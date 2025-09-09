interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { handle } = await params;
  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <section className="rounded-2xl border overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-sky-500 to-fuchsia-500" />
        <div className="p-4 flex flex-col sm:flex-row gap-4 -mt-10">
          <div className="h-24 w-24 rounded-2xl border-4 border-white bg-zinc-200" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">@{handle}</h1>
            <p className="opacity-80 text-sm">
              Bio: add your vibe, music, and wallpapers.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <button className="rounded-xl border px-3 py-2">
                Add Friend
              </button>
              <button className="rounded-xl border px-3 py-2">Tune-In</button>
              <button className="rounded-xl border px-3 py-2">Message</button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4 space-y-3">
          <h2 className="font-medium">Music Playlist</h2>
          <ul className="space-y-2 text-sm">
            <li className="rounded-xl border p-2">Track A</li>
            <li className="rounded-xl border p-2">Track B</li>
            <li className="rounded-xl border p-2">Track C</li>
          </ul>
        </div>
        <div className="rounded-2xl border p-4 md:col-span-2 space-y-3">
          <h2 className="font-medium">Activity Feed</h2>
          <div className="rounded-xl border p-3 text-sm">
            Posted a new video…
          </div>
          <div className="rounded-xl border p-3 text-sm">
            Boosted "City Nights"…
          </div>
        </div>
      </section>

      <section className="rounded-2xl border p-4">
        <h2 className="font-medium">Friends</h2>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-3 text-center text-sm">
              friend_{i + 1}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
