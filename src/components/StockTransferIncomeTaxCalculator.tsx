'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, Coins, ReceiptText, TrendingUp } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface StockTransferIncomeTaxCalculatorProps {
  className?: string;
}

interface CaseInput {
  stockCount: string;
  buyPrice: string;
  sellPrice: string;
}

interface CaseResult extends CaseInput {
  acquisitionAmount: number;
  transferAmount: number;
  capitalGain: number;
  stockTax: number;
  taxBase: number;
  capitalTax: number;
  localTax: number;
  totalTax: number;
  requiredAmountBuyer: number;
}

interface CalculationResult {
  cases: CaseResult[];
  totalTransferAmount: number;
  totalCapitalGain: number;
  totalTax: number;
  totalRequiredAmountBuyer: number;
}

const BASIC_DEDUCTION = 2_500_000;
const STOCK_TRANSACTION_TAX_RATE = 0.0045;

const INITIAL_CASES: CaseInput[] = [
  { stockCount: '10,000', buyPrice: '5,000', sellPrice: '250,000' },
  { stockCount: '5,000', buyPrice: '6,000', sellPrice: '250,000' },
  { stockCount: '60,000', buyPrice: '5,000', sellPrice: '12,000' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
  { stockCount: '', buyPrice: '', sellPrice: '' },
];

const parseNumber = (value: string): number => Number(String(value).replace(/[^\d.-]/g, '')) || 0;

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value) || value === 0) return '0';
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

const calculateCapitalTax = (taxBase: number): number => {
  if (taxBase > 300_000_000) return (taxBase - 300_000_000) * 0.25 + 60_000_000;
  return taxBase * 0.2;
};

const calculateCase = (input: CaseInput): CaseResult => {
  const stockCount = parseNumber(input.stockCount);
  const buyPrice = parseNumber(input.buyPrice);
  const sellPrice = parseNumber(input.sellPrice);
  const acquisitionAmount = stockCount * buyPrice;
  const transferAmount = stockCount * sellPrice;
  const capitalGain = Math.max((sellPrice - buyPrice) * stockCount, 0);
  const stockTax = transferAmount * STOCK_TRANSACTION_TAX_RATE;
  const taxBase = Math.max(capitalGain - stockTax - BASIC_DEDUCTION, 0);
  const capitalTax = calculateCapitalTax(taxBase);
  const localTax = capitalTax * 0.1;
  const totalTax = capitalTax + localTax + stockTax;

  return {
    ...input,
    acquisitionAmount,
    transferAmount,
    capitalGain,
    stockTax,
    taxBase,
    capitalTax,
    localTax,
    totalTax,
    requiredAmountBuyer: transferAmount,
  };
};

const calculateResult = (cases: CaseInput[]): CalculationResult => {
  const results = cases.map(calculateCase);
  return {
    cases: results,
    totalTransferAmount: results.reduce((sum, row) => sum + row.transferAmount, 0),
    totalCapitalGain: results.reduce((sum, row) => sum + row.capitalGain, 0),
    totalTax: results.reduce((sum, row) => sum + row.totalTax, 0),
    totalRequiredAmountBuyer: results.reduce((sum, row) => sum + row.requiredAmountBuyer, 0),
  };
};

export default function StockTransferIncomeTaxCalculator({ className = '' }: StockTransferIncomeTaxCalculatorProps) {
  const [cases, setCases] = useState<CaseInput[]>(INITIAL_CASES);
  const [activeCase, setActiveCase] = useState(0);
  const result = useMemo((): CalculationResult => calculateResult(cases), [cases]);
  const activeResult = result.cases[activeCase];

  const updateCase = (index: number, field: keyof CaseInput, value: string): void => {
    setCases((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: formatMoneyInput(value) };
      return next;
    });
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>주식 수, 주당 취득가격, 주당 양도가격을 입력하면 케이스별 양도소득세를 자동 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>증권거래세 0.45%, 기본공제 250만원, 양도소득세율 20%/25%, 지방소득세 10%를 반영합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>양도자의 세금 합계와 매수자의 필요자금을 함께 확인할 수 있습니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">calc805-3.js의 주식 양도소득세 계산 흐름을 React 상태 계산으로 이식했습니다. 실제 신고 전에는 대주주 여부, 중소기업 여부, 상장/비상장 구분, 보유기간별 세율을 별도로 검토해야 합니다.</p>
          </div>
        </div>

        <div className="flex mx-4 mb-8 mt-8 max-w-5xl overflow-x-auto rounded-2xl bg-gray-100 p-1 scrollbar-hide md:mx-auto">
          {cases.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(): void => setActiveCase(index)}
              className={`min-w-[84px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeCase === index ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              CASE {index + 1}
            </button>
          ))}
        </div>

        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard icon={<ArrowRightLeft className="w-5 h-5" />} label="선택 케이스 양도가액" value={formatNumber(activeResult.transferAmount)} />
          <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="선택 케이스 양도차익" value={formatNumber(activeResult.capitalGain)} color="dark" />
          <MetricCard icon={<ReceiptText className="w-5 h-5" />} label="선택 케이스 세금" value={formatNumber(activeResult.totalTax)} color="green" />
          <MetricCard icon={<Coins className="w-5 h-5" />} label="전체 케이스 세금" value={formatNumber(result.totalTax)} color="blue" />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">케이스별 입력</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">입력값을 수정하면 결과가 즉시 반영됩니다.</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[980px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    {cases.map((_, index) => (
                      <th key={index} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">CASE {index + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <InputTableRow label="주식 수" field="stockCount" cases={cases} updateCase={updateCase} />
                  <InputTableRow label="주당 취득가격" field="buyPrice" cases={cases} updateCase={updateCase} />
                  <OutputTableRow label="취득가액" values={result.cases.map((row) => row.acquisitionAmount)} />
                  <InputTableRow label="주당 양도가격" field="sellPrice" cases={cases} updateCase={updateCase} />
                  <OutputTableRow label="양도가액" values={result.cases.map((row) => row.transferAmount)} />
                </tbody>
              </table>
            </div>
          </section>

          <ResultTable cases={result.cases} />
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

function InputTableRow({ label, field, cases, updateCase }: {
  label: string;
  field: keyof CaseInput;
  cases: CaseInput[];
  updateCase: (index: number, field: keyof CaseInput, value: string) => void;
}) {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">{label}</td>
      {cases.map((row, index) => (
        <td key={index} className="p-0 border-r border-gray-100 bg-blue-50/30">
          <input
            type="text"
            value={row[field]}
            onChange={(event): void => updateCase(index, field, event.target.value)}
            className="w-full p-3 md:p-4 bg-transparent text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20"
          />
        </td>
      ))}
    </tr>
  );
}

function OutputTableRow({ label, values }: { label: string; values: number[] }) {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">{label}</td>
      {values.map((value, index) => (
        <td key={index} className="p-3 md:p-4 text-right text-[#4e5968] border-r border-gray-100 whitespace-nowrap font-bold">{formatOptionalNumber(value)}</td>
      ))}
    </tr>
  );
}

function ResultTable({ cases }: { cases: CaseResult[] }) {
  const rows: Array<[string, (row: CaseResult) => number, boolean?]> = [
              ['양도차익', (row) => row.capitalGain, true],
              ['과세표준', (row) => row.taxBase, true],
    ['양도소득세', (row) => row.capitalTax],
              ['지방소득세', (row) => row.localTax],
    ['증권거래세', (row) => row.stockTax],
    ['?멸툑 ?⑷퀎', (row) => row.totalTax, true],
    ['?묐룄?먯쓽 ?멸툑', (row) => row.totalTax, true],
              ['매수자의 필요자금', (row) => row.requiredAmountBuyer, true],
  ];

  return (
    <section className="px-4 md:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
            <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">양도소득세 계산 결과</h3>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
        <table className="w-full border-collapse min-w-[980px]">
          <thead>
            <tr className="bg-[#1a1f27] text-white">
              <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">구분</th>
              {cases.map((_, index) => (
                <th key={index} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">CASE {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
            {rows.map(([label, formatter, highlight]) => (
              <tr key={label} className={`${highlight ? 'bg-blue-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-bold ${highlight ? 'bg-blue-50/50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>{label}</td>
                {cases.map((row, index) => (
                  <td key={index} className={`p-3 md:p-4 text-right whitespace-nowrap border-r border-gray-100 ${highlight ? 'font-black text-[#203578]' : 'font-bold text-[#4e5968]'}`}>{formatOptionalNumber(formatter(row))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

