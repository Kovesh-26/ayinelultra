import React from 'react';

interface PlaylistPlayerProps {
  title?: string;
  artist?: string;
  progress?: number;
}

export function PlaylistPlayer({ title = "Chill Vibes", artist = "Artist Name", progress = 32 }: PlaylistPlayerProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500" />
        <div>
          <div className="font-semibold text-white">{title}</div>
          <div className="text-sm text-white/70">{artist}</div>
        </div>
      </div>
      <div className="mb-3 h-2 w-full overflow-hidden rounded bg-white/10">
        <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">⏮</button>
        <button className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">▶</button>
        <button className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">⏭</button>
        <button className="ml-auto rounded-full bg-white/10 px-3 py-1 text-sm text-white">♡</button>
      </div>
    </div>
  );
}
