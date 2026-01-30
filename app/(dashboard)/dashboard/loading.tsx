export default function DashboardLoading() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-primary/10 animate-pulse border border-border/50"
          />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 h-[400px] bg-primary/10 animate-pulse border border-border/50" />
        <div className="col-span-3 h-[400px] bg-primary/10 animate-pulse border border-border/50" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={`row2-${i}`}
            className="h-48 bg-primary/10 animate-pulse border border-border/50"
          />
        ))}
      </div>
    </div>
  );
}
