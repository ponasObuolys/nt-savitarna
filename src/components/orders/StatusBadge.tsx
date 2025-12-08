import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import type { OrderDisplayStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderDisplayStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(STATUS_COLORS[status], "font-medium", className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
