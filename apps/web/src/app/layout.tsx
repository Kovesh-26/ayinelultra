import type { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

// Use system fonts to avoid network dependency during build
const fontClass = 'font-sans';

export const metadata = {
  title: 'Ayinel',
  description: 'Discover, Tune-In, Boost, and build your Crew.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={fontClass} suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
