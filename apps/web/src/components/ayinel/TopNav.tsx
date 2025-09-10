import React from 'react';
import { Container } from './Container';
import ScreenshotCapture from '../ScreenshotCapture';

export function TopNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f14]/80 backdrop-blur">
      <Container className="h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold">👁️</span>
          <span className="text-white font-semibold">Ayinel</span>
          <div className="ml-4 hidden md:block w-72">
            <input
              placeholder="Search Ayinel..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ScreenshotCapture />
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Upload</button>
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow">Create</button>
          <div className="ml-2 h-8 w-8 rounded-full bg-white/10" />
        </div>
      </Container>
    </div>
  );
}
