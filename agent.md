현재 `/calc` 폴더에 있는 sub-801-1.html과 calc801-1.js JS 코드를 분석해서 Next.js(App Router) 기반의 React 컴포넌트로 변환해 줘. 

다음 3가지 핵심 규칙을 반드시 지켜야 해.

1. 확장자 및 언어 고정: 결과물은 반드시 `.tsx` 확장자를 사용하며, 모든 변수와 함수에 TypeScript 타입을 정의할 것.
2. 기존 CSS 폐기 및 디자인 가이드 적용: 기존 CSS는 무시하고 프로젝트 루트의 `Design-Guide.md`를 읽어 컬러 헥스코드, 여백, 테두리, 그림자 등 모든 디자인 수치를 Tailwind CSS 클래스로 완벽히 구현해.
3. 템플릿 복제: `/src/components/TaxCalculator.tsx` 파일을 템플릿으로 참고하여 동일한 구조(use client 선언, Props/State 인터페이스 정의, Tailwind 조합 패턴)를 100% 복제할 것.
4. JS 로직 완벽 이식: 원본 JS 파일의 모든 '수학적 계산 공식'을 철저히 분석하여 React의 상태 관리(useState, useEffect)로 변환해. 계산 결과가 기존과 단 1원도 틀리지 않게 로직을 완벽하게 이식할 것.

파일 생성 경로: /src/components/[생성파일명].tsx