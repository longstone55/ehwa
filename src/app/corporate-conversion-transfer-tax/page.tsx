import CorporateConversionTransferTaxCalculator from '@/components/CorporateConversionTransferTaxCalculator';

export default function CorporateConversionTransferTaxPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              법인전환 양도소득세·취득세 계산
            </h1>
            <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
              부동산 법인전환 시 양도소득세, 이월과세 차감 후 순자산가액, 주가 변동과 취득 관련 세금을 비교합니다.
            </p>
          </header>
          <CorporateConversionTransferTaxCalculator />
        </div>
      </main>
    </div>
  );
}
