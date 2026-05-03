import InheritanceTaxForecastCalculator from '@/components/InheritanceTaxForecastCalculator';
import CalculatorTabs from '@/components/CalculatorTabs';

export default function InheritanceTaxForecastPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CalculatorTabs />

          <header className="mb-8 text-center md:mb-12 md:text-left">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              상속세 미래 예측 계산기
            </h1>
            <p className="text-base md:text-lg text-[#4e5968] font-medium leading-relaxed">
              현재와 미래의 자산가치 변동을 반영해 상속세 부담과 세후 상속재산가액을 비교합니다.
            </p>
          </header>
          <InheritanceTaxForecastCalculator />
        </div>
      </main>
    </div>
  );
}


