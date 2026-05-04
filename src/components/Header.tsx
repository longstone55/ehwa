'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "서비스", href: "/#services" },
    { name: "세미나", href: "/#seminar" },
    { name: "간편 계산기", href: "/simple-calculator" },
    { name: "AI 서비스", href: "/ai" },
  ];

  const calculatorLinks = [
    { name: "전문 계산기", href: "/calculator" },
    { name: "사업·임대 세금비교", href: "/business-rental-income-tax" },
    { name: "법인·임대 세금비교", href: "/corporate-salary-rental-income-tax" },
    { name: "특정법인 증여의제", href: "/specific-corporation-gift-tax" },
    { name: "차등배당 세후수령", href: "/differential-dividend-after-tax" },
    { name: "특정법인 증여와 법인세", href: "/specific-corporation-gift-corporate-tax" },
    { name: "토지 무상사용 적정임대료", href: "/land-free-use-rent" },
    { name: "법인전환 양도·취득세", href: "/corporate-conversion-transfer-tax" },
    { name: "부동산 양도소득세(주택외)", href: "/commercial-building-sale-tax" },
    { name: "주택 취득세 계산기", href: "/home-acquisition-tax" },
    { name: "상속세 미래 예측", href: "/inheritance-tax-forecast" },
    { name: "증여세 다중 수증자", href: "/multi-donee-gift-tax" },
    { name: "주식양도소득세 계산기", href: "/stock-transfer-income-tax" },
    { name: "주식양수도 케이스별 세금", href: "/stock-transfer-case-tax" },
    { name: "자녀법인 차등배당", href: "/child-corporation-differential-dividend" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-md border-b border-gray-50 shadow-sm py-0" 
            : "bg-transparent border-transparent py-2"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-20 md:py-4 max-w-[1920px] mx-auto">
          
          {/* 모바일: 햄버거 메뉴 (왼쪽) */}
          <div className="flex flex-1 items-center md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-[#4e5968] hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* 로고: 명시적 크기 지정으로 확대 해결 */}
          <div className="flex flex-1 justify-center md:justify-start">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo4.png" 
                alt="세무법인이화 로고" 
                width={280}
                height={70}
                className="w-[120px] h-auto md:w-[120px] md:h-auto object-contain"
                priority
              />
            </Link>
          </div>


          {/* 데스크탑 전용 메뉴 (중앙) */}
          <div className="hidden md:flex space-x-10 text-[16px] font-bold text-[#4e5968]">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
                aria-expanded={isCalculatorOpen}
              >
                계산기
                <ChevronDown className={`w-4 h-4 transition-transform ${isCalculatorOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl transition-all ${
                  isCalculatorOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                }`}
              >
                {calculatorLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsCalculatorOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-[#4e5968] hover:bg-gray-50 hover:text-primary transition-all"
                  >
                    {link.name}
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 로그인 버튼 (오른쪽) */}
          <div className="flex flex-1 justify-end items-center">
            <button className="px-4 py-2 md:px-6 md:py-2.5 bg-[#f2f4f6] text-[#4e5968] rounded-xl text-xs md:text-sm font-bold hover:bg-[#e5e8eb] transition-all">
              로그인
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 사이드바 메뉴 */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      >
        <div 
          className={`absolute top-0 left-0 bottom-0 flex h-dvh w-[280px] flex-col overflow-hidden bg-white p-6 shadow-2xl transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex shrink-0 items-center justify-between">
            <span className="text-lg font-black text-primary">세무법인이화</span>
            <button onClick={toggleMenu} className="p-2 text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-6 pr-1 scrollbar-hide">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={toggleMenu}
                className="flex items-center justify-between p-4 rounded-2xl text-[17px] font-bold text-[#1a1f27] hover:bg-gray-50 active:bg-gray-100 transition-all"
              >
                {link.name}
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </Link>
            ))}
            <div className="rounded-2xl bg-gray-50 p-2">
              <div className="px-3 py-2 text-[13px] font-black text-[#203578]">계산기</div>
              {calculatorLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleMenu}
                  className="flex items-center justify-between p-3 rounded-xl text-[15px] font-bold text-[#1a1f27] hover:bg-white active:bg-gray-100 transition-all"
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </Link>
              ))}
            </div>
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={toggleMenu}
                className="flex items-center justify-between p-4 rounded-2xl text-[17px] font-bold text-[#1a1f27] hover:bg-gray-50 active:bg-gray-100 transition-all"
              >
                {link.name}
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </Link>
            ))}
          </div>

          <div className="shrink-0 border-t border-gray-100 pt-4">
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">
              상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
