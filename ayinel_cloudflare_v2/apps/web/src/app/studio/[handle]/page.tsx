export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ handle: string }> };

async function getStudio(handle: string) {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${base}/studios/${handle}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load studio');
  return res.json();
}

export default async function StudioPage({ params }: Props) {
  const { handle } = await params;
  const data = await getStudio(handle);
  if (!data) return <main style={{ padding: 24 }}>Studio not found.</main>;
  return (
    <main style={{ padding: 24 }}>
      <h1>Studio: {data.name}</h1>
      <p>Handle: {data.handle}</p>
      <p>{data.about ?? 'No description yet.'}</p>
    </main>
  );
}
