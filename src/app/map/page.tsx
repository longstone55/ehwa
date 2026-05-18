'use client'

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const KAKAO_MAP_APP_KEY = 'fc7156833f8873bc6dd7fa6204e88082';
const EHWA_API_URL = 'https://ehwatax.com/ehwa-php-api/public/index.php';
const TAX_PROPOSAL_GUIDE_URL = 'https://ehwatax.co.kr/roma/sub/view5.html';
const ROADVIEW_SEARCH_RADIUS = 300;
const EMPTY_PROPERTY_NOTICE =
  '필요시 아래의 「절세상담신청」 버튼 클릭 후 「부동산 종합 컨설팅」 세제 항목과 「정식 부동산 감정평가」 의뢰 항목을 선택해 주세요. 가격자료가 충분하지 않은 부동산으로 가격산정이 정확하지 않을 수 있습니다.';
const PROPERTY_POSITION = {
  lat: 37.500806,
  lng: 127.036924,
};

type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};
type KakaoMap = unknown;
type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};
type KakaoRoadview = {
  setPanoId: (panoId: number, position: KakaoLatLng) => void;
  relayout?: () => void;
};

type KakaoMaps = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (options: { position: KakaoLatLng; map: KakaoMap }) => KakaoMarker;
  Roadview?: new (container: HTMLElement) => KakaoRoadview;
  RoadviewClient?: new () => {
    getNearestPanoId: (
      position: KakaoLatLng,
      radius: number,
      callback: (panoId: number | null) => void
    ) => void;
  };
  event: {
    addListener: (
      target: unknown,
      type: string,
      handler: (event: { latLng: KakaoLatLng }) => void
    ) => void;
  };
  services?: {
    Status: {
      OK: string;
    };
    Geocoder: new () => {
      coord2Address: (
        lng: number,
        lat: number,
        callback: (result: KakaoAddressDocument[], status: string) => void
      ) => void;
      coord2RegionCode: (
        lng: number,
        lat: number,
        callback: (result: KakaoRegionDocument[], status: string) => void
      ) => void;
    };
  };
};

type KakaoLandAddress = {
  address_name?: string;
  b_code?: string;
  mountain_yn?: string;
  main_address_no?: string;
  sub_address_no?: string;
};

type KakaoAddressDocument = {
  address?: KakaoLandAddress | null;
  road_address?: {
    address_name?: string;
  } | null;
};

type KakaoRegionDocument = {
  region_type?: string;
  code?: string;
};

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMaps;
    };
  }
}

type DataRowProps = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

function DataRow({ label, value, fullWidth = false }: DataRowProps) {
  return (
    <div className={`grid grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[112px_minmax(0,1fr)] min-h-14 border-b border-gray-100 last:border-0 ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <span className="flex items-center bg-gray-50 px-3 py-3 text-xs sm:text-sm font-medium text-gray-500">{label}</span>
      <span className="flex items-center px-3 py-3 text-sm sm:text-base font-semibold text-gray-900 break-keep">{value}</span>
    </div>
  );
}

type PropertyDetail = {
  address: string;
  marker: string;
  measuredPrice: string;
  measuredPriceUnit: string;
  landPrice: string;
  landUnitPrice: string;
  landArea: string;
  buildingArea: string;
  buildingPrice: string;
  mainUse: string;
  district: string;
  zoningDistrict: string;
  restriction: string;
  landCategory: string;
  shape: string;
  height: string;
  roadContact: string;
  publicLandPriceYear: string;
  publicLandPrice: string;
  publicLandPriceChange: string;
  pnucode?: string;
};

type GubunType = 'apart' | 'officetel' | 'rowhouse';

type GubunDong = {
  dongMngno?: string;
  dongPnuCode?: string;
  dongName?: string;
  dongBldNm?: string;
  dongMainusenm?: string;
  dongEtcuse?: string;
  dongFamcnt?: string;
  dongSumfam?: string;
  dongGroundflrcnt?: string;
  dongApprovedate?: string;
  bubAddr?: string;
};

type GubunHo = {
  etcAddrHo?: string;
  sepArea?: string;
  commonArea?: string;
  commonArea1?: string;
  floorNo?: string;
  sumFam?: string;
  floorCode?: string;
  mngNo?: string;
  hogbnnm?: string;
  floorNonm?: string;
  floornonm?: string;
  hoDisplayName?: string;
  mainusenm?: string;
};

type EhwaApiResponse = {
  ok?: boolean;
  message?: string;
  url?: string | null;
  filePath?: string | null;
  cache?: {
    hit?: boolean;
  };
  json?: {
    status?: number;
    error?: string;
    resultCode?: string;
    resultMessage?: string;
    result?: {
      summaryInfo?: {
        resultprice?: string;
        landprice?: string;
        landunitprice?: string;
        landarea?: string;
        bldgprice?: string;
        bldgarea?: string;
        giyukname?: string;
        main_use_nm?: string;
        summary_gaeprice_list?: Array<{ year?: string; value?: string }>;
        summary_compare_list?: Array<{ year?: string; value?: string }>;
      };
      landInfo?: {
        jibunaddr?: string;
        landarea?: string;
        giyukname?: string;
        dist_name?: string;
        gita_name?: string;
        jimok_name?: string;
        hung_name?: string;
        gojeu_name?: string;
        jub_name?: string;
        gaeprice_list?: Array<{ year?: string; value?: string }>;
        compare_list?: Array<{ year?: string; value?: string }>;
      };
      listBldgInfo?: Array<{
        area?: string;
        main_use_info_nm?: string;
      }>;
      commonVo?: {
        type?: string;
        pnucode?: string;
        jibunaddr?: string;
        bldgNm?: string;
      };
      list?: GubunDong[];
      hoList?: GubunHo[];
      resultData?: {
        resultprice?: string;
        resultunitprice_m?: string;
        separea_m?: string;
        supplyarea_m?: string;
        approvedate?: string;
        floor?: string;
        topfloor?: string;
        famcnt?: string;
        donguse?: string;
        hohouse?: string;
        struct?: string;
        pub_siga_list?: Array<{ year?: string; value?: string }>;
        pub_rate_list?: Array<{ year?: string; value?: string }>;
        etcAddrDong?: string;
        etcAddrHo?: string;
        mngNo?: string;
      };
    };
  };
};

const DEFAULT_PROPERTY: PropertyDetail = {
  address: '서울특별시 강남구 역삼동 719-22',
  marker: '역삼동 719-22',
  measuredPrice: '29,980,100,000',
  measuredPriceUnit: '(약 299억원)',
  landPrice: '26,414,300,000원',
  landUnitPrice: '63,252,000원',
  landArea: '417.6 ㎡',
  buildingArea: '3544.65 ㎡',
  buildingPrice: '3,565,800,000원',
  mainUse: '-',
  district: '일반상업지역',
  zoningDistrict: '-',
  restriction: '-',
  landCategory: '대',
  shape: '세로장방형',
  height: '평지',
  roadContact: '중로각지',
  publicLandPriceYear: '2025년',
  publicLandPrice: '25,790,000원',
  publicLandPriceChange: '전년 대비 105%',
};

function formatCurrency(value?: string, fallback = '-') {
  if (!value) {
    return fallback;
  }

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return value;
  }

  return `${numberValue.toLocaleString('ko-KR')}원`;
}

function formatPrice(value?: string) {
  return formatCurrency(value).replace(/원$/, '');
}

function formatPriceUnit(value?: string) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return '';
  }

  const eok = numberValue / 100000000;
  const label = eok >= 10 ? Math.round(eok).toLocaleString('ko-KR') : eok.toFixed(1);
  return `(약 ${label}억원)`;
}

function formatArea(value?: string) {
  return value ? `${value} ㎡` : '-';
}

function getAddressShortName(address: string) {
  const parts = address.trim().split(/\s+/);
  return parts.slice(-2).join(' ') || address;
}

function normalizeJibunAddress(address: string) {
  const sidoMap: Record<string, string> = {
    서울: '서울특별시',
    부산: '부산광역시',
    대구: '대구광역시',
    인천: '인천광역시',
    광주: '광주광역시',
    대전: '대전광역시',
    울산: '울산광역시',
    세종: '세종특별자치시',
    경기: '경기도',
    강원: '강원특별자치도',
    충북: '충청북도',
    충남: '충청남도',
    전북: '전북특별자치도',
    전남: '전라남도',
    경북: '경상북도',
    경남: '경상남도',
    제주: '제주특별자치도',
  };
  const trimmed = address.trim().replace(/\s+/g, ' ');
  const [sido, ...rest] = trimmed.split(' ');

  return [sidoMap[sido] || sido, ...rest].join(' ');
}

function createEmptyProperty(address: string, pnucode: string): PropertyDetail {
  return {
    address,
    marker: getAddressShortName(address),
    measuredPrice: '-',
    measuredPriceUnit: '',
    landPrice: '-',
    landUnitPrice: '-',
    landArea: '-',
    buildingArea: '-',
    buildingPrice: '-',
    mainUse: '-',
    district: '-',
    zoningDistrict: '-',
    restriction: '-',
    landCategory: '-',
    shape: '-',
    height: '-',
    roadContact: '-',
    publicLandPriceYear: '-',
    publicLandPrice: '-',
    publicLandPriceChange: '-',
    pnucode,
  };
}

function getLotNumberParts(addressName?: string) {
  if (!addressName) {
    return {
      mountainYn: undefined,
      mainNo: undefined,
      subNo: undefined,
    };
  }

  const match = addressName.match(/(?:^|\s)(산\s*)?(\d+)(?:-(\d+))?\s*$/);

  return {
    mountainYn: match?.[1] ? 'Y' : undefined,
    mainNo: match?.[2],
    subNo: match?.[3],
  };
}

function buildPnucode(address: KakaoLandAddress, regionCode?: string) {
  const legalDongCode = address.b_code || regionCode;
  const lotParts = getLotNumberParts(address.address_name);
  const mainAddressNo = address.main_address_no || lotParts.mainNo;
  const subAddressNo = address.sub_address_no || lotParts.subNo || '0';
  const mountainYn = address.mountain_yn || lotParts.mountainYn;

  if (!legalDongCode || !mainAddressNo) {
    return '';
  }

  const landTypeCode = mountainYn === 'Y' ? '2' : '1';
  const mainNo = mainAddressNo.padStart(4, '0');
  const subNo = subAddressNo.padStart(4, '0');

  return `${legalDongCode}${landTypeCode}${mainNo}${subNo}`;
}

async function fetchEhwaSvcResult(params: { pnucode: string; jibunaddr: string }) {
  const url = new URL(EHWA_API_URL);
  url.searchParams.set('action', 'svc_result');
  url.searchParams.set('pnucode', params.pnucode);
  url.searchParams.set('jibunaddr', params.jibunaddr);

  console.log('[EHWA svc_result request]', {
    pnucode: params.pnucode,
    jibunaddr: params.jibunaddr,
    url: url.toString(),
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await parseEhwaResponse(res, 'svc_result');

  console.log('[EHWA svc_result response]', data);

  if (!res.ok || !data.ok) {
    throw new Error(data.message || data.json?.resultMessage || EMPTY_PROPERTY_NOTICE);
  }

  return data;
}

async function parseEhwaResponse(res: Response, label: string) {
  const text = await res.text();

  if (!text.trim()) {
    console.error(`[EHWA ${label} empty response]`, {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(EMPTY_PROPERTY_NOTICE);
  }

  try {
    return JSON.parse(text) as EhwaApiResponse;
  } catch (error) {
    console.error(`[EHWA ${label} invalid json]`, {
      status: res.status,
      statusText: res.statusText,
      body: text.slice(0, 1000),
      error,
    });
    throw new Error(EMPTY_PROPERTY_NOTICE);
  }
}

async function fetchEhwaPdfResult(params: { pnucode: string; jibunaddr: string }) {
  const url = new URL(EHWA_API_URL);
  url.searchParams.set('action', 'pdf_result');
  url.searchParams.set('pnucode', params.pnucode);
  url.searchParams.set('jibunaddr', params.jibunaddr);

  console.log('[EHWA pdf_result request]', {
    pnucode: params.pnucode,
    jibunaddr: params.jibunaddr,
    url: url.toString(),
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await parseEhwaResponse(res, 'pdf_result');

  console.log('[EHWA pdf_result response]', data);

  if (!res.ok || !data.ok) {
    throw new Error(data.message || data.json?.resultMessage || 'PDF 생성 요청에 실패했습니다.');
  }

  return data;
}

async function fetchEhwaHoList(params: {
  pnucode: string;
  jibunaddr: string;
  dongMngno: string;
  type: string;
}) {
  const url = new URL(EHWA_API_URL);
  url.searchParams.set('action', 'ho_list');
  url.searchParams.set('pnucode', params.pnucode);
  url.searchParams.set('jibunaddr', params.jibunaddr);
  url.searchParams.set('dongMngno', params.dongMngno);
  url.searchParams.set('type', params.type);

  console.log('[EHWA ho_list request]', {
    ...params,
    url: url.toString(),
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await parseEhwaResponse(res, 'ho_list');

  console.log('[EHWA ho_list response]', data);

  if (!res.ok || !data.ok) {
    throw new Error(data.message || data.json?.resultMessage || EMPTY_PROPERTY_NOTICE);
  }

  return data;
}

async function fetchEhwaGubunBldgResult(params: Record<string, string>) {
  const url = new URL(EHWA_API_URL);
  url.searchParams.set('action', 'gubun_bldg_result');

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  console.log('[EHWA gubun_bldg_result request]', {
    ...params,
    url: url.toString(),
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await parseEhwaResponse(res, 'gubun_bldg_result');

  console.log('[EHWA gubun_bldg_result response]', data);

  if (!res.ok || !data.ok) {
    throw new Error(data.message || data.json?.resultMessage || EMPTY_PROPERTY_NOTICE);
  }

  return data;
}

function getPdfUrl(data: EhwaApiResponse) {
  const value = data.url || data.filePath;

  if (!value) {
    return '';
  }

  if (/^https?:\/\//.test(value)) {
    return value;
  }

  return new URL(value, EHWA_API_URL).toString();
}

function isEhwaNoDataResponse(data: EhwaApiResponse) {
  return data.json?.status === 404 || data.json?.error === 'Not Found';
}

function isGubunType(value?: string): value is GubunType {
  return value === 'apart' || value === 'officetel' || value === 'rowhouse';
}

function isEhwaGubunResponse(data: EhwaApiResponse) {
  const result = data.json?.result;

  return Boolean(
    isGubunType(result?.commonVo?.type) ||
    result?.list?.length ||
    result?.hoList?.length
  );
}

function hasEhwaPropertyData(data: EhwaApiResponse) {
  if (isEhwaNoDataResponse(data)) {
    return false;
  }

  const result = data.json?.result;
  const summary = result?.summaryInfo;
  const land = result?.landInfo;
  const building = result?.listBldgInfo?.[0];

  return Boolean(
    summary?.resultprice ||
    summary?.landprice ||
    summary?.landunitprice ||
    summary?.landarea ||
    summary?.bldgprice ||
    summary?.bldgarea ||
    land?.landarea ||
    land?.giyukname ||
    land?.jimok_name ||
    building?.area ||
    building?.main_use_info_nm
  );
}

function getHoDisplayName(ho: GubunHo) {
  return ho.hoDisplayName || [ho.etcAddrHo, ho.hogbnnm, ho.sepArea ? `${ho.sepArea}㎡` : ''].filter(Boolean).join(' / ') || '호 선택';
}

function buildGubunResultParams(args: {
  address: string;
  type: GubunType;
  dong?: GubunDong;
  ho: GubunHo;
  fallbackPnucode?: string;
}) {
  const { address, type, dong, ho, fallbackPnucode } = args;

  return {
    pnucode: dong?.dongPnuCode || fallbackPnucode || '',
    jibunaddr: address,
    etcAddrDong: dong?.dongName || '',
    etcAddrHo: ho.etcAddrHo || '',
    dongMngno: dong?.dongMngno || '',
    mngNo: ho.mngNo || '',
    sepArea: ho.sepArea || '',
    commonArea: ho.commonArea || '',
    commonArea1: ho.commonArea1 || '',
    floorNo: ho.floorNo || '',
    sumFam: ho.sumFam || dong?.dongSumfam || dong?.dongFamcnt || '',
    floorCode: ho.floorCode || '',
    bldNm: dong?.dongBldNm || '',
    approveDate: dong?.dongApprovedate || '',
    hogbnnm: ho.hogbnnm || type,
    bubAddr: dong?.bubAddr || address,
    dongMainusenm: dong?.dongMainusenm || '',
    dongEtcuse: dong?.dongEtcuse || '',
    famcnt: dong?.dongFamcnt || '',
    dongGroundflrcnt: dong?.dongGroundflrcnt || '',
    floornonm: ho.floorNonm || ho.floornonm || '',
  };
}

function toPropertyDetail(data: EhwaApiResponse, fallback: PropertyDetail): PropertyDetail {
  const result = data.json?.result;
  const summary = result?.summaryInfo;
  const land = result?.landInfo;
  const building = result?.listBldgInfo?.[0];
  const publicLandPrice = land?.gaeprice_list?.[0] || summary?.summary_gaeprice_list?.[0];
  const publicLandPriceChange = land?.compare_list?.[0] || summary?.summary_compare_list?.[0];
  const address = result?.commonVo?.jibunaddr || land?.jibunaddr || fallback.address;

  return {
    ...fallback,
    address,
    marker: getAddressShortName(address),
    measuredPrice: formatPrice(summary?.resultprice),
    measuredPriceUnit: formatPriceUnit(summary?.resultprice),
    landPrice: formatCurrency(summary?.landprice),
    landUnitPrice: formatCurrency(summary?.landunitprice),
    landArea: formatArea(summary?.landarea || land?.landarea),
    buildingArea: formatArea(summary?.bldgarea || building?.area),
    buildingPrice: formatCurrency(summary?.bldgprice),
    mainUse: building?.main_use_info_nm || summary?.main_use_nm || '-',
    district: summary?.giyukname || land?.giyukname || '-',
    zoningDistrict: land?.dist_name || '-',
    restriction: land?.gita_name || '-',
    landCategory: land?.jimok_name || '-',
    shape: land?.hung_name || '-',
    height: land?.gojeu_name || '-',
    roadContact: land?.jub_name || '-',
    publicLandPriceYear: publicLandPrice?.year ? `${publicLandPrice.year}년` : '-',
    publicLandPrice: formatCurrency(publicLandPrice?.value),
    publicLandPriceChange: publicLandPriceChange?.value ? `전년 대비 ${publicLandPriceChange.value}%` : '-',
    pnucode: result?.commonVo?.pnucode || fallback.pnucode,
  };
}

function toGubunPropertyDetail(data: EhwaApiResponse, fallback: PropertyDetail, ho?: GubunHo): PropertyDetail {
  const result = data.json?.result;
  const common = result?.commonVo;
  const detail = result?.resultData;
  const publicPrice = detail?.pub_siga_list?.[0];
  const publicRate = detail?.pub_rate_list?.[0];
  const address = common?.jibunaddr || fallback.address;
  const unitPrice = detail?.resultunitprice_m || '';
  const area = detail?.separea_m || ho?.sepArea || '';
  const supplyArea = detail?.supplyarea_m || ho?.commonArea1 || ho?.commonArea || '';

  return {
    ...fallback,
    address,
    marker: [detail?.etcAddrDong, detail?.etcAddrHo].filter(Boolean).join(' ') || fallback.marker,
    measuredPrice: formatPrice(detail?.resultprice),
    measuredPriceUnit: formatPriceUnit(detail?.resultprice),
    landPrice: '-',
    landUnitPrice: unitPrice ? formatCurrency(unitPrice) : '-',
    landArea: area ? formatArea(area) : '-',
    buildingArea: supplyArea ? formatArea(supplyArea) : '-',
    buildingPrice: formatCurrency(detail?.resultprice),
    mainUse: detail?.hohouse || detail?.donguse || '-',
    district: detail?.donguse || '-',
    zoningDistrict: '-',
    restriction: '-',
    landCategory: '-',
    shape: '-',
    height: detail?.floor || ho?.floorNonm || ho?.floornonm || '-',
    roadContact: detail?.topfloor ? `최고 ${detail.topfloor}` : '-',
    publicLandPriceYear: publicPrice?.year ? `${publicPrice.year}년` : '-',
    publicLandPrice: formatCurrency(publicPrice?.value),
    publicLandPriceChange: publicRate?.value ? `전년 대비 ${publicRate.value}%` : '-',
    pnucode: common?.pnucode || fallback.pnucode,
  };
}

export default function MapPage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const roadviewRef = useRef<HTMLDivElement>(null);
  const hasInitializedMap = useRef(false);
  const selectedMarkerRef = useRef<KakaoMarker | null>(null);
  const roadviewInstanceRef = useRef<KakaoRoadview | null>(null);
  const roadviewClientRef = useRef<InstanceType<NonNullable<KakaoMaps['RoadviewClient']>> | null>(null);
  const selectedRoadviewRef = useRef<{ panoId: number; position: KakaoLatLng } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetail>(DEFAULT_PROPERTY);
  const [detailStatus, setDetailStatus] = useState<{
    isLoading: boolean;
    error: string;
    emptyMessage?: string;
    cacheHit?: boolean;
  }>({
    isLoading: false,
    error: '',
  });
  const [roadviewStatus, setRoadviewStatus] = useState<{
    isLoading: boolean;
    message: string;
  }>({
    isLoading: false,
    message: '',
  });
  const [pdfStatus, setPdfStatus] = useState<{
    isLoading: boolean;
    message: string;
  }>({
    isLoading: false,
    message: '',
  });
  const [gubunState, setGubunState] = useState<{
    isGubun: boolean;
    type?: GubunType;
    address: string;
    basePnucode: string;
    dongs: GubunDong[];
    hos: GubunHo[];
    selectedDongMngno: string;
    selectedHoMngno: string;
    isLoading: boolean;
    message: string;
  }>({
    isGubun: false,
    address: '',
    basePnucode: '',
    dongs: [],
    hos: [],
    selectedDongMngno: '',
    selectedHoMngno: '',
    isLoading: false,
    message: '',
  });
  
  // 탭 상태 관리 (요약정보, 기본정보, 공시지가)
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (!isMapReady || hasInitializedMap.current) {
      return;
    }

    const kakaoMaps = window.kakao?.maps;
    if (!kakaoMaps || !mapRef.current) {
      return;
    }

    kakaoMaps.load(() => {
      if (!mapRef.current) {
        return;
      }

      const position = new kakaoMaps.LatLng(PROPERTY_POSITION.lat, PROPERTY_POSITION.lng);
      const map = new kakaoMaps.Map(mapRef.current, {
        center: position,
        level: 3,
      });
      const geocoder = kakaoMaps.services ? new kakaoMaps.services.Geocoder() : null;

      const renderRoadview = (panoId: number, targetPosition: KakaoLatLng) => {
        selectedRoadviewRef.current = {
          panoId,
          position: targetPosition,
        };

        window.setTimeout(() => {
          if (!roadviewInstanceRef.current) {
            return;
          }

          roadviewInstanceRef.current.relayout?.();
          roadviewInstanceRef.current.setPanoId(panoId, targetPosition);
        }, 350);
      };

      const updateRoadview = (targetPosition: KakaoLatLng) => {
        if (!roadviewInstanceRef.current || !roadviewClientRef.current) {
          setRoadviewStatus({
            isLoading: false,
            message: '로드뷰를 불러올 수 없습니다.',
          });
          return;
        }

        setRoadviewStatus({ isLoading: true, message: '' });

        roadviewClientRef.current.getNearestPanoId(targetPosition, ROADVIEW_SEARCH_RADIUS, (panoId) => {
          console.log('[Kakao roadview pano]', {
            lat: targetPosition.getLat(),
            lng: targetPosition.getLng(),
            radius: ROADVIEW_SEARCH_RADIUS,
            panoId,
          });

          if (!panoId) {
            selectedRoadviewRef.current = null;
            setRoadviewStatus({
              isLoading: false,
              message: '선택한 위치 주변에는 제공 가능한 로드뷰가 없습니다.',
            });
            return;
          }

          renderRoadview(panoId, targetPosition);
          setRoadviewStatus({ isLoading: false, message: '' });
        });
      };

      const updateSelectedProperty = async (latLng: KakaoLatLng) => {
        if (!geocoder || !kakaoMaps.services) {
          setDetailStatus({
            isLoading: false,
            error: '주소 변환 서비스를 사용할 수 없습니다.',
            emptyMessage: '',
          });
          return;
        }

        setDetailStatus({ isLoading: true, error: '', emptyMessage: '' });
        setGubunState({
          isGubun: false,
          address: '',
          basePnucode: '',
          dongs: [],
          hos: [],
          selectedDongMngno: '',
          selectedHoMngno: '',
          isLoading: false,
          message: '',
        });
        setPdfStatus({ isLoading: false, message: '' });

        try {
          const documents = await new Promise<KakaoAddressDocument[]>((resolve, reject) => {
            geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
              if (status !== kakaoMaps.services?.Status.OK || !result.length) {
                reject(new Error('선택한 위치의 지번주소를 찾을 수 없습니다.'));
                return;
              }

              resolve(result);
            });
          });
          const regionDocuments = await new Promise<KakaoRegionDocument[]>((resolve) => {
            geocoder.coord2RegionCode(latLng.getLng(), latLng.getLat(), (result, status) => {
              if (status !== kakaoMaps.services?.Status.OK) {
                resolve([]);
                return;
              }

              resolve(result);
            });
          });
          const landAddress = documents[0].address;
          const rawJibunaddr = landAddress?.address_name || documents[0].road_address?.address_name || '';
          const jibunaddr = normalizeJibunAddress(rawJibunaddr);
          const legalDongCode = regionDocuments.find((item) => item.region_type === 'B')?.code;
          const pnucode = landAddress ? buildPnucode(landAddress, legalDongCode) : '';

          if (!jibunaddr || !pnucode) {
            throw new Error('선택한 위치의 PNU 코드를 만들 수 없습니다.');
          }

          const fallback = createEmptyProperty(jibunaddr, pnucode);
          setSelectedProperty(fallback);

          const apiData = await fetchEhwaSvcResult({ pnucode, jibunaddr });
          if (isEhwaGubunResponse(apiData)) {
            const result = apiData.json?.result;
            const type = isGubunType(result?.commonVo?.type) ? result.commonVo.type : undefined;
            const dongs = result?.list || [];
            const hos = result?.hoList || [];

            setSelectedProperty(fallback);
            setGubunState({
              isGubun: true,
              type,
              address: result?.commonVo?.jibunaddr || jibunaddr,
              basePnucode: result?.commonVo?.pnucode || pnucode,
              dongs,
              hos,
              selectedDongMngno: dongs[0]?.dongMngno || '',
              selectedHoMngno: hos[0]?.mngNo || '',
              isLoading: false,
              message: '동/호를 선택한 뒤 시세를 조회해 주세요.',
            });
            setDetailStatus({
              isLoading: false,
              error: '',
              emptyMessage: '',
              cacheHit: apiData.cache?.hit,
            });

            if (type && dongs[0] && !hos.length) {
              setGubunState((current) => ({
                ...current,
                isLoading: true,
                message: '호 정보를 불러오는 중입니다.',
              }));

              try {
                const hoData = await fetchEhwaHoList({
                  pnucode: dongs[0].dongPnuCode || result?.commonVo?.pnucode || pnucode,
                  jibunaddr: result?.commonVo?.jibunaddr || jibunaddr,
                  dongMngno: dongs[0].dongMngno || '',
                  type,
                });
                const firstDongHos = hoData.json?.result?.hoList || [];

                setGubunState((current) => ({
                  ...current,
                  hos: firstDongHos,
                  selectedHoMngno: firstDongHos[0]?.mngNo || '',
                  isLoading: false,
                  message: firstDongHos.length ? '호를 선택한 뒤 시세를 조회해 주세요.' : '선택한 동의 호 정보를 찾을 수 없습니다.',
                }));
              } catch (error) {
                console.error('[EHWA ho_list error]', error);
                setGubunState((current) => ({
                  ...current,
                  isLoading: false,
                  message: '호 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
                }));
              }
            }

            return;
          }

          if (!hasEhwaPropertyData(apiData)) {
            setSelectedProperty(fallback);
            setDetailStatus({
              isLoading: false,
              error: '',
              emptyMessage: EMPTY_PROPERTY_NOTICE,
              cacheHit: apiData.cache?.hit,
            });
            return;
          }

          setSelectedProperty(toPropertyDetail(apiData, fallback));
          setDetailStatus({
            isLoading: false,
            error: '',
            emptyMessage: '',
            cacheHit: apiData.cache?.hit,
          });
        } catch (error) {
          console.error('[EHWA svc_result error]', error);
          setDetailStatus({
            isLoading: false,
            error: '',
            emptyMessage: EMPTY_PROPERTY_NOTICE,
          });
        }
      };

      kakaoMaps.event.addListener(map, 'click', (mouseEvent) => {
        selectedMarkerRef.current?.setMap(null);
        selectedMarkerRef.current = new kakaoMaps.Marker({
          position: mouseEvent.latLng,
          map,
        });
        setIsBottomSheetOpen(true);
        setActiveTab('summary');
        updateRoadview(mouseEvent.latLng);
        void updateSelectedProperty(mouseEvent.latLng);
      });

      if (roadviewRef.current && kakaoMaps.Roadview && kakaoMaps.RoadviewClient) {
        const roadview = new kakaoMaps.Roadview(roadviewRef.current);
        const roadviewClient = new kakaoMaps.RoadviewClient();
        roadviewInstanceRef.current = roadview;
        roadviewClientRef.current = roadviewClient;
        roadviewClient.getNearestPanoId(position, ROADVIEW_SEARCH_RADIUS, (panoId) => {
          if (panoId) {
            renderRoadview(panoId, position);
          }
        });
      }

      hasInitializedMap.current = true;
    });
  }, [isMapReady]);

  useEffect(() => {
    if (!isBottomSheetOpen || activeTab !== 'summary' || !roadviewInstanceRef.current || !selectedRoadviewRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!roadviewInstanceRef.current || !selectedRoadviewRef.current) {
        return;
      }

      roadviewInstanceRef.current.relayout?.();
      roadviewInstanceRef.current.setPanoId(
        selectedRoadviewRef.current.panoId,
        selectedRoadviewRef.current.position
      );
    }, 350);

    return () => window.clearTimeout(timer);
  }, [isBottomSheetOpen, activeTab]);

  const handleDongChange = async (dongMngno: string) => {
    const selectedDong = gubunState.dongs.find((item) => item.dongMngno === dongMngno);

    setGubunState((current) => ({
      ...current,
      selectedDongMngno: dongMngno,
      selectedHoMngno: '',
      hos: current.dongs.length > 1 ? [] : current.hos,
      isLoading: Boolean(selectedDong && current.type),
      message: selectedDong && current.type ? '호 정보를 불러오는 중입니다.' : current.message,
    }));

    if (!selectedDong || !gubunState.type) {
      return;
    }

    try {
      const data = await fetchEhwaHoList({
        pnucode: selectedDong.dongPnuCode || gubunState.basePnucode,
        jibunaddr: gubunState.address,
        dongMngno: selectedDong.dongMngno || '',
        type: gubunState.type,
      });
      const hos = data.json?.result?.hoList || [];

      setGubunState((current) => ({
        ...current,
        hos,
        selectedHoMngno: hos[0]?.mngNo || '',
        isLoading: false,
        message: hos.length ? '호를 선택한 뒤 시세를 조회해 주세요.' : '선택한 동의 호 정보를 찾을 수 없습니다.',
      }));
    } catch (error) {
      console.error('[EHWA ho_list error]', error);
      setGubunState((current) => ({
        ...current,
        isLoading: false,
        message: '호 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      }));
    }
  };

  const handleGubunPriceLookup = async () => {
    const selectedDong = gubunState.dongs.find((item) => item.dongMngno === gubunState.selectedDongMngno) || gubunState.dongs[0];
    const selectedHo = gubunState.hos.find((item) => item.mngNo === gubunState.selectedHoMngno) || gubunState.hos[0];

    if (!gubunState.type || !selectedHo) {
      setGubunState((current) => ({
        ...current,
        message: '동/호를 선택한 뒤 시세를 조회해 주세요.',
      }));
      return;
    }

    setGubunState((current) => ({
      ...current,
      isLoading: true,
      message: '선택한 호의 시세를 조회하는 중입니다.',
    }));
    setDetailStatus({ isLoading: true, error: '', emptyMessage: '' });

    try {
      const params = buildGubunResultParams({
        address: gubunState.address || selectedProperty.address,
        type: gubunState.type,
        dong: selectedDong,
        ho: selectedHo,
        fallbackPnucode: gubunState.basePnucode || selectedProperty.pnucode,
      });
      const data = await fetchEhwaGubunBldgResult(params);
      const fallback = createEmptyProperty(gubunState.address || selectedProperty.address, params.pnucode);

      if (!data.json?.result?.resultData?.resultprice) {
        setSelectedProperty(fallback);
        setDetailStatus({
          isLoading: false,
          error: '',
          emptyMessage: EMPTY_PROPERTY_NOTICE,
        });
        setGubunState((current) => ({
          ...current,
          isLoading: false,
          message: '',
        }));
        return;
      }

      setSelectedProperty(toGubunPropertyDetail(data, fallback, selectedHo));
      setDetailStatus({
        isLoading: false,
        error: '',
        emptyMessage: '',
        cacheHit: data.cache?.hit,
      });
      setGubunState((current) => ({
        ...current,
        isLoading: false,
        message: '선택한 호의 시세 조회가 완료되었습니다.',
      }));
    } catch (error) {
      console.error('[EHWA gubun_bldg_result error]', error);
      setDetailStatus({
        isLoading: false,
        error: '',
        emptyMessage: EMPTY_PROPERTY_NOTICE,
      });
      setGubunState((current) => ({
        ...current,
        isLoading: false,
        message: '',
      }));
    }
  };

  const handlePdfDownload = async () => {
    if (selectedProperty.measuredPrice === '-') {
      setPdfStatus({
        isLoading: false,
        message: gubunState.isGubun ? '동/호 시세를 먼저 조회한 뒤 PDF를 다운로드해 주세요.' : '산정된 가격이 있을 때 PDF를 다운로드할 수 있습니다.',
      });
      return;
    }

    if (!selectedProperty.pnucode || !selectedProperty.address) {
      setPdfStatus({
        isLoading: false,
        message: 'PDF 생성을 위해 먼저 지도에서 주소지를 선택해 주세요.',
      });
      return;
    }

    setPdfStatus({ isLoading: true, message: '' });

    try {
      const data = await fetchEhwaPdfResult({
        pnucode: selectedProperty.pnucode,
        jibunaddr: selectedProperty.address,
      });
      const pdfUrl = getPdfUrl(data);

      if (pdfUrl) {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        setPdfStatus({ isLoading: false, message: '' });
        return;
      }

      setPdfStatus({
        isLoading: false,
        message: 'PDF 생성 요청이 접수되었습니다. 잠시 후 다시 다운로드를 시도해 주세요.',
      });
    } catch (error) {
      console.error('[EHWA pdf_result error]', error);
      setPdfStatus({
        isLoading: false,
        message: 'PDF 생성 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-white">
      <main className="absolute inset-x-0 top-[70px] bottom-0 lg:top-[90px] overflow-hidden"> 
        <div className="absolute inset-0 w-full h-full overflow-hidden overscroll-none bg-gray-100">
          <Script
            id="kakao-map-sdk"
            strategy="afterInteractive"
            src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`}
            onReady={() => setIsMapReady(true)}
            onError={() => setMapError('카카오 지도 스크립트를 불러오지 못했습니다.')}
          />

          {/* 1. 카카오 지도 영역 */}
          <div className="absolute inset-0 w-full h-full overflow-hidden overscroll-contain">
            <div ref={mapRef} id="map" className="h-full w-full" />
            {!isMapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm font-medium text-gray-500">
                지도를 불러오는 중입니다.
              </div>
            )}
            {mapError && (
              <div className="absolute left-4 right-4 bottom-4 rounded-lg border border-red-100 bg-white/95 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                {mapError}
              </div>
            )}
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
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 pr-10 leading-tight">{selectedProperty.address}</h3>
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium">
                  {selectedProperty.pnucode && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">PNU {selectedProperty.pnucode}</span>
                  )}
                  {detailStatus.isLoading && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">시세 정보 조회 중</span>
                  )}
                  {!detailStatus.isLoading && detailStatus.cacheHit !== undefined && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                      {detailStatus.cacheHit ? '캐시 데이터' : '신규 조회'}
                    </span>
                  )}
                </div>
                
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
                {detailStatus.error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {detailStatus.error}
                  </div>
                )}
                {detailStatus.emptyMessage && (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-medium leading-6 text-amber-900">
                    <p>필요시 아래의 「절세상담신청」 버튼 클릭 후 「부동산 종합 컨설팅」 세제 항목과 「정식 부동산 감정평가」 의뢰 항목을 선택해 주세요.</p>
                    <p className="mt-2">가격자료가 충분하지 않은 부동산으로 가격산정이 정확하지 않을 수 있습니다.</p>
                  </div>
                )}
                
                {/* --- 1. 요약정보 탭 --- */}
                {activeTab === 'summary' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* 로드뷰 영역 */}
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                      <div ref={roadviewRef} id="roadview" className="w-full h-[200px] sm:h-[250px] bg-gray-100" />
                      {(roadviewStatus.isLoading || roadviewStatus.message) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 px-4 text-center text-sm font-medium text-gray-600">
                          {roadviewStatus.isLoading ? '로드뷰를 불러오는 중입니다.' : roadviewStatus.message}
                        </div>
                      )}
                    </div>

                    {gubunState.isGubun && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 shadow-sm">
                        <div className="mb-3">
                          <div className="text-sm font-bold text-blue-900">구분건물 동/호 선택</div>
                          <p className="mt-1 text-xs font-medium leading-5 text-blue-700">
                            아파트, 오피스텔, 연립/다세대는 동/호를 선택한 뒤 시세를 조회합니다.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <label className="flex flex-col gap-1.5 text-xs font-bold text-gray-600">
                            동
                            <select
                              value={gubunState.selectedDongMngno}
                              onChange={(event) => void handleDongChange(event.target.value)}
                              disabled={gubunState.isLoading || !gubunState.dongs.length}
                              className="h-11 rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-gray-900 outline-none focus:border-primary disabled:bg-gray-100"
                            >
                              {!gubunState.dongs.length && <option value="">동 정보 없음</option>}
                              {gubunState.dongs.map((dong, index) => (
                                <option key={dong.dongMngno || `${dong.dongName}-${index}`} value={dong.dongMngno || ''}>
                                  {dong.dongName || dong.dongBldNm || `동 ${index + 1}`}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="flex flex-col gap-1.5 text-xs font-bold text-gray-600">
                            호
                            <select
                              value={gubunState.selectedHoMngno}
                              onChange={(event) => setGubunState((current) => ({ ...current, selectedHoMngno: event.target.value }))}
                              disabled={gubunState.isLoading || !gubunState.hos.length}
                              className="h-11 rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-gray-900 outline-none focus:border-primary disabled:bg-gray-100"
                            >
                              {!gubunState.hos.length && <option value="">호 정보 없음</option>}
                              {gubunState.hos.map((ho, index) => (
                                <option key={ho.mngNo || `${ho.etcAddrHo}-${index}`} value={ho.mngNo || ''}>
                                  {getHoDisplayName(ho)}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={handleGubunPriceLookup}
                          disabled={gubunState.isLoading || !gubunState.hos.length}
                          className="mt-3 h-11 w-full rounded-lg bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          {gubunState.isLoading ? '조회 중' : '선택한 호 시세 조회'}
                        </button>
                        {gubunState.message && (
                          <p className="mt-3 text-xs font-medium leading-5 text-blue-800">{gubunState.message}</p>
                        )}
                      </div>
                    )}

                    {/* 시세 요약 */}
                    <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-gray-500 text-sm mb-2 font-medium">시세 감정평가액</div>
                      <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {selectedProperty.measuredPrice}
                        {selectedProperty.measuredPrice !== '-' && (
                          <span className="text-xl sm:text-2xl font-bold ml-1">원</span>
                        )}
                      </div>
                      <div className="text-gray-500 mt-1 font-medium">{selectedProperty.measuredPriceUnit}</div>
                      <p className="text-xs text-gray-400 mt-3 bg-white py-2 px-3 rounded-lg border border-gray-100 inline-block break-keep">회원님의 재산가치를 기반으로 설계된 이화 절세 제안서를 확인해보세요.</p>
                    </div>

                    {/* 로그인 / 제안서 버튼 영역 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={TAX_PROPOSAL_GUIDE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-gray-800 text-white rounded-xl text-sm sm:text-base font-bold shadow-md hover:bg-gray-700 transition text-center"
                      >
                        이화 절세 제안서 유형 안내
                      </a>
                      <button
                        type="button"
                        onClick={handlePdfDownload}
                        disabled={pdfStatus.isLoading || !selectedProperty.pnucode}
                        className="w-full py-3.5 bg-primary text-white text-center rounded-xl text-sm sm:text-base font-bold shadow-md shadow-primary/20 hover:bg-blue-700 transition flex items-center justify-center disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                      >
                        {pdfStatus.isLoading ? 'PDF 생성 중' : '프리미엄 절세 제안서 다운로드'}
                      </button>
                    </div>
                    {pdfStatus.message && (
                      <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                        {pdfStatus.message}
                      </div>
                    )}

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
                        법적 효력을 갖는 &quot;감정평가 및 감정평가사에 관한 법률&quot;에 따른 공식 감정평가를 요구하시는 경우, 
                        별도로 진행되므로, 정식 감정평가(서)를 의뢰해 주시기 바랍니다.
                      </span>
                    </div>

                    {/* 요약 정보 (모바일 최적화 리스트 형태) */}
                    <div className="bg-white border flex flex-col border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8">
                      <div className="bg-gray-50 px-5 py-3.5 font-bold text-gray-800 border-b border-gray-200">
                        핵심 요약정보
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        <DataRow label="토지가격" value={selectedProperty.landPrice} fullWidth />
                        <DataRow label="토지단가" value={selectedProperty.landUnitPrice} />
                        <DataRow label="토지면적" value={selectedProperty.landArea} />
                        <DataRow label="용도지역" value={selectedProperty.district} fullWidth />
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
                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        <DataRow label="주소" value={selectedProperty.address} fullWidth />
                        <DataRow label="토지면적" value={selectedProperty.landArea} />
                        <DataRow label="토지가격" value={selectedProperty.landPrice} />
                        <DataRow label="건물면적" value={selectedProperty.buildingArea} />
                        <DataRow label="건물가격" value={selectedProperty.buildingPrice} />
                        <DataRow label="이용상황" value={selectedProperty.mainUse} />
                        <DataRow label="용도지역" value={selectedProperty.district} />
                        <DataRow label="용도지구" value={selectedProperty.zoningDistrict} />
                        <DataRow label="제한구역기타" value={selectedProperty.restriction} />
                        <DataRow label="지목" value={selectedProperty.landCategory} />
                        <DataRow label="형상" value={selectedProperty.shape} />
                        <DataRow label="고저" value={selectedProperty.height} />
                        <DataRow label="접면" value={selectedProperty.roadContact} />
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
                              <td className="py-4 text-gray-900">{selectedProperty.publicLandPriceYear}</td>
                              <td className="py-4 font-bold text-gray-900">{selectedProperty.publicLandPrice}</td>
                              <td className="py-4 text-red-500 font-medium">{selectedProperty.publicLandPriceChange}</td>
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
