import BusinessRentalIncomeTaxCalculator from '@/components/BusinessRentalIncomeTaxCalculator';

export default function BusinessRentalIncomeTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              사업소득·임대소득 세금 비교
            </h1>
            <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
              개인 대표의 사업소득과 임대소득 조합에 따른 세금, 준조세, 세후 수령액을 CASE별로 비교합니다.
            </p>
          </header>
          <BusinessRentalIncomeTaxCalculator />
        </div>
      </main>
    </div>
  );
}
