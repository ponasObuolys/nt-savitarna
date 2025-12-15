"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({ content, className, iconClassName }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full hover:bg-gray-100 p-0.5 transition-colors",
            className
          )}
        >
          <HelpCircle
            className={cn("h-4 w-4 text-gray-400 hover:text-gray-600", iconClassName)}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
