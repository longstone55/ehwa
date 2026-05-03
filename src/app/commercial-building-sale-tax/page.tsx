import CalculatorTabs from '@/components/CalculatorTabs';
import CommercialBuildingSaleTaxCalculator from '@/components/CommercialBuildingSaleTaxCalculator';

export default function CommercialBuildingSaleTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CalculatorTabs />

          <header className="mb-8 text-center md:mb-12 md:text-left">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              부동산 양도소득세 계산(주택외)
            </h1>
            <p className="text-base md:text-lg text-[#4e5968] font-medium leading-relaxed">
              주택 외 부동산 양도 및 취득가액, 양도가액, 필요경비를 기준으로 양도소득세를 계산합니다.
            </p>
          </header>

          <CommercialBuildingSaleTaxCalculator />
        </div>
      </main>
    </div>
  );
}


