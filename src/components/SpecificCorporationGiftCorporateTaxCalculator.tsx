'use client';

import React, { useMemo, useState } from 'react';
import { Clock, Phone, Sparkles } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface SpecificCorporationGiftCorporateTaxCalculatorProps {
  className?: string;
}

interface CalculatorState {
  realEstateValue: string;
  monthlyRent: string;
}

interface CorporateTaxBracket {
  threshold: number;
  rate: number;
  deduction: number;
}

interface AssetScenario {
  shareholderCount: number;
  giftAssetValue: number;
  realEstateShareRate: string;
  requiredYears: string;
}

interface YearScenario {
  year: number;
  rows: YearScenarioRow[];
}

interface YearScenarioRow {
  shareholderCount: number;
  giftAssetValue: number;
  rentalIncome: number;
  corporationIncome: number;
  corporateTax: number;
}

type ViewTab = 'asset' | 'year';

const INITIAL_STATE: CalculatorState = {
  realEstateValue: '832,000,000',
  monthlyRent: '1,904,167',
};

const GIFT_ASSET_VALUES: number[] = [
  100_000_000,
  200_000_000,
  300_000_000,
  400_000_000,
  500_000_000,
  600_000_000,
  700_000_000,
  800_000_000,
  900_000_000,
  1_000_000_000,
];

const TAX_BRACKETS: CorporateTaxBracket[] = [
  { threshold: 0, rate: 0.09, deduction: 0 },
  { threshold: 200_000_000, rate: 0.19, deduction: 20_000_000 },
  { threshold: 20_000_000_000, rate: 0.21, deduction: 420_000_000 },
  { threshold: 300_000_000_000, rate: 0.24, deduction: 9_420_000_000 },
];

const RENTAL_BASE: number = 22_850_000;

const parseNumber = (value: string): number => {
  return parseFloat((value || '').replace(/[^0-9.-]/g, '')) || 0;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.floor(value).toLocaleString('ko-KR');
};

const getCorporateTax = (income: number): number => {
  if (income <= 0 || Number.isNaN(income)) return 0;

  let applicable: CorporateTaxBracket = TAX_BRACKETS[0];
  for (const bracket of TAX_BRACKETS) {
    if (income >= bracket.threshold) {
      applicable = bracket;
    } else {
      break;
    }
  }

  const result: number = income * applicable.rate - applicable.deduction;
  return result > 0 ? result : 0;
};

const calculateAssetScenarios = (realEstateValue: number): AssetScenario[] => {
  return GIFT_ASSET_VALUES.map((giftAssetValue: number, index: number): AssetScenario => {
    const shareRate: number = realEstateValue > 0 ? (giftAssetValue / realEstateValue) * 100 : 0;
    const requiredYears: number = giftAssetValue > 0 ? parseFloat((realEstateValue / giftAssetValue).toFixed(1)) : 0;

    return {
      shareholderCount: index + 1,
      giftAssetValue,
      realEstateShareRate: shareRate ? `${shareRate.toFixed(2)}%` : '',
      requiredYears: requiredYears ? `${requiredYears}년` : '-',
    };
  });
};

const calculateYearScenarios = (assetScenarios: AssetScenario[]): YearScenario[] => {
  return Array.from({ length: 10 }, (_: unknown, yearIndex: number): YearScenario => {
    const year: number = yearIndex + 1;
    const rows: YearScenarioRow[] = assetScenarios.map((assetScenario: AssetScenario): YearScenarioRow => {
      const ratio: number = parseFloat(assetScenario.realEstateShareRate.replace('%', '')) || 0;
      const rentalIncome: number = Math.floor((ratio / 100) * RENTAL_BASE * year);
      const corporationIncome: number = assetScenario.giftAssetValue + rentalIncome;
      const corporateTax: number = Math.floor(getCorporateTax(corporationIncome));

      return {
        shareholderCount: assetScenario.shareholderCount,
        giftAssetValue: assetScenario.giftAssetValue,
        rentalIncome,
        corporationIncome,
        corporateTax,
      };
    });

    return { year, rows };
  });
};

export default function SpecificCorporationGiftCorporateTaxCalculator({ className = '' }: SpecificCorporationGiftCorporateTaxCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ViewTab>('asset');
  const [activeYear, setActiveYear] = useState<number>(1);

  const realEstateValue: number = parseNumber(formData.realEstateValue);
  const monthlyRent: number = parseNumber(formData.monthlyRent);
  const yearlyRent: number = monthlyRent * 12;

  const assetScenarios: AssetScenario[] = useMemo((): AssetScenario[] => {
    return calculateAssetScenarios(realEstateValue);
  }, [realEstateValue]);

  const yearScenarios: YearScenario[] = useMemo((): YearScenario[] => {
    return calculateYearScenarios(assetScenarios);
  }, [assetScenarios]);

  const activeYearScenario: YearScenario = yearScenarios.find((scenario: YearScenario): boolean => scenario.year === activeYear) || yearScenarios[0];
  const lastAssetScenario: AssetScenario = assetScenarios[assetScenarios.length - 1];
  const lastYearRow: YearScenarioRow = activeYearScenario.rows[activeYearScenario.rows.length - 1];

  const handleInputChange = (field: keyof CalculatorState, value: string): void => {
    const normalizedValue: string = value.replace(/[^0-9.-]/g, '');
    const formattedValue: string = normalizedValue ? new Intl.NumberFormat('ko-KR').format(parseFloat(normalizedValue)) : '';
    setFormData((prev: CalculatorState): CalculatorState => ({ ...prev, [field]: formattedValue }));
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
                  <span>특정법인에 1인분 증여재산을 이전하는 경우 부동산 지분율과 필요기간을 계산합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">2.</span>
                  <span>월 임대료는 원본 JS와 동일하게 12개월분으로 자동 환산되어 연간 임대료에 반영됩니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">3.</span>
                  <span>1년차부터 10년차까지 임대소득, 특정법인 소득금액, 법인세를 산출합니다.</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                원본 calc802-3.js의 법인세율 구간, 증여재산 배열, 지분율, 필요기간, 임대소득 계산 공식을 그대로 이식했습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex mx-4 mb-8 mt-8 overflow-x-auto rounded-2xl bg-gray-100 p-1 scrollbar-hide md:mx-auto md:max-w-md">
          {[
            { label: '증여재산', value: 'asset' as ViewTab },
            { label: '연차별 법인세', value: 'year' as ViewTab },
          ].map((tab: { label: string; value: ViewTab }) => (
            <button
              key={tab.value}
              type="button"
              onClick={(): void => setActiveTab(tab.value)}
              className={`min-w-[84px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab.value ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">기본 정보 입력</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">부동산 가액과 월 임대료를 입력합니다.</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">부동산 가액</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">총자산가액</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">기간 선택</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <tr className="hover:bg-blue-50/20 transition-colors">
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">입력값</th>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.realEstateValue}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('realEstateValue', event.target.value)}
                      />
                    </td>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.monthlyRent}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('monthlyRent', event.target.value)}
                      />
                    </td>
                    <td className="p-3 md:p-4 text-right whitespace-nowrap font-black text-[#2e7d32]">{formatNumber(yearlyRent)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-2xl bg-[#203578] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">최대 증여재산</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(lastAssetScenario.giftAssetValue)}</p>
              </div>
              <div className="rounded-2xl bg-[#2e7d32] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">최대 부동산 지분율</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{lastAssetScenario.realEstateShareRate}</p>
              </div>
              <div className="rounded-2xl bg-[#1a1f27] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">{activeYear}년차 최대 법인세</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-[#fab005]">{formatNumber(lastYearRow.corporateTax)}</p>
              </div>
            </div>

            {activeTab === 'asset' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
                  <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">1인분 증여재산 분석</h3>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
                  <table className="w-full border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-[#1a1f27] text-white">
                        <th className="p-3 md:p-4 w-[150px] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">분석 기준</th>
                        {assetScenarios.map((scenario: AssetScenario) => (
                          <th key={scenario.shareholderCount} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold whitespace-nowrap">
                            {scenario.shareholderCount}인
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                      <tr className="hover:bg-gray-50 transition-colors bg-white">
                        <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">증여재산가액</td>
                        {assetScenarios.map((scenario: AssetScenario) => (
                          <td key={scenario.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(scenario.giftAssetValue)}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#2e7d32]/5 text-[#2e7d32]">
                        <td className="p-3 md:p-4 border-r border-gray-100 sticky left-0 bg-[#2e7d32]/5 z-10 font-black">부동산 지분율</td>
                        {assetScenarios.map((scenario: AssetScenario) => (
                          <td key={scenario.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black">{scenario.realEstateShareRate}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#203578]/5 text-[#203578]">
                        <td className="p-3 md:p-4 border-r border-gray-100 sticky left-0 bg-[#203578]/5 z-10 font-black">필요기간</td>
                        {assetScenarios.map((scenario: AssetScenario) => (
                          <td key={scenario.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black">{scenario.requiredYears}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
                  <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">연차별 특정법인 증여세 법인세</h3>
                </div>

                <div className="flex overflow-x-auto rounded-2xl bg-gray-100 p-1 scrollbar-hide">
                  {yearScenarios.map((scenario: YearScenario) => (
                    <button
                      key={scenario.year}
                      type="button"
                      onClick={(): void => setActiveYear(scenario.year)}
                      className={`min-w-[72px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeYear === scenario.year ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {scenario.year}년차
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
                  <table className="w-full border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-[#1a1f27] text-white">
                        <th className="p-3 md:p-4 w-[150px] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">분석 항목</th>
                        {activeYearScenario.rows.map((row: YearScenarioRow) => (
                          <th key={row.shareholderCount} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold whitespace-nowrap">
                            {row.shareholderCount}명
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                      <tr className="hover:bg-gray-50 transition-colors bg-white">
                        <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">임대소득</td>
                        {activeYearScenario.rows.map((row: YearScenarioRow) => (
                          <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(row.rentalIncome)}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#203578]/5 text-[#203578]">
                        <td className="p-3 md:p-4 border-r border-gray-100 sticky left-0 bg-[#203578]/5 z-10 font-black">특정법인 소득금액</td>
                        {activeYearScenario.rows.map((row: YearScenarioRow) => (
                          <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black">{formatNumber(row.corporationIncome)}</td>
                        ))}
                      </tr>
                      <tr className="bg-[#1a1f27] text-white">
                        <td className="p-3 md:p-4 border-r border-white/10 sticky left-0 bg-[#1a1f27] z-10 font-black">법인세</td>
                        {activeYearScenario.rows.map((row: YearScenarioRow) => (
                          <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black text-[#fab005]">{row.corporateTax > 0 ? formatNumber(row.corporateTax) : '-'}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
            <h5 className="font-black text-[#1a1f27] mb-1">증여재산 분석</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">1인분 증여재산과 부동산 지분율, 기간을 산출합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">연차별 계산</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">1년차부터 10년차까지 임대소득과 법인세를 비교합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#fab005]/10 flex items-center justify-center text-[#fab005]">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">세무 상담</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">증여 구조와 법인세 부담을 함께 검토할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
