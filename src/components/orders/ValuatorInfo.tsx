import { getValuatorInfo } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ValuatorInfoProps {
  priskirtaCode: string | null;
  compact?: boolean;
}

export function ValuatorInfo({ priskirtaCode, compact = false }: ValuatorInfoProps) {
  const valuator = getValuatorInfo(priskirtaCode);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-sm">{valuator.name}</p>
          <p className="text-xs text-gray-500">{valuator.email}</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Priskirtas vertintojas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-gray-500">Vardas</p>
          <p className="font-medium">{valuator.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Telefonas</p>
          <a href={`tel:${valuator.phone}`} className="font-medium text-blue-600 hover:underline">
            {valuator.phone}
          </a>
        </div>
        <div>
          <p className="text-sm text-gray-500">El. paštas</p>
          <a href={`mailto:${valuator.email}`} className="font-medium text-blue-600 hover:underline">
            {valuator.email}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
