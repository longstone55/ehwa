import DifferentialDividendAfterTaxCalculator from '@/components/DifferentialDividendAfterTaxCalculator';

export default function DifferentialDividendAfterTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              법인주주 차등배당 세후수령액 분석
            </h1>
            <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
              지분율별 차등배당 시나리오에 따른 법인세, 세후수령액, 주식 양수 가능 수량과 필요 기간을 비교합니다.
            </p>
          </header>
          <DifferentialDividendAfterTaxCalculator />
        </div>
      </main>
    </div>
  );
}
