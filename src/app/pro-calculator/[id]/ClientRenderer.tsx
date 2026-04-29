'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Phone, Clock, FileDown, Eye, Printer, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import TaxCalculator from '@/components/TaxCalculator';

interface ClientRendererProps {
  title: string;
  description: string;
  html: string;
  scriptUrls: string[];
  inlineScripts: string[];
  inlineStyles: string[];
  id: string;
  isContentOnly?: boolean;
  useReactCalculator?: boolean;
}

const CATEGORIES = [
  {
    id: '801',
    title: '소득 및 조세',
    items: [
      { id: '801-1', title: '사업/임대소득 비교' },
      { id: '801-2', title: '법인 대표 소득 구성' },
      { id: '801-3', title: '최적 포트폴리오 분석' },
    ]
  },
  {
    id: '802',
    title: '법인 및 배당',
    items: [
      { id: '802-1', title: '법인 간 거래 리스크' },
      { id: '802-2', title: '차등배당 실익 분석' },
      { id: '802-3', title: '특정법인 증여 진단' },
    ]
  },
  {
    id: '803',
    title: '토지 및 과세',
    items: [
      { id: '803-1', title: '토지 무상사용 분석' },
      { id: '803-2', title: '증여 후 법인세 분석' },
      { id: '803-3', title: '배당소득 이중과세' },
    ]
  },
  {
    id: '804',
    title: '부동산 매각/취득',
    items: [
      { id: '804-1', title: '법인 부동산 증여' },
      { id: '804-2', title: '상가·빌딩 매각 세부담' },
      { id: '804-3', title: '주택 취득세 계산기' },
    ]
  },
  {
    id: '805',
    title: '상속·증여/주식',
    items: [
      { id: '805-1', title: '상속세 미래 예측' },
      { id: '805-2', title: '증여세 통합 분석' },
      { id: '805-3', title: '비상장주식 양도세' },
      { id: '805-4', title: '주식 이동 리스크' },
    ]
  },
  {
    id: '806',
    title: '가업승계/자산',
    items: [
      { id: '806-1', title: '가업 승계 로드맵' },
      { id: '806-2', title: '승계 후 법인세 분석' },
      { id: '806-3', title: '이중과세 정밀 분석' },
      { id: '806-4', title: '상증법 보충적 평가' },
    ]
  }
];

export default function ClientRenderer({ 
  title, 
  description, 
  html, 
  scriptUrls, 
  inlineScripts, 
  inlineStyles, 
  id, 
  isContentOnly,
  useReactCalculator
}: ClientRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Find current category and tools
  const currentCategoryId = id.split('-')[0];
  const currentCategory = CATEGORIES.find(c => c.id === currentCategoryId) || CATEGORIES[0];
  
  useEffect(() => {
    // ... (existing switchCase logic)
    // 1. Define a robust global switchCase function that works with all sub-html structures
    (window as any).switchCase = (caseNum: number) => {
      // Update Tab Buttons
      document.querySelectorAll('.segmented-item button').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === caseNum - 1);
      });

      // Update Table Columns
      document.querySelectorAll('.case-col').forEach((col: any) => {
        if (col.classList.contains(`case-${caseNum}`)) {
          col.style.display = 'table-cell';
          col.classList.add('active');
        } else {
          col.style.display = 'none';
          col.classList.remove('active');
        }
      });

      // Update Glider if exists
      const glider = document.getElementById('caseGlider');
      if (glider) {
        glider.style.transform = `translateX(${(caseNum - 1) * 100}%)`;
      }

      // Trigger calculation logic if it exists in the external script (e.g., calc801-1.js)
      if (typeof (window as any).updateResult === 'function') {
        (window as any).updateResult();
      }
    };

    // 2. Re-initialize icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [html]);

  return (
    <div className={`w-full ${isContentOnly ? 'p-0 bg-white' : 'min-h-screen bg-[#f9fafb] pt-24 pb-20 px-4 md:px-10 lg:px-20'}`}>
      <div className="max-w-7xl mx-auto">
        
        {!isContentOnly && (
          <>
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-[#1a1f27]" dangerouslySetInnerHTML={{ __html: title }} />
              <p className="text-lg text-[#4e5968] font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
            </header>

            {/* --- Professional Navigation System --- */}
            <nav className="mb-10 space-y-4 no-print">
              {/* 1. Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/pro-calculator/${cat.items[0].id}`}
                    className={`px-5 py-3 rounded-t-2xl text-sm font-bold transition-all whitespace-nowrap ${
                      currentCategoryId === cat.id 
                      ? 'bg-white border-x border-t border-gray-200 text-[#203578] -mb-px relative z-10' 
                      : 'text-gray-400 hover:text-[#203578]'
                    }`}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>

              {/* 2. Tool Sub-tabs (Current Category) */}
              <div className="flex flex-wrap gap-2">
                {currentCategory.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/pro-calculator/${item.id}`}
                    className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${
                      id === item.id
                      ? 'bg-[#203578] border-[#203578] text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#203578] hover:text-[#203578]'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          </>
        )}

        {/* --- Unified Calculator Layout --- */}
        {useReactCalculator ? (
          <TaxCalculator />
        ) : (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden">
            {/* 1. Instruction Header (Navy) - Exact Match with TaxCalculator.tsx */}
            <div className="p-8 border-b border-gray-100 bg-white">
              <div className="flex items-start gap-4 mb-2">
                <div className="space-y-3 w-full">
                  <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
                    <p className="flex gap-2">
                      <span className="font-bold text-[#203578] shrink-0">1.</span>
                      <span>대표의 소득 구성 및 상황에 맞추어 다양한 절세 시나리오를 시뮬레이션해 볼 수 있습니다.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold text-[#203578] shrink-0">2.</span>
                      <span>상황별 탭(CASE)을 전환하며 각각의 소득 조합에 따른 조세 효과를 비교해 보세요.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold text-[#203578] shrink-0">3.</span>
                      <span>파란색 배경의 입력창(셀)을 클릭하여 직접 숫자를 수정하면 실시간으로 분석 결과가 업데이트됩니다.</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="font-bold text-[#203578] shrink-0">4.</span>
                      <span>본 시뮬레이션은 세무법인 이화의 전문 정밀 로직을 바탕으로 산출된 결과입니다.</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-4">
                    ※ 시뮬레이션 결과는 가정에 따라 실제 세액과 일부 차이가 발생할 수 있습니다. 정확한 분석은 전문가 상담을 권장합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Main Content (Injected HTML) */}
            <div className="w-full p-0 md:p-8 space-y-8 md:space-y-12">
               <div 
                 ref={containerRef}
                 className="pro-content-area"
                 dangerouslySetInnerHTML={{ __html: html }} 
               />
            </div>

            {/* 3. Action Buttons Section */}
            <div className="p-8 bg-[#f8f9fa] border-t border-gray-100">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-black text-[#203578]">분석 보고서 활용</h4>
                  <p className="text-sm text-gray-500 mt-1">시뮬레이션 결과를 PDF로 저장하거나 즉시 인쇄할 수 있습니다.</p>
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

                  <button className="flex flex-col items-center justify-center gap-3 p-6 bg-[#203578] rounded-2xl border border-[#203578] shadow-lg hover:bg-[#1a2b61] transition-all group text-white">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-center">AI 종합분석보고서</span>
                  </button>
                </div>

                {/* Branding Footer */}
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
          </div>
        )}

        {!isContentOnly && (
          <div className="mt-20 text-center">
            <Link href="/#contact" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl text-xl font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/20">
              전문가에게 1:1 상담 신청하기
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>

      {/* --- External Scripts --- */}
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="afterInteractive" />
      <Script src="https://unpkg.com/lucide@latest" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="afterInteractive" />
      {scriptUrls.filter(url => url.includes('mixednuts')).map(url => (
        <Script 
          key={url} 
          src={url} 
          strategy="afterInteractive"
          onLoad={() => {
            inlineScripts.forEach(script => {
              try {
                const cleanScript = script.replace(/lucide\.createIcons\(\);/g, '');
                new Function(cleanScript)();
              } catch (e) {}
            });
            if ((window as any).lucide) (window as any).lucide.createIcons();
          }}
        />
      ))}

      {/* Render extracted inline styles */}
      {inlineStyles.map((style, idx) => (
        <style key={idx} dangerouslySetInnerHTML={{ __html: style }} />
      ))}

      <style jsx global>{`
        /* 1. Reset Internal HTML Wrapper (Strip redundant backgrounds) */
        .pro-content-area #calculator-wrap {
          background: transparent !important;
          min-height: auto !important;
          padding: 0 !important;
          font-family: inherit !important;
        }

        /* 2. Remove internal Navigation, and Footer from HTML (Hero is handled by page.tsx) */
        .pro-content-area .Hero,
        .pro-content-area .Hero-Section,
        .pro-content-area .relative.pt-20.pb-16,
        .pro-content-area .relative.pt-16.pb-12,
        .pro-content-area nav,
        .pro-content-area footer,
        .pro-content-area [class*="sub-800-nav"],
        .pro-content-area [class*="sub-800-footer"] {
          display: none !important;
        }

        /* 3. Strip internal card containers and padding to use the unified bg-white card */
        .pro-content-area #print_wrap,
        .pro-content-area #print_wrap > div,
        .pro-content-area .max-w-6xl,
        .pro-content-area .max-w-5xl,
        .pro-content-area .px-4.py-8,
        .pro-content-area .md\:py-20,
        .pro-content-area .bg-white.rounded-\[40px\],
        .pro-content-area div[class*="rounded-\[40px\]"] {
           background: transparent !important;
           border: none !important;
           box-shadow: none !important;
           padding: 0 !important;
           margin-top: 0 !important;
           margin-bottom: 0 !important;
           border-radius: 0 !important;
           max-width: none !important;
        }

        /* Input Grid Support (2-column layouts like 805-1) */
        .pro-content-area .grid.grid-cols-1.md\:grid-cols-2 {
          gap: 2rem !important;
          margin-bottom: 3rem !important;
          padding: 0 1rem !important;
        }
        @media (min-width: 768px) {
          .pro-content-area .grid.grid-cols-1.md\:grid-cols-2 {
            padding: 0 !important;
          }
        }
        .pro-content-area .space-y-4 > div {
          border-radius: 1rem !important;
        }

        /* Support for specific utility rows and indicators in 805-1 */
        .pro-content-area .bg-green-50, .pro-content-area .bg-blue-50 {
          border-radius: 9999px !important;
          padding: 0.25rem 0.75rem !important;
        }
        .pro-content-area .bg-\[\#1a1f27\] {
          background-color: #1a1f27 !important;
          color: white !important;
          border-radius: 1rem !important;
        }

        /* 806-1 Specific: Scenario Cards and Complex Grids */
        .pro-content-area .grid.grid-cols-1.md\:grid-cols-3 {
          gap: 1.5rem !important;
        }
        
        /* Scenario Comparison Cards */
        .pro-content-area .bg-\[\#1a1f27\].shadow-xl {
          background-color: #1a1f27 !important;
          color: white !important;
          border-radius: 2rem !important;
        }
        .pro-content-area .bg-white.border-gray-100.shadow-sm {
          border-radius: 2rem !important;
          border-color: #f3f4f6 !important;
        }
        .pro-content-area .bg-white\/5 {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-radius: 1rem !important;
        }
        
        /* Values in Cards */
        .pro-content-area #tax_corp3_1,
        .pro-content-area #sonCorpNetIncome_1 {
          font-weight: 900 !important;
          letter-spacing: -0.05em !important;
        }
        .pro-content-area #sonCorpNetIncome_1 {
          color: #fab005 !important;
        }

        /* Complex Double Header Tables */
        .pro-content-area thead tr:first-of-type th {
          background-color: #1a1f27 !important;
          color: white !important;
          border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .pro-content-area thead tr:last-of-type th {
          background-color: #f8f9fa !important;
          color: #8b95a1 !important;
          font-size: 9px !important;
          border-right: 1px solid #f3f4f6 !important;
        }
        
        /* Sticky Column Support for Table */
        .pro-content-area .sticky-left {
          position: sticky !important;
          left: 0 !important;
          z-index: 20 !important;
          background-color: inherit !important;
          box-shadow: 2px 0 5px rgba(0,0,0,0.02) !important;
        }

        /* Row Highlighting for Roadmap */
        .pro-content-area tr.bg-blue-50\/30 {
          background-color: #f0f7ff !important;
        }
        .pro-content-area tr.bg-gray-50\/30 {
          background-color: #f8fafc !important;
        }
        
        /* 803-1 Specific: Real Estate and Gift Risk Tables */
        .pro-content-area #realEstateTable,
        .pro-content-area #freeUseTable,
        .pro-content-area #freeUseTable2 {
          border-radius: 1.5rem !important;
          margin-bottom: 2rem !important;
        }
        
        /* Highlight Total Row for 803-1 */
        .pro-content-area #realEstateTotalRow {
          background-color: #1a1f27 !important;
          color: white !important;
        }
        .pro-content-area #realEstateTotalRow td {
          color: white !important;
          font-weight: 900 !important;
          border: none !important;
        }
        .pro-content-area #realEstateTotalRow .text-\[\#fab005\],
        .pro-content-area #realEstateTotalRow .text-\[\#22c55e\] {
          color: #fab005 !important;
        }

        /* Input specific to 803-1 tables */
        .pro-content-area #realEstateTable input {
          text-align: center !important;
          font-size: 0.95rem !important;
          padding: 0.5rem !important;
        }
        .pro-content-area .land-appraisal {
          text-decoration: none !important;
        }

        /* Bottom Result Grid (L/R) for 803-1 */
        .pro-content-area .grid.grid-cols-1.lg\:grid-cols-2 {
          gap: 2.5rem !important;
          margin-top: 3rem !important;
        }
        .pro-content-area #freeUseTable thead th,
        .pro-content-area #freeUseTable2 thead th {
          background-color: #f8f9fa !important;
          color: #8b95a1 !important;
        }

        /* 4. Exact Table Sync with TaxCalculator.tsx */
        .pro-content-area table {
          border-collapse: collapse !important;
          width: 100% !important;
          border: 1px solid #f3f4f6 !important;
          border-radius: 1rem !important;
          overflow: hidden !important;
        }
        
        /* 805-1 Specific: Current vs Future Table */
        .pro-content-area .elapsedYearsLabel {
          color: #fab005 !important;
          font-weight: 900 !important;
        }
        .pro-content-area #stockFutureValue, 
        .pro-content-area #realEstateFuture,
        .pro-content-area #taxTotal2,
        .pro-content-area #finalTaxPayment2 {
          font-weight: 900 !important;
          color: #203578 !important;
        }
        .pro-content-area #finalTaxPayment2 {
          color: #fab005 !important;
        }

        /* Row Specifics for 805-1 */
        .pro-content-area tr:has(#finalTaxPayment1),
        .pro-content-area tr:has(#finalTaxPayment2) {
          background-color: #1a1f27 !important;
          color: white !important;
        }
        .pro-content-area tr:has(#finalTaxPayment1) th,
        .pro-content-area tr:has(#finalTaxPayment1) td {
          color: white !important;
          border-bottom: none !important;
        }
        
        /* thead (bg-[#203578] or bg-[#1a1f27]) */
        .pro-content-area thead tr {
          background-color: #203578 !important; /* Business Income Section */
          color: white !important;
        }
        .pro-content-area section:last-of-type thead tr {
          background-color: #1a1f27 !important; /* Results Section */
        }
        .pro-content-area thead th {
          padding: 0.75rem !important; /* p-3 */
          font-size: 10px !important; /* text-[10px] */
          font-weight: 900 !important;
          border-right: 1px solid rgba(255,255,255,0.1) !important;
        }
        @media (min-width: 768px) {
          .pro-content-area thead th {
            padding: 1rem !important; /* p-4 */
            font-size: 11px !important; /* text-[11px] */
          }
        }

        /* tbody (bg-white based) */
        .pro-content-area tbody tr {
          background-color: white !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        .pro-content-area tbody tr:hover {
          background-color: rgba(240, 247, 255, 0.2) !important; /* hover:bg-blue-50/20 */
        }
        .pro-content-area tbody td, .pro-content-area tbody th {
          padding: 0.75rem !important; /* p-3 */
          font-size: 12px !important; /* text-[12px] */
        }
        @media (min-width: 768px) {
          .pro-content-area tbody td, .pro-content-area tbody th {
            padding: 1rem !important; /* p-4 */
            font-size: 13px !important; /* text-[13px] */
          }
        }

        /* Label Columns (bg-[#f8f9fa]) */
        .pro-content-area tbody th {
          background-color: #f8f9fa !important;
          color: #4e5968 !important;
          font-weight: 700 !important;
          text-align: left !important;
          border-right: 1px solid #f3f4f6 !important;
        }

        /* Input Unification (bg-blue-50/30) */
        .pro-content-area td:has(input) {
          background-color: rgba(219, 234, 254, 0.3) !important; /* bg-blue-50/30 */
          padding: 0 !important;
        }
        .pro-content-area input {
          width: 100% !important;
          background: transparent !important;
          border: none !important;
          text-align: right !important;
          font-weight: 900 !important;
          color: #203578 !important;
          padding: 0.75rem 1rem !important;
          outline: none !important;
        }

        /* Result Highlighting */
        .pro-content-area .bg-blue-50\/50, 
        .pro-content-area tr[class*="bg-blue-50"] {
          background-color: rgba(239, 246, 255, 0.5) !important;
          font-weight: 700 !important;
        }
        .pro-content-area .bg-\[\#2e7d32\],
        .pro-content-area tr:has(.text-white) {
          background-color: #2e7d32 !important;
          color: white !important;
        }

        /* 5. Segmented Control (Exact TaxCalculator.tsx match) */
        .pro-content-area .segmented-control {
          background: #f3f4f6 !important; /* bg-gray-100 */
          border-radius: 1rem !important; /* rounded-2xl */
          padding: 0.25rem !important; /* p-1 */
          display: flex !important;
          max-width: 28rem !important;
          margin: 0 auto 2rem auto !important;
          border: none !important;
        }
        .pro-content-area .segmented-item {
          flex: 1 !important;
        }
        .pro-content-area .segmented-item button {
          width: 100% !important;
          padding: 0.75rem 0 !important; /* py-3 */
          font-size: 14px !important; /* text-sm */
          font-weight: 700 !important;
          color: #6b7280 !important; /* text-gray-500 */
          background: transparent !important;
          border: none !important;
          border-radius: 0.75rem !important; /* rounded-xl */
          transition: all 0.2s !important;
        }
        .pro-content-area .segmented-item button.active {
          background: white !important;
          color: #203578 !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .pro-content-area .segmented-glider { display: none !important; }

        /* Section Headings (Bar + Title alignment sync) */
        .pro-content-area .flex.items-center.gap-3 {
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          margin-bottom: 1.5rem !important;
        }
        .pro-content-area .w-1.h-6 {
          width: 0.25rem !important;
          height: 1.5rem !important;
          background-color: var(--theme-color) !important;
          border-radius: 9999px !important;
          flex-shrink: 0 !important;
        }
        .pro-content-area h3 {
          color: var(--theme-color) !important;
          font-size: 1.25rem !important; /* text-xl */
          font-weight: 900 !important; /* font-black */
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1 !important;
          letter-spacing: -0.025em !important;
        }

        /* 2. Global Section Theme Mapping */
        .pro-content-area section:nth-of-type(1),
        .pro-content-area section:has(input) {
          --theme-color: #203578;
        }
        .pro-content-area section:last-of-type,
        .pro-content-area section:has(.text-red-500),
        .pro-content-area section:has(h3:contains("최종 실익")),
        .pro-content-area section:has(h3:contains("조세 효과")),
        .pro-content-area section:has(h3:contains("조세부담 분석")) {
          --theme-color: #2e7d32;
        }

        .pro-content-area section {
          margin-bottom: 4rem !important;
        }
      `}</style>
    </div>
  );
}
