import WatchPageClient from './WatchPageClient';

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WatchPageClient id={id} />;
}
