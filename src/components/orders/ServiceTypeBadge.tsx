import { Badge } from "@/components/ui/badge";
import { getServiceInfo } from "@/lib/constants";
import type { ServiceType } from "@/types";
import { cn } from "@/lib/utils";

interface ServiceTypeBadgeProps {
  serviceType: ServiceType | null;
  showPrice?: boolean;
  className?: string;
}

const SERVICE_COLORS: Record<string, string> = {
  TYPE_1: "bg-purple-100 text-purple-800",
  TYPE_2: "bg-indigo-100 text-indigo-800",
  TYPE_3: "bg-cyan-100 text-cyan-800",
  TYPE_4: "bg-orange-100 text-orange-800",
  unknown: "bg-gray-100 text-gray-800",
};

export function ServiceTypeBadge({ serviceType, showPrice = false, className }: ServiceTypeBadgeProps) {
  const info = getServiceInfo(serviceType);
  const colorClass = SERVICE_COLORS[info.id] || SERVICE_COLORS.unknown;

  return (
    <Badge
      variant="secondary"
      className={cn(colorClass, "font-medium", className)}
    >
      {info.nameLt}
      {showPrice && info.price > 0 && (
        <span className="ml-1 opacity-75">({info.price} €)</span>
      )}
    </Badge>
  );
}
