import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-2">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-6 w-1/4" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Card>
            <CardContent className="grid gap-4 p-6">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
