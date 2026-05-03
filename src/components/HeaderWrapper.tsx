'use client';

import { useSearchParams } from 'next/navigation';
import Header from './Header';
import { Suspense } from 'react';

function HeaderContent() {
  const searchParams = useSearchParams();
  // 'type' 파라미터가 'content'인 경우 무조건 숨김
  const isContentMode = searchParams.get('type') === 'content';

  if (isContentMode) {
    return <div className="hidden" aria-hidden="true" />; // 완전 제거 대신 숨김 처리로 레이아웃 흔들림 방지
  }

  return <Header />;
}

export default function HeaderWrapper() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  );
}

