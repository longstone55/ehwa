'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 카카오맵 전역 객체 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

import Image from 'next/image';

export default function MapPage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // 탭 상태 관리 (요약정보, 기본정보, 공시지가)
  const [activeTab, setActiveTab] = useState('summary');

  // 마커나 지도를 클릭했을 때 처리 (디자인 시연용)
  const handleMapClick = () => {
    setIsBottomSheetOpen(true);
  };

  // 재사용 가능한 데이터 항목 컴포넌트 (모바일 최적화)
  const DataRow = ({ label, value, fullWidth = false }: { label: string, value: string, fullWidth?: boolean }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0 ${fullWidth ? 'col-span-2' : ''}`}>
      <span className="text-gray-500 text-xs sm:text-sm font-medium w-full sm:w-1/3 mb-1 sm:mb-0">{label}</span>
      <span className="text-gray-900 text-sm sm:text-base font-bold sm:font-medium w-full sm:w-2/3">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <main className="flex-1 mt-[70px] lg:mt-[90px] relative w-full h-[calc(100dvh-70px)] lg:h-[calc(100dvh-90px)]"> 
        <div className="absolute inset-0 w-full h-full bg-gray-100">
          {/* 1. 디자인 테스트용 가짜 지도 (API 도메인 차단 우회) */}
          <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={handleMapClick}>
            <Image 
              src="/mock_map.png"
              alt="지도 시뮬레이션"
              fill
              className="object-cover"
              priority
            />
            {/* 가상의 마커 (가운데) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pb-2 animate-bounce flex flex-col items-center">
              <div className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap mb-1">역삼동 678-29</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 shadow-sm">
              시연 모드 (미리보기)
            </div>
          </div>

          {/* 2. 배경 딤(Dim) 처리 */}
          <div
             className={`absolute inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isBottomSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
             onClick={() => setIsBottomSheetOpen(false)}
          />

          {/* 3. 바텀 시트 */}
          <div
            className={`absolute bottom-0 left-0 w-full h-[85vh] sm:h-[80vh] bg-white rounded-t-3xl shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.15)] z-50 p-0 flex flex-col transition-transform duration-300 ease-out ${
              isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
            } max-w-3xl mx-auto right-0`}
          >
            {/* 드래그 핸들 */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />

            {/* 닫기 버튼 */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* 바텀 시트 스크롤 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto pb-10 px-5 sm:px-8 custom-scrollbar">
              
              {/* 헤더 및 주소 */}
              <div className="mt-2 mb-4 sticky top-0 bg-white z-10 pt-2 pb-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-10 leading-tight">서울특별시 강남구 역삼동 678-29</h3>
                
                {/* 탭 메뉴 */}
                <ul className="flex border-b border-gray-200">
                  {['summary', 'info', 'price'].map((tab) => (
                    <li key={tab} className="flex-1 text-center">
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`w-full py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${
                          activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {tab === 'summary' && '요약정보'}
                        {tab === 'info' && '기본정보'}
                        {tab === 'price' && '공시지가'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="mapDetailInfo" className="space-y-6 mt-4">
                
                {/* --- 1. 요약정보 탭 --- */}
                {activeTab === 'summary' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* 로드뷰 영역 */}
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                      <div id="roadview" className="w-full h-[200px] sm:h-[250px] bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <span className="text-sm font-medium">로드뷰 영역 (API 연결 필요)</span>
                      </div>
                    </div>

                    {/* 시세 요약 */}
                    <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-gray-500 text-sm mb-2 font-medium">시세 감정평가액</div>
                      <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        **,***,000,000<span className="text-xl sm:text-2xl font-bold ml-1">원</span>
                      </div>
                      <div className="text-gray-500 mt-1 font-medium">(약 **.**원)</div>
                      <p className="text-xs text-gray-400 mt-3 bg-white py-2 px-3 rounded-lg border border-gray-100 inline-block break-keep">조회하신 부동산 시세정보가 업데이트 되었습니다. 로그인을 하시어 확인하세요</p>
                    </div>

                    {/* 로그인 / 제안서 버튼 영역 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button className="w-full py-3.5 bg-gray-800 text-white rounded-xl text-sm sm:text-base font-bold shadow-md hover:bg-gray-700 transition">
                        절세 제안서 유형 안내
                      </button>
                      <Link href="/member/login.html" className="w-full py-3.5 bg-primary text-white text-center rounded-xl text-sm sm:text-base font-bold shadow-md shadow-primary/20 hover:bg-blue-700 transition flex items-center justify-center">
                        회원가입 / 로그인
                      </Link>
                    </div>

                    {/* 감정평가 안내 메세지 */}
                    <div className="bg-blue-50/80 border border-blue-100 p-4 rounded-xl text-sm text-blue-900 leading-relaxed shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          본 물건은 <span className="font-bold text-blue-700 bg-blue-100 px-1 rounded">정밀탁상감정</span> 혹은 <span className="font-bold text-blue-700 bg-blue-100 px-1 rounded">정식감정</span>이 필요합니다.<br/>
                          절세 상담 신청 페이지에서 신청하시면 전문상담원이 상담하여 드립니다.
                        </div>
                      </div>
                    </div>

                    {/* 법적 한계 안내 */}
                    <div className="bg-red-50/50 p-4 rounded-xl text-xs sm:text-sm text-red-700 leading-relaxed border border-red-100 break-keep">
                      <strong className="flex items-center gap-1.5 mb-1.5 text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Notice : 법적한계안내
                      </strong>
                      <span className="opacity-90">
                        본 가격은 실거래가를 기반으로 한 참고용 시장가격으로, 법적 효력이 있는 감정평가는 아닙니다.
                        법적 효력을 갖는 "감정평가 및 감정평가사에 관한 법률"에 따른 공식 감정평가를 요구하시는 경우, 
                        별도로 진행되므로, 정식 감정평가(서)를 의뢰해 주시기 바랍니다.
                      </span>
                    </div>

                    {/* 요약 정보 (모바일 최적화 리스트 형태) */}
                    <div className="bg-white border flex flex-col border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8">
                      <div className="bg-gray-50 px-5 py-3.5 font-bold text-gray-800 border-b border-gray-200">
                        핵심 요약정보
                      </div>
                      <div className="p-5 flex flex-col gap-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-0">
                        <DataRow label="토지가격" value="**,***,***,000원" fullWidth />
                        <DataRow label="토지단가" value="**,***,000원" />
                        <DataRow label="토지면적" value="331.3 ㎡" />
                        <DataRow label="용도지역" value="일반상업지역" fullWidth />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 2. 기본정보 탭 --- */}
                {activeTab === 'info' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-5 py-3.5 font-bold text-gray-800 border-b border-gray-200">
                        토지 및 건물 기본정보
                      </div>
                      <div className="p-5 flex flex-col gap-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-0">
                        <DataRow label="주소" value="서울특별시 강남구 역삼동 678-29" fullWidth />
                        <DataRow label="토지면적" value="331.3 ㎡" />
                        <DataRow label="토지가격" value="**,***,***,000원" />
                        <DataRow label="건물면적" value="3134.2 ㎡" />
                        <DataRow label="건물가격" value="*,***,***,000원" />
                        <DataRow label="이용상황" value="상업용 기호 1" />
                        <DataRow label="용도지역" value="일반상업지역" />
                        <DataRow label="지목" value="대" />
                        <DataRow label="형상" value="세로장방형" />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 3. 공시지가 탭 --- */}
                {activeTab === 'price' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-5 py-3.5 font-bold text-gray-800 border-b border-gray-200">
                        연도별 개별공시지가 추이
                      </div>
                      <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-center min-w-[300px]">
                          <thead className="bg-white text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                              <th className="py-3 font-medium">연도</th>
                              <th className="py-3 font-medium">공시지가 (㎡당)</th>
                              <th className="py-3 font-medium">변동률</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-4 text-gray-900">2026</td>
                              <td className="py-4 font-bold text-gray-900">85,420,000원</td>
                              <td className="py-4 text-red-500 font-medium">▲ 3.2%</td>
                            </tr>
                            <tr className="bg-gray-50/50">
                              <td className="py-4 text-gray-900">2025</td>
                              <td className="py-4 font-bold text-gray-900">82,770,000원</td>
                              <td className="py-4 text-red-500 font-medium">▲ 4.1%</td>
                            </tr>
                            <tr>
                              <td className="py-4 text-gray-900">2024</td>
                              <td className="py-4 font-bold text-gray-900">79,510,000원</td>
                              <td className="py-4 text-blue-500 font-medium">▼ 1.5%</td>
                            </tr>
                            <tr className="bg-gray-50/50">
                              <td className="py-4 text-gray-900">2023</td>
                              <td className="py-4 font-bold text-gray-900">80,720,000원</td>
                              <td className="py-4 text-gray-500 font-medium">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
