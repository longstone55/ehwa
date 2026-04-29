'use client';

import Link from "next/link";
import TaxCalculator from "@/components/TaxCalculator";
import { ChevronRight } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CalculatorContent() {
  const searchParams = useSearchParams();
  const isContentOnly = searchParams.get('type') === 'content';

  return (
    <main className={`${isContentOnly ? 'pt-4' : 'pt-32'} pb-20 px-4 md:px-10 lg:px-20`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            개인사업자 소득구성과 조세효과
          </h1>
          <p className="text-lg text-[#4e5968] font-medium leading-relaxed">
            개인사업자의 소득 구성에 따른 세금 부담 효과를 분석한 자료입니다.<br className="hidden md:block" />
            사업소득과 임대소득의 조합에 따른 세금 및 준조세 부담률을 케이스별로 비교해 보세요.
          </p>
        </header>

        <TaxCalculator />

        {!isContentOnly && (
          <div className="mt-20 text-center">
            <p className="text-[#4e5968] mb-6 font-bold text-lg">더 자세한 분석이나 절세 전략이 필요하신가요?</p>
            <Link href="/#contact" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl text-xl font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20">
              세무 전문가에게 1:1 상담 신청하기
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading...</div>}>
        <CalculatorContent />
      </Suspense>
    </div>
  );
}
