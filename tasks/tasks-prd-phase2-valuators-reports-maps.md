# Fazė 2 - Užduočių sąrašas

Sugeneruota pagal: `prd-phase2-valuators-reports-maps.md`

## Relevant Files

### Priklausomybės ir konfigūracija
- `package.json` - Naujų priklausomybių įdiegimas (recharts, react-leaflet, leaflet, papaparse, @react-pdf/renderer)
- `src/lib/chart-colors.ts` - Grafikų spalvų konstantos (naujas)

### Vertintojų modulis
- `src/app/(admin)/admin/valuators/page.tsx` - Vertintojų sąrašo puslapis (naujas)
- `src/app/(admin)/admin/valuators/[id]/page.tsx` - Vertintojo detalių puslapis (naujas)
- `src/app/api/admin/valuators/route.ts` - Vertintojų sąrašo API (atnaujinamas)
- `src/app/api/admin/valuators/[id]/route.ts` - Vertintojo detalių API (naujas)
- `src/components/admin/ValuatorTable.tsx` - Vertintojų lentelė (naujas)
- `src/components/admin/ValuatorCard.tsx` - Vertintojo kortelė su statistika (naujas)
- `src/components/admin/ValuatorOrdersList.tsx` - Vertintojo užsakymų sąrašas (naujas)

### Žemėlapių modulis
- `src/components/map/MapView.tsx` - OpenStreetMap žemėlapio komponentas (naujas)
- `src/components/map/MapMarker.tsx` - Žymeklio komponentas (naujas)
- `src/lib/coordinates.ts` - Koordinačių konvertavimo funkcijos (naujas)
- `src/app/(dashboard)/dashboard/orders/[id]/page.tsx` - Pridėti žemėlapį (atnaujinamas)
- `src/app/(admin)/admin/orders/[id]/page.tsx` - Pridėti žemėlapį (atnaujinamas)

### Ataskaitų modulis - infrastruktūra
- `src/app/(admin)/admin/reports/page.tsx` - Ataskaitų dashboard puslapis (naujas)
- `src/components/filters/DateRangeFilter.tsx` - Datos filtro komponentas (naujas)
- `src/components/reports/StatsCard.tsx` - Statistikos kortelė (naujas)
- `src/lib/report-utils.ts` - Ataskaitų pagalbinės funkcijos (naujas)

### Ataskaitų modulis - grafikai
- `src/components/charts/LineChart.tsx` - Linijinis grafikas (naujas)
- `src/components/charts/PieChart.tsx` - Skritulinė diagrama (naujas)
- `src/components/charts/BarChart.tsx` - Stulpelinė diagrama (naujas)
- `src/components/charts/AreaChart.tsx` - Srities grafikas (naujas)

### Ataskaitų modulis - sekcijos
- `src/components/reports/OrdersStats.tsx` - Užsakymų statistikos sekcija (naujas)
- `src/components/reports/RevenueStats.tsx` - Pajamų statistikos sekcija (naujas)
- `src/components/reports/ValuatorWorkload.tsx` - Vertintojų apkrovimo sekcija (naujas)
- `src/components/reports/ClientActivity.tsx` - Klientų aktyvumo sekcija (naujas)
- `src/components/reports/GeographyStats.tsx` - Geografinė statistika (naujas)

### Ataskaitų API
- `src/app/api/admin/reports/orders/route.ts` - Užsakymų statistikos API (naujas)
- `src/app/api/admin/reports/revenue/route.ts` - Pajamų statistikos API (naujas)
- `src/app/api/admin/reports/valuators/route.ts` - Vertintojų apkrovimo API (naujas)
- `src/app/api/admin/reports/clients/route.ts` - Klientų aktyvumo API (naujas)
- `src/app/api/admin/reports/geography/route.ts` - Geografinės statistikos API (naujas)

### Eksportas
- `src/components/reports/ExportButton.tsx` - Eksporto mygtukas (naujas)
- `src/lib/export/csv-export.ts` - CSV eksporto funkcijos (naujas)
- `src/lib/export/pdf-export.ts` - PDF eksporto funkcijos (naujas)
- `src/app/api/admin/reports/export/route.ts` - Eksporto API endpoint (naujas)

### Navigacija
- `src/components/layout/AdminNav.tsx` - Pridėti "Vertintojai" ir "Ataskaitos" nuorodas (atnaujinamas)

### Tipai
- `src/types/index.ts` - Pridėti DateFilter, ReportData, ChartData interfaces (atnaujinamas)

### Notes

- Ši fazė priklauso nuo Fazės 1 užbaigimo (app_valuators lentelė, admin funkcionalumas)
- Naudojami Recharts grafikams (React-native, lengva Next.js integracija)
- Naudojama react-leaflet/Leaflet žemėlapiams
- Leaflet reikalauja client-side only rendering (dynamic import)
- Koordinatės saugomos MySQL POINT tipo lauke, reikia binary parsing
- PDF eksportui naudojama @react-pdf/renderer
- CSV eksportui naudojama papaparse
- Testų nėra šiame projekte (pagal esamą struktūrą)

---

## Tasks

- [x] 1.0 Priklausomybių įdiegimas ir konfigūracija
  - [x] 1.1 Įdiegti `recharts` biblioteką grafikams (`npm install recharts`)
  - [x] 1.2 Įdiegti `react-leaflet` ir `leaflet` bibliotekas žemėlapiams (`npm install react-leaflet leaflet @types/leaflet`)
  - [x] 1.3 Įdiegti `papaparse` biblioteką CSV eksportui (`npm install papaparse @types/papaparse`)
  - [x] 1.4 Įdiegti `@react-pdf/renderer` biblioteką PDF eksportui (`npm install @react-pdf/renderer`)
  - [x] 1.5 Sukurti `src/lib/chart-colors.ts` su grafikų spalvų konstantomis (CHART_COLORS objektas)
  - [x] 1.6 Atnaujinti `src/types/index.ts` - pridėti `DateFilter`, `ReportData`, `ChartDataPoint` interfaces
  - [x] 1.7 Sukurti `src/lib/report-utils.ts` su pagalbinėmis funkcijomis (datos formatavimas, grupavimas, agregavimas)

- [x] 2.0 Vertintojų modulis
  - [x] 2.1 Atnaujinti `src/app/api/admin/valuators/route.ts` - pridėti statistikos skaičiavimą (priskirtų užsakymų skaičius, atliktų, vykdomų)
  - [x] 2.2 Sukurti `src/app/api/admin/valuators/[id]/route.ts` - GET endpoint vertintojo detalėms ir jo užsakymų sąrašui su filtrais
  - [x] 2.3 Sukurti `src/components/admin/ValuatorTable.tsx` - vertintojų lentelė (ID, kodas, vardas, pavardė, tel, email, aktyvus, užsakymų sk.)
  - [x] 2.4 Sukurti `src/components/admin/ValuatorCard.tsx` - vertintojo statistikos kortelė (viso užsakymų, šio mėnesio, atliktų, vykdomų)
  - [x] 2.5 Sukurti `src/components/admin/ValuatorOrdersList.tsx` - vertintojo užsakymų sąrašas su filtrais (statusas, data)
  - [x] 2.6 Sukurti `src/app/(admin)/admin/valuators/page.tsx` - vertintojų sąrašo puslapis su paieška
  - [x] 2.7 Sukurti `src/app/(admin)/admin/valuators/[id]/page.tsx` - vertintojo detalių puslapis su kortelė + užsakymais + mini grafikas
  - [x] 2.8 Pridėti paiešką pagal vardą, pavardę, kodą vertintojų sąraše
  - [x] 2.9 Implementuoti mini grafiką vertintojo kortelėje (užsakymų per mėnesį, Recharts)
  - [x] 2.10 Atnaujinti admin navigaciją - pridėti "Vertintojai" nuorodą

- [x] 3.0 Žemėlapių integracija (OpenStreetMap/Leaflet)
  - [x] 3.1 Sukurti `src/lib/coordinates.ts` su MySQL POINT → [lat, lng] konvertavimo funkcija
  - [x] 3.2 Sukurti `src/components/map/MapView.tsx` - bazinis OpenStreetMap žemėlapio komponentas (dynamic import, client-only)
  - [x] 3.3 Implementuoti zoom in/out funkcionalumą žemėlapyje
  - [x] 3.4 Implementuoti pilno ekrano režimą žemėlapyje
  - [x] 3.5 Sukurti `src/components/map/MapMarker.tsx` - marker su popup (adresas: savivaldybė, miestas, gatvė, namo nr.)
  - [x] 3.6 Integruoti MapView į kliento užsakymo detalių puslapį (`src/app/(dashboard)/dashboard/orders/[id]/page.tsx`)
  - [x] 3.7 Integruoti MapView į admin užsakymo detalių puslapį (`src/app/(admin)/admin/orders/[id]/page.tsx`)
  - [x] 3.8 Implementuoti "Koordinatės nenurodytos" pranešimą, kai address_coordinates yra NULL
  - [x] 3.9 Pridėti responsive dydžius: 300px aukštis desktop, 200px mobile
  - [x] 3.10 Pridėti Leaflet CSS importą ir stilius (rounded corners, shadow)

- [x] 4.0 Ataskaitų modulis - bazinė infrastruktūra
  - [x] 4.1 Sukurti `src/components/filters/DateRangeFilter.tsx` - datos filtro komponentas (preset: today, week, month, quarter, year, custom)
  - [x] 4.2 Sukurti `src/components/reports/StatsCard.tsx` - statistikos kortelės komponentas (title, value, trend, icon)
  - [x] 4.3 Sukurti `src/app/(admin)/admin/reports/page.tsx` - ataskaitų dashboard puslapis su tabs/sections
  - [x] 4.4 Implementuoti datos filtro state management (URL params arba React state)
  - [x] 4.5 Sukurti bazinį dashboard layout su kortelėmis ir sekcijomis
  - [x] 4.6 Atnaujinti admin navigaciją - pridėti "Ataskaitos" nuorodą
  - [x] 4.7 Sukurti `src/components/charts/ChartWrapper.tsx` - bendras grafikų wrapper su loading state

- [x] 5.0 Ataskaitų modulis - užsakymų ir pajamų statistika
  - [x] 5.1 Sukurti `src/app/api/admin/reports/orders/route.ts` - užsakymų statistikos API su datos filtru
  - [x] 5.2 Sukurti `src/components/charts/LineChart.tsx` - Recharts linijinis grafikas
  - [x] 5.3 Sukurti `src/components/charts/PieChart.tsx` - Recharts skritulinė diagrama
  - [x] 5.4 Sukurti `src/components/charts/BarChart.tsx` - Recharts stulpelinė diagrama
  - [x] 5.5 Sukurti `src/components/reports/OrdersStats.tsx` - užsakymų statistikos sekcija
  - [x] 5.6 Implementuoti grafiką: Užsakymų skaičius per laikotarpį (line chart, grupuota pagal dieną/savaitę/mėnesį)
  - [x] 5.7 Implementuoti grafiką: Užsakymų pasiskirstymas pagal paslaugos tipą (pie chart)
  - [x] 5.8 Implementuoti grafiką: Užsakymų pasiskirstymas pagal statusą (pie chart)
  - [x] 5.9 Implementuoti grafiką: Užsakymų pasiskirstymas pagal savivaldybę (bar chart, top 10)
  - [x] 5.10 Implementuoti grafiką: Užsakymų pasiskirstymas pagal turto tipą (pie chart)
  - [x] 5.11 Sukurti `src/app/api/admin/reports/revenue/route.ts` - pajamų statistikos API
  - [x] 5.12 Sukurti `src/components/reports/RevenueStats.tsx` - pajamų statistikos sekcija
  - [x] 5.13 Implementuoti grafiką: Pajamos per laikotarpį (bar chart, grupuota pagal mėnesį)
  - [x] 5.14 Implementuoti grafiką: Pajamų pasiskirstymas pagal paslaugos tipą (pie chart)
  - [x] 5.15 Implementuoti pajamų skaičiavimo logiką: TYPE_1=8€, TYPE_2=30€, TYPE_3/4=price laukas
  - [x] 5.16 Implementuoti rodiklius: vidutinė užsakymo vertė, bendros pajamos, prognozuojamos pajamos
  - [x] 5.17 Pridėti hover tooltip su detalėmis visiems grafikams

- [x] 6.0 Ataskaitų modulis - vertintojų ir klientų ataskaitos
  - [x] 6.1 Sukurti `src/app/api/admin/reports/valuators/route.ts` - vertintojų apkrovimo API
  - [x] 6.2 Sukurti `src/components/charts/AreaChart.tsx` - Recharts srities grafikas (stacked)
  - [x] 6.3 Sukurti `src/components/reports/ValuatorWorkload.tsx` - vertintojų apkrovimo sekcija
  - [x] 6.4 Implementuoti grafiką: Užsakymų skaičius pagal vertintoją (horizontal bar chart)
  - [x] 6.5 Implementuoti grafiką: Vertintojų apkrovimas per laiką (stacked area chart)
  - [x] 6.6 Implementuoti lentelę: Vertintojų reitingas pagal atliktų užsakymų skaičių
  - [x] 6.7 Implementuoti rodiklius: vidutinis užsakymų skaičius, labiausiai/mažiausiai apkrautas vertintojas
  - [x] 6.8 Sukurti `src/app/api/admin/reports/clients/route.ts` - klientų aktyvumo API
  - [x] 6.9 Sukurti `src/components/reports/ClientActivity.tsx` - klientų aktyvumo sekcija
  - [x] 6.10 Implementuoti grafiką: Naujų klientų registracijos per laiką (line chart)
  - [x] 6.11 Implementuoti grafiką: Klientų aktyvumas pagal užsakymų skaičių (histogram)
  - [x] 6.12 Implementuoti lentelę: Top 10 aktyviausių klientų
  - [x] 6.13 Implementuoti rodiklius: viso klientų, aktyvių klientų, naujų šį mėnesį
  - [x] 6.14 Sukurti `src/app/api/admin/reports/geography/route.ts` - geografinės statistikos API
  - [x] 6.15 Sukurti `src/components/reports/GeographyStats.tsx` - geografinė statistika sekcija
  - [x] 6.16 Implementuoti grafiką: Užsakymų pasiskirstymas pagal savivaldybę (bar chart)
  - [x] 6.17 Implementuoti grafiką: Užsakymų pasiskirstymas pagal miestą (top 20, bar chart)

- [x] 7.0 Eksporto funkcionalumas (CSV/PDF)
  - [x] 7.1 Sukurti `src/lib/export/csv-export.ts` - CSV generavimo funkcijos (papaparse)
  - [x] 7.2 Sukurti `src/lib/export/pdf-export.ts` - PDF generavimo funkcijos (@react-pdf/renderer)
  - [x] 7.3 Sukurti `src/components/reports/ExportButton.tsx` - eksporto mygtukas (CSV/PDF dropdown)
  - [x] 7.4 Sukurti `src/app/api/admin/reports/export/route.ts` - POST endpoint eksportui
  - [x] 7.5 Implementuoti CSV eksportą užsakymų statistikai
  - [x] 7.6 Implementuoti CSV eksportą pajamų ataskaitai
  - [x] 7.7 Implementuoti CSV eksportą vertintojų apkrovimui
  - [x] 7.8 Implementuoti CSV eksportą klientų aktyvumui
  - [x] 7.9 Implementuoti CSV eksportą geografinei statistikai
  - [x] 7.10 Implementuoti PDF eksportą su grafikais (charts as images)
  - [x] 7.11 Pridėti datos filtro taikymą eksportuojamiems duomenims
  - [x] 7.12 Pridėti eksporto limitą (max 10,000 įrašų)
  - [x] 7.13 Pridėti loading state eksporto mygtukui

- [x] 8.0 Testavimas ir optimizacija
  - [x] 8.1 Paleisti `npm run build` ir pataisyti klaidas
  - [x] 8.2 Paleisti `npm run lint` ir pataisyti klaidas
  - [x] 8.3 Testuoti vertintojų sąrašo puslapį ir paiešką
  - [x] 8.4 Testuoti vertintojo detalių puslapį su užsakymais
  - [x] 8.5 Testuoti žemėlapio rodymą kliento puslapyje (su ir be koordinačių)
  - [x] 8.6 Testuoti žemėlapio rodymą admin puslapyje
  - [x] 8.7 Testuoti ataskaitų dashboard su visais grafikais
  - [x] 8.8 Testuoti datos filtro veikimą (visi preset'ai + custom)
  - [x] 8.9 Testuoti CSV eksportą (visoms ataskaitoms)
  - [x] 8.10 Testuoti PDF eksportą
  - [x] 8.11 Testuoti responsive dizainą (mobile) - grafikai ir žemėlapis
  - [x] 8.12 Optimizuoti API queries su DB indeksais (jei reikia)
  - [x] 8.13 Patikrinti ataskaitų užkrovimo laiką (tikslas < 3s)
  - [x] 8.14 Patikrinti žemėlapio užkrovimo laiką (tikslas < 1s)

---

## Pastabos implementacijai

### Prioritetų tvarka
1. **Pirma** - Priklausomybės (1.0) - būtina viskam kitam
2. **Antra** - Vertintojų modulis (2.0) - paprasčiausia funkcionalumo prasme
3. **Trečia** - Žemėlapių integracija (3.0) - nepriklausoma nuo ataskaitų
4. **Ketvirta** - Ataskaitų infrastruktūra (4.0) - bazė kitiems
5. **Penkta** - Ataskaitų grafikai (5.0, 6.0) - galima lygiagrečiai
6. **Šešta** - Eksportas (7.0) - priklauso nuo ataskaitų
7. **Septinta** - Testavimas (8.0)

### Leaflet SSR problema
```typescript
// Leaflet neveikia server-side, reikia dynamic import:
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse" />
});
```

### Recharts naudojimas
```typescript
// Bazinis LineChart pavyzdys
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary} />
  </LineChart>
</ResponsiveContainer>
```

### MySQL POINT koordinačių parsing
```typescript
// src/lib/coordinates.ts
export function parseCoordinates(point: Buffer | null): [number, number] | null {
  if (!point || point.length < 25) return null;
  try {
    const lng = point.readDoubleLE(9);  // X coordinate
    const lat = point.readDoubleLE(17); // Y coordinate
    return [lat, lng];
  } catch {
    return null;
  }
}
```

### API response formatas
```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }

// Reports with date filter
{
  success: true,
  data: T,
  filter: DateFilter,
  generatedAt: string // ISO timestamp
}
```

### Shadcn/UI komponentai (gali reikėti įdiegti)
- Tabs - ataskaitų sekcijoms
- Calendar - custom datos pasirinkimui
- Select - dropdown filtrui
- Badge - statusams

---

*Sugeneruota: 2025-12-10*
*Užduočių skaičius: 8 parent tasks, 87 sub-tasks*
