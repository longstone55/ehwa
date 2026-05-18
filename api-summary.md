# EHWA 부동산 시세 API 연동 요약 지시서

## 핵심 원칙

1. 주소는 반드시 지번주소로 보낸다.
2. 기본 지도 클릭 조회에서는 가격 조회 API만 호출한다.
3. PDF 생성 API는 가격 산정 결과가 있는 경우에만, 사용자가 다운로드 버튼을 눌렀을 때 호출한다.
4. 구분건물(아파트, 오피스텔, 연립/다세대)은 일반 토지/단독건물과 조회 흐름이 다르다.
5. 응답 wrapper가 성공이어도 내부 `json.status: 404` 또는 `json.error: "Not Found"`이면 고객에게 기술 오류를 보여주지 말고 가격자료 부족 안내를 표시한다.

## 인증키

원천 API 기준 인증키는 요청 header의 `apiSejKey`로 보낸다.

```text
데이터 관련 인증키:
e6dd7a52106290e637852543e76bc1109f34af87c1d544e1e7c39b43a6753c0c

PDF 인증키:
fc7cb09b4162d8e1fd0e092069c0d23bfde0c74db748b1c900d71d96ae683bf8
```

현재 Next 프로젝트에서는 직접 원천 API를 호출하지 않고, 아래 PHP 중계 API를 호출한다.

```text
https://ehwatax.com/ehwa-php-api/public/index.php
```

중계 API는 `action` 파라미터를 받아 내부에서 원천 API의 `serviceId`로 변환한다.

## 공통 요청 파라미터

원천 API 기준:

| 이름 | 위치 | 필수 | 설명 |
| --- | --- | --- | --- |
| `apiSejKey` | header | O | 데이터 조회는 데이터 인증키, PDF는 PDF 인증키 |
| `serviceId` | query/body | O | 서비스 ID |
| `requestId` | query/body | O | 유니크 요청 ID |

요청 ID 규칙:

```text
일반 데이터: EHWA_REQ_yyyyMMddHHmmss + Random(6자리)
호 리스트: EHWA_HO_REQ_yyyyMMddHHmmss + Random(6자리)
법정동 리스트: EHWA_BUBCODE_REQ_yyyyMMddHHmmss + Random(6자리)
PDF: EHWA_PDF_REQ_yyyyMMddHHmmss + Random(6자리)
```

## 중계 API action 목록

| 중계 action | 원천 serviceId | 용도 |
| --- | --- | --- |
| `svc_result` | `SVC_RESULT` | 기본 결과 조회. 토지/단독은 가격 결과, 구분건물은 동/호 정보 |
| `ho_list` | `SVC_HO_LIST` | 구분건물 호 리스트 조회 |
| `gubun_bldg_result` | `SVC_GUBUN_BLDG_RESULT` | 구분건물 가격 결과 조회 |
| `bub_list` | `SVC_BUB_LIST` | 법정동 리스트 조회 |
| `pdf_result` | `SVC_PDF_RESULT` | 토지/단독 PDF 생성 |
| `pdf_gubun_bldg_result` | `SVC_PDF_GUBUN_BLDG_RESULT` | 구분건물 PDF 생성 |
| `pdf_info` | `SVC_PDF_GET_PDF_INFO` | PDF 생성 정보 조회 |

## 기본 지도 클릭 조회

지도 클릭 시에는 PDF를 호출하지 않는다. 기본은 가격 조회만 호출한다.

```text
GET /index.php?action=svc_result&pnucode={pnucode}&jibunaddr={jibunaddr}
```

예시:

```text
https://ehwatax.com/ehwa-php-api/public/index.php?action=svc_result&pnucode=1168010100107180015&jibunaddr=서울특별시 강남구 역삼동 718-15
```

필수 파라미터:

| 이름 | 설명 |
| --- | --- |
| `pnucode` | PNU 코드 |
| `jibunaddr` | 지번주소 |

## SVC_RESULT 응답 분기

`SVC_RESULT`는 부동산 타입에 따라 결과가 달라진다.

### 1. 토지/단독건물

`commonVo.type`이 `land`이면 토지/단독건물이다.

주요 데이터 위치:

```text
json.result.summaryInfo
json.result.landInfo
json.result.listBldgInfo
json.result.commonVo
```

주요 필드:

| 필드 | 설명 |
| --- | --- |
| `summaryInfo.resultprice` | 산정가격, 시세추정가 |
| `summaryInfo.landprice` | 토지가격 |
| `summaryInfo.landunitprice` | 토지단가 |
| `summaryInfo.landarea` | 토지면적 |
| `summaryInfo.bldgprice` | 건물가격 |
| `summaryInfo.bldgarea` | 건물연면적 |
| `summaryInfo.giyukname` | 용도지역 |
| `summaryInfo.main_use_info_nm` 또는 `main_use_nm` | 주용도 |
| `landInfo.jibunaddr` | 주소 |
| `landInfo.jimok_name` | 지목 |
| `landInfo.hung_name` | 형상 |
| `landInfo.gojeu_name` | 고저 |
| `landInfo.jub_name` | 접면 |
| `landInfo.gaeprice_list` | 공시지가 리스트 |
| `landInfo.compare_list` | 공시지가 전년대비 리스트 |
| `listBldgInfo[].area` | 건물 면적 |
| `listBldgInfo[].main_use_info_nm` | 건물 주용도 |

### 2. 구분건물

아파트, 오피스텔, 연립/다세대는 구분건물이다.

`SVC_RESULT` 호출 시 바로 가격이 나오지 않고 동/호 선택용 데이터가 올 수 있다.

주요 데이터 위치:

```text
json.result.commonVo
json.result.list
json.result.hoList
```

`commonVo.type` 값:

| 값 | 설명 |
| --- | --- |
| `apart` | 아파트 |
| `officetel` | 오피스텔 |
| `rowhouse` | 연립/다세대 |

동 리스트 주요 필드:

| 필드 | 설명 |
| --- | --- |
| `dongMngno` | 동 관리번호 |
| `dongPnuCode` | 동 PNU 코드 |
| `dongName` | 동명 |
| `dongBldNm` | 건물명 |
| `bubAddr` | 법정동 주소 |

호 리스트 주요 필드:

| 필드 | 설명 |
| --- | --- |
| `etcAddrHo` | 호 이름 |
| `sepArea` | 전용면적 |
| `commonArea` | 공용면적 |
| `commonArea1` | 공급면적 또는 계약면적 |
| `floorNo` | 층수 |
| `floorCode` | 층코드. 20 지상, 10 지하 |
| `mngNo` | 상세 mng 번호 |
| `hogbnnm` | 유형. apart, rowhouse, officetel |
| `hoDisplayName` | 화면 표시용 호 이름 |

구분건물은 사용자가 동/호를 선택한 뒤 `gubun_bldg_result`를 호출한다.

## 구분건물 가격 조회

```text
GET /index.php?action=gubun_bldg_result&...
```

필수 파라미터는 `SVC_GUBUN_BLDG_RESULT` 기준이다.

| 이름 | 설명 |
| --- | --- |
| `pnucode` | 동 리스트에 해당하는 PNU 코드 |
| `jibunaddr` | 지번주소 |
| `etcAddrDong` | 동 이름 |
| `etcAddrHo` | 호 이름 |
| `dongMngno` | 동 관리번호 |
| `mngNo` | 상세 mng 번호 |
| `sepArea` | 전용면적 |
| `commonArea` | 공용면적 |
| `commonArea1` | 공급면적 또는 계약면적 |
| `floorNo` | 층수 |
| `sumFam` | 전체 세대수 |
| `floorCode` | 층코드 |
| `bldNm` | 건물명 |
| `approveDate` | 사용승인일 |
| `hogbnnm` | 유형. apart, rowhouse, officetel |
| `bubAddr` | 법정동 주소 |
| `dongMainusenm` | 동 용도1 |
| `dongEtcuse` | 동 용도2 |
| `famcnt` | 동 세대수 |
| `dongGroundflrcnt` | 동 최고층 |
| `floornonm` | 해당층 이름 |

구분건물 가격 결과 주요 필드:

```text
json.result.resultData
```

| 필드 | 설명 |
| --- | --- |
| `resultprice` | 산정가격, 시세추정가 |
| `resultunitprice_m` | ㎡ 기준 단가 |
| `resultunitprice_p` | 평 기준 단가 |
| `separea_m` | 전용면적 ㎡ |
| `separea_p` | 전용면적 평 |
| `supplyarea_m` | 공급면적 또는 계약면적 ㎡ |
| `supplyarea_p` | 공급면적 또는 계약면적 평 |
| `approvedate` | 사용승인일 |
| `floor` | 해당층 |
| `topfloor` | 최고층 |
| `famcnt` | 세대수 |
| `donguse` | 동 용도 |
| `hohouse` | 호 용도 |
| `struct` | 구조 |
| `pub_siga_list` | 공동주택가격 또는 기준시가 |
| `pub_rate_list` | 전년대비 비율 |

## 호 리스트 조회

구분건물의 특정 동에 대한 호 리스트가 필요할 때 호출한다.

```text
GET /index.php?action=ho_list&pnucode={pnucode}&jibunaddr={jibunaddr}&dongMngno={dongMngno}&type={type}
```

필수 파라미터:

| 이름 | 설명 |
| --- | --- |
| `pnucode` | PNU 코드 |
| `jibunaddr` | 지번주소 |
| `dongMngno` | 동 관리번호 |
| `type` | apart, rowhouse, officetel |

## 법정동 리스트 조회

```text
GET /index.php?action=bub_list&searchType={searchType}&si={si}&gu={gu}&dong={dong}
```

`searchType` 값:

| 값 | 설명 |
| --- | --- |
| `si` | 시/도 리스트 |
| `gu` | 시/군/구 리스트 |
| `dong` | 읍/면/동 리스트 |
| `ri` | 리 리스트 |

응답 주요 필드:

| 필드 | 설명 |
| --- | --- |
| `bub_code` | 법정동 코드 |
| `result_bub_type` | si, gu, dong_eub, ri |
| `bub_name` | 법정동 주소 |

## PDF 생성

PDF는 지도 클릭 시 자동 호출하지 않는다. 사용자가 다운로드 버튼을 눌렀을 때만 호출한다.

또한 산정된 가격, 즉 시세추정가가 있을 경우에만 요청한다.

### 토지/단독 PDF

```text
GET /index.php?action=pdf_result&...
```

원천 serviceId:

```text
SVC_PDF_RESULT
```

`SVC_RESULT`에서 받은 토지/단독 결과 파라미터를 보낸다.

### 구분건물 PDF

```text
GET /index.php?action=pdf_gubun_bldg_result&...
```

원천 serviceId:

```text
SVC_PDF_GUBUN_BLDG_RESULT
```

`SVC_GUBUN_BLDG_RESULT`에서 받은 구분건물 결과 파라미터를 보낸다.

### PDF 정보 조회

```text
GET /index.php?action=pdf_info&pdfId={pdfId}
```

원천 serviceId:

```text
SVC_PDF_GET_PDF_INFO
```

PDF 응답 주요 필드:

| 필드 | 설명 |
| --- | --- |
| `resultPdfId` | PDF 생성 ID |
| `urlFilePath` | 파일 URL 경로 |

PDF 파일은 2개월만 보관된다.

## 가격 결과 코드

공통 응답에는 가격 관련 코드가 올 수 있다.

| 필드 | 설명 |
| --- | --- |
| `resultPriceCode` | 가격 결과 코드 |
| `resultPriceMessage` | 가격 결과 메시지 |

주요 코드:

| 코드 | 의미 |
| --- | --- |
| `999` | 정식 감정이 필요한 물건 |
| `1099` | 토지/단독에서 가격자료가 충분하지 않지만 가격을 산정한 경우 |
| `2100` | 구분건물에서 거래/자료 부족 관련 경고 |

고객 안내 문구 예시:

```text
필요시 아래의 「절세상담신청」 버튼 클릭 후 「부동산 종합 컨설팅」 세제 항목과 「정식 부동산 감정평가」 의뢰 항목을 선택해 주세요.
가격자료가 충분하지 않은 부동산으로 가격산정이 정확하지 않을 수 있습니다.
```

## 데이터 없음 처리

중계 API의 HTTP 응답이 200이고 wrapper가 성공이어도 내부 `json`이 아래처럼 오면 데이터 없음으로 처리한다.

```json
{
  "ok": true,
  "statusCode": 200,
  "json": {
    "status": 404,
    "error": "Not Found"
  }
}
```

이 경우 고객 화면에는 API 오류 문구를 보여주지 않는다.

표시할 문구:

```text
필요시 아래의 「절세상담신청」 버튼 클릭 후 「부동산 종합 컨설팅」 세제 항목과 「정식 부동산 감정평가」 의뢰 항목을 선택해 주세요.
가격자료가 충분하지 않은 부동산으로 가격산정이 정확하지 않을 수 있습니다.
```

## 현재 구현 시 주의할 점

1. 지도 클릭 시 `svc_result`만 호출한다.
2. `svc_result` 결과가 토지/단독(`type: land`)이면 바로 가격을 표시한다.
3. `svc_result` 결과가 구분건물(`type: apart`, `officetel`, `rowhouse`)이면 동/호 선택 UI가 필요하다.
4. 구분건물은 동/호 선택 후 `gubun_bldg_result`를 호출해야 가격이 나온다.
5. PDF는 가격 결과가 있고, 사용자가 다운로드 버튼을 누른 경우에만 호출한다.
6. `json.status: 404` 또는 `json.error: "Not Found"`는 기술 오류가 아니라 데이터 없음 안내로 처리한다.
