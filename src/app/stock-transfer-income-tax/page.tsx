import StockTransferIncomeTaxCalculator from '@/components/StockTransferIncomeTaxCalculator';
import CalculatorTabs from '@/components/CalculatorTabs';

export default function StockTransferIncomeTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CalculatorTabs />

          <header className="mb-8 text-center md:mb-12 md:text-left">
            <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              주식양도소득세 계산기
            </h1>
            <p className="text-base md:text-lg text-[#4e5968] font-medium leading-relaxed">
              주식 수, 취득가격, 양도가격을 기준으로 케이스별 양도소득세와 필요자금을 계산합니다.
            </p>
          </header>
          <StockTransferIncomeTaxCalculator />
        </div>
      </main>
    </div>
  );
}


