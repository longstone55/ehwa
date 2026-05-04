'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const calculatorGroups = [
  {
    title: "1. 개인사업자 소득구성과 조세효과",
    shortTitle: "1. 개인사업자",
    items: [
      { title: "1-1. 개인사업자 소득구성과 조세효과", href: "/calculator" },
    ],
  },
  {
    title: "2. 법인사업자 소득구성과 조세효과",
    shortTitle: "2. 법인사업자",
    items: [
      { title: "2-1. 개인 대표 사업소득+임대소득 세금 비교", href: "/business-rental-income-tax" },
      { title: "2-2. 법인 대표 근로소득+임대소득 세금 비교", href: "/corporate-salary-rental-income-tax" },
    ],
  },
  {
    title: "3. 법인주주 증여와 법인세",
    shortTitle: "3. 법인주주",
    items: [
      { title: "3-1. 특정법인 증여세제", href: "/specific-corporation-gift-tax" },
      { title: "3-2. 법인주주 차등배당과 세후수령액", href: "/differential-dividend-after-tax" },
      { title: "3-3. 특정법인 증여와 법인세", href: "/specific-corporation-gift-corporate-tax" },
    ],
  },
  {
    title: "4. 부의 토지사용 적정임대료",
    shortTitle: "4. 토지사용",
    items: [
      { title: "4-1. 아버지 토지 사용에 대한 적정임대료", href: "/land-free-use-rent" },
    ],
  },
  {
    title: "5. 법인전환과 양도세·취득세·주가 변동계산",
    shortTitle: "5. 법인전환",
    items: [
      { title: "5-1. 법인전환 양도소득세·취득세 계산", href: "/corporate-conversion-transfer-tax" },
      { title: "5-2. 부동산 양도소득세 계산(주택 외)", href: "/commercial-building-sale-tax" },
      { title: "5-3. 주택 취득세 계산", href: "/home-acquisition-tax" },
    ],
  },
  {
    title: "6. 상속세·증여세·주식양도소득세",
    shortTitle: "6. 상속/증여/주식",
    items: [
      { title: "6-1. 상속세 계산", href: "/inheritance-tax-forecast" },
      { title: "6-2. 증여세 계산", href: "/multi-donee-gift-tax" },
      { title: "6-3. 주식양도소득세 계산", href: "/stock-transfer-income-tax" },
      { title: "6-4. 주식양수도 케이스별 세금", href: "/stock-transfer-case-tax" },
    ],
  },
  {
    title: "7. 자녀법인 차등배당",
    shortTitle: "7. 자녀법인",
    items: [
      { title: "7-1. 자녀법인 차등배당", href: "/child-corporation-differential-dividend" },
    ],
  },
];

export default function CalculatorTabs() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeGroup = calculatorGroups.find((group) =>
    group.items.some((item) => item.href === pathname)
  ) ?? calculatorGroups[0];

  return (
    <nav
      className="mb-8 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:mb-10 md:rounded-[32px] md:p-4 md:shadow-xl"
      aria-label="계산기 메뉴"
    >
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3.5 text-left"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="min-w-0">
            <span className="block text-[12px] font-bold text-gray-500">계산기 카테고리</span>
            <span className="mt-0.5 block truncate text-[16px] font-black text-[#203578]">
              {activeGroup.shortTitle}
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-[#203578] transition-transform ${
              isMobileMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
            {calculatorGroups.map((group) => {
              const isActive = group === activeGroup;

              return (
                <Link
                  key={group.title}
                  href={group.items[0].href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#203578] text-white"
                      : "bg-white text-[#4e5968] hover:text-[#203578]"
                  }`}
                >
                  {group.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto scrollbar-hide md:block">
        <div className="flex min-w-max gap-1 rounded-2xl bg-gray-100 p-1">
          {calculatorGroups.map((group) => {
            const isActive = group === activeGroup;

            return (
              <Link
                key={group.title}
                href={group.items[0].href}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-[#203578] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {group.shortTitle}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-3 overflow-x-auto scrollbar-hide md:mt-4">
        <div className="flex min-w-max gap-2 md:min-w-0 md:flex-wrap">
          {activeGroup.items.map((item) => {
            const isActive = item.href === pathname;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "border-[#203578] bg-white text-[#203578] shadow-sm"
                    : "border-gray-100 bg-white text-[#4e5968] hover:border-[#203578] hover:text-[#203578]"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
