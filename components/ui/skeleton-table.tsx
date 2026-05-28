import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

/**
 * Skeleton for table rows
 */
function SkeletonTableRow({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-4 py-3", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 flex-1"
          style={{ maxWidth: i === 0 ? "200px" : undefined }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for full table
 */
function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("gap-y-1", className)}>
      {/* Header */}
      <div className="flex items-center gap-x-4 border-b py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 flex-1"
            style={{ maxWidth: i === 0 ? "200px" : undefined }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  )
}

export { SkeletonTable, SkeletonTableRow }
