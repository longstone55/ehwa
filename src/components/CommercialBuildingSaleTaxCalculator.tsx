'use client';

import React, { useMemo, useState } from 'react';
import { Building2, Clock, Landmark, ReceiptText } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface CommercialBuildingSaleTaxCalculatorProps {
  className?: string;
}

interface CalculatorState {
  acquisitionDate: string;
  transferDate: string;
  businessUse: '1' | '0';
  acquisitionPrice: string;
  taxAcquisitionPrice: string;
  capitalExpense: string;
  transferBrokerFee: string;
  bondLoss: string;
  otherCost: string;
  basicDeduction: string;
  collateralDebt: string;
}

interface ScenarioInput {
  id: 'valuation1' | 'valuation2' | 'marketCase';
  label: string;
  shortLabel: string;
  value: string;
}

interface TransferTaxRate {
  base: number;
  deduction: number;
  business: number;
  nonBusiness: number;
}

interface ScenarioResult {
  id: ScenarioInput['id'];
  label: string;
  shortLabel: string;
  valuation: number;
  capitalGain: number;
  specialDeduction: number;
  taxableGain: number;
  taxBase: number;
  appliedRate: number;
  progressiveDeduction: number;
  calculatedTax: number;
  localTax: number;
  transferTaxTotal: number;
  normalAcquisitionTax: number;
  normalRuralTax: number;
  normalEducationTax: number;
  normalAcquisitionTotal: number;
  heavyAcquisitionTax: number;
  heavyRuralTax: number;
  heavyEducationTax: number;
  heavyAcquisitionTotal: number;
  netAsset: number;
  licenseTax: number;
  licenseEducationTax: number;
  licenseTotal: number;
  denseTax: number;
  denseEducationTax: number;
  denseTotal: number;
}

interface CalculationResult {
  holdingYears: number;
  holdingRate: number;
  necessaryCost: number;
  estimatedDeduction: number;
  usageType: string;
  scenarios: ScenarioResult[];
}

const INITIAL_STATE: CalculatorState = {
  acquisitionDate: '1990-01-01',
  transferDate: '2024-12-31',
  businessUse: '1',
  acquisitionPrice: '2,000,000,000',
  taxAcquisitionPrice: '1,322,801,282',
  capitalExpense: '0',
  transferBrokerFee: '0',
  bondLoss: '0',
  otherCost: '0',
  basicDeduction: '2,500,000',
  collateralDebt: '14,000,000,000',
};

const INITIAL_SCENARIOS: ScenarioInput[] = [
  { id: 'valuation1', label: '감정평가 평가액 1', shortLabel: '시나리오 1', value: '10,000,000,000' },
  { id: 'valuation2', label: '감정평가 평가액 2', shortLabel: '시나리오 2', value: '20,000,000,000' },
  { id: 'marketCase', label: '매매사례가액', shortLabel: '시나리오 3', value: '18,000,000,000' },
];

const INCOME_RATE_TABLE: TransferTaxRate[] = [
  { base: 0, deduction: 0, business: 6, nonBusiness: 16 },
  { base: 12_000_000, deduction: 1_080_000, business: 15, nonBusiness: 25 },
  { base: 46_000_000, deduction: 5_220_000, business: 24, nonBusiness: 34 },
  { base: 88_000_000, deduction: 14_900_000, business: 35, nonBusiness: 45 },
  { base: 150_000_000, deduction: 19_400_000, business: 38, nonBusiness: 48 },
  { base: 300_000_000, deduction: 25_400_000, business: 40, nonBusiness: 50 },
  { base: 500_000_000, deduction: 35_400_000, business: 42, nonBusiness: 52 },
  { base: 1_000_000_000, deduction: 65_400_000, business: 45, nonBusiness: 55 },
];

const HOLDING_DEDUCTION_RATES: Array<{ period: number; rate: number }> = [
  { period: 0, rate: 0 },
  { period: 3, rate: 6 },
  { period: 4, rate: 8 },
  { period: 5, rate: 10 },
  { period: 6, rate: 12 },
  { period: 7, rate: 14 },
  { period: 8, rate: 16 },
  { period: 9, rate: 18 },
  { period: 10, rate: 20 },
  { period: 11, rate: 22 },
  { period: 12, rate: 24 },
  { period: 13, rate: 26 },
  { period: 14, rate: 28 },
  { period: 15, rate: 30 },
];

const parseNumber = (value: string): number => Number(String(value).replace(/[^\d.-]/g, '')) || 0;

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.round(value).toLocaleString('ko-KR');
};

const formatMoneyInput = (value: string): string => {
  const numericValue = value.replace(/[^0-9.-]/g, '');
  if (!numericValue || numericValue === '-') return numericValue;
  return new Intl.NumberFormat('ko-KR').format(Number(numericValue));
};

const calculateHoldingYears = (acquisitionDate: string, transferDate: string): number => {
  const start = new Date(acquisitionDate);
  const end = new Date(transferDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
  return Number(((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1));
};

const getHoldingRate = (holdingYears: number): number => {
  let matchedRate = 0;
  for (const row of HOLDING_DEDUCTION_RATES) {
    if (holdingYears >= row.period) matchedRate = row.rate;
    else break;
  }
  return matchedRate;
};

const getIncomeRate = (taxBase: number): TransferTaxRate => {
  let selected = INCOME_RATE_TABLE[0];
  for (const row of INCOME_RATE_TABLE) {
    if (taxBase >= row.base) selected = row;
    else break;
  }
  return selected;
};

const calculateResult = (state: CalculatorState, scenarios: ScenarioInput[]): CalculationResult => {
  const holdingYears = calculateHoldingYears(state.acquisitionDate, state.transferDate);
  const holdingRate = getHoldingRate(holdingYears);
  const acquisitionPrice = parseNumber(state.taxAcquisitionPrice);
  const purchasePrice = parseNumber(state.acquisitionPrice);
  const necessaryCost = parseNumber(state.capitalExpense) + parseNumber(state.transferBrokerFee) + parseNumber(state.bondLoss) + parseNumber(state.otherCost);
  const estimatedDeduction = Math.round(purchasePrice * 0.03);
  const basicDeduction = parseNumber(state.basicDeduction);
  const collateralDebt = parseNumber(state.collateralDebt);

  const results = scenarios.map((scenario: ScenarioInput): ScenarioResult => {
    const valuation = parseNumber(scenario.value);
    const capitalGain = valuation - acquisitionPrice - necessaryCost;
    const specialDeduction = Math.round(capitalGain * (holdingRate / 100));
    const taxableGain = Math.max(0, capitalGain - specialDeduction);
    const taxBase = Math.max(0, taxableGain - basicDeduction);
    const rateRow = getIncomeRate(taxBase);
    const appliedRate = state.businessUse === '1' ? rateRow.business : rateRow.nonBusiness;
    const calculatedTax = Math.max(0, Math.round(taxBase * (appliedRate / 100) - rateRow.deduction));
    const localTax = Math.round(calculatedTax * 0.1);
    const netAsset = valuation - collateralDebt;
    const licenseTax = Math.max(0, Math.round(netAsset * 0.004));
    const denseTax = Math.max(0, Math.round(netAsset * 0.012));

    return {
      id: scenario.id,
      label: scenario.label,
      shortLabel: scenario.shortLabel,
      valuation,
      capitalGain,
      specialDeduction,
      taxableGain,
      taxBase,
      appliedRate,
      progressiveDeduction: rateRow.deduction,
      calculatedTax,
      localTax,
      transferTaxTotal: calculatedTax + localTax,
      normalAcquisitionTax: Math.round(valuation * 0.04),
      normalRuralTax: Math.round(valuation * 0.002),
      normalEducationTax: Math.round(valuation * 0.004),
      normalAcquisitionTotal: Math.round(valuation * 0.046),
      heavyAcquisitionTax: Math.round(valuation * 0.08),
      heavyRuralTax: Math.round(valuation * 0.002),
      heavyEducationTax: Math.round(valuation * 0.012),
      heavyAcquisitionTotal: Math.round(valuation * 0.094),
      netAsset,
      licenseTax,
      licenseEducationTax: Math.round(licenseTax * 0.2),
      licenseTotal: Math.round(licenseTax * 1.2),
      denseTax,
      denseEducationTax: Math.round(denseTax * 0.2),
      denseTotal: Math.round(denseTax * 1.2),
    };
  });

  return {
    holdingYears,
    holdingRate,
    necessaryCost,
    estimatedDeduction,
    usageType: state.businessUse === '1' ? '사업용 부동산' : '비사업용 부동산',
    scenarios: results,
  };
};

export default function CommercialBuildingSaleTaxCalculator({ className = '' }: CommercialBuildingSaleTaxCalculatorProps) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [scenarios, setScenarios] = useState<ScenarioInput[]>(INITIAL_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState(0);
  const result = useMemo((): CalculationResult => calculateResult(state, scenarios), [state, scenarios]);

  const updateState = (field: keyof CalculatorState, value: string): void => {
    setState((prev) => {
      const moneyFields: Array<keyof CalculatorState> = ['acquisitionPrice', 'taxAcquisitionPrice', 'capitalExpense', 'transferBrokerFee', 'bondLoss', 'otherCost', 'basicDeduction', 'collateralDebt'];
      const nextValue = moneyFields.includes(field) ? formatMoneyInput(value) : value;
      return { ...prev, [field]: nextValue };
    });
  };

  const updateScenario = (index: number, value: string): void => {
    setScenarios((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value: formatMoneyInput(value) };
      return next;
    });
  };

  const activeResult = result.scenarios[activeScenario];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>상가, 빌딩 등 주택 외 부동산 매각 시 발생하는 양도소득세와 취득 관련 세금을 시나리오별로 비교합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>감정평가액 2개와 매매사례가액을 각각 입력하면 양도차익, 장기보유공제, 과세표준, 산출세액을 자동 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>취득세 일반/중과, 담보채무 차감 후 등록면허세와 과밀억제권역 중과까지 함께 확인할 수 있습니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">calc804-2.js의 세율표와 계산 흐름을 React 상태 계산으로 이식했습니다. 실제 신고 전에는 과세대상, 감면요건, 중과 여부를 별도로 검토해야 합니다.</p>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl md:max-w-md mx-auto mt-8">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              type="button"
              onClick={(): void => setActiveScenario(index)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeScenario === index ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {scenario.shortLabel}
            </button>
          ))}
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-4">
              <SummaryCard label="취득일" value={state.acquisitionDate} />
              <SummaryCard label="양도일" value={state.transferDate} />
            <SummaryCard label="양도구분" value={result.usageType} />
            <SummaryCard label="보유기간" value={`${result.holdingYears.toFixed(1)}년 / ${result.holdingRate}%`} dark />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">기본 조건 입력</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div className="bg-[#203578] text-white p-4 text-sm font-black">공통 조건</div>
                <div className="divide-y divide-gray-100">
                  <InputRow label="취득일"><input type="date" value={state.acquisitionDate} onChange={(event): void => updateState('acquisitionDate', event.target.value)} className="w-full bg-transparent text-right font-black text-[#203578] outline-none" /></InputRow>
                  <InputRow label="양도일"><input type="date" value={state.transferDate} onChange={(event): void => updateState('transferDate', event.target.value)} className="w-full bg-transparent text-right font-black text-[#203578] outline-none" /></InputRow>
                  <InputRow label="사업용 여부">
                    <select value={state.businessUse} onChange={(event): void => updateState('businessUse', event.target.value)} className="w-full bg-transparent text-right font-black text-[#203578] outline-none">
                      <option value="1">사업용 부동산</option>
                      <option value="0">비사업용 부동산</option>
                    </select>
                  </InputRow>
                  <InputRow label="매입가액"><MoneyInput value={state.acquisitionPrice} onChange={(value): void => updateState('acquisitionPrice', value)} /></InputRow>
                  <InputRow label="양도 시 취득가액"><MoneyInput value={state.taxAcquisitionPrice} onChange={(value): void => updateState('taxAcquisitionPrice', value)} /></InputRow>
                  <InputRow label="기본공제"><MoneyInput value={state.basicDeduction} onChange={(value): void => updateState('basicDeduction', value)} /></InputRow>
                  <InputRow label="담보채무"><MoneyInput value={state.collateralDebt} onChange={(value): void => updateState('collateralDebt', value)} /></InputRow>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div className="bg-[#203578] text-white p-4 text-sm font-black">시나리오 및 필요경비</div>
                <div className="divide-y divide-gray-100">
                  {scenarios.map((scenario, index) => (
                    <InputRow key={scenario.id} label={scenario.label} highlight={index === activeScenario}>
                      <MoneyInput value={scenario.value} onChange={(value): void => updateScenario(index, value)} />
                    </InputRow>
                  ))}
                  <InputRow label="자본적 지출액"><MoneyInput value={state.capitalExpense} onChange={(value): void => updateState('capitalExpense', value)} /></InputRow>
                  <InputRow label="양도 중개수수료"><MoneyInput value={state.transferBrokerFee} onChange={(value): void => updateState('transferBrokerFee', value)} /></InputRow>
                  <InputRow label="국민주택채권 매각손실"><MoneyInput value={state.bondLoss} onChange={(value): void => updateState('bondLoss', value)} /></InputRow>
                  <InputRow label="기타 필요경비"><MoneyInput value={state.otherCost} onChange={(value): void => updateState('otherCost', value)} /></InputRow>
                  <div className="p-5 bg-blue-50/40 flex items-center justify-between"><span className="text-sm font-black text-[#1a1f27]">필요경비 합계</span><span className="text-lg font-black text-[#203578]">{formatNumber(result.necessaryCost)}</span></div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">선택 시나리오 핵심 결과</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard icon={<Building2 className="w-5 h-5" />} label="양도가액" value={formatNumber(activeResult.valuation)} />
            <MetricCard icon={<Clock className="w-5 h-5" />} label="양도세 합계" value={formatNumber(activeResult.transferTaxTotal)} color="green" />
            <MetricCard icon={<Landmark className="w-5 h-5" />} label="일반 취득세 합계" value={formatNumber(activeResult.normalAcquisitionTotal)} color="blue" />
            <MetricCard icon={<ReceiptText className="w-5 h-5" />} label="중과 취득세 합계" value={formatNumber(activeResult.heavyAcquisitionTotal)} color="dark" />
            </div>
          </section>

          <ResultTable
              title="양도소득세 분석 상세"
            rows={[
              ['양도가액', (row) => formatNumber(row.valuation)],
              ['양도 시 취득가액', () => state.taxAcquisitionPrice],
              ['매입가액', () => state.acquisitionPrice],
                ['개산공제액 3%', () => formatNumber(result.estimatedDeduction)],
                ['필요경비', () => formatNumber(result.necessaryCost)],
                ['양도차익', (row) => formatNumber(row.capitalGain)],
                ['장기보유특별공제', (row) => formatNumber(row.specialDeduction)],
                ['양도소득금액', (row) => formatNumber(row.taxableGain)],
                ['기본공제', () => state.basicDeduction],
                ['과세표준', (row) => formatNumber(row.taxBase)],
              ['?곸슜?몄쑉', (row) => `${row.appliedRate}%`],
                ['누진공제', (row) => formatNumber(row.progressiveDeduction)],
              ['?곗텧?몄븸', (row) => formatNumber(row.calculatedTax)],
                ['지방소득세', (row) => formatNumber(row.localTax)],
              ['?멸툑 ?⑷퀎', (row) => formatNumber(row.transferTaxTotal)],
            ]}
            results={result.scenarios}
          />

          <ResultTable
              title="취득세 및 등록면허세 비교"
            rows={[
                ['취득세 일반 4%', (row) => formatNumber(row.normalAcquisitionTax)],
                ['농어촌특별세 0.2%', (row) => formatNumber(row.normalRuralTax)],
                ['지방교육세 0.4%', (row) => formatNumber(row.normalEducationTax)],
                ['일반 취득세 합계', (row) => formatNumber(row.normalAcquisitionTotal)],
                ['취득세 중과 8%', (row) => formatNumber(row.heavyAcquisitionTax)],
                ['중과 농어촌특별세 0.2%', (row) => formatNumber(row.heavyRuralTax)],
                ['중과 지방교육세 1.2%', (row) => formatNumber(row.heavyEducationTax)],
                ['중과 취득세 합계', (row) => formatNumber(row.heavyAcquisitionTotal)],
              ['채무 차감 순자산가액', (row) => formatNumber(row.netAsset)],
                ['등록면허세 0.4%', (row) => formatNumber(row.licenseTax)],
                ['등록면허 지방교육세', (row) => formatNumber(row.licenseEducationTax)],
                ['등록면허세 합계', (row) => formatNumber(row.licenseTotal)],
                ['과밀억제권역 등록세 1.2%', (row) => formatNumber(row.denseTax)],
                ['과밀억제권역 지방교육세', (row) => formatNumber(row.denseEducationTax)],
                ['과밀억제권역 합계', (row) => formatNumber(row.denseTotal)],
            ]}
            results={result.scenarios}
          />
        </div>

        <ReportActionFooter />
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  dark?: boolean;
}

function SummaryCard({ label, value, dark = false }: SummaryCardProps) {
  return (
    <div className={`${dark ? 'bg-[#1a1f27] text-white shadow-xl' : 'bg-white border border-gray-100 shadow-sm'} p-6 rounded-[32px] text-center`}>
      <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${dark ? 'text-white/40' : 'text-[#8b95a1]'}`}>{label}</p>
      <p className={`text-lg font-bold ${dark ? 'text-[#fab005]' : 'text-[#1a1f27]'}`}>{value}</p>
    </div>
  );
}

interface InputRowProps {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}

function InputRow({ label, children, highlight = false }: InputRowProps) {
  return (
    <div className={`p-5 flex items-center justify-between gap-4 transition-colors ${highlight ? 'bg-blue-50/40' : 'hover:bg-gray-50/60'}`}>
      <span className="text-sm font-semibold text-[#4e5968] shrink-0">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
}

function MoneyInput({ value, onChange }: MoneyInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event): void => onChange(event.target.value)}
      className="w-full bg-transparent border-none text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20 rounded-lg px-2 py-1"
    />
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

interface ResultTableProps {
  title: string;
  rows: Array<[string, (result: ScenarioResult) => string]>;
  results: ScenarioResult[];
}

function ResultTable({ title, rows, results }: ResultTableProps) {
  return (
    <section className="px-4 md:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
        <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">{title}</h3>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
        <table className="w-full border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#1a1f27] text-white">
            <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">분석 항목</th>
              {results.map((result) => (
                <th key={result.id} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">{result.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
            {rows.map(([label, formatter], index) => {
            const isTotalRow = label.includes('합계') || label === '세금 합계' || label === '과세표준';
              return (
                <tr key={label} className={`${isTotalRow ? 'bg-blue-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                  <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-bold ${isTotalRow ? 'bg-blue-50/50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>{label}</td>
                  {results.map((result) => (
                    <td key={`${label}-${result.id}-${index}`} className={`p-3 md:p-4 text-right whitespace-nowrap ${isTotalRow ? 'font-black text-[#203578]' : 'font-bold text-[#4e5968]'}`}>{formatter(result)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

