'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Phone, Sparkles } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface SpecificCorporationGiftCalculatorProps {
  className?: string;
}

interface CalculatorState {
  shareholderCount: string;
  dividendShareRate: string;
  totalDividend: string;
  parentCorporationShareRate: string;
  incomeYearly: string;
  lossCarriedForward: string;
  lowHighDiff: string;
  debtForgiven: string;
  cheapInKind: string;
  assetReceipt: string;
  freeLoan: string;
  dividendIncome: string;
}

interface GiftTaxBracket {
  min: number;
  rate: number;
  deduction: number;
}

interface CorporateTaxInfo {
  tax: number;
  rate: number;
}

interface CalculationResult {
  sharePercentPerPerson: string;
  corporationDividendIncome: number;
  topEqualDividendIncome: number;
  excludedDividend: number;
  specificCorpBenefit: number;
  specificCorpIncome: number;
  corporateTaxRate: string;
  corporateTax: number;
  extraDividend: number;
  specificShareRate: string;
  equalDividend: number;
  specificCorpTradeProfit: number;
  incomeRatio: string;
  dealTax: number;
  majorShareRate: string;
  giftAssumedIncome: number;
  giftAssumedJudgment: string;
  giftAssumedTax: number;
  giftTaxLimit: number;
  directGiftIncome: number;
  directGiftTax: number;
  corporateTaxShare: number;
  finalGiftTax: number;
}

interface InputRow {
  label: string;
  field: keyof CalculatorState;
  unit: 'money' | 'count' | 'percent';
}

interface ResultRow {
  label: string;
  formula: string;
  value: string;
  variant: 'normal' | 'sub' | 'total' | 'primary' | 'success' | 'warning';
}

const INITIAL_STATE: CalculatorState = {
  shareholderCount: '3',
  dividendShareRate: '1',
  totalDividend: '107,874,865',
  parentCorporationShareRate: '50',
  incomeYearly: '0',
  lossCarriedForward: '0',
  lowHighDiff: '0',
  debtForgiven: '0',
  cheapInKind: '0',
  assetReceipt: '0',
  freeLoan: '0',
  dividendIncome: '600,000,000',
};

const BENEFIT_INPUT_ROWS: InputRow[] = [
  { label: '특정법인 주주수', field: 'shareholderCount', unit: 'count' },
  { label: '자녀법인과 부법인 지분율', field: 'parentCorporationShareRate', unit: 'percent' },
  { label: '(1) 각 사업연도 소득', field: 'incomeYearly', unit: 'money' },
  { label: '(2) 이월결손금', field: 'lossCarriedForward', unit: 'money' },
  { label: '저가·고가 거래 차액', field: 'lowHighDiff', unit: 'money' },
  { label: '채무면제이익', field: 'debtForgiven', unit: 'money' },
  { label: '저가 현물출자이익', field: 'cheapInKind', unit: 'money' },
  { label: '재산 무상제공이익', field: 'assetReceipt', unit: 'money' },
  { label: '금전 무상대부이익', field: 'freeLoan', unit: 'money' },
  { label: '배당소득', field: 'dividendIncome', unit: 'money' },
];

const GIFT_TAX_BRACKETS: GiftTaxBracket[] = [
  { min: 3_000_000_000, rate: 0.5, deduction: 460_000_000 },
  { min: 1_000_000_000, rate: 0.4, deduction: 160_000_000 },
  { min: 500_000_000, rate: 0.3, deduction: 60_000_000 },
  { min: 100_000_000, rate: 0.2, deduction: 10_000_000 },
  { min: 0, rate: 0.1, deduction: 0 },
];

const parseNumber = (value: string): number => {
  return parseFloat((value || '').replace(/[^0-9.-]/g, '')) || 0;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.floor(value).toLocaleString('ko-KR');
};

const formatRate = (value: number, digit: number = 1): string => {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(digit)}%`;
};

const getGiftTaxInfo = (base: number): GiftTaxBracket => {
  return GIFT_TAX_BRACKETS.find((bracket: GiftTaxBracket) => base >= bracket.min) || { min: 0, rate: 0, deduction: 0 };
};

const getCorporateTaxInfo = (specificCorpIncome: number): CorporateTaxInfo => {
  let rate: number = 0;
  let deduction: number = 0;

  if (specificCorpIncome < 200_000_000) {
    rate = 0.09;
  } else if (specificCorpIncome < 20_000_000_000) {
    rate = 0.19;
    deduction = 20_000_000;
  } else if (specificCorpIncome < 300_000_000_000) {
    rate = 0.21;
    deduction = 420_000_000;
  } else {
    rate = 0.24;
    deduction = 9_420_000_000;
  }

  return {
    tax: Math.max(0, Math.floor(specificCorpIncome * rate - deduction)),
    rate,
  };
};

const calculateResult = (state: CalculatorState): CalculationResult => {
  const shareholderCount: number = parseNumber(state.shareholderCount);
  const dividendShareRate: number = parseNumber(state.dividendShareRate);
  const totalDividend: number = parseNumber(state.totalDividend);
  const parentCorporationShareRate: number = parseNumber(state.parentCorporationShareRate);
  const incomeYearly: number = parseNumber(state.incomeYearly);
  const lossCarriedForward: number = parseNumber(state.lossCarriedForward);
  const lowHighDiff: number = parseNumber(state.lowHighDiff);
  const debtForgiven: number = parseNumber(state.debtForgiven);
  const cheapInKind: number = parseNumber(state.cheapInKind);
  const assetReceipt: number = parseNumber(state.assetReceipt);
  const freeLoan: number = parseNumber(state.freeLoan);
  const dividendIncome: number = parseNumber(state.dividendIncome);

  let excludedRate: number = 0.3;
  if (parentCorporationShareRate >= 50) {
    excludedRate = 1;
  } else if (parentCorporationShareRate >= 20) {
    excludedRate = 0.8;
  }

  const excludedDividend: number = -dividendIncome * excludedRate;
  const benefit3: number = lowHighDiff + debtForgiven + cheapInKind + assetReceipt + freeLoan + dividendIncome;
  const specificCorpBenefit: number = benefit3 + excludedDividend;
  const specificCorpIncome: number = incomeYearly + lossCarriedForward + specificCorpBenefit;
  const corporateTaxInfo: CorporateTaxInfo = getCorporateTaxInfo(specificCorpIncome);
  const tradeProfit: number = benefit3 - dividendIncome * (parentCorporationShareRate / 100);
  const hRatio: number = specificCorpIncome > 0 ? tradeProfit / specificCorpIncome : 1;
  const cappedRatio: number = Math.min(hRatio, 1);
  const dealTax: number = Math.floor(corporateTaxInfo.tax * cappedRatio);
  const majorShareRate: number = shareholderCount > 0 ? 1 / shareholderCount : 0;
  const giftAssumedIncome: number = (tradeProfit - dealTax) * majorShareRate;
  const giftAssumedJudgment: string = giftAssumedIncome >= 100_000_000 ? '증여의제 O' : '증여의제 X';
  const giftTaxInfo: GiftTaxBracket = getGiftTaxInfo(giftAssumedIncome);
  const giftAssumedTax: number = Math.floor(giftAssumedIncome * giftTaxInfo.rate - giftTaxInfo.deduction * 0.97);
  const directGiftIncome: number = tradeProfit * majorShareRate;
  const directTaxInfo: GiftTaxBracket = getGiftTaxInfo(directGiftIncome);
  const directGiftTax: number = Math.floor(directGiftIncome * directTaxInfo.rate - directTaxInfo.deduction * 0.97);
  const corporateTaxShare: number = Math.floor(dealTax * majorShareRate);
  const giftTaxLimit: number = Math.floor(directGiftTax - dealTax * majorShareRate);
  const finalGiftTax: number = giftAssumedJudgment === '증여의제 X' ? 0 : Math.min(giftAssumedTax, giftTaxLimit);
  const equalDividend: number = dividendIncome * (parentCorporationShareRate / 100);

  return {
    sharePercentPerPerson: formatRate(shareholderCount > 0 ? (1 / shareholderCount) * 100 : 0),
    corporationDividendIncome: totalDividend,
    topEqualDividendIncome: totalDividend * (dividendShareRate / 100),
    excludedDividend: Math.floor(excludedDividend),
    specificCorpBenefit: Math.floor(specificCorpBenefit),
    specificCorpIncome,
    corporateTaxRate: formatRate(corporateTaxInfo.rate * 100, 0),
    corporateTax: corporateTaxInfo.tax,
    extraDividend: Math.floor(dividendIncome - equalDividend),
    specificShareRate: formatRate(parentCorporationShareRate),
    equalDividend: Math.floor(equalDividend),
    specificCorpTradeProfit: tradeProfit,
    incomeRatio: formatRate(cappedRatio * 100),
    dealTax,
    majorShareRate: formatRate(majorShareRate * 100),
    giftAssumedIncome: Math.floor(giftAssumedIncome),
    giftAssumedJudgment,
    giftAssumedTax,
    giftTaxLimit,
    directGiftIncome: Math.floor(directGiftIncome),
    directGiftTax,
    corporateTaxShare,
    finalGiftTax,
  };
};

export default function SpecificCorporationGiftCalculator({ className = '' }: SpecificCorporationGiftCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorState>(INITIAL_STATE);
  const [result, setResult] = useState<CalculationResult>(calculateResult(INITIAL_STATE));

  useEffect((): void => {
    setResult(calculateResult(formData));
  }, [formData]);

  const handleInputChange = (field: keyof CalculatorState, value: string): void => {
    const normalizedValue: string = value.replace(/[^0-9.-]/g, '');
    const formattedValue: string = normalizedValue ? new Intl.NumberFormat('ko-KR').format(parseFloat(normalizedValue)) : '';
    setFormData((prev: CalculatorState): CalculatorState => ({ ...prev, [field]: formattedValue }));
  };

  const resultRows: ResultRow[] = [
    { label: '특정법인 주주수', formula: '', value: `${formatNumber(parseNumber(formData.shareholderCount))}명`, variant: 'normal' },
    { label: '각 주주 지분율', formula: '1 / 주주수', value: result.sharePercentPerPerson, variant: 'sub' },
    { label: '(1) 각 사업연도 소득', formula: '', value: formatNumber(parseNumber(formData.incomeYearly)), variant: 'normal' },
    { label: '(2) 이월결손금', formula: '', value: formatNumber(parseNumber(formData.lossCarriedForward)), variant: 'normal' },
    { label: '(3) 특정법인 이익', formula: '거래이익 합계 - 수입배당금 익금불산입', value: formatNumber(result.specificCorpBenefit), variant: 'success' },
    { label: '수입배당금 익금불산입', formula: '배당소득 × 지분율 구간', value: formatNumber(result.excludedDividend), variant: 'warning' },
    { label: '(F) 특정법인 소득금액', formula: '(1) + (2) + (3)', value: formatNumber(result.specificCorpIncome), variant: 'total' },
    { label: '법인세율 (t)', formula: '', value: result.corporateTaxRate, variant: 'normal' },
    { label: '(T) 법인세 산출세액', formula: '(F) × t - 누진공제', value: formatNumber(result.corporateTax), variant: 'normal' },
    { label: '초과배당이익', formula: '배당소득 - 균등배당금액', value: formatNumber(result.extraDividend), variant: 'success' },
    { label: '특정법인 지분율', formula: '', value: result.specificShareRate, variant: 'normal' },
    { label: '균등배당금액', formula: '배당소득 × 특정법인 지분율', value: formatNumber(result.equalDividend), variant: 'normal' },
    { label: '(G) 특정법인 거래이익', formula: '거래이익 합계 - 균등배당금액', value: formatNumber(result.specificCorpTradeProfit), variant: 'total' },
    { label: '(H) 특정이익 비중', formula: 'G / F', value: result.incomeRatio, variant: 'normal' },
    { label: "(T') 특정법인 거래이익 상당세액", formula: 'T × H', value: formatNumber(result.dealTax), variant: 'normal' },
    { label: '(a) 지배주주 지분율', formula: '1 / 특정법인 주주수', value: result.majorShareRate, variant: 'success' },
    { label: '(R) 주주 1인당 증여의제이익', formula: "(G - T') × a", value: formatNumber(result.giftAssumedIncome), variant: 'primary' },
    { label: '증여의제 여부 판단', formula: '1억원 이상', value: result.giftAssumedJudgment, variant: 'warning' },
    { label: '(J) 증여의제 증여세액', formula: 'R × 세율 - 누진공제 × 97%', value: formatNumber(result.giftAssumedTax), variant: 'primary' },
    { label: '(K) 증여세 한도액', formula: '직접증여세 - 법인세 상당액', value: formatNumber(result.giftTaxLimit), variant: 'normal' },
    { label: '주주 1인당 직접증여이익', formula: 'G × a', value: formatNumber(result.directGiftIncome), variant: 'success' },
    { label: '직접증여 증여세액', formula: '직접증여이익 × 세율 - 누진공제 × 97%', value: formatNumber(result.directGiftTax), variant: 'normal' },
    { label: '법인세 상당액', formula: "T' × a", value: formatNumber(result.corporateTaxShare), variant: 'normal' },
    { label: '납부할 증여세액', formula: 'min(J, K)', value: formatNumber(result.finalGiftTax), variant: 'total' },
  ];

  const rowClassName = (variant: ResultRow['variant']): string => {
    if (variant === 'primary') return 'bg-[#203578]/5 text-[#203578] font-black';
    if (variant === 'success') return 'bg-[#2e7d32]/5 text-[#2e7d32] font-black';
    if (variant === 'warning') return 'bg-[#fff8e1] text-[#8a5b00] font-bold';
    if (variant === 'total') return 'bg-[#1a1f27] text-white font-black';
    if (variant === 'sub') return 'bg-[#f8f9fa] text-[#4e5968]';
    return 'bg-white text-[#1a1f27]';
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="space-y-3">
              <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">1.</span>
                  <span>특정법인의 주주 구성, 지분율, 배당금액을 입력하여 특정법인 증여의제 해당 여부를 검토합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">2.</span>
                  <span>저가·고가 거래, 채무면제, 현물출자, 재산제공, 금전대부, 배당소득을 기본 산식 그대로 반영합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">3.</span>
                  <span>법인세 상당액과 증여세 한도액을 비교하여 최종 납부할 증여세액을 계산합니다.</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                원본 calc802-1.js의 법인세율, 증여세율, 수입배당금 익금불산입률, 증여의제 판단 기준을 동일하게 적용했습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">확인란 / 배당가능금액</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">주주수와 지분율에 따른 배당흐름을 확인합니다.</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">입력 / 결과</th>
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10">구분</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">입력 / 결과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <tr className="hover:bg-blue-50/20 transition-colors">
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">특정법인 주주수</th>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.shareholderCount}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('shareholderCount', event.target.value)}
                      />
                    </td>
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100">특정법인 지분율</th>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.dividendShareRate}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('dividendShareRate', event.target.value)}
                      />
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/20 transition-colors">
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">1인 주주 지분율</th>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578]">{result.sharePercentPerPerson}</td>
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100">배당실시액</th>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.totalDividend}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('totalDividend', event.target.value)}
                      />
                    </td>
                  </tr>
                  <tr className="bg-[#203578]/5">
                    <th className="p-3 md:p-4 text-left font-black text-[#203578] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">특정법인 배당소득</th>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578]">{formatNumber(result.corporationDividendIncome)}</td>
                    <th className="p-3 md:p-4 text-left font-black text-[#203578] bg-[#f8f9fa] border-r border-gray-100">특정법인 균등배당소득</th>
                    <td className="p-3 md:p-4 text-right font-black text-[#203578]">{formatNumber(result.topEqualDividendIncome)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">입력값</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">금액과 비율을 입력하면 결과가 자동 계산됩니다.</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 w-[46%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">금액 / 비율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {BENEFIT_INPUT_ROWS.map((row: InputRow) => (
                    <tr key={row.field} className="hover:bg-blue-50/20 transition-colors">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">{row.label}</th>
                      <td className="p-0">
                        <input
                          type="text"
                          className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                          value={formData[row.field]}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange(row.field, event.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">계산 결과</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-2xl bg-[#203578] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">주주 1인당 증여의제이익</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(result.giftAssumedIncome)}</p>
              </div>
              <div className="rounded-2xl bg-[#2e7d32] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">증여의제 여부</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{result.giftAssumedJudgment}</p>
              </div>
              <div className="rounded-2xl bg-[#1a1f27] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">납부할 증여세액</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-[#fab005]">{formatNumber(result.finalGiftTax)}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                    <th className="p-3 md:p-4 w-[38%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">구분</th>
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-bold border-r border-white/10">계산식</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {resultRows.map((row: ResultRow) => {
                    const variantClassName: string = rowClassName(row.variant);
                    const stickyBackgroundClassName: string = row.variant === 'total' ? 'bg-[#1a1f27]' : row.variant === 'primary' ? 'bg-[#203578]/5' : row.variant === 'success' ? 'bg-[#2e7d32]/5' : row.variant === 'warning' ? 'bg-[#fff8e1]' : row.variant === 'sub' ? 'bg-[#f8f9fa]' : 'bg-white';

                    return (
                      <tr key={row.label} className={`${variantClassName} transition-colors`}>
                        <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 ${stickyBackgroundClassName}`}>{row.label}</td>
                        <td className="p-3 md:p-4 text-[#4e5968] border-r border-gray-100 whitespace-nowrap">{row.formula}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-black">{row.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <ReportActionFooter />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#203578]/10 flex items-center justify-center text-[#203578]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">자동 계산</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">입력 즉시 증여의제 판단과 최종세액을 산출합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">실시간 반영</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">거래이익과 지분율 변경이 결과에 바로 반영됩니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#fab005]/10 flex items-center justify-center text-[#fab005]">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">세무 상담</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">계산 결과를 바탕으로 실제 거래 구조를 검토할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
