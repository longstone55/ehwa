import CorporateSalaryRentalIncomeTaxCalculator from '@/components/CorporateSalaryRentalIncomeTaxCalculator';

export default function CorporateSalaryRentalIncomeTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              법인 대표 근로소득·임대소득 세금 비교
            </h1>
            <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
              법인 대표의 급여, 임대소득, 금융소득 조합에 따른 세금, 준조세, 법인 비용과 대외유출을 CASE별로 비교합니다.
            </p>
          </header>
          <CorporateSalaryRentalIncomeTaxCalculator />
        </div>
      </main>
    </div>
  );
}
