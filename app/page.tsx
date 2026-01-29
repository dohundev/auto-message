'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className='fixed inset-0 bg-black flex items-center justify-center'>
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