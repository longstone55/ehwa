'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-20 md:px-20 border-t border-gray-100 text-[#4e5968] bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        <div className="col-span-1 md:col-span-2">
          <div className="text-2xl font-black text-[#1a1f27] mb-8">세무법인이화</div>
          <p className="mb-6 text-[15px] leading-loose font-medium text-[#4e5968]">
            세무법인이화 | 사업자등록번호: 000-00-00000<br />
            본사: 서울특별시 강남구 테헤란로 (전문가 빌딩 15층)<br />
            대표전화: 02-123-4567 | 팩스: 02-123-4568
          </p>
          <p className="text-xs text-gray-400">
            © 2024 TAXSACOM by EHWATAX Tax Corporation. All rights reserved.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-[#1a1f27] mb-8 text-[16px]">전문 서비스</h5>
          <ul className="space-y-4 text-sm font-medium">
            <li className="hover:text-primary cursor-pointer transition-colors">정기 세무 기장</li>
            <li className="hover:text-primary cursor-pointer transition-colors">상속 및 증여 플래닝</li>
            <li className="hover:text-primary cursor-pointer transition-colors">조세 불복 및 심판 청구</li>
            <li className="hover:text-primary cursor-pointer transition-colors">법인 설립 및 전환</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-[#1a1f27] mb-8 text-[16px]">퀵 링크</h5>
          <ul className="space-y-4 text-sm font-extrabold text-primary">
            <li className="hover:underline cursor-pointer"><Link href="/simple-calculator">간편 세금 계산기</Link></li>
            <li className="hover:underline cursor-pointer"><Link href="/calculator">전문 세금 계산기</Link></li>
            <li className="hover:underline cursor-pointer"><Link href="/pro-calculator">심화 시뮬레이션</Link></li>
            <li className="hover:underline cursor-pointer">세미나 신청</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
