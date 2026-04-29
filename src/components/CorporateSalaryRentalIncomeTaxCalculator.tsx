'use client';

import React, { useEffect, useState } from 'react';
import { Clock, CornerDownRight, Eye, FileDown, Phone, Printer, Sparkles } from 'lucide-react';

interface CorporateSalaryRentalIncomeTaxCalculatorProps {
  className?: string;
}

interface CaseData {
  laborIncome: string;
  businessIncome: string;
  rentalIncome: string;
  dividendIncome: string;
  otherFinancialIncome: string;
  ipTransferIncome: string;
}

interface IncomeData {
  employmentIncome: number;
  businessIncome: number;
  rentalIncome: number;
  dividendIncome: number;
  financialIncome: number;
  ipTransferIncome: number;
}

interface TaxRateRow {
  min: number;
  deduction: number;
  rate: number;
}

interface SalaryDeductionRow {
  base: number;
  rate: number;
  deduction: number;
}

interface TaxScenario {
  totalIncome: number;
  withholdingDividend: number;
  grossUpDividend: number;
  totalFinancialIncome: number;
  withholdingFinancialIncome: number;
  incomeDeduction: number;
  taxableFinancialIncome: number;
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

interface CaseResult {
  laborIncome: number;
  businessIncome: number;
  rentalIncome: number;
  dividendIncome: number;
  otherFinancialIncome: number;
  ipTransferIncome: number;
  ipTransferExpense: number;
  otherIncomeAfterExpense: number;
  salaryTaxBase: number;
  salaryTaxBaseAfterDeduction: number;
  withholdingDividend: number;
  grossUpDividend: number;
  totalFinancialIncome: number;
  withholdingFinancialIncome: number;
  taxableFinancialIncome: number;
  healthInsuranceAssessmentIncome: number;
  totalIncome: number;
  incomeDeduction: number;
  comprehensiveTaxBaseA: number;
  comprehensiveTaxBaseB: number;
  comprehensiveTax: number;
  separatedTax: number;
  totalCalculatedTax: number;
  dividendTaxCredit: number;
  standardTaxCredit: number;
  localIncomeTax: number;
  burdenRate: string;
  taxIncrease: number | null;
  taxIncreaseRate: string | null;
  healthInsurance: number;
  nonSalaryHealthInsurance: number;
  elderlyCare: number;
  nationalPension: number;
  quasiTaxTotal: number;
  finalTaxWithQuasiTax: number;
  burdenRateWithQuasiTax: string;
  quasiTaxIncrease: number | null;
  quasiTaxIncreaseRate: string | null;
  adjustedHealthInsurance: number;
  corporatePension: number;
  corporateSalary: number;
  corporateCostTotal: number;
  corporateTaxReduction: number;
  outsideOutflowAmount: number;
  outsideOutflowRate: string;
  outsideOutflowIncrease: number | null;
  outsideOutflowIncreaseRate: string | null;
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
  { laborIncome: '150,000,000', businessIncome: '0', rentalIncome: '60,000,000', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '150,000,000', businessIncome: '0', rentalIncome: '50,000,000', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '150,000,000', businessIncome: '0', rentalIncome: '0', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '150,000,000', businessIncome: '0', rentalIncome: '50,000,000', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '200,000,000', businessIncome: '0', rentalIncome: '0', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '200,000,000', businessIncome: '0', rentalIncome: '50,000,000', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '250,000,000', businessIncome: '0', rentalIncome: '0', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
  { laborIncome: '250,000,000', businessIncome: '0', rentalIncome: '50,000,000', dividendIncome: '0', otherFinancialIncome: '0', ipTransferIncome: '0' },
];

const INPUT_ROWS: InputRow[] = [
  { label: '근로소득(연급여)', field: 'laborIncome' },
  { label: '사업소득', field: 'businessIncome' },
  { label: '임대소득', field: 'rentalIncome' },
  { label: '배당소득', field: 'dividendIncome' },
  { label: '배당소득 외 금융소득', field: 'otherFinancialIncome' },
  { label: '산업재산권 양도소득', field: 'ipTransferIncome' },
];

const TAX_RATE_TABLE: TaxRateRow[] = [
  { min: 0, deduction: 0, rate: 0.06 },
  { min: 14_000_000, deduction: 1_260_000, rate: 0.15 },
  { min: 50_000_000, deduction: 5_760_000, rate: 0.24 },
  { min: 88_000_000, deduction: 15_440_000, rate: 0.35 },
  { min: 150_000_000, deduction: 19_940_000, rate: 0.38 },
  { min: 300_000_000, deduction: 25_940_000, rate: 0.4 },
  { min: 500_000_000, deduction: 35_940_000, rate: 0.42 },
  { min: 1_000_000_000, deduction: 65_940_000, rate: 0.45 },
];

const SALARY_DEDUCTION_TABLE: SalaryDeductionRow[] = [
  { base: 0, rate: 0.7, deduction: 0 },
  { base: 5_000_000, rate: 0.4, deduction: 3_500_000 },
  { base: 15_000_000, rate: 0.15, deduction: 7_500_000 },
  { base: 45_000_000, rate: 0.05, deduction: 12_000_000 },
  { base: 100_000_000, rate: 0.02, deduction: 14_750_000 },
];

const RESULT_ROWS: ResultRow[] = [
  { label: '근로소득', field: 'laborIncome', variant: 'success', format: 'money' },
  { label: '급여소득과세표준', field: 'salaryTaxBase', variant: 'sub', format: 'money' },
  { label: '소득공제 후 급여과세표준', field: 'salaryTaxBaseAfterDeduction', variant: 'sub', format: 'money' },
  { label: '사업소득', field: 'businessIncome', variant: 'success', format: 'money' },
  { label: '임대소득', field: 'rentalIncome', variant: 'success', format: 'money' },
  { label: '배당소득', field: 'dividendIncome', variant: 'success', format: 'money' },
  { label: '원천징수배당', field: 'withholdingDividend', variant: 'sub', format: 'money' },
  { label: '그로스업배당(10% 가산)', field: 'grossUpDividend', variant: 'sub', format: 'money' },
  { label: '배당소득 외 금융소득', field: 'otherFinancialIncome', variant: 'success', format: 'money' },
  { label: '금융소득계', field: 'totalFinancialIncome', variant: 'sub', format: 'money' },
  { label: '종합과세금융소득', field: 'taxableFinancialIncome', variant: 'sub', format: 'money' },
  { label: '산업재산권 양도소득', field: 'ipTransferIncome', variant: 'success', format: 'money' },
  { label: '필요경비2', field: 'ipTransferExpense', variant: 'sub', format: 'money' },
  { label: '필요경비공제후 기타소득', field: 'otherIncomeAfterExpense', variant: 'sub', format: 'money' },
  { label: '근로외 건보료부과소득', field: 'healthInsuranceAssessmentIncome', variant: 'success', format: 'money' },
  { label: '총 소득', field: 'totalIncome', variant: 'total', format: 'money' },
  { label: '종합소득공제', field: 'incomeDeduction', variant: 'success', format: 'money' },
  { label: '종합소득 종합과세표준 A', field: 'comprehensiveTaxBaseA', variant: 'normal', format: 'money' },
  { label: '종합소득 분리과세표준 B', field: 'comprehensiveTaxBaseB', variant: 'normal', format: 'money' },
  { label: '종합과세시', field: 'comprehensiveTax', variant: 'normal', format: 'money' },
  { label: '분리과세시', field: 'separatedTax', variant: 'normal', format: 'money' },
  { label: '총산출세액', field: 'totalCalculatedTax', variant: 'success', format: 'money' },
  { label: '결정세액(지방소득세)', field: 'localIncomeTax', variant: 'primary', format: 'money' },
  { label: '세부담률', field: 'burdenRate', variant: 'normal', format: 'rate' },
  { label: '현재대비 세금 증가분', field: 'taxIncrease', variant: 'warning', format: 'money' },
  { label: '△세금 / △소득', field: 'taxIncreaseRate', variant: 'normal', format: 'rate' },
  { label: '건강보험료', field: 'healthInsurance', variant: 'normal', format: 'money' },
  { label: '근로외', field: 'nonSalaryHealthInsurance', variant: 'sub', format: 'money' },
  { label: '노인요양', field: 'elderlyCare', variant: 'sub', format: 'money' },
  { label: '국민연금', field: 'nationalPension', variant: 'sub', format: 'money' },
  { label: '준조세(계)', field: 'quasiTaxTotal', variant: 'success', format: 'money' },
  { label: '세금 계', field: 'finalTaxWithQuasiTax', variant: 'success', format: 'money' },
  { label: '세부담률', field: 'burdenRateWithQuasiTax', variant: 'success', format: 'rate' },
  { label: '현재대비 준조세포함 증가분', field: 'quasiTaxIncrease', variant: 'warning', format: 'money' },
  { label: '준조세포함 / 소득', field: 'quasiTaxIncreaseRate', variant: 'normal', format: 'rate' },
  { label: '법인계', field: 'corporateCostTotal', variant: 'success', format: 'money' },
  { label: '법인세감소액', field: 'corporateTaxReduction', variant: 'sub', format: 'money' },
  { label: '대외유출금액', field: 'outsideOutflowAmount', variant: 'warning', format: 'money' },
  { label: '대외유출비율', field: 'outsideOutflowRate', variant: 'normal', format: 'rate' },
  { label: '현재대비 대외유출 증가분', field: 'outsideOutflowIncrease', variant: 'warning', format: 'money' },
  { label: '△대외유출/△소득', field: 'outsideOutflowIncreaseRate', variant: 'normal', format: 'rate' },
  { label: '세후수령액', field: 'afterTaxReceipt', variant: 'primary', format: 'money' },
];

const CASE_LABELS: string[] = ['CASE I', 'CASE II', 'CASE III', 'CASE IV'];
const HEALTH_INSURANCE_CAP: number = 50_888_520;
const HEALTH_INSURANCE_RATE: number = 0.0709;
const CARE_RATE: number = 0.1295;
const NATIONAL_PENSION_CAP: number = 74_040_000;
const NATIONAL_PENSION_RATE: number = 0.09;
const FINANCIAL_THRESHOLD: number = 20_000_000;
const INCOME_DEDUCTION_AMOUNT: number = 1_500_000;
const STANDARD_TAX_CREDIT_IF_EMPLOYED: number = 630_000;
const STANDARD_TAX_CREDIT_ELSE: number = 70_000;

const parseCurrency: (value: string) => number = (value: string): number => Number(value.replace(/[^0-9]/g, '')) || 0;
const formatCurrency: (value: number | null) => string = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return '--';
  return Math.round(value).toLocaleString('ko-KR');
};
const formatInputValue: (value: string) => string = (value: string): string => {
  const numericValue: string = value.replace(/[^0-9]/g, '');
  return numericValue ? Number(numericValue).toLocaleString('ko-KR') : '';
};
const formatResultValue: (value: CaseResult[keyof CaseResult], format: ResultRow['format']) => string = (
  value: CaseResult[keyof CaseResult],
  format: ResultRow['format']
): string => {
  if (value === null) return '--';
  if (format === 'rate') return typeof value === 'string' ? value : '--';
  return typeof value === 'number' ? formatCurrency(value) : '--';
};

const calculateBurdenRate: (tax: number, income: number) => string = (tax: number, income: number): string => {
  if (!income || Number.isNaN(income)) return '0%';
  return `${((tax / income) * 100).toFixed(1)}%`;
};

const calculateSalaryTaxBase: (employmentIncome: number) => number = (employmentIncome: number): number => {
  let selected: SalaryDeductionRow = SALARY_DEDUCTION_TABLE[0];
  for (const row of SALARY_DEDUCTION_TABLE) {
    if (employmentIncome >= row.base) selected = row;
  }
  const earnedDeduction: number = (employmentIncome - selected.base) * selected.rate + selected.deduction;
  return Math.max(employmentIncome - Math.min(earnedDeduction, 20_000_000), 0);
};

const calculateComprehensiveTax: (baseTaxableIncome: number, separatedFinancialIncome: number) => number = (
  baseTaxableIncome: number,
  separatedFinancialIncome: number
): number => {
  let selected: TaxRateRow = TAX_RATE_TABLE[0];
  for (const row of TAX_RATE_TABLE) {
    if (baseTaxableIncome >= row.min) selected = row;
  }
  return baseTaxableIncome * selected.rate - selected.deduction + separatedFinancialIncome * 0.14;
};

const calculateSeparatedTax: (comprehensiveTaxBaseB: number, financialIncomeTotal: number) => number = (
  comprehensiveTaxBaseB: number,
  financialIncomeTotal: number
): number => {
  let selected: TaxRateRow = TAX_RATE_TABLE[0];
  for (const row of TAX_RATE_TABLE) {
    if (comprehensiveTaxBaseB >= row.min) selected = row;
  }
  return Math.round(comprehensiveTaxBaseB * selected.rate - selected.deduction + financialIncomeTotal * 0.14);
};

const calculateHealthInsuranceForSalary: (employmentIncome: number) => number = (employmentIncome: number): number => {
  if (employmentIncome === 0) return 0;
  return Math.min(HEALTH_INSURANCE_CAP, (employmentIncome * HEALTH_INSURANCE_RATE) / 2);
};

const calculateHealthInsuranceForNonSalary: (employmentIncome: number, otherTaxableIncome: number) => number = (
  employmentIncome: number,
  otherTaxableIncome: number
): number => {
  const insurance: number =
    employmentIncome === 0
      ? otherTaxableIncome * HEALTH_INSURANCE_RATE
      : otherTaxableIncome >= FINANCIAL_THRESHOLD
        ? (otherTaxableIncome - FINANCIAL_THRESHOLD) * HEALTH_INSURANCE_RATE
        : 0;
  return Math.min(insurance, HEALTH_INSURANCE_CAP);
};

const calculateNationalPension: (employmentIncome: number) => number = (employmentIncome: number): number => {
  if (employmentIncome === 0) return 0;
  return Math.min(NATIONAL_PENSION_CAP, employmentIncome) * (NATIONAL_PENSION_RATE / 2);
};

const calculateTaxScenario: (incomeData: IncomeData) => TaxScenario = (incomeData: IncomeData): TaxScenario => {
  const withholdingDividend: number =
    incomeData.dividendIncome === 0 ? 0 : Math.max(FINANCIAL_THRESHOLD - incomeData.financialIncome, 0);
  const grossUpDividend: number = Math.max((incomeData.dividendIncome - withholdingDividend) * 0.11, 0);
  const totalFinancialIncome: number = incomeData.dividendIncome + incomeData.financialIncome;
  const taxableFinancialIncome: number = Math.max(totalFinancialIncome - FINANCIAL_THRESHOLD, 0);
  const withholdingFinancialIncome: number =
    totalFinancialIncome > FINANCIAL_THRESHOLD ? FINANCIAL_THRESHOLD : totalFinancialIncome;
  const totalIncome: number =
    incomeData.employmentIncome + totalFinancialIncome + incomeData.rentalIncome + incomeData.businessIncome;
  const incomeDeduction: number = totalIncome === 0 ? 0 : INCOME_DEDUCTION_AMOUNT;
  const calculatedTax: number = Math.round(
    calculateComprehensiveTax(
      incomeData.businessIncome + incomeData.rentalIncome + incomeData.employmentIncome + taxableFinancialIncome,
      withholdingFinancialIncome
    )
  );

  return {
    totalIncome,
    withholdingDividend,
    grossUpDividend,
    totalFinancialIncome,
    withholdingFinancialIncome,
    incomeDeduction,
    taxableFinancialIncome,
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

const calculateSingleResult: (caseData: CaseData) => CaseResult = (caseData: CaseData): CaseResult => {
  const incomeData: IncomeData = {
    employmentIncome: parseCurrency(caseData.laborIncome),
    businessIncome: parseCurrency(caseData.businessIncome),
    rentalIncome: parseCurrency(caseData.rentalIncome),
    dividendIncome: parseCurrency(caseData.dividendIncome),
    financialIncome: parseCurrency(caseData.otherFinancialIncome),
    ipTransferIncome: parseCurrency(caseData.ipTransferIncome),
  };
  const scenario: TaxScenario = calculateTaxScenario(incomeData);
  const salaryTaxBase: number = calculateSalaryTaxBase(incomeData.employmentIncome);
  const healthInsurance: number = calculateHealthInsuranceForSalary(incomeData.employmentIncome);
  const nationalPension: number = calculateNationalPension(incomeData.employmentIncome);
  const ipTransferExpense: number = incomeData.ipTransferIncome * 0.6;
  const ipTransferExpenseForTax: number = incomeData.ipTransferIncome * 0.7;
  const otherIncomeAfterExpense: number = incomeData.rentalIncome + incomeData.ipTransferIncome - ipTransferExpenseForTax;
  const baseSum: number = scenario.totalFinancialIncome + otherIncomeAfterExpense + scenario.grossUpDividend;
  const healthInsuranceAssessmentIncome: number =
    baseSum <= FINANCIAL_THRESHOLD ? incomeData.businessIncome : baseSum + incomeData.businessIncome;
  const nonSalaryHealthInsurance: number = calculateHealthInsuranceForNonSalary(
    incomeData.employmentIncome,
    healthInsuranceAssessmentIncome
  );
  const elderlyCare: number = Math.round((healthInsurance + nonSalaryHealthInsurance) * CARE_RATE);
  const quasiTaxTotal: number = healthInsurance + nonSalaryHealthInsurance + elderlyCare + nationalPension;

  const totalIncomeA: number =
    incomeData.employmentIncome > 0
      ? salaryTaxBase +
        incomeData.dividendIncome +
        incomeData.financialIncome +
        incomeData.ipTransferIncome +
        scenario.taxableFinancialIncome +
        incomeData.rentalIncome
      : incomeData.dividendIncome +
        incomeData.financialIncome +
        incomeData.ipTransferIncome +
        scenario.taxableFinancialIncome +
        incomeData.rentalIncome;
  const totalDeductions: number =
    scenario.incomeDeduction + healthInsurance + nonSalaryHealthInsurance + elderlyCare + nationalPension;
  const comprehensiveTaxBaseA: number =
    incomeData.employmentIncome > 0
      ? Math.max(totalIncomeA - totalDeductions, 0)
      : Math.max(totalIncomeA - scenario.incomeDeduction, 0);

  const totalIncomeB: number =
    salaryTaxBase + incomeData.dividendIncome + incomeData.financialIncome + incomeData.rentalIncome;
  const comprehensiveTaxBaseB: number =
    incomeData.employmentIncome > 0
      ? Math.max(totalIncomeB - totalDeductions, 0)
      : Math.max(totalIncomeB - scenario.incomeDeduction, 0);

  const separatedTax: number = Math.floor(calculateSeparatedTax(comprehensiveTaxBaseB, 0));
  const comprehensiveTax: number = Math.floor(calculateComprehensiveTax(comprehensiveTaxBaseA, 0));
  const totalCalculatedTax: number = Math.max(comprehensiveTax, separatedTax);
  const dividendTaxCredit: number = Math.min(scenario.grossUpDividend, totalCalculatedTax - separatedTax);
  const standardTaxCredit: number = calculateStandardTaxCredit({
    totalIncome: scenario.totalIncome,
    employmentIncome: incomeData.employmentIncome,
    rentalIncome: incomeData.rentalIncome,
    totalFinancialIncome: scenario.totalFinancialIncome,
    calculatedTax: scenario.calculatedTax,
    separatedTax,
  });
  const localIncomeTax: number = Math.round(Math.max(totalCalculatedTax - dividendTaxCredit - standardTaxCredit, 0) * 1.1);
  const salaryTaxBaseAfterDeduction: number = Math.round(
    Math.max(salaryTaxBase - scenario.incomeDeduction - (healthInsurance * (1 + CARE_RATE) + nationalPension), 0)
  );
  const finalTaxWithQuasiTax: number = localIncomeTax + quasiTaxTotal;
  const adjustedHealthInsurance: number = Math.round(healthInsurance * (1 + CARE_RATE));
  const corporatePension: number = nationalPension;
  const corporateSalary: number = incomeData.employmentIncome;
  const corporateCostTotal: number = adjustedHealthInsurance + corporatePension + corporateSalary;
  const corporateTaxReduction: number = Math.round(-corporateCostTotal * 0.22);
  const outsideOutflowAmount: number =
    finalTaxWithQuasiTax + corporateTaxReduction + adjustedHealthInsurance + corporatePension;

  return {
    laborIncome: incomeData.employmentIncome,
    businessIncome: incomeData.businessIncome,
    rentalIncome: incomeData.rentalIncome,
    dividendIncome: incomeData.dividendIncome,
    otherFinancialIncome: incomeData.financialIncome,
    ipTransferIncome: incomeData.ipTransferIncome,
    ipTransferExpense,
    otherIncomeAfterExpense,
    salaryTaxBase,
    salaryTaxBaseAfterDeduction,
    withholdingDividend: scenario.withholdingDividend,
    grossUpDividend: scenario.grossUpDividend,
    totalFinancialIncome: scenario.totalFinancialIncome,
    withholdingFinancialIncome: scenario.withholdingFinancialIncome,
    taxableFinancialIncome: scenario.taxableFinancialIncome,
    healthInsuranceAssessmentIncome,
    totalIncome: scenario.totalIncome,
    incomeDeduction: scenario.incomeDeduction,
    comprehensiveTaxBaseA,
    comprehensiveTaxBaseB,
    comprehensiveTax,
    separatedTax,
    totalCalculatedTax,
    dividendTaxCredit,
    standardTaxCredit,
    localIncomeTax,
    burdenRate: calculateBurdenRate(localIncomeTax, scenario.totalIncome),
    taxIncrease: null,
    taxIncreaseRate: null,
    healthInsurance,
    nonSalaryHealthInsurance,
    elderlyCare,
    nationalPension,
    quasiTaxTotal,
    finalTaxWithQuasiTax,
    burdenRateWithQuasiTax: calculateBurdenRate(finalTaxWithQuasiTax, scenario.totalIncome),
    quasiTaxIncrease: null,
    quasiTaxIncreaseRate: null,
    adjustedHealthInsurance,
    corporatePension,
    corporateSalary,
    corporateCostTotal,
    corporateTaxReduction,
    outsideOutflowAmount,
    outsideOutflowRate: calculateBurdenRate(outsideOutflowAmount, scenario.totalIncome),
    outsideOutflowIncrease: null,
    outsideOutflowIncreaseRate: null,
    afterTaxReceipt: null,
  };
};

const calculateAllResults: (caseDataList: CaseData[]) => CaseResult[] = (caseDataList: CaseData[]): CaseResult[] => {
  const results: CaseResult[] = caseDataList.map((caseData: CaseData): CaseResult => calculateSingleResult(caseData));
  for (let caseIndex: number = 0; caseIndex < 4; caseIndex += 1) {
    const currentIndex: number = caseIndex * 2;
    const rentalIndex: number = currentIndex + 1;
    const currentResult: CaseResult = results[currentIndex];
    const rentalResult: CaseResult = results[rentalIndex];
    const deltaIncome: number = Math.max(rentalResult.totalIncome - currentResult.totalIncome, 0);
    const taxIncrease: number = rentalResult.localIncomeTax - currentResult.localIncomeTax;
    const quasiTaxIncrease: number = rentalResult.finalTaxWithQuasiTax - currentResult.finalTaxWithQuasiTax;
    const outsideOutflowIncrease: number = rentalResult.outsideOutflowAmount - currentResult.outsideOutflowAmount;
    results[rentalIndex] = {
      ...rentalResult,
      taxIncrease,
      taxIncreaseRate: deltaIncome === 0 ? '0%' : `${((taxIncrease / deltaIncome) * 100).toFixed(1)}%`,
      quasiTaxIncrease,
      quasiTaxIncreaseRate: deltaIncome === 0 ? '0%' : `${((quasiTaxIncrease / deltaIncome) * 100).toFixed(1)}%`,
      outsideOutflowIncrease,
      outsideOutflowIncreaseRate:
        deltaIncome === 0 ? '0%' : `${((outsideOutflowIncrease / deltaIncome) * 100).toFixed(1)}%`,
      afterTaxReceipt: Math.round(deltaIncome - quasiTaxIncrease),
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

export default function CorporateSalaryRentalIncomeTaxCalculator({
  className = '',
}: CorporateSalaryRentalIncomeTaxCalculatorProps) {
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
    const nextCases: CaseData[] = [...cases];
    nextCases[index] = { ...nextCases[index], [field]: formatInputValue(value) };
    setCases(nextCases);
    setResults(calculateAllResults(nextCases));
  };

  const currentIndices: number[] = [activeCase * 2, activeCase * 2 + 1];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="space-y-3">
              <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">1.</span>
                  <span>법인 대표의 근로소득과 임대소득 조합을 CASE별로 비교합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">2.</span>
                  <span>건강보험료, 노인요양, 국민연금, 법인 비용과 대외유출까지 함께 계산합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">3.</span>
                  <span>원본 JS의 세율표, 급여공제, 종합/분리과세 비교 공식을 React 상태로 이식했습니다.</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                단위: 원. 임대소득 추가 열은 같은 CASE의 현재상황 열과 비교한 증가분을 표시합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl md:max-w-md mx-auto mt-8">
          {CASE_LABELS.map((label: string, index: number) => (
            <button
              key={label}
              onClick={(): void => setActiveCase(index)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeCase === index ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full" />
              <h3 className="text-lg md:text-xl font-black text-[#203578]">소득 정보 입력</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">
                현재상황과 임대소득 추가 시나리오를 입력하세요.
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 w-[140px] md:w-[30%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">
                      분석 항목
                    </th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10">
                      현재상황 (A)
                    </th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold bg-blue-500/30">
                      임대소득 추가 (B)
                    </th>
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
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full" />
              <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">확인란 / 소득구성에 따른 조세효과</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                    <th className="p-3 md:p-4 w-[140px] md:w-[30%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">
                      분석 결과 상세
                    </th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10">
                      현재상황 (A)
                    </th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold bg-green-500/20">
                      임대소득 추가 (B)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {RESULT_ROWS.map((row: ResultRow) => (
                    <tr key={`${row.label}-${row.field}`} className={`${rowClassName(row.variant)} hover:bg-[#F2F4F6] transition-colors`}>
                      <td
                        className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 ${
                          row.variant === 'primary'
                            ? 'bg-[#203578]'
                            : row.variant === 'total'
                              ? 'bg-[#2E7D32]'
                              : row.variant === 'warning'
                                ? 'bg-[#fff9db]'
                                : row.variant === 'success'
                                  ? 'bg-[#F0F8F1]'
                                  : 'bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {row.variant === 'sub' ? <CornerDownRight className="w-3 h-3 text-gray-300" /> : null}
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
              <p className="text-sm text-gray-500 mt-1">계산 결과를 검토한 뒤 필요한 보고서 기능과 연결할 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'PDF 다운로드', Icon: FileDown, color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'PDF 보기', Icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: '인쇄', Icon: Printer, color: 'text-gray-600', bg: 'bg-gray-50' },
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
                  <p className="text-sm font-bold text-[#1a1f27]">세무법인 이화 (TAXSACOM)</p>
                  <p className="text-[11px] text-gray-400">법인 대표 근로소득·임대소득 세금 비교 계산기</p>
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
