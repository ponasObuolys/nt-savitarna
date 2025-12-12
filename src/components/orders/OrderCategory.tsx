"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { translateFieldName, translateValue, formatBoolean } from "@/lib/translations";

export interface OrderField {
  key: string;
  value: string | number | boolean | Date | null | undefined;
  type?: "text" | "boolean" | "number" | "date" | "link";
  unit?: string;
}

interface OrderCategoryProps {
  title: string;
  icon?: React.ReactNode;
  fields: OrderField[];
  defaultOpen?: boolean;
}

export function OrderCategory({
  title,
  icon,
  fields,
  defaultOpen = false,
}: OrderCategoryProps) {
  // Filter out fields with no value
  const visibleFields = fields.filter(
    (field) => field.value !== null && field.value !== undefined && field.value !== ""
  );

  if (visibleFields.length === 0) {
    return null;
  }

  const formatFieldValue = (field: OrderField): string => {
    const { value, type, unit } = field;

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (type === "boolean" || typeof value === "boolean") {
      return formatBoolean(value as boolean);
    }

    if (type === "number" && typeof value === "number") {
      const formattedNumber = value.toLocaleString("lt-LT");
      return unit ? `${formattedNumber} ${unit}` : formattedNumber;
    }

    if (type === "date" && value) {
      const date = value instanceof Date ? value : new Date(value as string);
      return date.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    // Try to translate the value, fallback to original
    return translateValue(value as string | number | boolean);
  };

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "item" : undefined}
    >
      <AccordionItem value="item" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold">{title}</span>
            <span className="text-sm text-muted-foreground ml-2">
              ({visibleFields.length} laukai)
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
            {visibleFields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {translateFieldName(field.key)}
                </span>
                <span className="font-medium">
                  {formatFieldValue(field)}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
