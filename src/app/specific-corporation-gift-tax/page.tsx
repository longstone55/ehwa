import CalculatorTabs from '@/components/CalculatorTabs';
import SpecificCorporationGiftCalculator from '@/components/SpecificCorporationGiftCalculator';

export default function SpecificCorporationGiftTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CalculatorTabs />

          <header className="mb-8 text-center md:mb-12 md:text-left">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              특정법인 증여의제 계산
            </h1>
            <p className="text-base md:text-lg text-[#4e5968] font-medium leading-relaxed">
              특정법인과의 거래로 발생하는 간접 이익, 법인세 상당액, 증여세 한도액을 계산하여 증여의제 여부와 납부세액을 확인합니다.
            </p>
          </header>
          <SpecificCorporationGiftCalculator />
        </div>
      </main>
    </div>
  );
}
