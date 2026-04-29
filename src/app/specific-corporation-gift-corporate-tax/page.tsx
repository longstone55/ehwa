import SpecificCorporationGiftCorporateTaxCalculator from '@/components/SpecificCorporationGiftCorporateTaxCalculator';

export default function SpecificCorporationGiftCorporateTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              특정법인 증여와 법인세
            </h1>
            <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
              특정법인에 증여재산이 이전되는 경우 부동산 지분율, 필요기간, 연차별 임대소득과 법인세를 비교합니다.
            </p>
          </header>
          <SpecificCorporationGiftCorporateTaxCalculator />
        </div>
      </main>
    </div>
  );
}
