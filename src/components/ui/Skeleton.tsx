interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded-xl ${className}`}
      role="status"
      aria-label="Carregando..."
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-2 border border-purple-900/30 p-0">
      <Skeleton className="w-full h-52" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-6 text-center w-full max-w-2xl px-4">
        <Skeleton className="h-16 w-4/5 mx-auto" />
        <Skeleton className="h-16 w-3/5 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
