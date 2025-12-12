"use client";

import * as React from "react";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatePreset, DateFilter } from "@/types";
import { getDateRangeFromPreset, DATE_PRESET_LABELS } from "@/lib/report-utils";

interface DateRangeFilterProps {
  value: DateFilter;
  onChange: (value: DateFilter) => void;
  className?: string;
}

export function DateRangeFilter({
  value,
  onChange,
  className,
}: DateRangeFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Calculate date range for display
  const displayRange = React.useMemo(() => {
    if (value.preset === "custom" && value.dateFrom && value.dateTo) {
      return {
        from: new Date(value.dateFrom),
        to: new Date(value.dateTo),
      };
    }
    const { dateFrom, dateTo } = getDateRangeFromPreset(value.preset);
    return { from: dateFrom, to: dateTo };
  }, [value]);

  // Handle preset change
  const handlePresetChange = (preset: DatePreset) => {
    if (preset === "custom") {
      setIsCalendarOpen(true);
      onChange({
        preset: "custom",
        dateFrom: displayRange.from,
        dateTo: displayRange.to,
      });
    } else {
      onChange({
        preset,
        dateFrom: null,
        dateTo: null,
      });
    }
  };

  // Handle custom date range selection
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange({
        preset: "custom",
        dateFrom: range.from,
        dateTo: range.to,
      });
    } else if (range?.from) {
      onChange({
        preset: "custom",
        dateFrom: range.from,
        dateTo: range.from,
      });
    }
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!displayRange.from) return "Pasirinkite laikotarpį";

    const fromStr = format(displayRange.from, "yyyy-MM-dd", { locale: lt });
    const toStr = displayRange.to
      ? format(displayRange.to, "yyyy-MM-dd", { locale: lt })
      : fromStr;

    if (fromStr === toStr) {
      return fromStr;
    }
    return `${fromStr} - ${toStr}`;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      {/* Preset selector */}
      <Select
        value={value.preset}
        onValueChange={(val) => handlePresetChange(val as DatePreset)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Pasirinkite laikotarpį" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">{DATE_PRESET_LABELS.today}</SelectItem>
          <SelectItem value="week">{DATE_PRESET_LABELS.week}</SelectItem>
          <SelectItem value="month">{DATE_PRESET_LABELS.month}</SelectItem>
          <SelectItem value="quarter">{DATE_PRESET_LABELS.quarter}</SelectItem>
          <SelectItem value="year">{DATE_PRESET_LABELS.year}</SelectItem>
          <SelectItem value="custom">{DATE_PRESET_LABELS.custom}</SelectItem>
        </SelectContent>
      </Select>

      {/* Custom date range picker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[280px] justify-start text-left font-normal",
              !displayRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={displayRange.from}
            selected={{
              from: displayRange.from,
              to: displayRange.to,
            }}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
          <div className="border-t p-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
            >
              Atšaukti
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
            >
              Pritaikyti
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Default filter value
export const DEFAULT_DATE_FILTER: DateFilter = {
  preset: "month",
  dateFrom: null,
  dateTo: null,
};
