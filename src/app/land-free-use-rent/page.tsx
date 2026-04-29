import LandFreeUseRentCalculator from '@/components/LandFreeUseRentCalculator';

export default function LandFreeUseRentPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              토지 무상사용 적정임대료 계산
            </h1>
            <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
              부동산 기준시가와 감정평가액을 바탕으로 적정임대료, 무상사용이익, 증여의제 여부를 계산합니다.
            </p>
          </header>
          <LandFreeUseRentCalculator />
        </div>
      </main>
    </div>
  );
}
