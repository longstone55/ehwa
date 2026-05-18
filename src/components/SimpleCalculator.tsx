'use client';

import { useMemo, useState } from 'react';
import { Building2, Calculator, Coins, Home, ReceiptText, RefreshCcw } from 'lucide-react';

type CalculatorType = 'homeAcquisition' | 'transferTax' | 'giftTax' | 'incomeTax';

interface TaxBracket {
  base: number;
  rate: number;
  deduction: number;
}

interface BaseBracket {
  base: number;
}

const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { base: 0, rate: 0.06, deduction: 0 },
  { base: 14_000_000, rate: 0.15, deduction: 1_260_000 },
  { base: 50_000_000, rate: 0.24, deduction: 5_760_000 },
  { base: 88_000_000, rate: 0.35, deduction: 15_440_000 },
  { base: 150_000_000, rate: 0.38, deduction: 19_940_000 },
  { base: 300_000_000, rate: 0.4, deduction: 25_940_000 },
  { base: 500_000_000, rate: 0.42, deduction: 35_940_000 },
  { base: 1_000_000_000, rate: 0.45, deduction: 65_940_000 },
];

const TRANSFER_TAX_BRACKETS = [
  { base: 0, deduction: 0, business: 0.06, nonBusiness: 0.16 },
  { base: 12_000_000, deduction: 1_080_000, business: 0.15, nonBusiness: 0.25 },
  { base: 46_000_000, deduction: 5_220_000, business: 0.24, nonBusiness: 0.34 },
  { base: 88_000_000, deduction: 14_900_000, business: 0.35, nonBusiness: 0.45 },
  { base: 150_000_000, deduction: 19_400_000, business: 0.38, nonBusiness: 0.48 },
  { base: 300_000_000, deduction: 25_400_000, business: 0.4, nonBusiness: 0.5 },
  { base: 500_000_000, deduction: 35_400_000, business: 0.42, nonBusiness: 0.52 },
  { base: 1_000_000_000, deduction: 65_400_000, business: 0.45, nonBusiness: 0.55 },
];

const HOLDING_DEDUCTION_RATES = [
  { years: 0, rate: 0 },
  { years: 3, rate: 0.06 },
  { years: 4, rate: 0.08 },
  { years: 5, rate: 0.1 },
  { years: 6, rate: 0.12 },
  { years: 7, rate: 0.14 },
  { years: 8, rate: 0.16 },
  { years: 9, rate: 0.18 },
  { years: 10, rate: 0.2 },
  { years: 11, rate: 0.22 },
  { years: 12, rate: 0.24 },
  { years: 13, rate: 0.26 },
  { years: 14, rate: 0.28 },
  { years: 15, rate: 0.3 },
];

const RELATION_EXEMPTIONS = [
  { label: '배우자', value: 600_000_000 },
  { label: '직계비속(성년)', value: 50_000_000 },
  { label: '직계비속(미성년)', value: 20_000_000 },
  { label: '직계존속', value: 50_000_000 },
  { label: '기타 친족', value: 10_000_000 },
  { label: '기타', value: 0 },
];

const TABS: Array<{ id: CalculatorType; label: string; icon: typeof Home }> = [
  { id: 'homeAcquisition', label: '주택 취득세', icon: Home },
  { id: 'transferTax', label: '부동산 양도세', icon: Building2 },
  { id: 'giftTax', label: '증여세', icon: Coins },
  { id: 'incomeTax', label: '종합소득세', icon: ReceiptText },
];

const parseNumber = (value: string): number => Number(value.replace(/[^\d.-]/g, '')) || 0;

const formatMoneyInput = (value: string): string => {
  const numeric = value.replace(/[^0-9]/g, '');
  return numeric ? Number(numeric).toLocaleString('ko-KR') : '';
};

const formatPlainInput = (value: string): string => value.replace(/[^0-9.]/g, '');

const formatWon = (value: number): string => `${Math.max(0, Math.round(value)).toLocaleString('ko-KR')}원`;

const formatRate = (value: number): string => `${(value * 100).toFixed(value * 100 % 1 === 0 ? 0 : 2)}%`;

const getBracket = <T extends BaseBracket>(amount: number, brackets: T[]): T => {
  let selected = brackets[0];
  for (const bracket of brackets) {
    if (amount >= bracket.base) selected = bracket;
  }
  return selected;
};

const getHoldingDeductionRate = (years: number): number => {
  let rate = 0;
  for (const row of HOLDING_DEDUCTION_RATES) {
    if (years >= row.years) rate = row.rate;
  }
  return rate;
};

const calculateGiftTax = (base: number): number => {
  if (base > 3_000_000_000) return base * 0.5 - 460_000_000;
  if (base > 1_000_000_000) return base * 0.4 - 160_000_000;
  if (base > 500_000_000) return base * 0.3 - 60_000_000;
  if (base > 100_000_000) return base * 0.2 - 10_000_000;
  return base * 0.1;
};

export default function SimpleCalculator() {
  const [active, setActive] = useState<CalculatorType>('homeAcquisition');
  const [homePrice, setHomePrice] = useState('700,000,000');
  const [homeArea, setHomeArea] = useState('84');
  const [salePrice, setSalePrice] = useState('1,000,000,000');
  const [acquisitionPrice, setAcquisitionPrice] = useState('600,000,000');
  const [necessaryCost, setNecessaryCost] = useState('20,000,000');
  const [holdingYears, setHoldingYears] = useState('5');
  const [businessUse, setBusinessUse] = useState('business');
  const [giftAmount, setGiftAmount] = useState('200,000,000');
  const [giftExemption, setGiftExemption] = useState(String(50_000_000));
  const [incomeAmount, setIncomeAmount] = useState('120,000,000');
  const [incomeDeduction, setIncomeDeduction] = useState('1,500,000');

  const homeResult = useMemo(() => {
    const price = parseNumber(homePrice);
    const area = parseNumber(homeArea);
    const acquisitionRate = price > 900_000_000 ? 0.03 : price > 600_000_000 ? (price / 100_000_000 * (2 / 3) - 3) / 100 : 0.01;
    const educationRate = acquisitionRate * 0.1;
    const ruralRate = area > 85 ? 0.002 : 0;
    const totalRate = acquisitionRate + educationRate + ruralRate;

    return {
      title: '예상 취득세 합계',
      amount: price * totalRate,
      rows: [
        ['취득세율', formatRate(acquisitionRate)],
        ['지방교육세율', formatRate(educationRate)],
        ['농어촌특별세율', ruralRate ? formatRate(ruralRate) : '-'],
        ['합계 세율', formatRate(totalRate)],
      ],
    };
  }, [homeArea, homePrice]);

  const transferResult = useMemo(() => {
    const gain = parseNumber(salePrice) - parseNumber(acquisitionPrice) - parseNumber(necessaryCost);
    const holdingRate = getHoldingDeductionRate(parseNumber(holdingYears));
    const specialDeduction = Math.max(0, gain * holdingRate);
    const taxBase = Math.max(0, gain - specialDeduction - 2_500_000);
    const bracket = getBracket(taxBase, TRANSFER_TAX_BRACKETS);
    const rate = businessUse === 'business' ? bracket.business : bracket.nonBusiness;
    const incomeTax = Math.max(0, taxBase * rate - bracket.deduction);
    const localTax = incomeTax * 0.1;

    return {
      title: '예상 양도소득세 합계',
      amount: incomeTax + localTax,
      rows: [
        ['양도차익', formatWon(gain)],
        ['장기보유공제', `${formatWon(specialDeduction)} (${formatRate(holdingRate)})`],
        ['과세표준', formatWon(taxBase)],
        ['적용세율', formatRate(rate)],
        ['지방소득세', formatWon(localTax)],
      ],
    };
  }, [acquisitionPrice, businessUse, holdingYears, necessaryCost, salePrice]);

  const giftResult = useMemo(() => {
    const value = parseNumber(giftAmount);
    const exemption = Number(giftExemption);
    const taxBase = Math.max(0, value - exemption);
    const calculatedTax = Math.max(0, calculateGiftTax(taxBase));
    const reportDeduction = calculatedTax * 0.03;

    return {
      title: '예상 증여세 신고세액',
      amount: calculatedTax - reportDeduction,
      rows: [
        ['증여재산가액', formatWon(value)],
        ['증여재산공제', formatWon(exemption)],
        ['과세표준', formatWon(taxBase)],
        ['산출세액', formatWon(calculatedTax)],
        ['신고세액공제 3%', formatWon(reportDeduction)],
      ],
    };
  }, [giftAmount, giftExemption]);

  const incomeResult = useMemo(() => {
    const totalIncome = parseNumber(incomeAmount);
    const deduction = parseNumber(incomeDeduction);
    const taxBase = Math.max(0, totalIncome - deduction);
    const bracket = getBracket(taxBase, INCOME_TAX_BRACKETS);
    const incomeTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);
    const localTax = incomeTax * 0.1;

    return {
      title: '예상 종합소득세 합계',
      amount: incomeTax + localTax,
      rows: [
        ['종합소득금액', formatWon(totalIncome)],
        ['소득공제', formatWon(deduction)],
        ['과세표준', formatWon(taxBase)],
        ['적용세율', formatRate(bracket.rate)],
        ['지방소득세', formatWon(localTax)],
      ],
    };
  }, [incomeAmount, incomeDeduction]);

  const result = {
    homeAcquisition: homeResult,
    transferTax: transferResult,
    giftTax: giftResult,
    incomeTax: incomeResult,
  }[active];

  const reset = (): void => {
    setHomePrice('700,000,000');
    setHomeArea('84');
    setSalePrice('1,000,000,000');
    setAcquisitionPrice('600,000,000');
    setNecessaryCost('20,000,000');
    setHoldingYears('5');
    setBusinessUse('business');
    setGiftAmount('200,000,000');
    setGiftExemption(String(50_000_000));
    setIncomeAmount('120,000,000');
    setIncomeDeduction('1,500,000');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-gray-100 bg-white shadow-sm md:rounded-[28px] md:shadow-xl">
      <div className="border-b border-gray-100 p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3 text-xl font-black text-[#203578] md:text-2xl">
          <Calculator className="h-7 w-7" />
          간편 세금 계산기
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-black transition-all ${
                  active === tab.id ? 'bg-[#203578] text-white shadow-lg shadow-blue-900/10' : 'bg-[#f2f4f6] text-[#4e5968] hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 p-5 md:p-7">
          {active === 'homeAcquisition' && (
            <>
              <MoneyField label="주택 매입가격" value={homePrice} onChange={setHomePrice} />
              <TextField label="전용면적(㎡)" value={homeArea} onChange={setHomeArea} />
            </>
          )}

          {active === 'transferTax' && (
            <>
              <MoneyField label="양도가액" value={salePrice} onChange={setSalePrice} />
              <MoneyField label="취득가액" value={acquisitionPrice} onChange={setAcquisitionPrice} />
              <MoneyField label="필요경비" value={necessaryCost} onChange={setNecessaryCost} />
              <TextField label="보유기간(년)" value={holdingYears} onChange={setHoldingYears} />
              <SelectField label="부동산 구분" value={businessUse} onChange={setBusinessUse} options={[['business', '사업용'], ['nonBusiness', '비사업용']]} />
            </>
          )}

          {active === 'giftTax' && (
            <>
              <MoneyField label="증여재산가액" value={giftAmount} onChange={setGiftAmount} />
              <SelectField label="수증자 관계" value={giftExemption} onChange={setGiftExemption} options={RELATION_EXEMPTIONS.map((item) => [String(item.value), item.label])} />
            </>
          )}

          {active === 'incomeTax' && (
            <>
              <MoneyField label="종합소득금액" value={incomeAmount} onChange={setIncomeAmount} />
              <MoneyField label="소득공제" value={incomeDeduction} onChange={setIncomeDeduction} />
            </>
          )}

          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-black text-[#4e5968] hover:bg-gray-200">
            <RefreshCcw className="h-4 w-4" />
            기본값으로 다시 계산
          </button>
        </div>

        <div className="border-t border-gray-100 bg-[#f8fafc] p-5 md:border-l md:border-t-0 md:p-7">
          <div className="rounded-2xl bg-[#203578] p-5 text-white">
            <div className="text-sm font-bold text-white/70">{result.title}</div>
            <div className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{formatWon(result.amount)}</div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {result.rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0">
                <span className="text-sm font-bold text-[#4e5968]">{label}</span>
                <span className="text-right text-sm font-black text-[#1a1f27]">{value}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-xl bg-white p-4 text-xs font-medium leading-relaxed text-gray-500">
            간편 계산은 주요 산식만 반영한 참고용 결과입니다. 중과, 감면, 보유주택 수, 특수관계 거래, 신고기한 등 실제 신고에 필요한 예외는 전문 계산기 또는 상담으로 확인해야 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function MoneyField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#4e5968]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(formatMoneyInput(event.target.value))}
        inputMode="numeric"
        className="w-full rounded-2xl bg-[#f2f4f6] px-5 py-4 text-right text-lg font-black text-[#203578] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#203578]/20"
      />
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#4e5968]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(formatPlainInput(event.target.value))}
        inputMode="decimal"
        className="w-full rounded-2xl bg-[#f2f4f6] px-5 py-4 text-right text-lg font-black text-[#203578] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#203578]/20"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#4e5968]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl bg-[#f2f4f6] px-5 py-4 text-lg font-black text-[#203578] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#203578]/20"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
