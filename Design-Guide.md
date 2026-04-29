# 🎨 세무 계산기 UI/UX 디자인 가이드 (Toss Style)

본 문서는 세무 계산기의 일관된 디자인 유지를 위한 전역 가이드입니다.

## 1. 컬러 시스템 (Color System)
| 용도 | 색상명 | Hex Code | 설명 |
| :--- | :--- | :--- | :--- |
| **Page BG** | Light Gray | `#F2F4F6` | **전체 페이지 배경색 (필수)** |
| **Surface** | White | `#FFFFFF` | 계산기 본체 카드 배경색 |
| **Primary** | Toss Blue | `#203578` | 메인 포인트 컬러 (네이비) |
| **Secondary** | Safe Green | `#2E7D32` | 결과 강조 (그린) |
| **Text Title**| Dark Gray | `#1A1F27` | 제목 텍스트 |
| **Text Body** | Gray | `#4E5968` | 본문 텍스트 |

## 2. 전체 레이아웃 및 배경 (Layout & Background)
- **최상단 컨테이너:** 반드시 `w-full min-h-screen bg-[#F2F4F6] p-4 md:p-12`를 적용하여 페이지 전체에 밝은 회색 배경이 깔리도록 합니다.
- **콘텐츠 카드:** 계산기 본체는 `bg-white rounded-[32px] shadow-2xl`를 적용하여 배경 위에 떠 있는 느낌을 줍니다.
- **너비 제한:** 카드 내부의 실제 콘텐츠 영역은 `max-w-7xl mx-auto`로 제한하여 가독성을 높입니다.

## 3. 상단 헤더 섹션 (Header Section)
- **위치:** 배경(`bg-[#F2F4F6]`) 위에 바로 위치.
- **스타일:** `text-3xl md:text-5xl font-black mb-12 tracking-tight`
- **정렬:** 모바일(`text-center`), PC(`md:text-left`)

## 4. 케이스 탭 및 테이블 (Tab & Table)
- **탭 디자인:** `bg-gray-100` 배경에 둥근 형태, 활성 탭은 `bg-white shadow-sm`.
- **테이블:** 세로선 제거, 가로선은 `#E5E8EB`, `min-w-[450px]` 고정, `overflow-x-auto` 적용.
- **Sticky Column:** 첫 번째 열(항목명)은 모바일에서 `sticky left-0 bg-white` 고정.

## 5. 컴포넌트 쉐이프 (Shape)
- **카드 모서리:** `rounded-[32px]`
- **그림자:** `box-shadow: 0 8px 30px rgba(0,0,0,0.04);`