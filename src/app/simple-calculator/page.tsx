import SimpleCalculator from "@/components/SimpleCalculator";

export default function SimpleCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-[#1a1f27]">
          간편 세금 계산기
        </h1>
        <p className="text-lg text-[#4e5968] font-medium">
          필수 항목만 입력하여 양도소득세를 빠르게 확인해보세요.
        </p>
      </div>
      
      <SimpleCalculator />
    </div>
  );
}
