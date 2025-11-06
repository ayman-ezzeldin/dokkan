export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card">
      <div className="aspect-[4/5] rounded-t-xl bg-muted" />
      <div className="space-y-3 p-3">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-9 w-full rounded-md bg-muted" />
      </div>
    </div>
  );
}


