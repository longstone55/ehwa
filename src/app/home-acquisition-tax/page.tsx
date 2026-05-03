import HomeAcquisitionTaxCalculator from '@/components/HomeAcquisitionTaxCalculator';
import CalculatorTabs from '@/components/CalculatorTabs';

export default function HomeAcquisitionTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CalculatorTabs />

          <header className="mb-8 text-center md:mb-12 md:text-left">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              주택 취득세 스마트 계산기
            </h1>
            <p className="text-base md:text-lg text-[#4e5968] font-medium leading-relaxed">
              매입가격과 전용면적을 기준으로 주택 취득세, 지방교육세, 농어촌특별세를 자동 계산합니다.
            </p>
          </header>
          <HomeAcquisitionTaxCalculator />
        </div>
      </main>
    </div>
  );
}


