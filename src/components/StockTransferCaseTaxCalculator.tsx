'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, Coins, ReceiptText, Scale } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface StockTransferCaseTaxCalculatorProps {
  className?: string;
}

interface CalculatorState {
  parValue: string;
  acquisitionPrice: string;
  currentPrice: string;
  stockCount: string;
  customPrice: string;
}

interface CaseResult {
  caseNo: number;
  title: string;
  relationType: string;
  taxLawType: string;
  tradePrice: number;
  tradeAmount: number;
  giftProfit: number;
  giftTax: number;
  giftReportCredit: number;
  giftFinalTax: number;
  capitalGain: number;
  transferTaxBase: number;
  transferTaxWithLocal: number;
  securitiesTax: number;
  transferTaxSum: number;
  totalTaxSum: number;
  paymentAmount: number;
}

interface CalculationResult {
  cases: CaseResult[];
  marketValue: number;
  calcPrice: number;
  stockCount: number;
  totalTax: number;
  bestCase: CaseResult;
}

const INITIAL_STATE: CalculatorState = {
  parValue: '10,000',
  acquisitionPrice: '10,000',
  currentPrice: '41,000',
  stockCount: '10,000',
  customPrice: '12,000',
};

const CASE_DEFINITIONS = [
  { caseNo: 1, title: '시가 양수도', group: 'market', relationType: '-', taxLawType: '-' },
  { caseNo: 2, title: '시가 70% / 특수 / 소득세법', group: 'seventy', relationType: '특수', taxLawType: '소득세법' },
  { caseNo: 3, title: '시가 70% / 비특수 / 상증세법', group: 'seventy', relationType: '비특수', taxLawType: '상증세법' },
  { caseNo: 4, title: '시가 70% / 비특수 / 비특수', group: 'seventy', relationType: '비특수', taxLawType: '비특수' },
  { caseNo: 5, title: '액면가 / 특수 / 소득세법', group: 'par', relationType: '특수', taxLawType: '소득세법' },
  { caseNo: 6, title: '액면가 / 특수 / 상증세법', group: 'par', relationType: '특수', taxLawType: '상증세법' },
  { caseNo: 7, title: '액면가 / 비특수', group: 'par', relationType: '비특수', taxLawType: '비특수' },
  { caseNo: 8, title: '임의가격 / 특수 / 소득세법', group: 'custom', relationType: '특수', taxLawType: '소득세법' },
  { caseNo: 9, title: '임의가격 / 특수 / 상증세법', group: 'custom', relationType: '특수', taxLawType: '상증세법' },
  { caseNo: 10, title: '임의가격 / 비특수', group: 'custom', relationType: '비특수', taxLawType: '비특수' },
] as const;

const parseNumber = (value: string): number => Number(String(value).replace(/[^\d.-]/g, '')) || 0;

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.round(value).toLocaleString('ko-KR');
};

const formatOptionalNumber = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '-';
  return Math.round(value).toLocaleString('ko-KR');
};

const formatMoneyInput = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString('ko-KR');
};

const calculateGiftTax = (amount: number): number => {
  if (amount > 3_000_000_000) return amount * 0.5 - 460_000_000;
  if (amount > 1_000_000_000) return amount * 0.4 - 160_000_000;
  if (amount > 500_000_000) return amount * 0.3 - 60_000_000;
  if (amount > 100_000_000) return amount * 0.2 - 10_000_000;
  return amount * 0.1;
};

const calculateTransferTax = (base: number): number => {
  const nationalTax = base > 300_000_000 ? (base - 300_000_000) * 0.25 + 60_000_000 : base * 0.2;
  return nationalTax * 1.1;
};

const getTradePrice = (caseNo: number, currentPrice: number, parValue: number, customPrice: number): number => {
  if (caseNo === 1) return currentPrice;
  if (caseNo >= 2 && caseNo <= 4) return currentPrice * 0.7;
  if (caseNo >= 5 && caseNo <= 7) return parValue;
  return customPrice;
};

const calculateResult = (state: CalculatorState): CalculationResult => {
  const parValue = parseNumber(state.parValue);
  const acquisitionPrice = parseNumber(state.acquisitionPrice);
  const currentPrice = parseNumber(state.currentPrice);
  const stockCount = parseNumber(state.stockCount);
  const customPrice = parseNumber(state.customPrice);
  const calcPrice = acquisitionPrice !== 0 ? acquisitionPrice : parValue;
  const marketValue = currentPrice * stockCount;

  const interim = CASE_DEFINITIONS.map((definition) => {
    const tradePrice = getTradePrice(definition.caseNo, currentPrice, parValue, customPrice);
    const tradeAmount = stockCount * tradePrice;
    const diff = marketValue - tradeAmount;
    let giftProfit = 0;

    if (definition.caseNo !== 1) {
      const groupOffset = (definition.caseNo - 2) % 3;
      const threshold = Math.min(marketValue * 0.3, 300_000_000);
      if (groupOffset === 0 || groupOffset === 1) {
        giftProfit = diff < threshold ? 0 : diff - threshold;
      } else {
        giftProfit = diff < marketValue * 0.3 ? 0 : Math.max(diff - 300_000_000, 0);
      }
    }

    let capitalGain = 0;
    if ([1, 3, 4, 6, 7, 9, 10].includes(definition.caseNo)) {
      capitalGain = (tradePrice - calcPrice) * stockCount;
    } else if (definition.caseNo === 2 || definition.caseNo === 5) {
      capitalGain = (currentPrice - calcPrice) * stockCount;
    } else if (definition.caseNo === 8) {
      capitalGain = currentPrice < parValue ? currentPrice * stockCount : (customPrice - calcPrice) * stockCount;
    }

    const securitiesTax = tradeAmount * 0.0045;

    return {
      definition,
      tradePrice,
      tradeAmount,
      giftProfit: Math.max(giftProfit, 0),
      capitalGain,
      securitiesTax,
    };
  });

  const case1 = interim[0];

  const cases = interim.map((row): CaseResult => {
    const caseNo = row.definition.caseNo;
    const giftTax = caseNo === 1 ? 0 : calculateGiftTax(row.giftProfit);
    const giftReportCredit = caseNo === 1 ? 0 : -giftTax * 0.03;
    const giftFinalTax = caseNo === 1 ? 0 : giftTax + giftReportCredit;
    const capitalGain = caseNo === 2 ? case1.capitalGain : row.capitalGain;
    const securitiesTax = caseNo === 2 ? case1.securitiesTax : row.securitiesTax;
    const transferTaxBase = Math.max(capitalGain - securitiesTax - 2_500_000, 0);
    const transferBaseForTax = caseNo === 2 ? Math.max(case1.capitalGain - case1.securitiesTax - 2_500_000, 0) : transferTaxBase;
    const transferTaxWithLocal = calculateTransferTax(transferBaseForTax);
    const transferTaxSum = securitiesTax + transferTaxWithLocal;
    const totalTaxSum = giftFinalTax + transferTaxSum;

    return {
      caseNo,
      title: row.definition.title,
      relationType: row.definition.relationType,
      taxLawType: row.definition.taxLawType,
      tradePrice: row.tradePrice,
      tradeAmount: row.tradeAmount,
      giftProfit: row.giftProfit,
      giftTax,
      giftReportCredit,
      giftFinalTax,
      capitalGain,
      transferTaxBase,
      transferTaxWithLocal,
      securitiesTax,
      transferTaxSum,
      totalTaxSum,
      paymentAmount: row.tradeAmount,
    };
  });

  const taxableCases = cases.filter((row) => row.totalTaxSum > 0);
  const bestCase = taxableCases.reduce((best, row) => row.totalTaxSum < best.totalTaxSum ? row : best, taxableCases[0] || cases[0]);

  return {
    cases,
    marketValue,
    calcPrice,
    stockCount,
    totalTax: cases.reduce((sum, row) => sum + row.totalTaxSum, 0),
    bestCase,
  };
};

export default function StockTransferCaseTaxCalculator({ className = '' }: StockTransferCaseTaxCalculatorProps) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [activeCase, setActiveCase] = useState(0);
  const result = useMemo((): CalculationResult => calculateResult(state), [state]);
  const activeResult = result.cases[activeCase];

  const updateState = (field: keyof CalculatorState, value: string): void => {
    setState((prev) => ({ ...prev, [field]: formatMoneyInput(value) }));
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>시가, 시가의 70%, 액면가, 임의가격 양수도 시나리오별 세금을 비교합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>특수관계인 저가양수도에 따른 증여이익, 증여세, 양도소득세, 증권거래세를 함께 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>매수자가 지급할 대금과 총 세금 부담을 케이스별로 빠르게 비교할 수 있습니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">calc805-4.js의 주식양수도 케이스별 계산 흐름을 React 상태 계산으로 이식했습니다. 실제 거래 전에는 특수관계 여부, 시가 산정, 상장/비상장 구분, 대주주 여부를 별도로 검토해야 합니다.</p>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl max-w-5xl mx-4 md:mx-auto mt-8 overflow-x-auto scrollbar-hide">
          {result.cases.map((row, index) => (
            <button
              key={row.caseNo}
              type="button"
              onClick={(): void => setActiveCase(index)}
              className={`min-w-[84px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeCase === index ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              CASE {row.caseNo}
            </button>
          ))}
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<ArrowRightLeft className="w-5 h-5" />} label="선택 케이스" value={activeResult.title} />
          <MetricCard icon={<Coins className="w-5 h-5" />} label="거래금액" value={formatNumber(activeResult.tradeAmount)} color="dark" />
              <MetricCard icon={<ReceiptText className="w-5 h-5" />} label="총세금" value={formatNumber(activeResult.totalTaxSum)} color="green" />
          <MetricCard icon={<Scale className="w-5 h-5" />} label="최저세금 케이스" value={`CASE ${result.bestCase.caseNo}`} color="blue" />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">입력값</h3>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">액면가</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">주당 취득가격</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">현재 주가</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">주식 수</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">임의 매매가</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <tr className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">?낅젰</td>
                    <InputCell value={state.parValue} onChange={(value): void => updateState('parValue', value)} />
                    <InputCell value={state.acquisitionPrice} onChange={(value): void => updateState('acquisitionPrice', value)} />
                    <InputCell value={state.currentPrice} onChange={(value): void => updateState('currentPrice', value)} />
                    <InputCell value={state.stockCount} onChange={(value): void => updateState('stockCount', value)} />
                    <InputCell value={state.customPrice} onChange={(value): void => updateState('customPrice', value)} />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <CaseSummaryTable cases={result.cases} calcPrice={result.calcPrice} stockCount={result.stockCount} />
          <TaxResultTable cases={result.cases} />
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

function InputCell({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <td className="p-0 border-r border-gray-100 bg-blue-50/30">
      <input
        type="text"
        value={value}
        onChange={(event): void => onChange(event.target.value)}
        className="w-full p-3 md:p-4 bg-transparent text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20"
      />
    </td>
  );
}

function CaseSummaryTable({ cases, calcPrice, stockCount }: { cases: CaseResult[]; calcPrice: number; stockCount: number }) {
  const rows: Array<[string, (row: CaseResult) => string, boolean?]> = [
    ['관계', (row) => row.relationType],
    ['적용 구분', (row) => row.taxLawType],
    ['주식 수', () => formatNumber(stockCount)],
    ['취득가', () => formatNumber(calcPrice)],
    ['거래가', (row) => formatNumber(row.tradePrice), true],
    ['매매금액', (row) => formatNumber(row.tradeAmount), true],
  ];

  return (
    <section className="px-4 md:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
          <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">주식 양수도 케이스</h3>
      </div>
      <WideTable cases={cases} rows={rows} />
    </section>
  );
}

function TaxResultTable({ cases }: { cases: CaseResult[] }) {
  const rows: Array<[string, (row: CaseResult) => string, boolean?]> = [
    ['저가양수도 증여이익', (row) => row.caseNo === 1 ? '-' : formatOptionalNumber(row.giftProfit), true],
    ['증여세 산출세액', (row) => row.caseNo === 1 ? '-' : formatNumber(row.giftTax)],
    ['(-) 신고세액공제', (row) => row.caseNo === 1 ? '-' : formatNumber(row.giftReportCredit)],
    ['납부할 증여세(a)', (row) => row.caseNo === 1 ? '-' : formatNumber(row.giftFinalTax), true],
    ['양도차익', (row) => formatNumber(row.capitalGain)],
    ['양도소득세 과세표준', (row) => formatNumber(row.transferTaxBase), true],
    ['양도소득세(지방세 포함)', (row) => formatNumber(row.transferTaxWithLocal)],
    ['증권거래세', (row) => formatNumber(row.securitiesTax)],
    ['양도소득세 소계(b)', (row) => formatNumber(row.transferTaxSum), true],
    ['?멸툑 ?⑷퀎(a+b)', (row) => formatNumber(row.totalTaxSum), true],
    ['매수자가 지급할 대금', (row) => formatNumber(row.paymentAmount), true],
  ];

  return (
    <section className="px-4 md:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
          <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">세금 계산 결과</h3>
      </div>
      <WideTable cases={cases} rows={rows} />
    </section>
  );
}

function WideTable({ cases, rows }: { cases: CaseResult[]; rows: Array<[string, (row: CaseResult) => string, boolean?]> }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
      <table className="w-full border-collapse min-w-[1120px]">
        <thead>
          <tr className="bg-[#1a1f27] text-white">
            <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">구분</th>
            {cases.map((row) => (
              <th key={row.caseNo} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">CASE {row.caseNo}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
          {rows.map(([label, formatter, highlight]) => (
            <tr key={label} className={`${highlight ? 'bg-blue-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
              <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-bold ${highlight ? 'bg-blue-50/50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>{label}</td>
              {cases.map((row) => (
                <td key={`${label}-${row.caseNo}`} className={`p-3 md:p-4 text-right whitespace-nowrap border-r border-gray-100 ${highlight ? 'font-black text-[#203578]' : 'font-bold text-[#4e5968]'}`}>{formatter(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

