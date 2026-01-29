'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 3초 후 페이드 아웃 시작
    const showTimer = setTimeout(() => {
      setIsExiting(true);
    }, 300);

    // 페이드 아웃 끝난 뒤(0.5초) 페이지 이동
    const leaveTimer = setTimeout(() => {
      router.replace('/home');
    }, 500); // 3000 + 500ms

    return () => {
      clearTimeout(showTimer);
      clearTimeout(leaveTimer);
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className='text-center'>
        <h1
          className='text-white text-4xl md:text-5xl tracking-widest font-light'
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            letterSpacing: '0.3em',
          }}
        >
          L FILM
        </h1>
        <div className='w-12 h-px bg-white/70 mx-auto my-5' />
        <h2
          className='text-white text-4xl md:text-5xl tracking-widest font-light'
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            letterSpacing: '0.3em',
          }}
        >
          C RECORD
        </h2>
      </div>
    </div>
  );
}