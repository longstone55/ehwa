'use client';

import React, { useMemo, useState } from 'react';
import { Coins, Percent, ReceiptText, Users } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface MultiDoneeGiftTaxCalculatorProps {
  className?: string;
}

interface DoneeInput {
  name: string;
  relation: string;
  exemption: string;
  stockCount: string;
  unitPrice: string;
  manualGiftValue: string;
}

interface CalculatorState {
  directGiftModeAmount: string;
  totalIssuedStock: string;
  donees: DoneeInput[];
}

interface DoneeResult extends DoneeInput {
  ratio: number;
  giftValue: number;
  exemptionValue: number;
  taxableBase: number;
  taxDue: number;
  reportDeduction: number;
  declaredTax: number;
}

interface CalculationResult {
  manualMode: boolean;
  totalGiftValue: number;
  totalTaxDue: number;
  totalReportDeduction: number;
  totalDeclaredTax: number;
  results: DoneeResult[];
}

const RELATION_OPTIONS = [
  { label: '배우자', value: '600000000' },
  { label: '직계비속(성년)', value: '50000000' },
  { label: '직계비속(미성년)', value: '20000000' },
  { label: '직계존속', value: '50000000' },
  { label: '기타 친족', value: '10000000' },
  { label: '기타', value: '0' },
];

const INITIAL_DONEES: DoneeInput[] = [
  { name: '배우자', relation: '600000000', exemption: '600,000,000', stockCount: '10,534', unitPrice: '57,146', manualGiftValue: '500' },
  { name: '가족 1', relation: '600000000', exemption: '600,000,000', stockCount: '1,200', unitPrice: '57,146', manualGiftValue: '25,000,000' },
  { name: '가족 2', relation: '600000000', exemption: '600,000,000', stockCount: '7,000', unitPrice: '25,000', manualGiftValue: '1,500,000,000' },
  { name: '가족 3', relation: '600000000', exemption: '600,000,000', stockCount: '8,000', unitPrice: '25,000', manualGiftValue: '800,000,000' },
  { name: '가족 4', relation: '600000000', exemption: '600,000,000', stockCount: '9,000', unitPrice: '25,000', manualGiftValue: '35,250,000' },
  { name: '가족 5', relation: '600000000', exemption: '600,000,000', stockCount: '10,000', unitPrice: '25,000', manualGiftValue: '' },
  { name: '가족 6', relation: '600000000', exemption: '600,000,000', stockCount: '10,000', unitPrice: '25,001', manualGiftValue: '' },
  { name: '가족 7', relation: '600000000', exemption: '600,000,000', stockCount: '20,000', unitPrice: '25,002', manualGiftValue: '' },
  { name: '가족 8', relation: '600000000', exemption: '600,000,000', stockCount: '30,000', unitPrice: '25,000', manualGiftValue: '' },
  { name: '가족 9', relation: '600000000', exemption: '600,000,000', stockCount: '40,000', unitPrice: '25,000', manualGiftValue: '' },
];

const INITIAL_STATE: CalculatorState = {
  directGiftModeAmount: '0',
  totalIssuedStock: '120,000',
  donees: INITIAL_DONEES,
};

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

const calculateGiftTax = (taxableBase: number): number => {
  if (taxableBase > 3_000_000_000) return taxableBase * 0.5 - 460_000_000;
  if (taxableBase > 1_000_000_000) return taxableBase * 0.4 - 160_000_000;
  if (taxableBase > 500_000_000) return taxableBase * 0.3 - 60_000_000;
  if (taxableBase > 100_000_000) return taxableBase * 0.2 - 10_000_000;
  return taxableBase * 0.1;
};

const calculateResult = (state: CalculatorState): CalculationResult => {
  const totalIssuedStock = parseNumber(state.totalIssuedStock);
  const manualMode = parseNumber(state.directGiftModeAmount) > 0;

  const results = state.donees.map((donee): DoneeResult => {
    const stockCount = parseNumber(donee.stockCount);
    const unitPrice = parseNumber(donee.unitPrice);
    const giftValue = manualMode ? parseNumber(donee.manualGiftValue) : stockCount * unitPrice;
    const exemptionValue = parseNumber(donee.relation);
    const taxableBase = Math.max(giftValue - exemptionValue, 0);
    const taxDue = Math.round(calculateGiftTax(taxableBase));
    const reportDeduction = Math.round(taxDue * 0.03);
    const declaredTax = Math.round(taxDue - taxDue * 0.03);

    return {
      ...donee,
      ratio: totalIssuedStock > 0 ? (stockCount / totalIssuedStock) * 100 : 0,
      giftValue,
      exemptionValue,
      taxableBase,
      taxDue,
      reportDeduction,
      declaredTax,
    };
  });

  return {
    manualMode,
    totalGiftValue: results.reduce((sum, row) => sum + row.giftValue, 0),
    totalTaxDue: results.reduce((sum, row) => sum + row.taxDue, 0),
    totalReportDeduction: results.reduce((sum, row) => sum + row.reportDeduction, 0),
    totalDeclaredTax: results.reduce((sum, row) => sum + row.declaredTax, 0),
    results,
  };
};

export default function MultiDoneeGiftTaxCalculator({ className = '' }: MultiDoneeGiftTaxCalculatorProps) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const result = useMemo((): CalculationResult => calculateResult(state), [state]);

  const updateTopLevel = (field: keyof Omit<CalculatorState, 'donees'>, value: string): void => {
    setState((prev) => ({ ...prev, [field]: formatMoneyInput(value) }));
  };

  const updateDonee = (index: number, field: keyof DoneeInput, value: string): void => {
    setState((prev) => {
      const donees = [...prev.donees];
      const formattedValue = field === 'name' ? value : field === 'relation' ? value : formatMoneyInput(value);
      donees[index] = {
        ...donees[index],
        [field]: formattedValue,
        exemption: field === 'relation' ? formatNumber(parseNumber(value)) : donees[index].exemption,
      };
      return { ...prev, donees };
    });
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>수증자별 주식 수, 1주당 평가액, 관계별 증여재산공제를 반영해 증여세 신고세액을 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>증여재산 입력값이 0이면 주식 수와 1주당 평가액으로 증여재산가액을 자동 산출합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>증여재산 입력값을 1 이상으로 두면 수증자별 직접 입력한 증여재산가액을 기준으로 계산합니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">calc805-2.js의 수증자별 증여세 산식, 3% 신고세액공제, 관계별 증여재산공제를 React 상태 계산으로 이식했습니다.</p>
          </div>
        </div>

        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard icon={<Users className="w-5 h-5" />} label="수증자 수" value={`${result.results.length}명`} />
          <MetricCard icon={<Coins className="w-5 h-5" />} label="증여재산 합계" value={formatNumber(result.totalGiftValue)} color="dark" />
          <MetricCard icon={<Percent className="w-5 h-5" />} label="신고세액공제 합계" value={formatNumber(result.totalReportDeduction)} color="green" />
              <MetricCard icon={<ReceiptText className="w-5 h-5" />} label="?좉퀬?몄븸 ?⑷퀎" value={formatNumber(result.totalDeclaredTax)} color="blue" />
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">기본 입력</h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <InputRow label="증여재산 입력 모드값">
                  <MoneyInput value={state.directGiftModeAmount} onChange={(value): void => updateTopLevel('directGiftModeAmount', value)} />
                </InputRow>
                <InputRow label="발행주식 총수">
                  <MoneyInput value={state.totalIssuedStock} onChange={(value): void => updateTopLevel('totalIssuedStock', value)} />
                </InputRow>
              </div>
              <div className="px-5 py-3 bg-blue-50/40 text-xs font-bold text-[#203578]">
                현재 모드: {result.manualMode ? '수증자별 직접 증여재산가액 입력' : '주식 수와 1주당 평가액 자동 계산'}
              </div>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">?섏쬆?먮퀎 ?낅젰</h3>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[1120px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#203578] z-20">수증자</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-black border-r border-white/10">관계</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">주식 수</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">지분율</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">1주당 평가액</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black">직접 증여재산가액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {result.results.map((row, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="p-0 border-r border-gray-100 sticky left-0 bg-white z-10">
                        <input value={row.name} onChange={(event): void => updateDonee(index, 'name', event.target.value)} className="w-full p-3 md:p-4 bg-transparent text-left font-black text-[#203578] outline-none" />
                      </td>
                      <td className="p-2 border-r border-gray-100 bg-blue-50/30">
                        <select value={row.relation} onChange={(event): void => updateDonee(index, 'relation', event.target.value)} className="w-full bg-transparent text-center font-black text-[#203578] outline-none">
                          {RELATION_OPTIONS.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)}
                        </select>
                      </td>
                      <td className="p-0 border-r border-gray-100 bg-blue-50/30"><CellMoneyInput value={row.stockCount} onChange={(value): void => updateDonee(index, 'stockCount', value)} /></td>
                      <td className="p-3 md:p-4 text-right font-bold text-[#4e5968] border-r border-gray-100 whitespace-nowrap">{row.ratio.toFixed(1)}%</td>
                      <td className="p-0 border-r border-gray-100 bg-blue-50/30"><CellMoneyInput value={row.unitPrice} onChange={(value): void => updateDonee(index, 'unitPrice', value)} /></td>
                      <td className="p-0 bg-blue-50/30"><CellMoneyInput value={row.manualGiftValue} onChange={(value): void => updateDonee(index, 'manualGiftValue', value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <GiftResultTable result={result} />
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

function InputRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
      <span className="text-sm font-semibold text-[#4e5968] shrink-0">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function MoneyInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event): void => onChange(event.target.value)}
      className="w-full bg-transparent border-none text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20 rounded-lg px-2 py-1"
    />
  );
}

function CellMoneyInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event): void => onChange(event.target.value)}
      className="w-full p-3 md:p-4 bg-transparent text-right font-black text-[#203578] outline-none focus:ring-2 focus:ring-[#203578]/20"
    />
  );
}

function GiftResultTable({ result }: { result: CalculationResult }) {
  const rows: Array<[string, (row: DoneeResult) => string, boolean?]> = [
    ['증여재산가액', (row) => formatNumber(row.giftValue), true],
            ['(-) 증여재산공제', (row) => formatNumber(row.exemptionValue)],
            ['증여세 과세표준', (row) => formatNumber(row.taxableBase), true],
            ['증여세 산출세액', (row) => formatNumber(row.taxDue)],
            ['(-) 신고세액공제', (row) => row.reportDeduction === 0 ? '0' : `-${formatNumber(row.reportDeduction)}`],
            ['증여세 신고세액', (row) => formatNumber(row.declaredTax), true],
  ];

  return (
    <section className="px-4 md:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
          <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">수증자별 증여세 결과</h3>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
        <table className="w-full border-collapse min-w-[1120px]">
          <thead>
            <tr className="bg-[#1a1f27] text-white">
            <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">구분</th>
              {result.results.map((row, index) => (
                <th key={`${row.name}-${index}`} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-black border-r border-white/10">{row.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
            {rows.map(([label, formatter, highlight]) => (
              <tr key={label} className={`${highlight ? 'bg-blue-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                <td className={`p-3 md:p-4 border-r border-gray-100 sticky left-0 z-10 font-bold ${highlight ? 'bg-blue-50/50 text-[#203578]' : 'bg-white text-[#1a1f27]'}`}>{label}</td>
                {result.results.map((row, index) => (
                  <td key={`${label}-${index}`} className={`p-3 md:p-4 text-right whitespace-nowrap border-r border-gray-100 ${highlight ? 'font-black text-[#203578]' : 'font-bold text-[#4e5968]'}`}>{formatter(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

