'use client';

import React, { useMemo, useState } from 'react';
import { BarChart3, Coins, Landmark, TrendingUp } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface InheritanceTaxForecastCalculatorProps {
  className?: string;
}

interface CalculatorState {
  spouseCount: string;
  childCount: string;
  stockCount: string;
  currentStockPrice: string;
  elapsedYears: string;
  futureStockPrice: string;
  realEstateValue: string;
  realEstateGrowth: string;
  financialAssetsValue: string;
  financialAssetsGrowth: string;
  otherAssetsValue: string;
  debtValue: string;
  priorGiftValue: string;
  priorGiftTaxPaid: string;
}

interface ScenarioResult {
  stockValue: number;
  realEstateValue: number;
  financialAssetsValue: number;
  otherAssetsValue: number;
  debtValue: number;
  taxBase: number;
  inheritanceTaxable: number;
  financialDeduction: number;
  blanketDeduction: number;
  spouseDeduction: number;
  totalDeduction: number;
  taxStandard: number;
  taxRate: number;
  calculatedTax: number;
  prepaidTaxDeduction: number;
  finalTaxPayment: number;
  afterTaxInheritance: number;
}

interface CalculationResult {
  years: number;
  spouseShareText: string;
  current: ScenarioResult;
  future: ScenarioResult;
  netAssetIncrease: number;
}

type MoneyField =
  | 'stockCount'
  | 'currentStockPrice'
  | 'futureStockPrice'
  | 'realEstateValue'
  | 'financialAssetsValue'
  | 'otherAssetsValue'
  | 'debtValue'
  | 'priorGiftValue'
  | 'priorGiftTaxPaid';

const INITIAL_STATE: CalculatorState = {
  spouseCount: '1',
  childCount: '2',
  stockCount: '1,000',
  currentStockPrice: '30,000',
  elapsedYears: '5',
  futureStockPrice: '60,000',
  realEstateValue: '500,000,000',
  realEstateGrowth: '20',
  financialAssetsValue: '300,000,000',
  financialAssetsGrowth: '15',
  otherAssetsValue: '100,000,000',
  debtValue: '200,000,000',
  priorGiftValue: '50,000,000',
  priorGiftTaxPaid: '10,000,000',
};

const MONEY_FIELDS: MoneyField[] = [
  'stockCount',
  'currentStockPrice',
  'futureStockPrice',
  'realEstateValue',
  'financialAssetsValue',
  'otherAssetsValue',
  'debtValue',
  'priorGiftValue',
  'priorGiftTaxPaid',
];

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

const formatNumericInput = (value: string): string => value.replace(/[^0-9.]/g, '');

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

const toFraction = (numerator: number, denominator: number): string => {
  if (!denominator) return '-';
  const factor = gcd(numerator, denominator);
  return `${numerator / factor}/${denominator / factor}`;
};

const getApplicableTaxRate = (taxableAmount: number): number => {
  if (taxableAmount > 3_000_000_000) return 50;
  if (taxableAmount > 1_000_000_000) return 40;
  if (taxableAmount > 500_000_000) return 30;
  if (taxableAmount > 100_000_000) return 20;
  return 10;
};

const getProgressiveDeduction = (taxRate: number): number => {
  switch (taxRate) {
    case 50:
      return 460;
    case 40:
      return 160;
    case 30:
      return 60;
    case 20:
      return 10;
    default:
      return 0;
  }
};

const calculateTaxAmount = (taxStandard: number, taxRate: number): number => {
  const deduction = getProgressiveDeduction(taxRate);
  return Math.round(taxStandard * (taxRate / 100) - deduction);
};

const calculateFinancialDeduction = (financialAmount: number): number => {
  if (!financialAmount) return 0;
  return Math.min(200_000_000, Math.max(Math.round(financialAmount * 0.2), 20));
};

const calculateSpouseShareRatio = (spouseCount: number, childCount: number): number => {
  if (spouseCount + childCount === 0) return 0;
  return (spouseCount * 1.5) / (spouseCount * 1.5 + childCount);
};

const calculateSpouseDeduction = (spouseCount: number, taxTotal: number, spouseShareRatio: number): number => {
  if (spouseCount === 0) return 0;
  const rawDeduction = taxTotal * spouseShareRatio;
  return Math.min(3_000_000_000, Math.max(500_000_000, rawDeduction));
};

const calculateScenario = ({
  stockValue,
  realEstateValue,
  financialAssetsValue,
  otherAssetsValue,
  debtValue,
  priorGiftValue,
  priorGiftTaxPaid,
  blanketDeduction,
  spouseDeduction,
}: {
  stockValue: number;
  realEstateValue: number;
  financialAssetsValue: number;
  otherAssetsValue: number;
  debtValue: number;
  priorGiftValue: number;
  priorGiftTaxPaid: number;
  blanketDeduction: number;
  spouseDeduction: number;
}): ScenarioResult => {
  const taxBase = stockValue + realEstateValue + financialAssetsValue + otherAssetsValue - debtValue;
  const inheritanceTaxable = taxBase + priorGiftValue;
  const financialDeduction = calculateFinancialDeduction(financialAssetsValue);
  const totalDeduction = financialDeduction + blanketDeduction + spouseDeduction;
  const taxStandard = Math.max(inheritanceTaxable - totalDeduction, 0);
  const taxRate = getApplicableTaxRate(taxStandard);
  const calculatedTax = calculateTaxAmount(taxStandard, taxRate);
  const finalTaxPayment = Math.round((calculatedTax - priorGiftTaxPaid) * 0.97);

  return {
    stockValue,
    realEstateValue,
    financialAssetsValue,
    otherAssetsValue,
    debtValue,
    taxBase,
    inheritanceTaxable,
    financialDeduction,
    blanketDeduction,
    spouseDeduction,
    totalDeduction,
    taxStandard,
    taxRate,
    calculatedTax,
    prepaidTaxDeduction: priorGiftTaxPaid,
    finalTaxPayment,
    afterTaxInheritance: Math.max(0, taxBase - finalTaxPayment),
  };
};

const calculateResult = (state: CalculatorState): CalculationResult => {
  const spouseCount = parseNumber(state.spouseCount);
  const childCount = parseNumber(state.childCount);
  const stockCount = parseNumber(state.stockCount);
  const currentStockPrice = parseNumber(state.currentStockPrice);
  const futureStockPrice = parseNumber(state.futureStockPrice);
  const realEstateValue = parseNumber(state.realEstateValue);
  const realEstateGrowth = parseNumber(state.realEstateGrowth);
  const financialAssetsValue = parseNumber(state.financialAssetsValue);
  const financialAssetsGrowth = parseNumber(state.financialAssetsGrowth);
  const otherAssetsValue = parseNumber(state.otherAssetsValue);
  const debtValue = parseNumber(state.debtValue);
  const priorGiftValue = parseNumber(state.priorGiftValue);
  const priorGiftTaxPaid = parseNumber(state.priorGiftTaxPaid);
  const years = parseNumber(state.elapsedYears);

  const spouseShareRatio = calculateSpouseShareRatio(spouseCount, childCount);
  const rawNumerator = spouseCount * 1.5 * 10;
  const rawDenominator = (spouseCount * 1.5 + childCount) * 10;
  const spouseShareText = rawDenominator > 0 ? toFraction(rawNumerator, rawDenominator) : '-';
  const blanketDeduction = childCount === 0 ? 2_000_000_000 : 5_000_000_000;

  const stockNow = stockCount * currentStockPrice;
  const stockFuture = stockCount * futureStockPrice;
  const realEstateFuture = Math.round(realEstateValue * Math.pow(1 + realEstateGrowth / 100, years));
  const financialAssetsFuture = Math.round(financialAssetsValue * Math.pow(1 + financialAssetsGrowth / 100, years));

  const currentTaxBase = stockNow + realEstateValue + financialAssetsValue + otherAssetsValue - debtValue;
  const futureTaxBase = Math.round(stockFuture + realEstateFuture + financialAssetsFuture + otherAssetsValue - debtValue);
  const spouseDeductionCurrent = calculateSpouseDeduction(spouseCount, currentTaxBase + priorGiftValue, spouseShareRatio);
  const spouseDeductionFuture = calculateSpouseDeduction(spouseCount, futureTaxBase + priorGiftValue, spouseShareRatio);

  const current = calculateScenario({
    stockValue: stockNow,
    realEstateValue,
    financialAssetsValue,
    otherAssetsValue,
    debtValue,
    priorGiftValue,
    priorGiftTaxPaid,
    blanketDeduction,
    spouseDeduction: spouseDeductionCurrent,
  });

  const future = calculateScenario({
    stockValue: stockFuture,
    realEstateValue: realEstateFuture,
    financialAssetsValue: financialAssetsFuture,
    otherAssetsValue,
    debtValue,
    priorGiftValue,
    priorGiftTaxPaid,
    blanketDeduction,
    spouseDeduction: spouseDeductionFuture,
  });

  return {
    years,
    spouseShareText,
    current,
    future,
    netAssetIncrease: future.taxBase - current.taxBase,
  };
};

export default function InheritanceTaxForecastCalculator({ className = '' }: InheritanceTaxForecastCalculatorProps) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const result = useMemo((): CalculationResult => calculateResult(state), [state]);

  const updateState = (field: keyof CalculatorState, value: string): void => {
    setState((prev) => ({
      ...prev,
      [field]: MONEY_FIELDS.includes(field as MoneyField) ? formatMoneyInput(value) : formatNumericInput(value),
    }));
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>현재 시점과 경과 후 시점의 상속재산가액, 과세표준, 산출세액, 세후 상속재산을 비교합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>주식, 부동산, 금융자산의 미래가치를 입력한 경과연수와 성장률 기준으로 자동 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>금융재산 상속공제, 일괄공제, 배우자공제, 사전증여재산과 기납부세액을 반영합니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">calc805-1.js의 주요 계산 흐름을 React 상태 계산으로 이식했습니다. 실제 신고 전에는 상속인 구성, 사전증여 합산기간, 감정평가, 채무 인정 여부를 별도로 검토해야 합니다.</p>
          </div>
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard icon={<Landmark className="w-5 h-5" />} label="현재 상속재산가액" value={formatNumber(result.current.taxBase)} />
              <MetricCard icon={<TrendingUp className="w-5 h-5" />} label={`${result.years}년 후 상속재산가액`} value={formatNumber(result.future.taxBase)} color="dark" />
              <MetricCard icon={<Coins className="w-5 h-5" />} label="미래 순증가액" value={formatNumber(result.netAssetIncrease)} color="green" />
          <MetricCard icon={<BarChart3 className="w-5 h-5" />} label="배우자 법정비율" value={result.spouseShareText} color="blue" />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">입력값</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">금액과 성장률을 수정하면 계산 결과가 즉시 반영됩니다.</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputPanel title="상속인 및 주식 조건">
                <InputRow label="배우자 수"><NumberInput value={state.spouseCount} onChange={(value): void => updateState('spouseCount', value)} /></InputRow>
                <InputRow label="자녀 수"><NumberInput value={state.childCount} onChange={(value): void => updateState('childCount', value)} /></InputRow>
                <InputRow label="보유주식 수"><MoneyInput value={state.stockCount} onChange={(value): void => updateState('stockCount', value)} /></InputRow>
                <InputRow label="현재 주가"><MoneyInput value={state.currentStockPrice} onChange={(value): void => updateState('currentStockPrice', value)} /></InputRow>
                <InputRow label="경과연수"><NumberInput value={state.elapsedYears} onChange={(value): void => updateState('elapsedYears', value)} /></InputRow>
                <InputRow label={`${result.years}년 후 추정 주가`}><MoneyInput value={state.futureStockPrice} onChange={(value): void => updateState('futureStockPrice', value)} /></InputRow>
              </InputPanel>

              <InputPanel title="자산 및 사전증여 조건">
                <InputRow label="부동산가액"><MoneyInput value={state.realEstateValue} onChange={(value): void => updateState('realEstateValue', value)} /></InputRow>
                <InputRow label="부동산 가치상승률(%)"><NumberInput value={state.realEstateGrowth} onChange={(value): void => updateState('realEstateGrowth', value)} /></InputRow>
                <InputRow label="금융자산가액"><MoneyInput value={state.financialAssetsValue} onChange={(value): void => updateState('financialAssetsValue', value)} /></InputRow>
                <InputRow label="금융자산 가치상승률(%)"><NumberInput value={state.financialAssetsGrowth} onChange={(value): void => updateState('financialAssetsGrowth', value)} /></InputRow>
                <InputRow label="기타자산가액"><MoneyInput value={state.otherAssetsValue} onChange={(value): void => updateState('otherAssetsValue', value)} /></InputRow>
                <InputRow label="채무"><MoneyInput value={state.debtValue} onChange={(value): void => updateState('debtValue', value)} /></InputRow>
                <InputRow label="사전증여재산"><MoneyInput value={state.priorGiftValue} onChange={(value): void => updateState('priorGiftValue', value)} /></InputRow>
                <InputRow label="사전증여 기납부세액"><MoneyInput value={state.priorGiftTaxPaid} onChange={(value): void => updateState('priorGiftTaxPaid', value)} /></InputRow>
              </InputPanel>
            </div>
          </section>

          <ComparisonTable years={result.years} result={result} />
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

interface InputPanelProps {
  title: string;
  children: React.ReactNode;
}

function InputPanel({ title, children }: InputPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div className="bg-[#203578] text-white p-4 text-sm font-black">{title}</div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

interface InputRowProps {
  label: string;
  children: React.ReactNode;
}

function InputRow({ label, children }: InputRowProps) {
  return (
    <div className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
      <span className="text-sm font-semibold text-[#4e5968] shrink-0">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

function MoneyInput({ value, onChange }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event): void => onChange(event.target.value)}
      className="w-full bg-transparent border-none text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20 rounded-lg px-2 py-1"
    />
  );
}

function NumberInput({ value, onChange }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event): void => onChange(event.target.value)}
      className="w-full bg-transparent border-none text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20 rounded-lg px-2 py-1"
    />
  );
}

function ComparisonTable({ years, result }: { years: number; result: CalculationResult }) {
  const rows: Array<[string, (scenario: ScenarioResult) => string, boolean?]> = [
              ['주식', (scenario) => formatNumber(scenario.stockValue)],
              ['부동산', (scenario) => formatNumber(scenario.realEstateValue)],
              ['금융자산', (scenario) => formatNumber(scenario.financialAssetsValue)],
              ['기타자산', (scenario) => formatNumber(scenario.otherAssetsValue)],
              ['(-) 채무', (scenario) => formatNumber(scenario.debtValue)],
    ['상속재산가액', (scenario) => formatNumber(scenario.taxBase), true],
              ['(+) 사전증여재산', () => formatNumber(result.current.inheritanceTaxable - result.current.taxBase)],
    ['상속세 과세가액', (scenario) => formatNumber(scenario.inheritanceTaxable), true],
              ['(-) 금융재산 상속공제', (scenario) => formatNumber(scenario.financialDeduction)],
              ['(-) 일괄공제', (scenario) => formatNumber(scenario.blanketDeduction)],
    ['(-) 배우자공제', (scenario) => formatNumber(scenario.spouseDeduction)],
    ['공제계', (scenario) => formatNumber(scenario.totalDeduction), true],
              ['상속세 과세표준', (scenario) => formatNumber(scenario.taxStandard), true],
    ['?곸슜?몄쑉', (scenario) => `${scenario.taxRate}%`],
    ['?곗텧?몄븸', (scenario) => formatNumber(scenario.calculatedTax)],
              ['(-) 기납부세액공제', (scenario) => formatNumber(scenario.prepaidTaxDeduction)],
              ['자진납부세액', (scenario) => formatNumber(scenario.finalTaxPayment), true],
    ['세후 상속재산가액', (scenario) => formatNumber(scenario.afterTaxInheritance), true],
  ];

  return (
    <section className="px-4 md:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
            <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">현재와 미래 상속세 비교</h3>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#1a1f27] text-white">
              <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">구분</th>
              <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">현재 기준</th>
              <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">{years}년 후 기준</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
            {rows.map(([label, formatter, highlight]) => (
              <tr key={label} className={`${highlight ? 'bg-blue-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-bold ${highlight ? 'bg-blue-50/50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>{label}</td>
                <td className={`p-3 md:p-4 text-right border-r border-gray-100 whitespace-nowrap ${highlight ? 'font-black text-[#203578]' : 'font-bold text-[#4e5968]'}`}>{formatter(result.current)}</td>
                <td className={`p-3 md:p-4 text-right whitespace-nowrap ${highlight ? 'font-black text-[#203578]' : 'font-bold text-[#4e5968]'}`}>{formatter(result.future)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <p className="mt-3 text-right text-[11px] text-gray-400">배우자 법정상속비율: {result.spouseShareText}</p>
    </section>
  );
}

