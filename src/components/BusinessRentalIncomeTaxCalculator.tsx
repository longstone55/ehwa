'use client';

import React, { useEffect, useState } from 'react';
import { Clock, CornerDownRight, Eye, FileDown, Phone, Printer, Sparkles } from 'lucide-react';

interface BusinessRentalIncomeTaxCalculatorProps {
  className?: string;
}

interface CaseData {
  businessIncome: string;
  dividendIncome: string;
  otherFinancialIncome: string;
  rentalIncome: string;
  laborIncome: string;
}

interface IncomeData {
  businessIncome: number;
  dividendIncome: number;
  financialIncome: number;
  rentalIncome: number;
  employmentIncome: number;
}

interface TaxBracket {
  limit: number;
  rate: number;
  deduction: number;
}

interface TaxScenario {
  totalIncome: number;
  withholdingDividend: number;
  grossUpDividend: number;
  totalFinancialIncome: number;
  rentalExpense: number;
  withholdingFinancialIncome: number;
  incomeDeduction: number;
  taxableFinancialIncome: number;
  comprehensiveTaxBaseA: number;
  comprehensiveTaxBaseB: number;
  calculatedTax: number;
}

interface StandardTaxCreditParams {
  totalIncome: number;
  employmentIncome: number;
  rentalIncome: number;
  totalFinancialIncome: number;
  calculatedTax: number;
  separatedTax: number;
}

interface FinalTaxWithCreditsParams {
  calculatedTax: number;
  dividendTaxCredit: number;
  standardTaxCredit: number;
}

interface CaseResult {
  businessIncome: number;
  dividendIncome: number;
  otherFinancialIncome: number;
  rentalIncome: number;
  laborIncome: number;
  withholdingDividend: number;
  grossUpDividend: number;
  totalFinancialIncome: number;
  withholdingFinancialIncome: number;
  taxableFinancialIncome: number;
  rentalExpense: number;
  salaryTaxBase: number;
  salaryTaxableAfterDeduction: number;
  salaryEtcIncome: number;
  totalIncome: number;
  incomeDeduction: number;
  comprehensiveTaxBaseA: number;
  comprehensiveTaxBaseB: number;
  comprehensiveTax: number;
  separatedTax: number;
  totalCalculatedTax: number;
  dividendTaxCredit: number;
  standardTaxCredit: number;
  finalTax: number;
  burdenRate: string;
  taxIncrease: number | null;
  taxIncreaseRate: string | null;
  healthInsurance: number;
  elderlyCare: number;
  nationalPension: number;
  quasiTaxTotal: number;
  finalTaxWithQuasiTax: number;
  burdenRateWithQuasiTax: string;
  quasiTaxIncrease: number | null;
  quasiTaxIncreaseRate: string | null;
  afterTaxReceipt: number | null;
}

interface InputRow {
  label: string;
  field: keyof CaseData;
}

interface ResultRow {
  label: string;
  field: keyof CaseResult;
  variant: 'normal' | 'sub' | 'total' | 'primary' | 'success' | 'warning';
  format: 'money' | 'rate';
}

const INITIAL_DATA: CaseData[] = [
  '11,737,403,960',
  '13,717,601,980',
  '15,697,800,000',
  '17,677,998,020',
  '19,658,196,040',
  '29,559,186,139',
  '39,460,176,238',
  '59,262,156,436',
].map((businessIncome: string): CaseData => ({
  businessIncome,
  dividendIncome: '0',
  otherFinancialIncome: '0',
  rentalIncome: '0',
  laborIncome: '0',
}));

const INPUT_ROWS: InputRow[] = [
  { label: '사업소득', field: 'businessIncome' },
  { label: '배당소득', field: 'dividendIncome' },
  { label: '배당소득 외 금융소득', field: 'otherFinancialIncome' },
  { label: '임대소득', field: 'rentalIncome' },
  { label: '근로소득', field: 'laborIncome' },
];

const TAX_BRACKETS: TaxBracket[] = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 65_940_000 },
];

const SALARY_DEDUCTION_BRACKETS: TaxBracket[] = [
  { limit: 0, rate: 0.7, deduction: 0 },
  { limit: 5_000_000, rate: 0.4, deduction: 3_500_000 },
  { limit: 15_000_000, rate: 0.15, deduction: 7_500_000 },
  { limit: 45_000_000, rate: 0.05, deduction: 12_000_000 },
  { limit: 100_000_000, rate: 0.02, deduction: 14_750_000 },
];

const RESULT_ROWS: ResultRow[] = [
  { label: '사업소득', field: 'businessIncome', variant: 'success', format: 'money' },
  { label: '배당소득', field: 'dividendIncome', variant: 'success', format: 'money' },
  { label: '원천징수배당', field: 'withholdingDividend', variant: 'sub', format: 'money' },
  { label: '그로스업배당(11% 가산)', field: 'grossUpDividend', variant: 'sub', format: 'money' },
  { label: '배당소득 외 금융소득', field: 'otherFinancialIncome', variant: 'success', format: 'money' },
  { label: '금융소득계', field: 'totalFinancialIncome', variant: 'sub', format: 'money' },
  { label: '원천징수금융소득', field: 'withholdingFinancialIncome', variant: 'sub', format: 'money' },
  { label: '종합과세금융소득', field: 'taxableFinancialIncome', variant: 'sub', format: 'money' },
  { label: '임대소득', field: 'rentalIncome', variant: 'success', format: 'money' },
  { label: '필요경비', field: 'rentalExpense', variant: 'sub', format: 'money' },
  { label: '근로소득', field: 'laborIncome', variant: 'success', format: 'money' },
  { label: '급여소득과세표준', field: 'salaryTaxBase', variant: 'sub', format: 'money' },
  { label: '소득공제 후 급여과세표준', field: 'salaryTaxableAfterDeduction', variant: 'sub', format: 'money' },
  { label: '급여소득외계', field: 'salaryEtcIncome', variant: 'success', format: 'money' },
  { label: '총 소득', field: 'totalIncome', variant: 'total', format: 'money' },
  { label: '종합소득공제', field: 'incomeDeduction', variant: 'success', format: 'money' },
  { label: '종합소득 종합과세표준 A', field: 'comprehensiveTaxBaseA', variant: 'normal', format: 'money' },
  { label: '종합소득 분리과세표준 B', field: 'comprehensiveTaxBaseB', variant: 'normal', format: 'money' },
  { label: '종합과세시', field: 'comprehensiveTax', variant: 'normal', format: 'money' },
  { label: '분리과세시', field: 'separatedTax', variant: 'normal', format: 'money' },
  { label: '총산출세액', field: 'totalCalculatedTax', variant: 'success', format: 'money' },
  { label: '배당세액공제', field: 'dividendTaxCredit', variant: 'sub', format: 'money' },
  { label: '표준세액공제', field: 'standardTaxCredit', variant: 'sub', format: 'money' },
  { label: '결정세액(지방소득세)', field: 'finalTax', variant: 'primary', format: 'money' },
  { label: '세부담률', field: 'burdenRate', variant: 'normal', format: 'rate' },
  { label: '현재대비 세금 증가분', field: 'taxIncrease', variant: 'warning', format: 'money' },
  { label: '세금 / 소득', field: 'taxIncreaseRate', variant: 'normal', format: 'rate' },
  { label: '건강보험료', field: 'healthInsurance', variant: 'normal', format: 'money' },
  { label: '노인요양', field: 'elderlyCare', variant: 'sub', format: 'money' },
  { label: '국민연금', field: 'nationalPension', variant: 'sub', format: 'money' },
  { label: '준조세(계)', field: 'quasiTaxTotal', variant: 'success', format: 'money' },
  { label: '세금 계', field: 'finalTaxWithQuasiTax', variant: 'success', format: 'money' },
  { label: '세부담률', field: 'burdenRateWithQuasiTax', variant: 'success', format: 'rate' },
  { label: '현재대비 준조세포함 증가분', field: 'quasiTaxIncrease', variant: 'warning', format: 'money' },
  { label: '준조세포함 / 소득', field: 'quasiTaxIncreaseRate', variant: 'normal', format: 'rate' },
  { label: '준조세 차감 후 수령액', field: 'afterTaxReceipt', variant: 'primary', format: 'money' },
];

const CASE_LABELS: string[] = ['CASE I', 'CASE II', 'CASE III', 'CASE IV'];
const HEALTH_INSURANCE_RATE: number = 0.0709;
const LONG_TERM_CARE_RATE: number = 0.1281;
const ELDERLY_CARE_RATE: number = 0.1295;
const FINANCIAL_INCOME_THRESHOLD: number = 20_000_000;
const INCOME_DEDUCTION_AMOUNT: number = 1_500_000;
const MAX_SALARY_DEDUCTION: number = 20_000_000;
const STANDARD_TAX_CREDIT_IF_EMPLOYED: number = 630_000;
const STANDARD_TAX_CREDIT_ELSE: number = 70_000;
const NATIONAL_PENSION_CAP: number = 74_040_000;
const NATIONAL_PENSION_RATE: number = 0.09;

const parseCurrency: (value: string) => number = (value: string): number => Number(value.replace(/[^0-9]/g, '')) || 0;

const formatCurrency: (value: number | null) => string = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return '--';
  return Math.round(value).toLocaleString('ko-KR');
};

const formatResultValue: (value: CaseResult[keyof CaseResult], format: ResultRow['format']) => string = (
  value: CaseResult[keyof CaseResult],
  format: ResultRow['format']
): string => {
  if (value === null) return '--';
  if (format === 'rate') return typeof value === 'string' ? value : '--';
  return typeof value === 'number' ? formatCurrency(value) : '--';
};

const formatInputValue: (value: string) => string = (value: string): string => {
  const numericValue: string = value.replace(/[^0-9]/g, '');
  return numericValue ? Number(numericValue).toLocaleString('ko-KR') : '';
};

const findBracket: (amount: number) => TaxBracket = (amount: number): TaxBracket => {
  const matchedBracket: TaxBracket | undefined = TAX_BRACKETS.find((bracket: TaxBracket): boolean => amount <= bracket.limit);
  return matchedBracket ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
};

const calculateFinalTaxWithBracketA: (comprehensiveTaxBaseA: number, withholdingFinancialIncome: number) => number = (
  comprehensiveTaxBaseA: number,
  withholdingFinancialIncome: number
): number => {
  const matchedBracket: TaxBracket = findBracket(comprehensiveTaxBaseA);
  const baseTax: number = comprehensiveTaxBaseA * matchedBracket.rate - matchedBracket.deduction;
  const separateTax: number = withholdingFinancialIncome * 0.14;
  return Math.round(baseTax + separateTax);
};

const calculateSeparatedTax: (comprehensiveTaxBaseB: number, financialIncomeTotal: number) => number = (
  comprehensiveTaxBaseB: number,
  financialIncomeTotal: number
): number => {
  const matchedBracket: TaxBracket = findBracket(comprehensiveTaxBaseB);
  const baseTax: number = comprehensiveTaxBaseB * matchedBracket.rate - matchedBracket.deduction;
  const separatedTax: number = financialIncomeTotal * 0.14;
  return Math.round(baseTax + separatedTax);
};

const calculateSalaryTaxBase: (grossSalary: number) => number = (grossSalary: number): number => {
  let matchedBracket: TaxBracket = SALARY_DEDUCTION_BRACKETS[0];

  for (const bracket of SALARY_DEDUCTION_BRACKETS) {
    if (grossSalary >= bracket.limit) {
      matchedBracket = bracket;
    } else {
      break;
    }
  }

  const deduction: number = (grossSalary - matchedBracket.limit) * matchedBracket.rate + matchedBracket.deduction;
  const finalTaxBase: number = grossSalary - Math.min(deduction, MAX_SALARY_DEDUCTION);
  return Math.floor(finalTaxBase);
};

const calculateTaxScenario: (incomeData: IncomeData) => TaxScenario = (incomeData: IncomeData): TaxScenario => {
  const withholdingDividend: number =
    incomeData.dividendIncome === 0 ? 0 : Math.max(FINANCIAL_INCOME_THRESHOLD - incomeData.financialIncome, 0);
  const grossUpDividend: number = Math.max((incomeData.dividendIncome - withholdingDividend) * 0.11, 0);
  const totalFinancialIncome: number = incomeData.dividendIncome + incomeData.financialIncome;
  const taxableFinancialIncome: number = Math.max(totalFinancialIncome - FINANCIAL_INCOME_THRESHOLD, 0);
  const withholdingFinancialIncome: number =
    totalFinancialIncome > FINANCIAL_INCOME_THRESHOLD ? FINANCIAL_INCOME_THRESHOLD : totalFinancialIncome;
  const rentalExpense: number = Math.floor(incomeData.rentalIncome * 0.5);
  const totalIncome: number =
    incomeData.employmentIncome + totalFinancialIncome + incomeData.rentalIncome + incomeData.businessIncome;
  const incomeDeduction: number = totalIncome === 0 ? 0 : INCOME_DEDUCTION_AMOUNT;
  const comprehensiveTaxBaseA: number =
    incomeData.businessIncome + incomeData.rentalIncome + incomeData.employmentIncome + taxableFinancialIncome;
  const comprehensiveTaxBaseB: number =
    incomeData.businessIncome + taxableFinancialIncome + totalFinancialIncome + incomeData.employmentIncome;
  const calculatedTax: number = calculateFinalTaxWithBracketA(comprehensiveTaxBaseA, withholdingFinancialIncome);

  return {
    totalIncome,
    withholdingDividend,
    grossUpDividend,
    totalFinancialIncome,
    rentalExpense,
    withholdingFinancialIncome,
    incomeDeduction,
    taxableFinancialIncome,
    comprehensiveTaxBaseA,
    comprehensiveTaxBaseB,
    calculatedTax,
  };
};

const calculateStandardTaxCredit: (params: StandardTaxCreditParams) => number = (
  params: StandardTaxCreditParams
): number => {
  if (params.totalIncome === 0) return 0;
  if (params.employmentIncome > 0) return STANDARD_TAX_CREDIT_IF_EMPLOYED;

  if (
    params.employmentIncome === 0 &&
    params.rentalIncome === 0 &&
    params.totalFinancialIncome > 0 &&
    params.calculatedTax <= params.separatedTax
  ) {
    return 0;
  }

  return STANDARD_TAX_CREDIT_ELSE;
};

const calculateFinalTaxWithCredits: (params: FinalTaxWithCreditsParams) => number = (
  params: FinalTaxWithCreditsParams
): number => {
  const baseTax: number = Math.max(params.calculatedTax - params.dividendTaxCredit - params.standardTaxCredit, 0);
  return Math.round(baseTax * 1.1);
};

const calculateBurdenRate: (finalTax: number, totalIncome: number) => string = (
  finalTax: number,
  totalIncome: number
): string => {
  if (!totalIncome || Number.isNaN(totalIncome)) return '0%';
  const rate: number = (finalTax / totalIncome) * 100;
  return `${rate.toFixed(1)}%`;
};

const calculateNationalPension: (income: number) => number = (income: number): number =>
  Math.round(Math.min(income, NATIONAL_PENSION_CAP) * NATIONAL_PENSION_RATE);

const calculateSingleResult: (caseData: CaseData) => CaseResult = (caseData: CaseData): CaseResult => {
  const incomeData: IncomeData = {
    businessIncome: parseCurrency(caseData.businessIncome),
    dividendIncome: parseCurrency(caseData.dividendIncome),
    financialIncome: parseCurrency(caseData.otherFinancialIncome),
    rentalIncome: parseCurrency(caseData.rentalIncome),
    employmentIncome: parseCurrency(caseData.laborIncome),
  };
  const scenario: TaxScenario = calculateTaxScenario(incomeData);
  const salaryTaxBase: number = calculateSalaryTaxBase(incomeData.employmentIncome);
  const salaryEtcTotal: number =
    scenario.totalFinancialIncome + incomeData.businessIncome + scenario.grossUpDividend;
  const salaryEtcIncome: number = salaryEtcTotal <= FINANCIAL_INCOME_THRESHOLD ? 0 : salaryEtcTotal;
  const separatedTax: number = calculateSeparatedTax(scenario.comprehensiveTaxBaseB, scenario.totalFinancialIncome);
  const totalCalculatedTax: number = Math.max(scenario.calculatedTax, separatedTax);
  const dividendTaxCredit: number = Math.min(scenario.grossUpDividend, totalCalculatedTax - separatedTax);
  const standardTaxCredit: number = calculateStandardTaxCredit({
    totalIncome: scenario.totalIncome,
    employmentIncome: incomeData.employmentIncome,
    rentalIncome: incomeData.rentalIncome,
    totalFinancialIncome: scenario.totalFinancialIncome,
    calculatedTax: scenario.calculatedTax,
    separatedTax,
  });
  const finalTax: number = calculateFinalTaxWithCredits({
    calculatedTax: totalCalculatedTax,
    dividendTaxCredit,
    standardTaxCredit,
  });
  const healthInsurance: number = Math.round(scenario.totalIncome * HEALTH_INSURANCE_RATE);
  const elderlyCare: number = Math.round(healthInsurance * ELDERLY_CARE_RATE);
  const nationalPension: number = calculateNationalPension(scenario.totalIncome);
  const quasiTaxTotal: number = healthInsurance + elderlyCare + nationalPension;
  const finalTaxWithQuasiTax: number = finalTax + quasiTaxTotal;
  const salaryTaxableAfterDeduction: number = Math.max(
    salaryTaxBase -
      scenario.incomeDeduction -
      (healthInsurance * (1 + LONG_TERM_CARE_RATE) + nationalPension),
    0
  );

  return {
    businessIncome: incomeData.businessIncome,
    dividendIncome: incomeData.dividendIncome,
    otherFinancialIncome: incomeData.financialIncome,
    rentalIncome: incomeData.rentalIncome,
    laborIncome: incomeData.employmentIncome,
    withholdingDividend: scenario.withholdingDividend,
    grossUpDividend: scenario.grossUpDividend,
    totalFinancialIncome: scenario.totalFinancialIncome,
    withholdingFinancialIncome: scenario.withholdingFinancialIncome,
    taxableFinancialIncome: scenario.taxableFinancialIncome,
    rentalExpense: scenario.rentalExpense,
    salaryTaxBase,
    salaryTaxableAfterDeduction,
    salaryEtcIncome,
    totalIncome: scenario.totalIncome,
    incomeDeduction: scenario.incomeDeduction,
    comprehensiveTaxBaseA: scenario.comprehensiveTaxBaseA,
    comprehensiveTaxBaseB: scenario.comprehensiveTaxBaseB,
    comprehensiveTax: scenario.calculatedTax,
    separatedTax,
    totalCalculatedTax,
    dividendTaxCredit,
    standardTaxCredit,
    finalTax,
    burdenRate: calculateBurdenRate(finalTax, scenario.totalIncome),
    taxIncrease: null,
    taxIncreaseRate: null,
    healthInsurance,
    elderlyCare,
    nationalPension,
    quasiTaxTotal,
    finalTaxWithQuasiTax,
    burdenRateWithQuasiTax: calculateBurdenRate(finalTaxWithQuasiTax, scenario.totalIncome),
    quasiTaxIncrease: null,
    quasiTaxIncreaseRate: null,
    afterTaxReceipt: null,
  };
};

const calculateAllResults: (caseDataList: CaseData[]) => CaseResult[] = (caseDataList: CaseData[]): CaseResult[] => {
  const results: CaseResult[] = caseDataList.map((caseData: CaseData): CaseResult => calculateSingleResult(caseData));

  for (let caseIndex: number = 0; caseIndex < 4; caseIndex += 1) {
    const currentIndex: number = caseIndex * 2;
    const rentalIndex: number = currentIndex + 1;
    const currentResult: CaseResult | undefined = results[currentIndex];
    const rentalResult: CaseResult | undefined = results[rentalIndex];

    if (!currentResult || !rentalResult) continue;

    const deltaIncome: number = rentalResult.totalIncome - currentResult.totalIncome;
    const taxIncrease: number = rentalResult.finalTax - currentResult.finalTax;
    const quasiTaxIncrease: number = rentalResult.finalTaxWithQuasiTax - currentResult.finalTaxWithQuasiTax;
    const taxIncreaseRate: string = deltaIncome === 0 ? '0%' : `${((taxIncrease / deltaIncome) * 100).toFixed(1)}%`;
    const quasiTaxIncreaseRate: string =
      deltaIncome === 0 ? '0%' : `${((quasiTaxIncrease / deltaIncome) * 100).toFixed(1)}%`;
    const afterTaxReceipt: number = Math.round(Math.max(deltaIncome, 0) - quasiTaxIncrease);

    results[rentalIndex] = {
      ...rentalResult,
      taxIncrease,
      taxIncreaseRate,
      quasiTaxIncrease,
      quasiTaxIncreaseRate,
      afterTaxReceipt,
    };
  }

  return results;
};

const rowClassName: (variant: ResultRow['variant']) => string = (variant: ResultRow['variant']): string => {
  if (variant === 'primary') return 'bg-[#203578] text-white font-black';
  if (variant === 'success') return 'bg-[#F0F8F1] text-[#1A1F27] font-bold';
  if (variant === 'total') return 'bg-[#2E7D32] text-white font-black text-base md:text-lg';
  if (variant === 'warning') return 'bg-[#FFF9DB] text-[#E67700] font-black';
  if (variant === 'sub') return 'text-[#8B95A1] bg-white';
  return 'bg-white text-[#4E5968]';
};

export default function BusinessRentalIncomeTaxCalculator({
  className = '',
}: BusinessRentalIncomeTaxCalculatorProps) {
  const [cases, setCases] = useState<CaseData[]>(INITIAL_DATA);
  const [activeCase, setActiveCase] = useState<number>(0);
  const [results, setResults] = useState<CaseResult[]>(() => calculateAllResults(INITIAL_DATA));

  useEffect((): (() => void) => {
    document.documentElement.dataset.latestTaxCalculator = CASE_LABELS[activeCase];
    return (): void => {
      delete document.documentElement.dataset.latestTaxCalculator;
    };
  }, [activeCase]);

  const handleInputChange: (index: number, field: keyof CaseData, value: string) => void = (
    index: number,
    field: keyof CaseData,
    value: string
  ): void => {
    const formattedValue: string = formatInputValue(value);
    const nextCases: CaseData[] = [...cases];
    nextCases[index] = { ...nextCases[index], [field]: formattedValue };
    const nextResults: CaseResult[] = calculateAllResults(nextCases);
    setCases(nextCases);
    setResults(nextResults);
  };

  const currentIndices: number[] = [activeCase * 2, activeCase * 2 + 1];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-[#8B95A1]">개인 대표 사업소득 + 임대소득 세금 비교</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-black text-[#1A1F27]">
                소득구성에 따른 세금 및 준조세 비교
              </h2>
            </div>
            <div className="grid gap-2 text-sm text-[#4E5968] leading-relaxed">
              <p className="flex gap-2">
                <span className="font-bold text-[#203578] shrink-0">1.</span>
                <span>사업소득, 배당소득, 금융소득, 임대소득, 근로소득을 CASE별로 입력합니다.</span>
              </p>
              <p className="flex gap-2">
                <span className="font-bold text-[#203578] shrink-0">2.</span>
                <span>원본 JS의 종합과세, 분리과세, 세액공제, 지방소득세 포함 결정세액 공식을 그대로 적용합니다.</span>
              </p>
              <p className="flex gap-2">
                <span className="font-bold text-[#203578] shrink-0">3.</span>
                <span>건강보험료, 노인요양, 국민연금까지 포함한 준조세 부담과 증가분을 함께 계산합니다.</span>
              </p>
            </div>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
              단위: 원. 임대소득 추가 열은 같은 CASE의 현재상황 열과 비교한 증가분을 표시합니다.
            </p>
          </div>
        </div>

        <div className="flex mx-4 mb-8 mt-8 overflow-x-auto rounded-2xl bg-gray-100 p-1 scrollbar-hide md:mx-auto md:max-w-md">
          {CASE_LABELS.map((label: string, index: number) => (
            <button
              key={label}
              onClick={(): void => setActiveCase(index)}
              className={`min-w-[84px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeCase === index ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full" />
              <h3 className="text-lg md:text-xl font-black text-[#203578]">소득 정보 입력</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">
                CASE별 현재상황과 임대소득 추가 시나리오를 입력하세요.
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 w-[140px] md:w-[30%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">
                      구분
                    </th>
                    <th className="p-4 text-center text-[11px] font-bold">현재상황</th>
                    <th className="p-4 text-center text-[11px] font-bold bg-white/10">임대소득 추가</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {INPUT_ROWS.map((row: InputRow) => (
                    <tr key={row.field} className="hover:bg-blue-50/20 transition-colors">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">
                        {row.label}
                      </th>
                      {currentIndices.map((index: number) => (
                        <td key={index} className={`p-0 ${index % 2 === 1 ? 'bg-blue-50/30' : ''}`}>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                            value={cases[index][row.field]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                              handleInputChange(index, row.field, event.target.value)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2E7D32] rounded-full" />
              <h3 className="text-lg md:text-xl font-black text-[#2E7D32]">확인란 / 소득구성에 따른 조세효과</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                    <th className="p-3 md:p-4 w-[140px] md:w-[30%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">
                      분석 결과
                    </th>
                    <th className="p-4 text-center text-[11px] font-bold">현재상황</th>
                    <th className="p-4 text-center text-[11px] font-bold bg-white/10">임대소득 추가</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {RESULT_ROWS.map((row: ResultRow) => (
                    <tr key={`${row.label}-${row.field}`} className={`${rowClassName(row.variant)} hover:bg-[#F2F4F6] transition-colors`}>
                      <td
                        className={`p-3 md:p-4 border-r border-[#E5E8EB] sticky left-0 z-10 ${
                          row.variant === 'primary'
                            ? 'bg-[#203578]'
                            : row.variant === 'total'
                              ? 'bg-[#2E7D32]'
                              : row.variant === 'warning'
                                ? 'bg-[#FFF9DB]'
                                : row.variant === 'success'
                                  ? 'bg-[#F0F8F1]'
                                  : 'bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {row.variant === 'sub' ? <CornerDownRight className="w-3 h-3 text-[#8B95A1]" /> : null}
                          <span>{row.label}</span>
                        </span>
                      </td>
                      {currentIndices.map((index: number) => {
                        const result: CaseResult | undefined = results[index];
                        const value: CaseResult[keyof CaseResult] | null = result ? result[row.field] : null;
                        return (
                          <td key={index} className="p-3 md:p-4 text-right whitespace-nowrap font-bold">
                            {result ? formatResultValue(value, row.format) : '--'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="p-8 bg-[#f8f9fa] border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h4 className="text-xl font-black text-[#203578]">분석 보고서 활용</h4>
              <p className="text-sm text-[#8B95A1] mt-1">계산 결과를 검토한 뒤 필요한 보고서 기능과 연결할 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'PDF 다운로드', Icon: FileDown, color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'PDF 보기', Icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '인쇄', Icon: Printer, color: 'text-[#4E5968]', bg: 'bg-white' },
              ].map(({ label, Icon, color, bg }: { label: string; Icon: typeof FileDown; color: string; bg: string }) => (
                <button
                  key={label}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group"
                  type="button"
                >
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">{label}</span>
                </button>
              ))}

              <button
                className="flex flex-col items-center justify-center gap-3 p-6 bg-[#203578] rounded-2xl border border-[#203578] shadow-lg hover:bg-[#1a2b61] transition-all group text-white"
                type="button"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-center">AI 종합분석보고서</span>
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#203578] flex items-center justify-center text-white font-black text-xs">
                  이화
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#1A1F27]">세무법인 이화 (TAXSACOM)</p>
                  <p className="text-[11px] text-[#8B95A1]">개인 대표 소득구성 세금 비교 계산기</p>
                </div>
              </div>
              <div className="flex gap-6 text-[12px] text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>02-6959-0621</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>평일 10:00 ~ 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
