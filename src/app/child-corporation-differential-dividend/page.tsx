import ChildCorporationDifferentialDividendCalculator from '@/components/ChildCorporationDifferentialDividendCalculator';
import CalculatorTabs from '@/components/CalculatorTabs';

export default function ChildCorporationDifferentialDividendPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CalculatorTabs />

          <header className="mb-8 text-center md:mb-12 md:text-left">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">자녀법인 차등배당 계산기</h1>
            <p className="text-base md:text-lg text-[#4e5968] font-medium leading-relaxed">
              부법인이 차등배당을 개인이 직접 받을 때와 자녀법인을 통해 받을 때의 법인세, 세후유입, 장기 주가 변화를 비교합니다.
            </p>
          </header>

          <ChildCorporationDifferentialDividendCalculator />
        </div>
      </main>
    </div>
  );
}


