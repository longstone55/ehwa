'use client';

import React, { useMemo, useState } from 'react';
import { Building2, Home, Percent, ReceiptText } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface HomeAcquisitionTaxCalculatorProps {
  className?: string;
}

interface CalculatorState {
  purchasePrice: string;
  purchaseArea: string;
}

interface TaxResult {
  bracket: 'under600' | 'between600And900' | 'over900';
  bracketLabel: string;
  areaLabel: string;
  acquisitionRate: number;
  educationRate: number;
  ruralRate: number;
  totalRate: number;
  acquisitionTax: number;
  educationTax: number;
  ruralTax: number;
  totalTax: number;
}

interface RateRow {
  id: string;
  bracket: TaxResult['bracket'] | 'other';
  condition: string;
  area: string;
  acquisitionRate: string;
  educationRate: string;
  ruralRate: string;
  totalRate: string;
  note?: string;
}

const INITIAL_STATE: CalculatorState = {
  purchasePrice: '70,000,000',
  purchaseArea: '86',
};

const WON_600M = 600_000_000;
const WON_900M = 900_000_000;

const parseNumber = (value: string): number => Number(String(value).replace(/[^\d.-]/g, '')) || 0;

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.round(value).toLocaleString('ko-KR');
};

const formatMoneyInput = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString('ko-KR');
};

const formatAreaInput = (value: string): string => value.replace(/[^0-9.]/g, '');

const formatRate = (rate: number): string => `${rate.toFixed(rate % 1 === 0 ? 0 : 2)}%`;

const calculateProgressiveAcquisitionRate = (price: number): number => {
  const hundredMillionUnit = price / 100_000_000;
  return Number((hundredMillionUnit * (2 / 3) - 3).toFixed(6));
};

const calculateResult = (state: CalculatorState): TaxResult => {
  const purchasePrice = parseNumber(state.purchasePrice);
  const purchaseArea = parseNumber(state.purchaseArea);
  const isLargeArea = purchaseArea > 85;

  let bracket: TaxResult['bracket'] = 'under600';
  let bracketLabel = '6?듭썝 ?댄븯';
  let acquisitionRate = 1;

  if (purchasePrice > WON_900M) {
    bracket = 'over900';
    bracketLabel = '9억원 초과';
    acquisitionRate = 3;
  } else if (purchasePrice > WON_600M) {
    bracket = 'between600And900';
    bracketLabel = '6억원 초과 9억원 이하';
    acquisitionRate = calculateProgressiveAcquisitionRate(purchasePrice);
  }

  const educationRate = Number((acquisitionRate * 0.1).toFixed(6));
  const ruralRate = isLargeArea ? 0.2 : 0;
  const totalRate = acquisitionRate + educationRate + ruralRate;

  const acquisitionTax = Math.round(purchasePrice * (acquisitionRate / 100));
  const educationTax = Math.round(purchasePrice * (educationRate / 100));
  const ruralTax = Math.round(purchasePrice * (ruralRate / 100));

  return {
    bracket,
    bracketLabel,
    areaLabel: isLargeArea ? '85㎡ 초과' : '85㎡ 이하',
    acquisitionRate,
    educationRate,
    ruralRate,
    totalRate,
    acquisitionTax,
    educationTax,
    ruralTax,
    totalTax: acquisitionTax + educationTax + ruralTax,
  };
};

const RATE_ROWS: RateRow[] = [
  { id: 'under600-small', bracket: 'under600', condition: '6억원 이하', area: '85㎡ 이하', acquisitionRate: '1%', educationRate: '0.10%', ruralRate: '-', totalRate: '1.10%' },
  { id: 'under600-large', bracket: 'under600', condition: '6억원 이하', area: '85㎡ 초과', acquisitionRate: '1%', educationRate: '0.10%', ruralRate: '0.20%', totalRate: '1.30%' },
  { id: 'between600-small', bracket: 'between600And900', condition: '6억원 초과 9억원 이하', area: '85㎡ 이하', acquisitionRate: '1~3%', educationRate: '취득세율의 10%', ruralRate: '-', totalRate: '자동계산', note: '2020년 개정 산식 적용' },
  { id: 'between600-large', bracket: 'between600And900', condition: '6억원 초과 9억원 이하', area: '85㎡ 초과', acquisitionRate: '1~3%', educationRate: '취득세율의 10%', ruralRate: '0.20%', totalRate: '자동계산', note: '2020년 개정 산식 적용' },
  { id: 'over900-small', bracket: 'over900', condition: '9억원 초과', area: '85㎡ 이하', acquisitionRate: '3%', educationRate: '0.30%', ruralRate: '-', totalRate: '3.30%' },
  { id: 'over900-large', bracket: 'over900', condition: '9억원 초과', area: '85㎡ 초과', acquisitionRate: '3%', educationRate: '0.30%', ruralRate: '0.20%', totalRate: '3.50%' },
  { id: 'non-home', bracket: 'other', condition: '주택 외 부동산', area: '상가, 오피스텔, 토지, 건물', acquisitionRate: '4%', educationRate: '0.40%', ruralRate: '0.20%', totalRate: '4.60%' },
  { id: 'inherit-farm', bracket: 'other', condition: '상속 취득', area: '농지', acquisitionRate: '2.30%', educationRate: '0.06%', ruralRate: '0.20%', totalRate: '2.56%' },
  { id: 'inherit-other', bracket: 'other', condition: '상속 취득', area: '기타', acquisitionRate: '2.80%', educationRate: '0.16%', ruralRate: '0.20%', totalRate: '3.16%' },
  { id: 'gift', bracket: 'other', condition: '무상 취득', area: '일반', acquisitionRate: '3.50%', educationRate: '0.30%', ruralRate: '0.20%', totalRate: '4.00%' },
];

export default function HomeAcquisitionTaxCalculator({ className = '' }: HomeAcquisitionTaxCalculatorProps) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const result = useMemo((): TaxResult => calculateResult(state), [state]);
  const purchasePrice = parseNumber(state.purchasePrice);

  const updateState = (field: keyof CalculatorState, value: string): void => {
    setState((prev) => ({
      ...prev,
      [field]: field === 'purchasePrice' ? formatMoneyInput(value) : formatAreaInput(value),
    }));
  };

  const isActiveRateRow = (row: RateRow): boolean => {
    if (row.bracket !== result.bracket) return false;
  if (row.area.includes('초과')) return result.areaLabel.includes('초과');
    return result.areaLabel.includes('?댄븯');
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>주택 매입가격과 전용면적을 입력하면 취득세, 지방교육세, 농어촌특별세를 자동 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>6억원 초과 9억원 이하 주택은 자본 계산 방식의 2020년 개정 누진 산식을 반영합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>85㎡ 초과 주택은 농어촌특별세 0.2%를 추가 반영합니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">주택 유상취득 기본 계산기입니다. 조정대상지역, 다주택 중과, 생애최초 감면, 신혼부부 감면 등은 실제 신고 시 별도 검토가 필요합니다.</p>
          </div>
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<Home className="w-5 h-5" />} label="과세 구간" value={result.bracketLabel} />
          <MetricCard icon={<Building2 className="w-5 h-5" />} label="면적 조건" value={result.areaLabel} color="dark" />
              <MetricCard icon={<Percent className="w-5 h-5" />} label="?⑷퀎 ?몄쑉" value={formatRate(result.totalRate)} color="green" />
          <MetricCard icon={<ReceiptText className="w-5 h-5" />} label="취득세 합계" value={formatNumber(result.totalTax)} color="blue" />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">입력값</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">금액과 면적을 수정하면 계산 결과가 즉시 반영됩니다.</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                  <th className="p-3 md:p-4 w-[160px] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10">매입가격</th>
                  <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10">전용면적(㎡)</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">?먮룞 ?먯젙</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <tr className="hover:bg-blue-50/20 transition-colors">
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">입력값</th>
                    <td className="p-0 bg-blue-50/30">
                      <input
                        type="text"
                        value={state.purchasePrice}
                        onChange={(event): void => updateState('purchasePrice', event.target.value)}
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                      />
                    </td>
                    <td className="p-0 bg-blue-50/30">
                      <input
                        type="text"
                        value={state.purchaseArea}
                        onChange={(event): void => updateState('purchaseArea', event.target.value)}
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                      />
                    </td>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578] whitespace-nowrap">{result.bracketLabel} / {result.areaLabel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
            <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">계산 결과</h3>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
              <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">항목</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">?몄쑉</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">?몄븸</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <ResultRow label="취득세" rate={formatRate(result.acquisitionRate)} amount={formatNumber(result.acquisitionTax)} />
              <ResultRow label="지방교육세" rate={formatRate(result.educationRate)} amount={formatNumber(result.educationTax)} />
              <ResultRow label="농어촌특별세" rate={result.ruralRate ? formatRate(result.ruralRate) : '-'} amount={formatNumber(result.ruralTax)} />
                  <tr className="bg-[#2e7d32] text-white font-black text-base md:text-lg">
                <td className="p-4 md:p-5 border-r border-white/10 sticky left-0 bg-[#2e7d32] z-10 font-black">취득세 합계</td>
                    <td className="p-4 md:p-5 text-right border-r border-white/10 whitespace-nowrap">{formatRate(result.totalRate)}</td>
                    <td className="p-4 md:p-5 text-right whitespace-nowrap">{formatNumber(result.totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">세율표</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">현재 입력값에 해당하는 행을 강조 표시합니다.</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[860px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">구분</th>
                <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10">면적 조건</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">취득세</th>
                <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">지방교육세</th>
                <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">농어촌특별세</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">?⑷퀎 ?몄쑉</th>
                <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">취득세 계산</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {RATE_ROWS.map((row) => {
                    const active = isActiveRateRow(row);
                    return (
                      <tr key={row.id} className={`${active ? 'bg-blue-50/70' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                        <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-bold ${active ? 'bg-blue-50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>
                          <div>{row.condition}</div>
                          {row.note ? <div className="mt-1 text-[10px] font-medium text-gray-400">{row.note}</div> : null}
                        </td>
                        <td className="p-3 md:p-4 text-left font-bold text-[#4e5968]">{row.area}</td>
                        <td className="p-3 md:p-4 text-right font-bold text-[#4e5968]">{active ? formatRate(result.acquisitionRate) : row.acquisitionRate}</td>
                        <td className="p-3 md:p-4 text-right font-bold text-[#4e5968]">{active ? formatRate(result.educationRate) : row.educationRate}</td>
                        <td className="p-3 md:p-4 text-right font-bold text-[#4e5968]">{active ? (result.ruralRate ? formatRate(result.ruralRate) : '-') : row.ruralRate}</td>
                        <td className="p-3 md:p-4 text-right font-black text-[#203578]">{active ? formatRate(result.totalRate) : row.totalRate}</td>
                        <td className="p-3 md:p-4 text-right font-black text-[#203578]">{active ? formatNumber(result.totalTax) : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-right text-[11px] text-gray-400">입력 매입가격 {formatNumber(purchasePrice)}원</p>
          </section>
        </div>

        <ReportActionFooter />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: 'blue' | 'green' | 'dark';
}

function MetricCard({ icon, label, value, color = 'blue' }: MetricCardProps) {
  const className = color === 'green' ? 'bg-[#2e7d32] text-white' : color === 'dark' ? 'bg-[#1a1f27] text-white' : 'bg-[#203578] text-white';
  const valueClassName = color === 'dark' ? 'text-[#fab005]' : 'text-white';
  return (
    <div className={`${className} rounded-2xl p-5 md:p-6 shadow-sm md:shadow-md`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-xs font-bold text-white/70">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">{icon}</div>
      </div>
      <p className={`text-xl md:text-2xl font-black tracking-tight ${valueClassName}`}>{value}</p>
    </div>
  );
}

interface ResultRowProps {
  label: string;
  rate: string;
  amount: string;
}

function ResultRow({ label, rate, amount }: ResultRowProps) {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">{label}</td>
      <td className="p-3 md:p-4 text-right text-[#4e5968] border-r border-gray-100 whitespace-nowrap font-bold">{rate}</td>
      <td className="p-3 md:p-4 text-right text-[#203578] whitespace-nowrap font-black">{amount}</td>
    </tr>
  );
}

