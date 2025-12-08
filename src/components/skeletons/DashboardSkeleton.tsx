import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Recent orders skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-24" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function OrderTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="flex items-center p-4 gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center p-4 gap-4 border-b last:border-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
