import SimpleCalculator from "@/components/SimpleCalculator";

export default function SimpleCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight text-[#1a1f27]">
          간편 세금 계산기
        </h1>
        <p className="text-base md:text-lg text-[#4e5968] font-medium">
          필수 항목만 입력하여 양도소득세를 빠르게 확인해보세요.
        </p>
      </div>
      
      <SimpleCalculator />
    </div>
  );
}
