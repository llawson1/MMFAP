import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-300 dark:bg-gray-700", className)}
      {...props}
    />
  )
}

// Specialized skeleton components for common layouts
function TeamCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-6" />
        </div>
      </div>
    </div>
  )
}

function PlayerCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center space-y-1">
          <Skeleton className="h-3 w-8 mx-auto" />
          <Skeleton className="h-2 w-12 mx-auto" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-3 w-8 mx-auto" />
          <Skeleton className="h-2 w-12 mx-auto" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-3 w-8 mx-auto" />
          <Skeleton className="h-2 w-12 mx-auto" />
        </div>
      </div>
    </div>
  )
}

function TransferCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

function ChartSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="h-64 flex items-end space-x-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="p-6 border rounded-lg">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <ChartSkeleton />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} className="p-4">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={8} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="p-4 border rounded-lg space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <TransferCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export { 
  Skeleton,
  TeamCardSkeleton,
  PlayerCardSkeleton,
  TransferCardSkeleton,
  TableRowSkeleton,
  ChartSkeleton,
  DashboardGridSkeleton
}