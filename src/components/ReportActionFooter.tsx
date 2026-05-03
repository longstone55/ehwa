'use client';

import React from 'react';
import { Clock, Eye, FileDown, Phone, Printer, Sparkles } from 'lucide-react';

export default function ReportActionFooter() {
  return (
    <div className="p-8 bg-[#f8f9fa] border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h4 className="text-xl font-black text-[#203578]">분석 보고서 활용</h4>
          <p className="text-sm text-gray-500 mt-1">시뮬레이션 결과를 다양한 방식으로 확인하고 저장할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <FileDown className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">PDF 다운로드</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Eye className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">PDF 보기</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors">
              <Printer className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">인쇄</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-3 p-5 md:p-6 bg-[#203578] rounded-2xl border border-[#203578] shadow-sm md:shadow-md hover:bg-[#1a2b61] transition-all group text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-center">AI 종합분석보고서</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#203578] flex items-center justify-center text-white font-black text-xs">이화</div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#1a1f27]">세무법인 이화 (TAXSACOM)</p>
              <p className="text-[11px] text-gray-400">서울특별시 강남구 논현로 86길 21, 1층·3층</p>
            </div>
          </div>
          <div className="flex gap-6 text-[12px] text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>02-6959-0621</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>평일 10:00 ~ 18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
