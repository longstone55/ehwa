'use client';

import React, { useMemo, useState } from 'react';
import { Clock, Phone, Sparkles } from 'lucide-react';
import ReportActionFooter from './ReportActionFooter';

interface DifferentialDividendAfterTaxCalculatorProps {
  className?: string;
}

interface CalculatorState {
  subsidiaryStockPrice: string;
  subsidiaryTotalShares: string;
  parentOwnedShares: string;
}

interface DividendScenario {
  shareholderCount: number;
  dividendIncome: number;
  corporateTax: number;
  afterTaxReceipt: number;
  convertibleStockCount: number;
  shareRatio: string;
  acquisitionPeriod: string;
}

interface RateScenario {
  rateLabel: RateLabel;
  rows: DividendScenario[];
}

interface TaxBracket {
  rate: number;
  deduction: number;
}

type RateLabel = '1%' | '20%' | '50%';

const INITIAL_STATE: CalculatorState = {
  subsidiaryStockPrice: '832,000,000',
  subsidiaryTotalShares: '1,904,167',
  parentOwnedShares: '77,200',
};

const RATE_LABELS: RateLabel[] = ['1%', '20%', '50%'];

const DIVIDEND_MAP: Record<RateLabel, number[]> = {
  '1%': [
    107_000_000, 215_000_000, 326_000_000, 443_000_000, 560_000_000,
    676_000_000, 793_000_000, 910_000_000, 1_026_000_000, 1_143_000_000,
  ],
  '20%': [
    127_000_000, 255_000_000, 383_000_000, 511_000_000, 539_000_000,
    767_000_000, 895_000_000, 1_023_000_000, 1_154_000_000, 1_286_000_000,
  ],
  '50%': [
    200_000_000, 400_000_000, 600_000_000, 800_000_000, 1_000_000_000,
    1_200_000_000, 1_400_000_000, 1_600_000_000, 1_800_000_000, 2_000_000_000,
  ],
};

const parseNumber = (value: string): number => {
  return parseFloat((value || '').replace(/[^0-9.-]/g, '')) || 0;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.floor(value).toLocaleString('ko-KR');
};

const getTaxBaseByRate = (dividend: number, rateLabel: RateLabel): number => {
  if (rateLabel === '20%') return dividend * 0.5;
  if (rateLabel === '1%') return dividend * 0.7;
  return 0;
};

const getTaxBracket = (income: number): TaxBracket => {
  if (income > 255_500_000) {
    return { rate: 0.19, deduction: 20_000_000 };
  }

  return { rate: 0.09, deduction: 0 };
};

const calculateCorporateTax = (dividend: number, rateLabel: RateLabel): number => {
  if (rateLabel === '50%') return 0;

  const taxBase: number = getTaxBaseByRate(dividend, rateLabel);
  const bracket: TaxBracket = getTaxBracket(taxBase);
  return Math.round((taxBase * bracket.rate - bracket.deduction) * 1.1);
};

const calculateRateScenario = (
  rateLabel: RateLabel,
  stockPrice: number,
  totalShares: number,
  parentOwnedShares: number,
): RateScenario => {
  const rows: DividendScenario[] = DIVIDEND_MAP[rateLabel].map((dividendIncome: number, index: number): DividendScenario => {
    const corporateTax: number = calculateCorporateTax(dividendIncome, rateLabel);
    const afterTaxReceipt: number = dividendIncome - corporateTax;
    const convertibleStockCount: number = stockPrice > 0 ? Math.floor(afterTaxReceipt / stockPrice) : 0;
    const shareRatio: string = totalShares > 0 ? `${((convertibleStockCount / totalShares) * 100).toFixed(1)}%` : '-';
    const acquisitionPeriod: string = parentOwnedShares > 0 && convertibleStockCount > 0 ? `${(parentOwnedShares / convertibleStockCount).toFixed(1)}년` : '-';

    return {
      shareholderCount: index + 1,
      dividendIncome,
      corporateTax,
      afterTaxReceipt,
      convertibleStockCount,
      shareRatio,
      acquisitionPeriod,
    };
  });

  return { rateLabel, rows };
};

export default function DifferentialDividendAfterTaxCalculator({ className = '' }: DifferentialDividendAfterTaxCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorState>(INITIAL_STATE);
  const [activeRate, setActiveRate] = useState<RateLabel>('20%');

  const scenarios: RateScenario[] = useMemo((): RateScenario[] => {
    const stockPrice: number = parseNumber(formData.subsidiaryStockPrice);
    const totalShares: number = parseNumber(formData.subsidiaryTotalShares);
    const parentOwnedShares: number = parseNumber(formData.parentOwnedShares);

    return RATE_LABELS.map((rateLabel: RateLabel): RateScenario => calculateRateScenario(rateLabel, stockPrice, totalShares, parentOwnedShares));
  }, [formData]);

  const activeScenario: RateScenario = scenarios.find((scenario: RateScenario): boolean => scenario.rateLabel === activeRate) || scenarios[0];
  const bestScenario: DividendScenario = activeScenario.rows.reduce((best: DividendScenario, current: DividendScenario): DividendScenario => {
    return current.convertibleStockCount > best.convertibleStockCount ? current : best;
  }, activeScenario.rows[0]);

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
                  <span>부법인 주가, 발행주식 총수, 부 보유주식 수를 입력하여 차등배당 후 세후수령액을 계산합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">2.</span>
                  <span>1%, 20%, 50% 지분율과 고정 배당 시나리오별 법인세 부담을 기본 산식 그대로 반영합니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">3.</span>
                  <span>세후수령액으로 매수 가능한 주식 수, 지분율, 부 보유주식 전량 매수에 필요한 기간을 산출합니다.</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                원본 calc802-2.js의 배당소득 배열, 과세대상 비율, 법인세 계산과 주식 수 환산 공식을 동일하게 적용했습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-2xl md:max-w-md mx-auto mt-8">
          {RATE_LABELS.map((rateLabel: RateLabel) => (
            <button
              key={rateLabel}
              type="button"
              onClick={(): void => setActiveRate(rateLabel)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeRate === rateLabel ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {rateLabel}
            </button>
          ))}
        </div>

        <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">기본 정보 입력</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">부법인 주식 기준값을 입력합니다.</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">구분</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">부법인 주가</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">부법인 주식 총수</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold">부 보유주식수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <tr className="hover:bg-blue-50/20 transition-colors">
                    <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">입력값</th>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.subsidiaryStockPrice}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('subsidiaryStockPrice', event.target.value)}
                      />
                    </td>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.subsidiaryTotalShares}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('subsidiaryTotalShares', event.target.value)}
                      />
                    </td>
                    <td className="p-0">
                      <input
                        type="text"
                        className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"
                        value={formData.parentOwnedShares}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('parentOwnedShares', event.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">{activeRate} 지분율 배당 효과 분석</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">특정법인 주주수별 결과입니다.</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-2xl bg-[#203578] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">최대 세후수령액</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(bestScenario.afterTaxReceipt)}</p>
              </div>
              <div className="rounded-2xl bg-[#2e7d32] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">최대 양수 가능 주식수</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">{formatNumber(bestScenario.convertibleStockCount)}</p>
              </div>
              <div className="rounded-2xl bg-[#1a1f27] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-white/70 mb-2">전량 매수 필요 기간</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-[#fab005]">{bestScenario.acquisitionPeriod}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                    <th className="p-3 md:p-4 w-[140px] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">분석 항목</th>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <th key={row.shareholderCount} className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold whitespace-nowrap">
                        {row.shareholderCount}명
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">배당소득</td>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(row.dividendIncome)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">법인세</td>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap text-red-500">{row.corporateTax > 0 ? formatNumber(row.corporateTax) : '-'}</td>
                    ))}
                  </tr>
                  <tr className="bg-[#203578]/5 text-[#203578]">
                    <td className="p-3 md:p-4 border-r border-gray-100 sticky left-0 bg-[#203578]/5 z-10 font-black">세후수령액</td>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black">{formatNumber(row.afterTaxReceipt)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-bold">주식 수 환산</td>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap text-[#4e5968]">{formatNumber(row.convertibleStockCount)}</td>
                    ))}
                  </tr>
                  <tr className="bg-[#2e7d32]/5 text-[#2e7d32]">
                    <td className="p-3 md:p-4 border-r border-gray-100 sticky left-0 bg-[#2e7d32]/5 z-10 font-black">지분율</td>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black">{row.shareRatio}</td>
                    ))}
                  </tr>
                  <tr className="bg-[#1a1f27] text-white">
                    <td className="p-3 md:p-4 border-r border-white/10 sticky left-0 bg-[#1a1f27] z-10 font-black">전량 매수 기간</td>
                    {activeScenario.rows.map((row: DividendScenario) => (
                      <td key={row.shareholderCount} className="p-3 md:p-4 text-right whitespace-nowrap font-black text-[#fab005]">{row.acquisitionPeriod}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">지분율별 요약</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">지분율</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">최대 배당소득</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">최대 세후수령액</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">최대 양수 가능 주식수</th>
                    <th className="p-3 md:p-4 text-right text-[10px] md:text-[11px] font-bold">최종 기간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {scenarios.map((scenario: RateScenario) => {
                    const lastRow: DividendScenario = scenario.rows[scenario.rows.length - 1];

                    return (
                      <tr key={scenario.rateLabel} className="hover:bg-blue-50/20 transition-colors">
                        <td className="p-3 md:p-4 text-left font-black text-[#203578] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">{scenario.rateLabel}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#4e5968]">{formatNumber(lastRow.dividendIncome)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-black text-[#203578]">{formatNumber(lastRow.afterTaxReceipt)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-bold text-[#2e7d32]">{formatNumber(lastRow.convertibleStockCount)}</td>
                        <td className="p-3 md:p-4 text-right whitespace-nowrap font-black text-[#1a1f27]">{lastRow.acquisitionPeriod}</td>
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
            <h5 className="font-black text-[#1a1f27] mb-1">배당 시나리오</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">주주수별 배당세와 세후수령액을 한 번에 비교합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">매수 기간</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">부 보유주식 전량 매수까지 필요한 기간을 산출합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#fab005]/10 flex items-center justify-center text-[#fab005]">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-black text-[#1a1f27] mb-1">세무 부담</h5>
            <p className="text-xs text-[#4e5968] leading-relaxed">차등배당 실행 시 세무 리스크를 검토할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
