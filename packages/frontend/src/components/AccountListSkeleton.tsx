import { Skeleton } from "@/components/ui/skeleton";

export function AccountListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-6">
        {[1, 2].map((group) => (
          <div key={group} className="space-y-4">
            <div className="p-4 rounded-lg border border-border">
              <div className="grid gap-2">
                <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-80" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((account) => (
                <div key={account} className="rounded-lg border p-6 space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-60" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 