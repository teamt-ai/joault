'use client';

import { Suspense } from 'react';
import JoaultAuthPage from '@/app/page';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center text-[#24150E] font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#24150E]" />
      </div>
    }>
      <JoaultAuthPage />
    </Suspense>
  );
}
