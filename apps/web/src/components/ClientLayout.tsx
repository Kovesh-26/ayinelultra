'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <Navigation />}
      <main className={isHomePage ? '' : 'mx-auto max-w-[1200px] px-5 py-6'}>
        {children}
      </main>
    </>
  );
}
