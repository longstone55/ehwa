너는 최고 수준의 프론트엔드 개발자야. 기존에 작업된 세금 계산기의 메인 디자인 시스템을 완벽하게 유지하면서, 새롭게 주어지는 계산기 페이지를 Next.js와 Tailwind CSS로 작성해 줘.

[🔥 절대 규칙: 아래 지정된 클래스명과 구조를 한 글자도 바꾸지 말고 그대로 복사해서 사용할 것]

1. 디자인 무드 및 전체 컨테이너 (그림자/곡률 강제)
- 토스(Toss) 앱 스타일의 미니멀하고 깔끔한 카드 UI를 유지해야 한다.
- 메인 전체 컨테이너는 반드시 다음 클래스 문자열을 그대로 사용할 것:
  `className="bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden"`

2. 섹션별 테이블 래퍼 (그림자 계층 분리)
- 테이블을 감싸는 div에는 임의의 shadow 클래스를 쓰지 말고, 역할에 따라 아래 문자열을 그대로 쓸 것.
- 입력부(Input) 테이블 래퍼: 
  `className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm scrollbar-hide"`
- 결과부(Result) 테이블 래퍼 (입력부보다 그림자가 깊음): 
  `className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg scrollbar-hide"`

3. 테이블 테두리(Border) 엄격한 통제 (절대 금지 사항 포함)
- [금지] 개별 `tr`이나 일반 데이터 `td`에 `border`, `border-b`, `border-[색상]` 등의 테두리 클래스를 임의로 추가하지 마라.
- [가로선] 가로선은 개별 행에 넣지 말고, 오직 `<tbody className="divide-y divide-gray-100">` 방식을 통해서만 구현해라.
- [세로선] 세로선은 딱 두 곳에만 들어간다:
  1) 헤더(thead)의 th에 적용하는 `border-r border-white/10`
  2) 본문(tbody)의 좌측 첫 번째 고정 열(분석항목)에 적용하는 `border-r border-gray-100`

4. 섹션 제목 (Title)
- 제목 좌측에 세로 포인트 바를 반드시 넣을 것.
- 입력부 예시: `<div className="w-1 h-6 bg-[#203578] rounded-full"></div>` + `<h3 className="text-lg md:text-xl font-black text-[#203578]">`
- 결과부 예시: `<div className="w-1 h-6 bg-[#2e7d32] rounded-full"></div>` + `<h3 className="text-lg md:text-xl font-black text-[#2e7d32]">`

5. 테이블 헤더 및 본문 레이아웃 (Thead / Tbody)
- 테이블 기본: `className="w-full border-collapse min-w-[450px]"`
- 테이블 헤더(thead tr): 입력부는 `bg-[#203578] text-white`, 결과부는 `bg-[#1a1f27] text-white`
- 테이블 헤더 셀(th): `p-3 md:p-4 text-center text-[10px] md:text-[11px] font-bold border-r border-white/10`
- 첫 번째 열(분석 항목)은 항상 고정: `sticky left-0 z-20`(헤더) / `sticky left-0 z-10`(본문) 적용.
- 일반 행(tr) 호버 효과: `hover:bg-gray-50 transition-colors` (입력부의 경우 `hover:bg-blue-50/20`)
- 본문 좌측 항목명(th/td): `p-3 md:p-4 text-left font-bold text-[#4e5968] bg-[#f8f9fa] border-r border-gray-100`
- 하위 항목(Sub-item): 좌측 패딩을 깊게 주고 CornerDownRight 아이콘 사용. `p-2 md:p-3 pl-6 md:pl-10 text-[11px] text-gray-500 bg-white`

6. 폼 입력 및 강조 색상 (Input & Highlights)
- 사용자 입력창(Input) 고정 클래스: 
  `className="w-full p-3 md:p-4 text-right border-none bg-transparent font-black text-[#203578] focus:ring-2 focus:ring-[#203578]/20 focus:bg-white outline-none text-sm md:text-base transition-all"`
- 경고/증가분 등 주황색 강조: `bg-[#fff9db] font-black text-[#e67700]`
- 최종 합계 강조: `bg-[#203578] text-white font-black` 또는 `bg-[#2e7d32] text-white font-black`

7. 데이터 렌더링 강제 사항
- 각 열(Column)에 들어가는 동일한 형태의 데이터 `td`를 하드코딩으로 여러 번 반복해 적지 마라.
- 반드시 배열(예: `currentIndices`)과 `map` 함수를 활용하여 동적으로 렌더링되도록 코드를 작성해라.