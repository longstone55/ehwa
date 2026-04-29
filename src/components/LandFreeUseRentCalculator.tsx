'use client';

import React, { useMemo, useState } from 'react';
import { Clock, Phone, Sparkles } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface LandFreeUseRentCalculatorProps {
  className?: string;
}

interface CalculatorState {
  landArea: string;
  landUnitPrice: string;
  landAppraisal: string;
  buildingArea: string;
  buildingAmount: string;
  buildingAppraisal: string;
  standardDeposit: string;
  appraisalDeposit: string;
}

interface RealEstateRow {
  label: string;
  area: number;
  unitPrice: number;
  amount: number;
  appraisal: number;
  ratio: number;
  leaseShare: number;
}

interface FreeUseRow {
  label: string;
  landPrice: number;
  halfLandPrice: number;
  deposit: number;
  baseAmount: number;
  rate: number;
  fairRent: number;
}

interface DeemedGiftRow {
  label: string;
  landPrice: number;
  rate: number;
  presentValueFactor: number;
  benefit: number;
  judgment: string;
}

interface CalculationResult {
  realEstateRows: RealEstateRow[];
  totalAmount: number;
  totalAppraisal: number;
  totalLeaseShare: number;
  freeUseRows: FreeUseRow[];
  deemedGiftRows: DeemedGiftRow[];
}

type ViewTab = 'realEstate' | 'fairRent' | 'gift';

const INITIAL_STATE: CalculatorState = {
  landArea: '1,758.5',
  landUnitPrice: '688,800',
  landAppraisal: '20,000,000',
  buildingArea: '3,216.111',
  buildingAmount: '10,000,000',
  buildingAppraisal: '10,000,000',
  standardDeposit: '0',
  appraisalDeposit: '0',
};

const LEASE_AMOUNT: number = 20_000_000;
const FAIR_RENT_RATE: number = 0.029;
const DEEMED_GIFT_RATE: number = 0.02;
const PRESENT_VALUE_FACTOR: number = 3.79079;
const GIFT_THRESHOLD: number = 100_000_000;

const parseNumber = (value: string): number => {
  return parseFloat((value || '').replace(/,/g, '').replace(/[^\d.]/g, '').trim()) || 0;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
};

const formatRate = (value: number): string => {
  if (!Number.isFinite(value)) return '0.0%';
  return `${(value * 100).toFixed(1)}%`;
};

const calculateResult = (state: CalculatorState): CalculationResult => {
  const landArea: number = parseNumber(state.landArea);
  const landUnitPrice: number = parseNumber(state.landUnitPrice);
  const landAppraisal: number = parseNumber(state.landAppraisal);
  const buildingArea: number = parseNumber(state.buildingArea);
  const buildingAmount: number = parseNumber(state.buildingAmount);
  const buildingAppraisal: number = parseNumber(state.buildingAppraisal);
  const standardDeposit: number = parseNumber(state.standardDeposit);
  const appraisalDeposit: number = parseNumber(state.appraisalDeposit);
  const landAmount: number = landArea * landUnitPrice;
  const totalAmount: number = landAmount + buildingAmount;
  const totalAppraisal: number = landAppraisal + buildingAppraisal;
  const landRatio: number = totalAppraisal > 0 ? landAppraisal / totalAppraisal : 0;
  const buildingRatio: number = totalAppraisal > 0 ? buildingAppraisal / totalAppraisal : 0;
  const landLeaseShare: number = landRatio * LEASE_AMOUNT;
  const buildingLeaseShare: number = buildingRatio * LEASE_AMOUNT;

  const realEstateRows: RealEstateRow[] = [
    {
      label: '?��?',
      area: landArea,
      unitPrice: landUnitPrice,
      amount: landAmount,
      appraisal: landAppraisal,
      ratio: landRatio,
      leaseShare: landLeaseShare,
    },
    {
      label: '건물',
      area: buildingArea,
      unitPrice: 0,
      amount: buildingAmount,
      appraisal: buildingAppraisal,
      ratio: buildingRatio,
      leaseShare: buildingLeaseShare,
    },
  ];

  const freeUseRows: FreeUseRow[] = [
    {
      label: '기�??��?',
      landPrice: landAmount,
      halfLandPrice: landAmount * 0.5,
      deposit: standardDeposit,
      baseAmount: Math.max(0, landAmount * 0.5 - standardDeposit),
      rate: FAIR_RENT_RATE,
      fairRent: Math.max(0, landAmount * 0.5 - standardDeposit) * FAIR_RENT_RATE,
    },
    {
      label: '감정평가액',
      landPrice: landAppraisal,
      halfLandPrice: landAppraisal * 0.5,
      deposit: appraisalDeposit,
      baseAmount: Math.max(0, landAppraisal * 0.5 - appraisalDeposit),
      rate: FAIR_RENT_RATE,
      fairRent: Math.max(0, landAppraisal * 0.5 - appraisalDeposit) * FAIR_RENT_RATE,
    },
  ];

  const deemedGiftRows: DeemedGiftRow[] = [
    {
      label: '기준시가',
      landPrice: landAmount,
      rate: DEEMED_GIFT_RATE,
      presentValueFactor: PRESENT_VALUE_FACTOR,
      benefit: landAmount * DEEMED_GIFT_RATE * PRESENT_VALUE_FACTOR,
      judgment: landAmount * DEEMED_GIFT_RATE * PRESENT_VALUE_FACTOR < GIFT_THRESHOLD ? '증여의제 아님' : '증여의제 대상',
    },
    {
      label: '감정평가액',
      landPrice: landAppraisal,
      rate: DEEMED_GIFT_RATE,
      presentValueFactor: PRESENT_VALUE_FACTOR,
      benefit: landAppraisal * DEEMED_GIFT_RATE * PRESENT_VALUE_FACTOR,
      judgment: landAppraisal * DEEMED_GIFT_RATE * PRESENT_VALUE_FACTOR < GIFT_THRESHOLD ? '증여의제 아님' : '증여의제 대상',
    },
  ];

  return {
    realEstateRows,
    totalAmount,
    totalAppraisal,
    totalLeaseShare: landLeaseShare + buildingLeaseShare,
    freeUseRows,
    deemedGiftRows,
  };
};

export default function LandFreeUseRentCalculator({ className = '' }: LandFreeUseRentCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ViewTab>('realEstate');
  const result: CalculationResult = useMemo((): CalculationResult => calculateResult(formData), [formData]);
  const standardFreeUse: FreeUseRow = result.freeUseRows[0];
  const standardGift: DeemedGiftRow = result.deemedGiftRows[0];

  const handleInputChange = (field: keyof CalculatorState, value: string): void => {
    const normalizedValue: string = value.replace(/[^0-9.]/g, '');
    const formattedValue: string = normalizedValue ? new Intl.NumberFormat('ko-KR').format(parseFloat(normalizedValue)) : '';
    setFormData((prev: CalculatorState): CalculatorState => ({ ...prev, [field]: formattedValue }));
  };

  const tabs: Array<{ label: string; value: ViewTab }> = [
    { label: '부동산 현황', value: 'realEstate' },
    { label: '적정임대료', value: 'fairRent' },
    { label: '증여의제', value: 'gift' },
  ];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="space-y-3">
              <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">1.</span>
                  <span>?�버지 ?�유 ?��?�??��? 법인??무상 ?�는 ?�가�??�용?�는 경우???�정?��?료�? 계산?�니??</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">2.</span>
                  <span>기�??��?, 감정?��??? 보증금을 반영???�득?�법???�정?��?료�? 무상?�용?�익???�출?�니??</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">3.</span>
                  <span>5?�간 ?�재가치계?��? 1?�원 기�??�로 증여?�제 ?��?�??�단?�니??</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                ?�본 calc803-1.js??2.9%, 2%, 3.79079, 2천만???��?�??�분, 1?�원 증여?�제 ?�단 기�????�일?�게 ?�용?�습?�다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl md:max-w-xl mx-auto mt-8">
          {tabs.map((tab: { label: string; value: ViewTab }) => (
            <button
              key={tab.value}
              type="button"
              onClick={(): void => setActiveTab(tab.value)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab.value ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#203578] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">토지 기준시가</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(result.realEstateRows[0].amount)}</p>
              </div>
              <div className="rounded-2xl bg-[#2e7d32] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">적정임대료</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(standardFreeUse.fairRent)}</p>
              </div>
              <div className="rounded-2xl bg-[#1a1f27] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">무상?�용?�익</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-[#fab005]">{formatNumber(standardGift.benefit)}</p>
              </div>
            </div>
          </section>

          {activeTab === 'realEstate' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
                <h3 className="text-lg md:text-xl font-black text-[#203578]">?�력??/ 부?�산 ?�황</h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
                <table className="w-full border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-[#203578] text-white">
                      <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">면적</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">기준시가</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">금액</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">감정평가액</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">비율</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">?��?�??�분</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                    <tr className="hover:bg-blue-50/20 transition-colors">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">?��?</th>
                      <td className="p-0"><input type="text" className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" value={formData.landArea} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('landArea', event.target.value)} /></td>
                      <td className="p-0"><input type="text" className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" value={formData.landUnitPrice} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('landUnitPrice', event.target.value)} /></td>
                      <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(result.realEstateRows[0].amount)}</td>
                      <td className="p-0"><input type="text" className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" value={formData.landAppraisal} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('landAppraisal', event.target.value)} /></td>
                      <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#2e7d32]">{formatRate(result.realEstateRows[0].ratio)}</td>
                      <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(result.realEstateRows[0].leaseShare)}</td>
                    </tr>
                    <tr className="hover:bg-blue-50/20 transition-colors">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">건물</th>
                      <td className="p-0"><input type="text" className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" value={formData.buildingArea} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('buildingArea', event.target.value)} /></td>
                      <td className="p-3 md:p-4 text-right text-gray-400">-</td>
                      <td className="p-0"><input type="text" className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" value={formData.buildingAmount} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('buildingAmount', event.target.value)} /></td>
                      <td className="p-0"><input type="text" className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" value={formData.buildingAppraisal} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('buildingAppraisal', event.target.value)} /></td>
                      <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#2e7d32]">{formatRate(result.realEstateRows[1].ratio)}</td>
                      <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(result.realEstateRows[1].leaseShare)}</td>
                    </tr>
                    <tr className="bg-[#1a1f27] text-white">
                      <td className="p-3 md:p-4 border-r border-white/10 sticky left-0 bg-[#1a1f27] z-10 font-black">?�계</td>
                      <td className="p-3 md:p-4 text-right">-</td>
                      <td className="p-3 md:p-4 text-right">-</td>
                      <td className="p-3 md:p-4 text-right font-black">{formatNumber(result.totalAmount)}</td>
                      <td className="p-3 md:p-4 text-right font-black">{formatNumber(result.totalAppraisal)}</td>
                      <td className="p-3 md:p-4 text-right font-black">100%</td>
                      <td className="p-3 md:p-4 text-right font-black text-[#fab005]">{formatNumber(result.totalLeaseShare)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'fairRent' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
                <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">?�정?��?�?계산</h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg scrollbar-hide">
                <table className="w-full border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-[#1a1f27] text-white">
                      <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">기�?</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">토지 가액</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">50%</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">보증금</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">기준금액</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">정기예금이자율</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">적정임대료</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                    {result.freeUseRows.map((row: FreeUseRow, index: number) => (
                      <tr key={row.label} className={index === 0 ? 'bg-[#203578]/5 text-[#203578]' : 'bg-[#2e7d32]/5 text-[#2e7d32]'}>
                        <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-black ${index === 0 ? 'bg-[#203578]/5' : 'bg-[#2e7d32]/5'}`}>{row.label}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{formatNumber(row.landPrice)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{formatNumber(row.halfLandPrice)}</td>
                        <td className="p-0">
                          <input
                            type="text"
                            className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                            value={index === 0 ? formData.standardDeposit : formData.appraisalDeposit}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange(index === 0 ? 'standardDeposit' : 'appraisalDeposit', event.target.value)}
                          />
                        </td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{formatNumber(row.baseAmount)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{(row.rate * 100).toFixed(1)}%</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-black">{formatNumber(row.fairRent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'gift' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
                <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">무상?�용?�익 / 증여?�제 ?�단</h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg scrollbar-hide">
                <table className="w-full border-collapse min-w-[450px]">
                  <thead>
                    <tr className="bg-[#1a1f27] text-white">
                      <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">기준</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">토지 가액</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">2%</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">5년 현재가치계수</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">무상사용이익</th>
                      <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">증여?�제 ?��?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                    {result.deemedGiftRows.map((row: DeemedGiftRow, index: number) => (
                      <tr key={row.label} className={index === 0 ? 'bg-[#203578]/5 text-[#203578]' : 'bg-[#2e7d32]/5 text-[#2e7d32]'}>
                        <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-black ${index === 0 ? 'bg-[#203578]/5' : 'bg-[#2e7d32]/5'}`}>{row.label}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{formatNumber(row.landPrice)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{(row.rate * 100).toFixed(0)}%</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold">{row.presentValueFactor}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-black">{formatNumber(row.benefit)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-black">{row.judgment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <ReportActionFooter />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#203578]/10 flex items-center justify-center text-[#203578]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">적정임대료</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">토지 가액 50%에서 보증금을 차감한 금액에 정기예금이자율을 적용합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">증여?�제 ?�단</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">5??무상?�용?�익??1?�원 미만?��? ?�인?�니??</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#fab005]/10 flex items-center justify-center text-[#fab005]">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">?�무 ?�담</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">부?�산 ?�용 구조?� 과세 ?�험??검?�할 ???�습?�다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
