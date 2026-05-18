import SimpleCalculator from "@/components/SimpleCalculator";

export default function SimpleCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 pb-16 pt-24 md:px-6 md:pb-20 md:pt-32">
      <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
        <h1 className="mb-4 text-2xl font-black leading-tight tracking-tight text-[#1a1f27] md:text-5xl">
          간편 세금 계산기
        </h1>
        <p className="text-base font-medium text-[#4e5968] md:text-lg">
          자주 쓰는 계산식의 핵심 입력값만 넣어 예상 세액을 빠르게 확인하세요.
        </p>
      </div>

      <SimpleCalculator />
    </div>
  );
}
