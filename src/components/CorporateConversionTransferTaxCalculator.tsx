'use client';

import React, { useMemo, useState } from 'react';
import { Clock, Phone, Sparkles } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface CorporateConversionTransferTaxCalculatorProps {
  className?: string;
}

interface AssetInput {
  name: string;
  acquisitionDate: string;
  transferDate: string;
  useType: 'business' | 'nonBusiness';
  leaseType: 'lease' | 'nonLease';
  transferPrice: string;
  acquisitionPrice: string;
  capitalExpense: string;
  transferBrokerFee: string;
  bondLoss: string;
  otherCost: string;
  basicDeduction: string;
}

interface HoldingDeductionRate {
  year: number;
  rate: number;
}

interface TransferTaxRate {
  base: number;
  deduction: number;
  business: number;
  nonBusiness: number;
}

interface AssetResult {
  holdingYears: number;
  holdingRate: number;
  businessFlag: number;
  estimatedDeduction: number;
  necessaryCost: number;
  capitalGain: number;
  specialDeduction: number;
  taxableGain: number;
  taxBase: number;
  appliedRate: number;
  progressiveDeduction: number;
  calculatedTax: number;
  localTax: number;
  taxSubtotal: number;
  normalAcquisitionTax: number;
  normalRuralTax: number;
  normalReducedRuralTax: number;
  normalEducationTax: number;
  normalAcquisitionSubtotal: number;
  highAcquisitionTax: number;
  highRuralTax: number;
  highEducationTax: number;
  highAcquisitionSubtotal: number;
  registrationLicenseTax: number;
  registrationEducationTax: number;
  denseAreaTax: number;
  denseEducationTax: number;
  fourthAcquisitionTax: number;
  fourthSpecialRuralTax: number;
  fourthEducationTax: number;
  fourthSubtotal: number;
}

interface CalculationResult {
  assetResults: AssetResult[];
  transferPriceTotal: number;
  totalTransferTax: number;
  currentNetAssets: number;
  netAssetsAfterTax: number;
  netAssetsAfterTaxRatio: number;
  estimatedStockPrice: number;
  requiredAssetIncrease: number;
  normalAcquisitionTaxTotal: number;
  highAcquisitionTaxTotal: number;
  registrationTaxTotal: number;
  fourthTaxTotal: number;
  inheritanceAcquisitionTax: number;
}

type ViewTab = 'input' | 'transferTax' | 'conversion' | 'acquisition';

const INITIAL_ASSETS: AssetInput[] = [
  {
    name: '물건지 1',
    acquisitionDate: '1996-04-08',
    transferDate: '2024-01-31',
    useType: 'business',
    leaseType: 'lease',
    transferPrice: '3,500,000,000',
    acquisitionPrice: '700,000,000',
    capitalExpense: '',
    transferBrokerFee: '',
    bondLoss: '',
    otherCost: '',
    basicDeduction: '2,500,000',
  },
  {
    name: '물건지 2',
    acquisitionDate: '2015-11-20',
    transferDate: '2023-12-31',
    useType: 'business',
    leaseType: 'lease',
    transferPrice: '',
    acquisitionPrice: '',
    capitalExpense: '',
    transferBrokerFee: '',
    bondLoss: '',
    otherCost: '',
    basicDeduction: '',
  },
  {
    name: '물건지 3',
    acquisitionDate: '1981-12-03',
    transferDate: '2023-12-31',
    useType: 'business',
    leaseType: 'lease',
    transferPrice: '',
    acquisitionPrice: '',
    capitalExpense: '',
    transferBrokerFee: '',
    bondLoss: '',
    otherCost: '',
    basicDeduction: '',
  },
  {
    name: '물건지 4',
    acquisitionDate: '1981-12-03',
    transferDate: '2023-12-31',
    useType: 'business',
    leaseType: 'lease',
    transferPrice: '',
    acquisitionPrice: '',
    capitalExpense: '',
    transferBrokerFee: '',
    bondLoss: '',
    otherCost: '',
    basicDeduction: '',
  },
];

const HOLDING_DEDUCTION_RATES: HoldingDeductionRate[] = [
  { year: 0, rate: 0 },
  { year: 3, rate: 6 },
  { year: 4, rate: 8 },
  { year: 5, rate: 10 },
  { year: 6, rate: 12 },
  { year: 7, rate: 14 },
  { year: 8, rate: 16 },
  { year: 9, rate: 18 },
  { year: 10, rate: 20 },
  { year: 11, rate: 22 },
  { year: 12, rate: 24 },
  { year: 13, rate: 26 },
  { year: 14, rate: 28 },
  { year: 15, rate: 30 },
];

const TAX_RATE_TABLE: TransferTaxRate[] = [
  { base: 0, deduction: 0, business: 0.06, nonBusiness: 0.16 },
  { base: 12_000_000, deduction: 1_080_000, business: 0.15, nonBusiness: 0.25 },
  { base: 46_000_000, deduction: 5_220_000, business: 0.24, nonBusiness: 0.34 },
  { base: 88_000_000, deduction: 14_900_000, business: 0.35, nonBusiness: 0.45 },
  { base: 150_000_000, deduction: 19_400_000, business: 0.38, nonBusiness: 0.48 },
  { base: 300_000_000, deduction: 25_400_000, business: 0.4, nonBusiness: 0.5 },
  { base: 500_000_000, deduction: 35_400_000, business: 0.42, nonBusiness: 0.52 },
  { base: 1_000_000_000, deduction: 65_400_000, business: 0.45, nonBusiness: 0.55 },
];

const parseNumber = (value: string): number => Number(String(value).replace(/[^\d.-]/g, '')) || 0;

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.floor(value).toLocaleString('ko-KR');
};

const calculateHoldingYears = (acquisitionDate: string, transferDate: string): number => {
  const acquisition: Date = new Date(acquisitionDate);
  const transfer: Date = new Date(transferDate);

  if (Number.isNaN(acquisition.getTime()) || Number.isNaN(transfer.getTime())) return 0;

  const diffDays: number = (transfer.getTime() - acquisition.getTime()) / (1000 * 60 * 60 * 24);
  return Number((diffDays / 365).toFixed(1));
};

const getDeductionRate = (years: number): number => {
  let rate: number = 0;
  for (const row of HOLDING_DEDUCTION_RATES) {
    if (years >= row.year) {
      rate = row.rate;
    } else {
      break;
    }
  }
  return rate;
};

const getTransferTaxRate = (taxBase: number, useType: AssetInput['useType']): { rate: number; deduction: number } => {
  let selected: TransferTaxRate = TAX_RATE_TABLE[0];
  for (const row of TAX_RATE_TABLE) {
    if (taxBase >= row.base) {
      selected = row;
    } else {
      break;
    }
  }

  return {
    rate: useType === 'business' ? selected.business : selected.nonBusiness,
    deduction: selected.deduction,
  };
};

const calculateAssetResult = (asset: AssetInput): AssetResult => {
  const transferPrice: number = parseNumber(asset.transferPrice);
  const acquisitionPrice: number = parseNumber(asset.acquisitionPrice);
  const necessaryCost: number = parseNumber(asset.capitalExpense) + parseNumber(asset.transferBrokerFee) + parseNumber(asset.bondLoss) + parseNumber(asset.otherCost);
  const estimatedDeduction: number = Math.floor(acquisitionPrice * 0.03);
  const capitalGain: number = transferPrice - acquisitionPrice - necessaryCost - estimatedDeduction;
  const holdingYears: number = calculateHoldingYears(asset.acquisitionDate, asset.transferDate);
  const holdingRate: number = getDeductionRate(Math.floor(holdingYears));
  const specialDeduction: number = Math.floor(capitalGain * (holdingRate / 100));
  const taxableGain: number = capitalGain - specialDeduction;
  const taxBase: number = Math.max(taxableGain - parseNumber(asset.basicDeduction), 0);
  const taxRate = getTransferTaxRate(taxBase, asset.useType);
  const calculatedTax: number = Math.max(0, taxBase * taxRate.rate - taxRate.deduction);
  const localTax: number = calculatedTax * 0.1;
  const taxSubtotal: number = calculatedTax + localTax;
  const isLease: boolean = asset.leaseType === 'lease';
  const normalAcquisitionTax: number = Math.floor(transferPrice * (isLease ? 0.04 : 0.01));
  const normalRuralTax: number = Math.floor(transferPrice * (isLease ? 0.002 : 0.0005));
  const normalReducedRuralTax: number = Math.floor(transferPrice * (isLease ? 0 : 0.2) * 0.75 * 0.04);
  const normalEducationTax: number = Math.floor(transferPrice * (isLease ? 0.004 : 0.001));
  const highAcquisitionTax: number = Math.floor(transferPrice * (isLease ? 0.08 : 0.02));
  const highRuralTax: number = Math.floor(transferPrice * (isLease ? 0.002 : 0.0005));
  const highReducedRuralTax: number = Math.floor(transferPrice * (isLease ? 0 : 0.2) * 0.75 * 0.08);
  const highEducationTax: number = Math.floor(transferPrice * (isLease ? 0.012 : 0.003));
  const registrationLicenseTax: number = Math.floor(transferPrice * 0.004);
  const registrationEducationTax: number = Math.floor(registrationLicenseTax * 0.2);
  const denseAreaTax: number = Math.floor(transferPrice * 0.012);
  const denseEducationTax: number = Math.floor(denseAreaTax * 0.2);
  const fourthAcquisitionTax: number = Math.floor(transferPrice * 0.04);
  const fourthSpecialRuralTax: number = Math.floor(transferPrice * 0.002);
  const fourthEducationTax: number = Math.floor(transferPrice * 0.004);

  return {
    holdingYears,
    holdingRate,
    businessFlag: asset.useType === 'business' ? 0 : 1,
    estimatedDeduction,
    necessaryCost,
    capitalGain,
    specialDeduction,
    taxableGain,
    taxBase,
    appliedRate: taxRate.rate,
    progressiveDeduction: taxRate.deduction,
    calculatedTax,
    localTax,
    taxSubtotal,
    normalAcquisitionTax,
    normalRuralTax,
    normalReducedRuralTax,
    normalEducationTax,
    normalAcquisitionSubtotal: normalAcquisitionTax + normalRuralTax + normalReducedRuralTax + normalEducationTax,
    highAcquisitionTax,
    highRuralTax,
    highEducationTax,
    highAcquisitionSubtotal: highAcquisitionTax + highRuralTax + highReducedRuralTax + highEducationTax,
    registrationLicenseTax,
    registrationEducationTax,
    denseAreaTax,
    denseEducationTax,
    fourthAcquisitionTax,
    fourthSpecialRuralTax,
    fourthEducationTax,
    fourthSubtotal: fourthAcquisitionTax + fourthSpecialRuralTax + fourthEducationTax,
  };
};

const calculateAll = (assets: AssetInput[]): CalculationResult => {
  const assetResults: AssetResult[] = assets.map((asset: AssetInput): AssetResult => calculateAssetResult(asset));
  const transferPriceTotal: number = assets.reduce((sum: number, asset: AssetInput): number => sum + parseNumber(asset.transferPrice), 0);
  const totalTransferTax: number = assetResults.reduce((sum: number, result: AssetResult): number => sum + result.taxSubtotal, 0);
  const currentNetAssets: number = transferPriceTotal;
  const netAssetsAfterTax: number = currentNetAssets - totalTransferTax;
  const netAssetsAfterTaxRatio: number = currentNetAssets > 0 ? (netAssetsAfterTax / currentNetAssets) * 100 : 0;
  const estimatedStockPrice: number = currentNetAssets > 0 ? Math.round((netAssetsAfterTax / currentNetAssets) * 10_000) : 0;
  const requiredAssetIncrease: number = currentNetAssets > 0 ? Math.round((currentNetAssets / 0.8 - currentNetAssets) / 1_000_000) : 0;

  return {
    assetResults,
    transferPriceTotal,
    totalTransferTax,
    currentNetAssets,
    netAssetsAfterTax,
    netAssetsAfterTaxRatio,
    estimatedStockPrice,
    requiredAssetIncrease,
    normalAcquisitionTaxTotal: assetResults.reduce((sum: number, row: AssetResult): number => sum + row.normalAcquisitionSubtotal, 0),
    highAcquisitionTaxTotal: assetResults.reduce((sum: number, row: AssetResult): number => sum + row.highAcquisitionSubtotal, 0),
    registrationTaxTotal: assetResults.reduce((sum: number, row: AssetResult): number => sum + row.registrationLicenseTax + row.registrationEducationTax + row.denseAreaTax + row.denseEducationTax, 0),
    fourthTaxTotal: assetResults.reduce((sum: number, row: AssetResult): number => sum + row.fourthSubtotal, 0),
    inheritanceAcquisitionTax: Math.floor(transferPriceTotal * 0.0316),
  };
};

export default function CorporateConversionTransferTaxCalculator({ className = '' }: CorporateConversionTransferTaxCalculatorProps) {
  const [assets, setAssets] = useState<AssetInput[]>(INITIAL_ASSETS);
  const [activeTab, setActiveTab] = useState<ViewTab>('input');
  const result: CalculationResult = useMemo((): CalculationResult => calculateAll(assets), [assets]);

  const updateAsset = (index: number, field: keyof AssetInput, value: string): void => {
    setAssets((prev: AssetInput[]): AssetInput[] => {
      const next: AssetInput[] = [...prev];
      const shouldFormat: boolean = ['transferPrice', 'acquisitionPrice', 'capitalExpense', 'transferBrokerFee', 'bondLoss', 'otherCost', 'basicDeduction'].includes(field);
      const formattedValue: string = shouldFormat
        ? (value.replace(/[^0-9.-]/g, '') ? new Intl.NumberFormat('ko-KR').format(parseFloat(value.replace(/[^0-9.-]/g, ''))) : '')
        : value;
      next[index] = { ...next[index], [field]: formattedValue };
      return next;
    });
  };

  const tabs: Array<{ label: string; value: ViewTab }> = [
    { label: '입력', value: 'input' },
    { label: '양도세', value: 'transferTax' },
    { label: '법인전환', value: 'conversion' },
    { label: '취득세', value: 'acquisition' },
  ];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        <div className="p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="space-y-3 text-sm text-[#4e5968] leading-relaxed">
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">1.</span><span>부동산 법인전환 시 양도소득세, 이월과세 차감 후 자산과 주가 변동을 계산합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">2.</span><span>사업용·비사업용 여부, 보유기간, 장기보유특별공제, 누진세율을 기본 산식 기준으로 반영합니다.</span></p>
            <p className="flex gap-2"><span className="font-bold text-[#203578] shrink-0">3.</span><span>법인전환 취득세, 중과 취득세, 등록면허세, 연속 취득세를 함께 비교합니다.</span></p>
            <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">calc804-1.js의 주요 세율표와 계산 흐름을 React 상태 계산으로 이식했습니다.</p>
          </div>
        </div>

        <div className="flex mx-4 mb-8 mt-8 overflow-x-auto rounded-2xl bg-gray-100 p-1 scrollbar-hide md:mx-auto md:max-w-2xl">
          {tabs.map((tab) => (
            <button key={tab.value} type="button" onClick={(): void => setActiveTab(tab.value)} className={`min-w-[96px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab.value ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#203578] p-6 text-white shadow-lg"><p className="text-xs font-bold text-white/70 mb-2">현재 순자산가액</p><p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(result.currentNetAssets)}</p></div>
              <div className="rounded-2xl bg-[#2e7d32] p-6 text-white shadow-lg"><p className="text-xs font-bold text-white/70 mb-2">이월과세 차감 후</p><p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(result.netAssetsAfterTax)}</p></div>
              <div className="rounded-2xl bg-[#1a1f27] p-6 text-white shadow-lg"><p className="text-xs font-bold text-white/70 mb-2">양도세 합계</p><p className="text-2xl md:text-3xl font-black tracking-tight text-[#fab005]">{formatNumber(result.totalTransferTax)}</p></div>
            </div>
          </section>

          {activeTab === 'input' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6"><div className="w-1 h-6 bg-[#203578] rounded-full"></div><h3 className="text-lg md:text-xl font-black text-[#203578]">기초정보 입력</h3></div>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead><tr className="bg-[#203578] text-white"><th className="p-3 md:p-4 text-left sticky left-0 bg-[#203578] z-20">구분</th>{assets.map((asset) => <th key={asset.name} className="p-3 md:p-4 text-center">{asset.name}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                    {[
                      ['취득일', 'acquisitionDate', 'date'],
                      ['양도일', 'transferDate', 'date'],
                      ['양도가액', 'transferPrice', 'text'],
                      ['취득가액', 'acquisitionPrice', 'text'],
                      ['자본적 지출액', 'capitalExpense', 'text'],
                      ['양도중개수수료', 'transferBrokerFee', 'text'],
                      ['국민주택채권매각손실', 'bondLoss', 'text'],
                      ['기타 필요경비', 'otherCost', 'text'],
                      ['기본공제', 'basicDeduction', 'text'],
                    ].map(([label, field, type]) => (
                      <tr key={field} className="hover:bg-blue-50/20">
                        <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">{label}</th>
                        {assets.map((asset, index) => (
                          <td key={`${field}-${index}`} className="p-0">
                            <input type={type} className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none transition-all" value={asset[field as keyof AssetInput]} onChange={(event): void => updateAsset(index, field as keyof AssetInput, event.target.value)} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="hover:bg-blue-50/20">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">사업용 여부</th>
                      {assets.map((asset, index) => (
                        <td key={asset.name} className="p-2">
                          <select className="w-full p-3 rounded-xl bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 outline-none" value={asset.useType} onChange={(event): void => updateAsset(index, 'useType', event.target.value)}>
                            <option value="business">사업용</option>
                            <option value="nonBusiness">비사업용</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-blue-50/20">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">임대 여부</th>
                      {assets.map((asset, index) => (
                        <td key={asset.name} className="p-2">
                          <select className="w-full p-3 rounded-xl bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 outline-none" value={asset.leaseType} onChange={(event): void => updateAsset(index, 'leaseType', event.target.value)}>
                            <option value="lease">임대</option>
                            <option value="nonLease">비임대</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'transferTax' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6"><div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div><h3 className="text-lg md:text-xl font-black text-[#2e7d32]">양도소득세 계산</h3></div>
              <ResultTable assets={assets} rows={[
                ['보유기간', (r) => `${r.holdingYears}년`],
                ['장기보유공제율', (r) => `${r.holdingRate}%`],
                ['가산공제액', (r) => formatNumber(r.estimatedDeduction)],
                ['필요경비', (r) => formatNumber(r.necessaryCost)],
                ['양도차익', (r) => formatNumber(r.capitalGain)],
                ['장기보유특별공제', (r) => formatNumber(r.specialDeduction)],
                ['양도소득금액', (r) => formatNumber(r.taxableGain)],
                ['과세표준', (r) => formatNumber(r.taxBase)],
                ['적용세율', (r) => `${(r.appliedRate * 100).toFixed(1)}%`],
                ['누진공제', (r) => formatNumber(r.progressiveDeduction)],
                ['산출세액', (r) => formatNumber(r.calculatedTax)],
                ['지방소득세', (r) => formatNumber(r.localTax)],
                ['세금 소계', (r) => formatNumber(r.taxSubtotal)],
              ]} results={result.assetResults} totalLabel="양도세 합계" totalValue={formatNumber(result.totalTransferTax)} />
            </section>
          )}

          {activeTab === 'conversion' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6"><div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div><h3 className="text-lg md:text-xl font-black text-[#2e7d32]">법인전환 후 주가 변동 추정</h3></div>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
                <table className="w-full border-collapse min-w-[450px]">
                  <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                    {[
                      ['현재 순자산가액', formatNumber(result.currentNetAssets)],
                      ['양도소득세 이월과세액', formatNumber(result.totalTransferTax)],
                      ['이월과세 차감 후 순자산가액', formatNumber(result.netAssetsAfterTax)],
                      ['순자산 비율', `${result.netAssetsAfterTaxRatio.toFixed(1)}%`],
                      ['추정 주가', formatNumber(result.estimatedStockPrice)],
                      ['부동산비율 80% 초과 필요 자산 증가액(백만원)', formatNumber(result.requiredAssetIncrease)],
                      ['상속 취득세 3.16%', formatNumber(result.inheritanceAcquisitionTax)],
                    ].map(([label, value], index) => (
                      <tr key={label} className={index === 2 ? 'bg-[#203578]/5 text-[#203578]' : index === 6 ? 'bg-[#1a1f27] text-white' : 'bg-white'}>
                        <td className={`p-3 md:p-4 font-black sticky left-0 z-10 ${index === 6 ? 'bg-[#1a1f27]' : index === 2 ? 'bg-[#203578]/5' : 'bg-white'}`}>{label}</td>
                        <td className="p-3 md:p-4 text-right font-black whitespace-nowrap">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'acquisition' && (
            <section className="px-4 md:px-0">
              <div className="flex items-center gap-3 mb-4 md:mb-6"><div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div><h3 className="text-lg md:text-xl font-black text-[#2e7d32]">법인전환 취득 관련 세금</h3></div>
              <ResultTable assets={assets} rows={[
                ['취득세(감면)', (r) => formatNumber(r.normalAcquisitionTax)],
                ['농특세(감면)', (r) => formatNumber(r.normalRuralTax)],
                ['감면분 농특세', (r) => formatNumber(r.normalReducedRuralTax)],
                ['교육세(감면)', (r) => formatNumber(r.normalEducationTax)],
                ['취득세 소계(감면)', (r) => formatNumber(r.normalAcquisitionSubtotal)],
                ['취득세(중과)', (r) => formatNumber(r.highAcquisitionTax)],
                ['농특세(중과)', (r) => formatNumber(r.highRuralTax)],
                ['교육세(중과)', (r) => formatNumber(r.highEducationTax)],
                ['중과 소계', (r) => formatNumber(r.highAcquisitionSubtotal)],
                ['등록면허세', (r) => formatNumber(r.registrationLicenseTax)],
                ['등록면허 교육세', (r) => formatNumber(r.registrationEducationTax)],
                ['대도시 중과 등록세', (r) => formatNumber(r.denseAreaTax)],
                ['대도시 중과 교육세', (r) => formatNumber(r.denseEducationTax)],
                ['증여 취득세 4%', (r) => formatNumber(r.fourthAcquisitionTax)],
                ['증여 농특세 0.2%', (r) => formatNumber(r.fourthSpecialRuralTax)],
                ['증여 교육세 0.4%', (r) => formatNumber(r.fourthEducationTax)],
              ]} results={result.assetResults} totalLabel="취득 관련 합계" totalValue={formatNumber(result.normalAcquisitionTaxTotal + result.highAcquisitionTaxTotal + result.registrationTaxTotal + result.fourthTaxTotal)} />
            </section>
          )}
        </div>

        <ReportActionFooter />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard icon={<Sparkles className="w-5 h-5" />} title="양도세 계산" body="보유기간과 사업용 여부를 반영해 과세표준과 산출세액을 계산합니다." color="blue" />
        <InfoCard icon={<Clock className="w-5 h-5" />} title="주가 변동" body="이월과세 차감 후 순자산가액 기준 주가를 추정합니다." color="green" />
        <InfoCard icon={<Phone className="w-5 h-5" />} title="세무 상담" body="법인전환 실행 전 세무 리스크를 검토할 수 있습니다." color="yellow" />
      </div>
    </div>
  );
}

interface ResultTableProps {
  assets: AssetInput[];
  results: AssetResult[];
  rows: Array<[string, (result: AssetResult) => string]>;
  totalLabel: string;
  totalValue: string;
}

function ResultTable({ assets, results, rows, totalLabel, totalValue }: ResultTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
      <table className="w-full border-collapse min-w-[760px]">
        <thead><tr className="bg-[#1a1f27] text-white"><th className="p-3 md:p-4 text-left sticky left-0 bg-[#1a1f27] z-20">분석 항목</th>{assets.map((asset) => <th key={asset.name} className="p-3 md:p-4 text-right">{asset.name}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
          {rows.map(([label, formatter]) => (
            <tr key={label} className="hover:bg-gray-50 bg-white">
              <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">{label}</td>
              {results.map((row, index) => <td key={`${label}-${index}`} className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatter(row)}</td>)}
            </tr>
          ))}
          <tr className="bg-[#1a1f27] text-white"><td className="p-3 md:p-4 border-r border-white/10 sticky left-0 bg-[#1a1f27] z-10 font-black">{totalLabel}</td><td colSpan={assets.length} className="p-3 md:p-4 text-right whitespace-nowrap font-black text-[#fab005]">{totalValue}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  color: 'blue' | 'green' | 'yellow';
}

function InfoCard({ icon, title, body, color }: InfoCardProps) {
  const colorClassName: string = color === 'blue' ? 'bg-[#203578]/10 text-[#203578]' : color === 'green' ? 'bg-[#2e7d32]/10 text-[#2e7d32]' : 'bg-[#fab005]/10 text-[#fab005]';
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClassName}`}>{icon}</div>
      <div><h5 className="font-black text-[#1a1f27] mb-1">{title}</h5><p className="text-xs text-[#4e5968] leading-relaxed">{body}</p></div>
    </div>
  );
}
