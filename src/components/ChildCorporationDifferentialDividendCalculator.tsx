'use client';

import React, { useMemo, useState } from 'react';
import { Building2, Landmark, ReceiptText, TrendingUp } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface ChildCorporationDifferentialDividendCalculatorProps {
  className?: string;
}

type ShareRatioKey = 'under20' | 'over20' | 'over50';

interface CalculatorState {
  subCorpAsset: string;
  subCorpNetIncome: string;
  sonCorpBeforeTaxIncome: string;
  subCorpDividend: string;
  shareRatio: ShareRatioKey;
}

interface YearProjection {
  year: number;
  noStrategyProfit: number;
  noStrategyDividendOut: number;
  noStrategyNetAsset: number;
  strategyFatherProfit: number;
  strategyFatherDividendOut: number;
  strategyFatherNetAsset: number;
  sonCorpProfit: number;
  sonCorpDividendIn: number;
  sonCorpNetAsset: number;
}

interface CalculationResult {
  subCorpIncome: number;
  subCorpTax: number;
  subCorpAfterTaxInflow: number;
  shareRatioPercent: number;
  sonCorpIncome: number;
  sonCorpTax: number;
  sonCorpAfterTaxInflow: number;
  personalDividendTax: number;
  personalAfterTaxInflow: number;
  years: YearProjection[];
  twentiethYearGap: number;
}

const INITIAL_STATE: CalculatorState = {
  subCorpAsset: '6,031,000,000',
  subCorpNetIncome: '300,000,000',
  sonCorpBeforeTaxIncome: '0',
  subCorpDividend: '500,000,000',
  shareRatio: 'under20',
};

const SHARE_RATIO_MAP: Record<ShareRatioKey, number> = {
  under20: 0.3,
  over20: 0.8,
  over50: 1,
};

const DIVIDEND_TAX_TABLE = [
  { income: 100_000_000, tax: 33_000_000 },
  { income: 200_000_000, tax: 72_000_000 },
  { income: 300_000_000, tax: 114_000_000 },
  { income: 400_000_000, tax: 155_000_000 },
  { income: 500_000_000, tax: 199_000_000 },
  { income: 600_000_000, tax: 243_000_000 },
  { income: 700_000_000, tax: 283_000_000 },
  { income: 800_000_000, tax: 322_000_000 },
  { income: 900_000_000, tax: 362_000_000 },
  { income: 1_000_000_000, tax: 405_000_000 },
];

const parseNumber = (value: string): number => Number(String(value).replace(/,/g, '')) || 0;

const formatInput = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString('ko-KR');
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.round(value).toLocaleString('ko-KR');
};

const formatSignedNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.round(value).toLocaleString('ko-KR');
};

const calculateCorporateTax = (income: number): number => {
  const threshold = 200_000_000;
  if (income > threshold) {
    return ((income - threshold) * 0.19 + threshold * 0.09) * 1.1;
  }
  return income * 0.09 * 1.1;
};

const vlookupApprox = (value: number): number => {
  let result = 0;
  for (const row of DIVIDEND_TAX_TABLE) {
    if (value >= row.income) {
      result = row.tax;
    } else {
      break;
    }
  }
  return result;
};

const calculateResult = (state: CalculatorState): CalculationResult => {
  const subCorpAsset = parseNumber(state.subCorpAsset);
  const subCorpNetIncome = parseNumber(state.subCorpNetIncome);
  const sonCorpBeforeTaxIncome = parseNumber(state.sonCorpBeforeTaxIncome);
  const subCorpDividend = parseNumber(state.subCorpDividend);
  const shareRatioPercent = SHARE_RATIO_MAP[state.shareRatio] ?? 0;

  const subCorpIncome = subCorpDividend * 0.2;
  const subCorpTax = calculateCorporateTax(subCorpIncome);
  const subCorpAfterTaxInflow = subCorpDividend - subCorpTax;
  const sonCorpIncome = subCorpDividend * (1 - shareRatioPercent);
  const sonCorpTax = calculateCorporateTax(sonCorpIncome);
  const sonCorpAfterTaxInflow = subCorpDividend - sonCorpTax;
  const personalDividendTax = vlookupApprox(subCorpDividend);
  const personalAfterTaxInflow = subCorpDividend - personalDividendTax;

  let noStrategyNetAsset = subCorpAsset;
  let strategyFatherNetAsset = subCorpAsset;
  let sonCorpNetAsset = 500_000_000;
  const years: YearProjection[] = [];

  for (let year = 1; year <= 20; year += 1) {
    const noStrategyProfit = subCorpNetIncome;
    const noStrategyDividendOut = 0;
    noStrategyNetAsset += noStrategyProfit + noStrategyDividendOut;

    const strategyFatherProfit = subCorpNetIncome;
    const strategyFatherDividendOut = -subCorpDividend;
    strategyFatherNetAsset += strategyFatherProfit + strategyFatherDividendOut;

    const sonCorpProfit = sonCorpBeforeTaxIncome;
    const sonCorpDividendIn = Math.round(Math.round(sonCorpAfterTaxInflow) / 1_000_000) * 1_000_000;
    sonCorpNetAsset += sonCorpProfit + sonCorpDividendIn;

    years.push({
      year,
      noStrategyProfit,
      noStrategyDividendOut,
      noStrategyNetAsset,
      strategyFatherProfit,
      strategyFatherDividendOut,
      strategyFatherNetAsset,
      sonCorpProfit,
      sonCorpDividendIn,
      sonCorpNetAsset,
    });
  }

  return {
    subCorpIncome,
    subCorpTax,
    subCorpAfterTaxInflow,
    shareRatioPercent,
    sonCorpIncome,
    sonCorpTax,
    sonCorpAfterTaxInflow,
    personalDividendTax,
    personalAfterTaxInflow,
    years,
    twentiethYearGap: years[19].sonCorpNetAsset - years[19].strategyFatherNetAsset,
  };
};

export default function ChildCorporationDifferentialDividendCalculator({ className = '' }: ChildCorporationDifferentialDividendCalculatorProps) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const result = useMemo(() => calculateResult(state), [state]);

  const updateMoney = (field: keyof Omit<CalculatorState, 'shareRatio'>, value: string): void => {
    setState((prev) => ({ ...prev, [field]: formatInput(value) }));
  };

  const updateShareRatio = (value: ShareRatioKey): void => {
    setState((prev) => ({ ...prev, shareRatio: value }));
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>부법인이 차등배당을 개인이 직접 받을 때와 자녀법인을 통해 받을 때의 세후 유입을 비교합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>자녀법인 지분율에 따른 현금불산입 비율을 반영해 자녀법인의 법인세와 세후유입을 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>20년 동안 전략 실행 전후 부법인 주가와 자녀법인 주가의 변화를 자본 계산 기준으로 시뮬레이션합니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">calc806-1.js의 법인세, 배당세액 조회, 20년 누적 주가 계산 흐름을 React 상태 계산으로 이식했습니다.</p>
          </div>
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0 pt-8 md:pt-0">
            <div className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<Building2 className="w-5 h-5" />} label="부법인 현금" value={formatNumber(result.subCorpIncome)} />
              <MetricCard icon={<ReceiptText className="w-5 h-5" />} label="자녀법인 법인세" value={formatNumber(result.sonCorpTax)} color="dark" />
          <MetricCard icon={<Landmark className="w-5 h-5" />} label="자녀법인 세후유입" value={formatNumber(result.sonCorpAfterTaxInflow)} color="green" />
          <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="20년 자녀법인 주가 증가" value={formatSignedNumber(result.twentiethYearGap)} color="blue" />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <SectionTitle color="blue" title="입력값" note="금액과 지분율을 조정하면 모든 결과가 즉시 재계산됩니다." />
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[860px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">?낅젰</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">?듦툑</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">법인세</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">?명썑?좎엯</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <InputResultRow label="부법인 순자산" value={state.subCorpAsset} onChange={(value) => updateMoney('subCorpAsset', value)} />
                    <InputResultRow label="부법인 세후이익" value={state.subCorpNetIncome} onChange={(value) => updateMoney('subCorpNetIncome', value)} />
                  <InputResultRow
                      label="아들법인 세전이익"
                    value={state.sonCorpBeforeTaxIncome}
                    onChange={(value) => updateMoney('sonCorpBeforeTaxIncome', value)}
                      resultLabel="부법인"
                    income={result.subCorpIncome}
                    tax={result.subCorpTax}
                    afterTax={result.subCorpAfterTaxInflow}
                  />
                  <InputResultRow
                      label="부법인 차등배당"
                    value={state.subCorpDividend}
                    onChange={(value) => updateMoney('subCorpDividend', value)}
                      resultLabel="자녀법인"
                    income={result.sonCorpIncome}
                    tax={result.sonCorpTax}
                    afterTax={result.sonCorpAfterTaxInflow}
                  />
                  <tr className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">자녀법인 지분율</td>
                    <td className="p-0 border-r border-gray-100 bg-blue-50/30">
                      <select
                        value={state.shareRatio}
                        onChange={(event): void => updateShareRatio(event.target.value as ShareRatioKey)}
                        className="w-full p-3 md:p-4 bg-transparent text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20"
                      >
                        <option value="under20">20% 미만</option>
                        <option value="over20">20% ?댁긽</option>
                        <option value="over50">50% ?댁긽</option>
                      </select>
                    </td>
                    <td className="p-3 md:p-4 text-right font-bold text-[#4e5968] border-r border-gray-100">익금불산입</td>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578] border-r border-gray-100" colSpan={2}>{Math.round(result.shareRatioPercent * 100)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <SectionTitle color="green" title="확인표 1 / 개인배당과 법인배당 세금 비교" note={`${formatNumber(parseNumber(state.subCorpDividend))}원 배당 기준`} />
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">개인 배당 시 배당소득세</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">개인 배당 시 세후유입</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">법인 배당 시 법인세</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">법인 배당 시 세후유입</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50/50 text-[13px] md:text-sm">
                    <td className="p-3 md:p-4 text-right font-black text-[#203578] border-r border-gray-100">{formatNumber(result.personalDividendTax)}</td>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578] border-r border-gray-100">{formatNumber(result.personalAfterTaxInflow)}</td>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578] border-r border-gray-100">{formatNumber(result.sonCorpTax)}</td>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578]">{formatNumber(result.sonCorpAfterTaxInflow)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0 pb-8 md:pb-0">
            <SectionTitle color="green" title="확인표 2 / 전략 시뮬레이션" note="원본 계산식과 동일하게 20년 누적 순자산을 표시합니다." />
            <ProjectionTable result={result} baseAsset={parseNumber(state.subCorpAsset)} />
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
      <p className={`text-lg md:text-2xl font-black tracking-tight ${valueClassName}`}>{value}</p>
    </div>
  );
}

function SectionTitle({ title, note, color }: { title: string; note?: string; color: 'blue' | 'green' }) {
  const colorClassName = color === 'green' ? 'bg-[#2e7d32] text-[#2e7d32]' : 'bg-[#203578] text-[#203578]';
  return (
    <div className="flex items-center gap-3 mb-4 md:mb-6">
      <div className={`w-1 h-6 rounded-full ${colorClassName.split(' ')[0]}`}></div>
      <h3 className={`text-lg md:text-xl font-black ${colorClassName.split(' ')[1]}`}>{title}</h3>
      {note ? <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">{note}</span> : null}
    </div>
  );
}

function InputResultRow({
  label,
  value,
  onChange,
  resultLabel,
  income,
  tax,
  afterTax,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  resultLabel?: string;
  income?: number;
  tax?: number;
  afterTax?: number;
}) {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">{label}</td>
      <td className="p-0 border-r border-gray-100 bg-blue-50/30">
        <input
          type="text"
          value={value}
          onChange={(event): void => onChange(event.target.value)}
          className="w-full p-3 md:p-4 bg-transparent text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20"
        />
      </td>
      <td className="p-3 md:p-4 text-right font-bold text-[#4e5968] border-r border-gray-100">{resultLabel ? `${resultLabel} ${formatNumber(income ?? 0)}` : '-'}</td>
      <td className="p-3 md:p-4 text-right font-bold text-[#4e5968] border-r border-gray-100">{tax === undefined ? '-' : formatNumber(tax)}</td>
      <td className="p-3 md:p-4 text-right font-black text-[#203578]">{afterTax === undefined ? '-' : formatNumber(afterTax)}</td>
    </tr>
  );
}

function ProjectionTable({ result, baseAsset }: { result: CalculationResult; baseAsset: number }) {
  const currentRow: YearProjection = {
    year: 0,
    noStrategyProfit: 0,
    noStrategyDividendOut: 0,
    noStrategyNetAsset: baseAsset,
    strategyFatherProfit: 0,
    strategyFatherDividendOut: 0,
    strategyFatherNetAsset: baseAsset,
    sonCorpProfit: 0,
    sonCorpDividendIn: 0,
    sonCorpNetAsset: 500_000_000,
  };
  const rows = [currentRow, ...result.years];

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
      <table className="w-full border-collapse min-w-[1180px]">
        <thead>
          <tr className="bg-[#1a1f27] text-white">
          <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20" rowSpan={2}>경과연수</th>
          <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-black border-r border-white/10" colSpan={3}>전략 없이 실행 / 아버지 법인</th>
          <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-black border-r border-white/10" colSpan={3}>전략 실행 후 / 아버지 법인</th>
          <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-black" colSpan={3}>전략 실행 후 / 아들 법인</th>
          </tr>
          <tr className="bg-[#203578] text-white">
            {['연도', '배당유출', '순자산', '연도', '배당유출', '순자산', '연도', '세후배당유입', '순자산'].map((label) => (
              <th key={label} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
          {rows.map((row) => {
            const highlight = row.year === 0 || row.year % 5 === 0;
            const label = row.year === 0 ? '현재' : `${row.year}년차`;
            return (
              <tr key={label} className={`${highlight ? 'bg-blue-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-black ${highlight ? 'bg-blue-50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>{label}</td>
                <NumberCell value={row.noStrategyProfit} empty={row.year === 0} />
                <NumberCell value={row.noStrategyDividendOut} empty={row.year === 0} />
                <NumberCell value={row.noStrategyNetAsset} highlight />
                <NumberCell value={row.strategyFatherProfit} empty={row.year === 0} />
                <NumberCell value={row.strategyFatherDividendOut} empty={row.year === 0} red />
                <NumberCell value={row.strategyFatherNetAsset} highlight />
                <NumberCell value={row.sonCorpProfit} empty={row.year === 0} />
                <NumberCell value={row.sonCorpDividendIn} empty={row.year === 0} />
                <NumberCell value={row.sonCorpNetAsset} highlight />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NumberCell({ value, empty = false, highlight = false, red = false }: { value: number; empty?: boolean; highlight?: boolean; red?: boolean }) {
  const color = red ? 'text-red-600' : highlight ? 'text-[#203578]' : 'text-[#4e5968]';
  return (
    <td className={`p-3 md:p-4 text-right whitespace-nowrap border-r border-gray-100 font-bold ${color}`}>
      {empty ? '-' : formatSignedNumber(value)}
    </td>
  );
}

