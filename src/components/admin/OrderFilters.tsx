"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, X, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { lt } from "date-fns/locale";

export interface OrderFiltersState {
  search: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  status: string[];
  serviceType: string[];
  municipality: string;
  city: string;
  propertyType: string;
}

interface FilterData {
  municipalities: string[];
  cities: { municipality: string; cities: string[] }[];
  propertyTypes: string[];
}

interface OrderFiltersProps {
  filters: OrderFiltersState;
  onFiltersChange: (filters: OrderFiltersState) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Laukiama apmokėjimo" },
  { value: "paid", label: "Apmokėta" },
  { value: "done", label: "Atlikta" },
  { value: "failed", label: "Nepavyko" },
];

const SERVICE_TYPE_OPTIONS = [
  { value: "TYPE_1", label: "Automatinis vertinimas (8€)" },
  { value: "TYPE_2", label: "Vertintojo nustatymas (30€)" },
  { value: "TYPE_3", label: "Kainos patikslinimas" },
  { value: "TYPE_4", label: "Turto vertinimas (Bankui)" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "namas", label: "Namas" },
  { value: "butas", label: "Butas" },
  { value: "sklypas", label: "Sklypas" },
  { value: "patalpos", label: "Patalpos" },
];

export function OrderFilters({ filters, onFiltersChange, onClear }: OrderFiltersProps) {
  const [filterData, setFilterData] = useState<FilterData>({
    municipalities: [],
    cities: [],
    propertyTypes: [],
  });
  const [searchInput, setSearchInput] = useState(filters.search);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput });
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Sync search input with filters
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Fetch filter data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch("/api/admin/filters");
        const data = await response.json();
        if (data.success) {
          setFilterData(data.data);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, []);

  // Get cities for selected municipality
  const availableCities = useMemo(() => {
    if (!filters.municipality) return [];
    const municipalityData = filterData.cities.find(
      (c) => c.municipality === filters.municipality
    );
    return municipalityData?.cities || [];
  }, [filters.municipality, filterData.cities]);

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleServiceTypeToggle = (type: string) => {
    const newTypes = filters.serviceType.includes(type)
      ? filters.serviceType.filter((t) => t !== type)
      : [...filters.serviceType, type];
    onFiltersChange({ ...filters, serviceType: newTypes });
  };

  const handleMunicipalityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      municipality: value === "all" ? "" : value,
      city: "", // Reset city when municipality changes
    });
  };

  const handleCityChange = (value: string) => {
    onFiltersChange({ ...filters, city: value === "all" ? "" : value });
  };

  const handlePropertyTypeChange = (value: string) => {
    onFiltersChange({ ...filters, propertyType: value === "all" ? "" : value });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, dateFrom: date });
  };

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, dateTo: date });
  };

  const hasActiveFilters =
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.status.length > 0 ||
    filters.serviceType.length > 0 ||
    filters.municipality ||
    filters.city ||
    filters.propertyType;

  const activeFilterCount = [
    filters.search,
    filters.dateFrom,
    filters.dateTo,
    filters.status.length > 0,
    filters.serviceType.length > 0,
    filters.municipality,
    filters.city,
    filters.propertyType,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar - Always Visible */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ieškoti pagal el. paštą, vardą, token arba adresą..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "min-w-[140px]",
              isExpanded && "bg-blue-50 border-blue-200"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrai
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClear}>
              <X className="h-4 w-4 mr-1" />
              Valyti
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 border rounded-lg bg-gray-50/50 space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data nuo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "yyyy-MM-dd", { locale: lt })
                    ) : (
                      <span>Pasirinkti</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={handleDateFromChange}
                    locale={lt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Data iki</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? (
                      format(filters.dateTo, "yyyy-MM-dd", { locale: lt })
                    ) : (
                      <span>Pasirinkti</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={handleDateToChange}
                    locale={lt}
                    disabled={(date) =>
                      filters.dateFrom ? date < filters.dateFrom : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Savivaldybė</Label>
              <Select
                value={filters.municipality || "all"}
                onValueChange={handleMunicipalityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Visos savivaldybės" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Visos savivaldybės</SelectItem>
                  {filterData.municipalities.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Miestas</Label>
              <Select
                value={filters.city || "all"}
                onValueChange={handleCityChange}
                disabled={!filters.municipality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Visi miestai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Visi miestai</SelectItem>
                  {availableCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Turto tipas</Label>
            <Select
              value={filters.propertyType || "all"}
              onValueChange={handlePropertyTypeChange}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Visi tipai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi tipai</SelectItem>
                {PROPERTY_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Multi-Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Statusas</Label>
            <div className="flex flex-wrap gap-3">
              {STATUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.status.includes(option.value)}
                    onCheckedChange={() => handleStatusToggle(option.value)}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Service Type Multi-Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Paslaugos tipas</Label>
            <div className="flex flex-wrap gap-3">
              {SERVICE_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.serviceType.includes(option.value)}
                    onCheckedChange={() => handleServiceTypeToggle(option.value)}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default empty filters state
export const defaultFilters: OrderFiltersState = {
  search: "",
  dateFrom: undefined,
  dateTo: undefined,
  status: [],
  serviceType: [],
  municipality: "",
  city: "",
  propertyType: "",
};
