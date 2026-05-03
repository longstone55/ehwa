'use client';

import { useSearchParams } from 'next/navigation';
import Footer from './Footer';
import { Suspense } from 'react';

function FooterContent() {
  const searchParams = useSearchParams();
  const isContentMode = searchParams.get('type') === 'content';

  if (isContentMode) {
    return null;
  }

  return <Footer />;
}

export default function FooterWrapper() {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  );
}

