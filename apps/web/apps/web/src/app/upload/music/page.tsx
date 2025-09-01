import PageHeader from '@/components/PageHeader'

export default function Page() {
  return (
    <section>
      <PageHeader title="Upload Music" subtitle="" />
      <div className="card p-6">
        <p className="text-sm text-muted-foreground">
          Placeholder page for <strong>Upload Music</strong>. Replace with real implementation.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
          <li>Brand wording: Channel → Studio, Subscribe → Join, Follow → Tune-In, Like → Boost, Comment → Chat, Playlist → Collection, Shorts → Flips, Live → Broadcast, Subscribers → Crew, Recommendations → For You Stream.</li>
          <li>Hook up data later via API & Prisma.</li>
        </ul>
      </div>
    </section>
  )
}
