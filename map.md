'use client'

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 탭 상태 관리 (요약정보, 기본정보, 공시지가)
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (mapLoaded && window.kakao) {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.500806, 127.036924), // 역삼동 좌표
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커 클릭 시 바텀 시트 오픈 (테스트용으로 맵 클릭 시 오픈)
        window.kakao.maps.event.addListener(map, 'click', function() {
          setIsBottomSheetOpen(true);
        });
      });
    }
  }, [mapLoaded]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&autoload=false`}
        onReady={() => setMapLoaded(true)}
      />

      {/* 1. 카카오맵 영역 */}
      <div id="map" className="w-full h-full" />

      {/* 2. 딤(Dim) 처리 */}
      {isBottomSheetOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsBottomSheetOpen(false)}
        />
      )}

      {/* 3. 바텀 시트 */}
      <div
        className={`fixed bottom-0 left-0 w-full h-[85vh] bg-white rounded-t-3xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
        } max-w-3xl mx-auto right-0`}
      >
        {/* 드래그 핸들 */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />

        {/* 닫기 버튼 */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsBottomSheetOpen(false)}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* 바텀 시트 스크롤 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto pb-10 px-6 custom-scrollbar">
          
          {/* 헤더 및 주소 */}
          <div className="mt-2 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">서울특별시 강남구 역삼동 678-29</h3>
            
            {/* 탭 메뉴 */}
            <ul className="flex border-b border-gray-200">
              {['summary', 'info', 'price'].map((tab) => (
                <li key={tab} className="flex-1 text-center">
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
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

          <div id="mapDetailInfo" className="space-y-6">
            
            {/* 로드뷰 영역 (향후 카카오 로드뷰 API 연결) */}
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div id="roadview" className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                카카오 로드뷰가 렌더링될 영역입니다.
              </div>
            </div>

            {/* 감정평가 안내 메세지 */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
              본 물건은 <span className="font-bold text-blue-600">정밀탁상감정</span> 혹은 <span className="font-bold text-blue-600">정식감정</span>이 필요합니다.<br/>
              절세 상담 신청 페이지에서 상담신청하시면 전문상담원이 상담하여 드립니다.
            </div>

            {/* 로그인 / 제안서 버튼 영역 */}
            <div className="flex flex-col gap-2">
              <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition">
                절세 제안서 유형 안내
              </button>
              <Link href="/member/login.html" className="w-full py-3 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition">
                회원가입 / 로그인
              </Link>
            </div>

            {/* 시세 요약 */}
            <div className="text-center bg-gray-50 py-6 rounded-lg border border-gray-200">
              <div className="text-gray-500 text-sm mb-1">시세 감정평가액</div>
              <div className="text-2xl font-bold text-gray-900">**,***,000,000원 <span className="text-lg font-medium text-gray-500">(약**.**원)</span></div>
              <p className="text-xs text-gray-400 mt-2">조회하신 부동산 시세정보가 업데이트 되었습니다. 로그인을 하시어 확인하세요</p>
            </div>

            {/* 법적 한계 안내 */}
            <div className="bg-red-50 p-4 rounded-lg text-xs text-red-700 leading-relaxed">
              <strong className="block mb-1">Notice : 법적한계안내</strong>
              본 가격은 실거래가를 기반으로 한 참고용 시장가격으로, 법적 효력이 있는 감정평가는 아닙니다.
              법적 효력을 갖는 "감정평가 및 감정평가사에 관한 법률"에 따른 공식 감정평가를 요구하시는 경우, 별도로 진행되므로, 정식 감정평가(서)를 의뢰해 주시기 바랍니다.
            </div>

            {/* 요약 정보 테이블 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
              <div className="bg-gray-100 px-4 py-3 font-bold text-gray-800 border-b border-gray-200">
                요약정보
              </div>
              <table className="w-full text-sm text-left">
                <colgroup>
                  <col className="w-[20%] bg-gray-50" />
                  <col className="w-[30%]" />
                  <col className="w-[20%] bg-gray-50" />
                  <col className="w-[30%]" />
                </colgroup>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">토지가격</th>
                    <td colSpan={3} className="px-4 py-3 text-gray-900 font-bold">**,***,***,000원</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">토지단가</th>
                    <td className="px-4 py-3 text-gray-900">**,***,000원</td>
                    <th className="px-4 py-3 font-medium text-gray-600">토지면적</th>
                    <td className="px-4 py-3 text-gray-900">331.3 ㎡</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">용도지역</th>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">일반상업지역</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 토지 기본정보 테이블 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
              <div className="bg-gray-100 px-4 py-3 font-bold text-gray-800 border-b border-gray-200">
                토지기본정보
              </div>
              <table className="w-full text-sm text-left">
                <colgroup>
                  <col className="w-[20%] bg-gray-50" />
                  <col className="w-[30%]" />
                  <col className="w-[20%] bg-gray-50" />
                  <col className="w-[30%]" />
                </colgroup>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">주소</th>
                    <td colSpan={3} className="px-4 py-3 text-gray-900">서울특별시 강남구 역삼동 678-29</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">토지면적</th>
                    <td className="px-4 py-3 text-gray-900">331.3 ㎡</td>
                    <th className="px-4 py-3 font-medium text-gray-600">토지가격</th>
                    <td className="px-4 py-3 text-gray-900">**,***,***,000원</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">건물면적</th>
                    <td className="px-4 py-3 text-gray-900">3134.2 ㎡</td>
                    <th className="px-4 py-3 font-medium text-gray-600">건물가격</th>
                    <td className="px-4 py-3 text-gray-900">*,***,***,000원</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">이용상황</th>
                    <td className="px-4 py-3 text-gray-900">-</td>
                    <th className="px-4 py-3 font-medium text-gray-600">용도지역</th>
                    <td className="px-4 py-3 text-gray-900">일반상업지역</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">지목</th>
                    <td className="px-4 py-3 text-gray-900">대</td>
                    <th className="px-4 py-3 font-medium text-gray-600">형상</th>
                    <td className="px-4 py-3 text-gray-900">세로장방형</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      
      {/* global.css 등에 추가할 스크롤바 숨김 클래스 (선택사항)
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      */}
    </div>
  );
}