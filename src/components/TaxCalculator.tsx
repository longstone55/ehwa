'use client';

import React, { useState } from 'react';
import { CornerDownRight, Phone, Clock } from 'lucide-react';

interface CaseData {
  businessIncome: string;
  dividendIncome: string;
  otherFinancialIncome: string;
  rentalIncome: string;
  laborIncome: string;
}

const INITIAL_DATA: CaseData[] = Array(8).fill(null).map((_, i) => ({
  businessIncome: i < 2 ? '1,500,000,000' : i < 4 ? '2,000,000,000' : i < 6 ? '2,500,000,000' : '3,000,000,000',
  dividendIncome: '0',
  otherFinancialIncome: '0',
  rentalIncome: i % 2 === 1 ? '75,600,000' : '0',
  laborIncome: '0',
}));

export default function TaxCalculator() {
  const [cases, setCases] = useState<CaseData[]>(INITIAL_DATA);
  const [activeCase, setActiveCase] = useState(0); // 0: Case I, 1: Case II...

  const handleInputChange = (index: number, field: keyof CaseData, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = numericValue ? new Intl.NumberFormat('ko-KR').format(parseInt(numericValue)) : '';
    const newCases = [...cases];
    newCases[index] = { ...newCases[index], [field]: formattedValue };
    setCases(newCases);
  };

  // 현재 선택된 케이스의 인덱스들 (예: Case I 이면 0번, 1번 데이터)
  const currentIndices = [activeCase * 2, activeCase * 2 + 1];

  return (
    <div className="w-full space-y-6">
      {/* 1. Case Selector Tabs */}


      {/* 2. Integrated Calculator Card */}
      <div className="bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm md:shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-5 md:p-5 md:p-8 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="space-y-3">
              <div className="grid gap-2 text-sm text-[#4e5968] leading-relaxed">
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">1.</span>
                  <span>대표의 소득이 급여 외에 다른 소득이 있는 경우 상황에 맞추어 시뮬레이션 해볼 수 있습니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">2.</span>
                  <span>각각의 소득을 조합하여 원하는 대로 시뮬레이션할 수 있습니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">3.</span>
                  <span>셀이 클릭되어 수정 가능한 곳은 직접 입력하여 수정(입력)할 수 있습니다.</span>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-[#203578] shrink-0">4.</span>
                  <span>산업재산권의 경우 필요경비율 60%를 제외한 금액에 대해 소득세를 계산합니다.</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                ※ 앞에 있는 쉬트 1.급여의 재구성(자료)와 계산값이 다를 수 있습니다. 그건 엑셀을 작성하면서 가정이 달리 적용된 까닭입니다. 큰 차이는 없을 겁니다.
              </p>
            </div>
          </div>
        </div>

      <div className="flex mx-4 mb-8 mt-8 overflow-x-auto rounded-2xl bg-gray-100 p-1 scrollbar-hide md:mx-auto md:max-w-md">
        {['CASE I', 'CASE II', 'CASE III', 'CASE IV'].map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveCase(i)}
            className={`min-w-[84px] flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeCase === i ? 'bg-white text-[#203578] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
        <div className="w-full p-0 pb-8 md:p-8 md:pb-8 space-y-8 md:space-y-12">
          {/* --- INPUT SECTION --- */}
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#203578] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#203578]">소득 정보 입력</h3>
              <span className="hidden md:inline text-xs text-gray-400 font-medium ml-2">수정 가능한 셀을 클릭하여 직접 입력해 보세요.</span>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#203578] text-white">
                    <th className="p-3 md:p-4 w-[140px] md:w-[30%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#203578] z-20">분석 항목</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10">현재 상황 (A)</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold bg-blue-500/30">임대소득 추가 (B)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {[
                    { label: '사업소득', field: 'businessIncome' },
                    { label: '배당소득', field: 'dividendIncome' },
                    { label: '배당외 금융소득', field: 'otherFinancialIncome' },
                    { label: '임대소득', field: 'rentalIncome' },
                    { label: '근로소득', field: 'laborIncome' },
                  ].map((row) => (
                    <tr key={row.field} className="hover:bg-blue-50/20 transition-colors">
                      <th className="p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100 sticky left-0 z-10">{row.label}</th>
                      {currentIndices.map((idx) => (
                        <td key={idx} className={`p-0 ${idx % 2 === 1 ? 'bg-blue-50/30' : ''}`}>
                          <div className="relative group">
                            <input 
                              type="text" 
                              className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all" 
                              value={cases[idx][row.field as keyof CaseData]} 
                              onChange={(e) => handleInputChange(idx, row.field as keyof CaseData, e.target.value)} 
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- RESULTS SECTION --- */}
          <section className="px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-black text-[#2e7d32]">확인란 / 소득구성에 따른 조세효과</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm md:shadow-md scrollbar-hide">
              <table className="w-full border-collapse min-w-[450px]">
                <thead>
                  <tr className="bg-[#1a1f27] text-white">
                    <th className="p-3 md:p-4 w-[140px] md:w-[30%] text-left text-[10px] md:text-[11px] font-black uppercase tracking-wider border-r border-white/10 sticky left-0 bg-[#1a1f27] z-20">분석 결과 상세</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10">현재 상황 (A)</th>
                    <th className="p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold bg-green-500/20">임대소득 추가 (B)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[12px] md:text-[13px]">
                  {/* 1. Income Section */}
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10">사업소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-gray-700 whitespace-nowrap">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10">배당소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-gray-700 whitespace-nowrap">0</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>원천징수배당</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>그로스업배당(11%가산)</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10">배당소득외 금융소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-gray-700 whitespace-nowrap">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10">금융소득계</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-gray-700 whitespace-nowrap">0</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>원천징수금융소득</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>종합과세금융소득</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10">임대소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-gray-700 whitespace-nowrap">0</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>필요경비</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10">근로소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-gray-700 whitespace-nowrap">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#4e5968] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">급여소득과세표준</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#4e5968] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">소득공제후 급여과세표준</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="bg-blue-50/50">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-blue-50/50 z-10 font-bold">급여소득외계</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-bold">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#4e5968] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">급여소득외 점수</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="bg-[#2e7d32] text-white font-black text-base md:text-lg">
                    <td className="p-4 md:p-5 border-r border-white/10 sticky left-0 bg-[#2e7d32] z-10 font-black">총 소 득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-4 md:p-5 text-right whitespace-nowrap font-black">0</td>)}
                  </tr>

                  {/* 2. Tax Calculation Base */}
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">종합소득공제</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">종합소득종합과세표준A</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">종합소득분리과세표준B</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  {/* 3. Tax Calculation Results */}
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#4e5968] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">산출세액</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-[#4e5968] whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#4e5968] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">총산출세액</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right text-[#4e5968] whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>배당세액공제</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>표준세액공제</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">0</td>)}
                  </tr>

                  <tr className="bg-[#203578] text-white font-black">
                    <td className="p-4 md:p-5 border-r border-white/10 sticky left-0 bg-[#203578] z-10 font-black">결정세액(지방소득세)</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-4 md:p-5 text-right whitespace-nowrap font-black">--</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white text-gray-500">
                    <td className="p-3 md:p-4 border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">세부담률</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  {/* 4. Comparison Analysis */}
                  <tr className="hover:bg-gray-50 transition-colors bg-white text-[#e67700]">
                    <td className="p-4 md:p-5 border-r border-gray-100 text-sm md:text-base sticky left-0 bg-white z-10 font-normal">현재대비 세금 증가분</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-4 md:p-5 text-right text-lg md:text-xl whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white text-gray-500">
                    <td className="p-4 md:p-6 border-r border-gray-100 text-center uppercase tracking-tighter text-[10px] md:text-xs sticky left-0 bg-white z-10 font-normal">△세금 / △소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-4 md:p-6 text-right text-lg md:text-xl whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  {/* 5. Additional Contributions */}
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">건강보험료</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>노인요양</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="text-gray-500 bg-white">
                    <td className="p-2 md:p-3 pl-6 md:pl-10 border-r border-gray-100 text-[11px] font-normal flex items-center gap-1 sticky left-0 bg-white z-10">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span>국민연금</span>
                    </td>
                    {currentIndices.map((idx) => <td key={idx} className="p-2 md:p-3 text-right text-[11px] whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="bg-gray-50 font-bold">
                    <td className="p-3 md:p-4 text-[#1a1f27] border-r border-gray-100 sticky left-0 bg-gray-50 z-10 font-bold">준조세</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-bold">--</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-3 md:p-4 text-[#203578] border-r border-gray-100 sticky left-0 bg-white z-10 font-normal">준조세포함</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-3 md:p-4 text-right whitespace-nowrap font-normal">--</td>)}
                  </tr>

                  <tr className="bg-[#fff9db] font-black text-[#e67700]">
                    <td className="p-4 md:p-5 border-r border-gray-100 text-sm md:text-base sticky left-0 bg-[#fff9db] z-10 font-black">현재대비 준조세포함 증가분</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-4 md:p-5 text-right text-lg md:text-xl whitespace-nowrap font-black">--</td>)}
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="p-4 md:p-6 border-r border-gray-100 text-center uppercase tracking-tighter text-[10px] md:text-xs sticky left-0 bg-white z-10 font-normal">△준조세포함 / △소득</td>
                    {currentIndices.map((idx) => <td key={idx} className="p-4 md:p-6 text-right text-lg md:text-xl whitespace-nowrap font-normal">--</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 3. Action Buttons Section */}
        <div className="p-8 bg-[#f8f9fa] border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h4 className="text-xl font-black text-[#203578]">분석 보고서 활용</h4>
              <p className="text-sm text-gray-500 mt-1">시뮬레이션 결과를 다양한 방식으로 확인하고 저장할 수 있습니다.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-down"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                </div>
                <span className="font-bold text-sm">PDF 다운로드</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <span className="font-bold text-sm">PDF 보기</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#203578] hover:text-[#203578] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
                </div>
                <span className="font-bold text-sm">인쇄</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-3 p-5 md:p-6 bg-[#203578] rounded-2xl border border-[#203578] shadow-sm md:shadow-md hover:bg-[#1a2b61] transition-all group text-white">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3 1.912 4.912L18.824 9.824 13.912 11.736 12 16.648l-1.912-4.912L5.176 9.824l4.912-1.912L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/><path d="m11 11 3 3"/><path d="m14 11-3 3"/></svg>
                </div>
                <span className="font-bold text-sm text-center">AI 종합분석보고서</span>
              </button>
            </div>

            {/* Bottom Footer Info */}
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
    </div>
  );
}
