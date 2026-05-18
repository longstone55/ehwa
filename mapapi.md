# EHWA API 사용 문서

## 1. 호출 URL

외부 프로젝트에서는 아래 API 엔드포인트를 호출합니다.

```text
https://ehwatax.com/ehwa-php-api/public/index.php
```

샘플 화면은 테스트용입니다.

```text
https://ehwatax.com/ehwa-php-api/public/sample.html
```

실제 Next 프로젝트나 외부 서비스에서는 `sample.html`이 아니라 `index.php`를 호출해야 합니다.

## 2. 기본 호출 방식

모든 API는 `GET` 방식입니다.

```text
https://ehwatax.com/ehwa-php-api/public/index.php?action={action}&파라미터...
```

예시:

```text
https://ehwatax.com/ehwa-php-api/public/index.php?action=svc_result&pnucode=1168010100107180015&jibunaddr=서울특별시 강남구 역삼동 718-15
```

## 3. DB 중복 검증 및 캐시 동작

API는 외부 EHWA API를 바로 호출하기 전에 DB의 `apiCalls` 테이블을 먼저 조회합니다.

DB 연결 기본값:

```text
host: 127.0.0.1
port: 3306
database: ehwa
table: apiCalls
user: ehwa
password: dlghk11!!
```

중복 검증 기준:

```text
apiId + requestParameter
```

예시:

```text
apiId = io.dalue.ewha.api.req.SVC_RESULT
requestParameter = serviceId=SVC_RESULT&pnucode=1168010100107180015&jibunaddr=서울특별시+강남구+역삼동+718-15
```

동작 순서:

1. 요청 파라미터로 `apiId`, `requestParameter` 생성
2. `apiCalls` 테이블에서 동일한 값이 있는지 조회
3. 있으면 DB에 저장된 `response` 반환
4. 없으면 외부 EHWA API 호출
5. 외부 API 응답을 `apiCalls`에 저장
6. 최종 JSON 반환

DB에서 조회된 경우 응답에 아래 값이 포함됩니다.

```json
{
  "cache": {
    "hit": true
  }
}
```

DB에 없어서 외부 API를 호출한 경우:

```json
{
  "cache": {
    "hit": false
  }
}
```

## 4. 응답 구조

성공 응답 예시:

```json
{
  "ok": true,
  "statusCode": 200,
  "contentType": "application/json; charset=utf-8",
  "url": null,
  "apiId": "io.dalue.ewha.api.req.SVC_RESULT",
  "requestId": "EHWA_REQ_1732652902538_437",
  "requestParameter": "serviceId=SVC_RESULT&pnucode=1168010100107180015&jibunaddr=...",
  "filePath": null,
  "json": {
    "resultCode": "1",
    "resultMessage": "정상결과 입니다.",
    "result": {}
  },
  "raw": null,
  "cache": {
    "hit": true,
    "pno": 1080,
    "hits": 3,
    "creationDate": "2024-11-27 05:28:23"
  }
}
```

실제 EHWA 응답 본문은 `json` 필드 안에 들어갑니다.

## 5. 지원 action 목록

| action | serviceId | 설명 |
| --- | --- | --- |
| `svc_result` | `SVC_RESULT` | 기본 시세 조회 |
| `ho_list` | `SVC_HO_LIST` | 호 리스트 조회 |
| `gubun_bldg_result` | `SVC_GUBUN_BLDG_RESULT` | 구분건물 시세 조회 |
| `bub_list` | `SVC_BUB_LIST` | 법정동 리스트 조회 |
| `pdf_result` | `SVC_PDF_RESULT` | 일반 물건 PDF 생성 |
| `pdf_gubun_bldg_result` | `SVC_PDF_GUBUN_BLDG_RESULT` | 구분건물 PDF 생성 |
| `pdf_info` | `SVC_PDF_GET_PDF_INFO` | PDF 정보 조회 |

## 6. 기본 시세 조회

### 요청

```text
GET /index.php?action=svc_result&pnucode={pnucode}&jibunaddr={jibunaddr}
```

필수 파라미터:

| 이름 | 설명 | 예시 |
| --- | --- | --- |
| `pnucode` | PNU 코드 | `1168010100107180015` |
| `jibunaddr` | 지번 주소 | `서울특별시 강남구 역삼동 718-15` |

호출 예시:

```text
https://ehwatax.com/ehwa-php-api/public/index.php?action=svc_result&pnucode=1168010100107180015&jibunaddr=서울특별시 강남구 역삼동 718-15
```

## 7. Next.js 호출 예시

### 직접 fetch

```ts
const url = new URL("https://ehwatax.com/ehwa-php-api/public/index.php");

url.searchParams.set("action", "svc_result");
url.searchParams.set("pnucode", "1168010100107180015");
url.searchParams.set("jibunaddr", "서울특별시 강남구 역삼동 718-15");

const res = await fetch(url.toString());
const data = await res.json();

console.log(data.ok);
console.log(data.cache?.hit);
console.log(data.json);
```

### 공통 함수

```ts
export async function fetchEhwaSvcResult(params: {
  pnucode: string;
  jibunaddr: string;
}) {
  const url = new URL("https://ehwatax.com/ehwa-php-api/public/index.php");

  url.searchParams.set("action", "svc_result");
  url.searchParams.set("pnucode", params.pnucode);
  url.searchParams.set("jibunaddr", params.jibunaddr);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.message ?? "EHWA API 호출 실패");
  }

  return data;
}
```

사용:

```ts
const result = await fetchEhwaSvcResult({
  pnucode: "1168010100107180015",
  jibunaddr: "서울특별시 강남구 역삼동 718-15",
});

console.log(result.json);
```

## 8. CORS

`public/index.php`에는 외부 Next 프로젝트에서 브라우저 호출이 가능하도록 CORS 헤더가 설정되어 있습니다.

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
```

## 9. 캐시 우회

DB 캐시를 사용하지 않고 외부 API를 강제로 호출하려면 `cache=0`을 추가합니다.

```text
https://ehwatax.com/ehwa-php-api/public/index.php?action=svc_result&cache=0&pnucode=1168010100107180015&jibunaddr=서울특별시 강남구 역삼동 718-15
```

일반적인 외부 서비스 호출에서는 `cache=0`을 넣지 않는 것을 권장합니다.
