'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "서비스", href: "/#services" },
    { name: "세미나", href: "/#seminar" },
    { name: "간편 계산기", href: "/simple-calculator" },
    { name: "전문 계산기", href: "/calculator" },
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
            {navLinks.map((link) => (
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
          className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out p-6 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="text-lg font-black text-primary">세무법인이화</span>
            <button onClick={toggleMenu} className="p-2 text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            {navLinks.map((link) => (
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

          <div className="absolute bottom-10 left-6 right-6">
            <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">
              상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
