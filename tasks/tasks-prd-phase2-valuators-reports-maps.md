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

- [ ] 1.0 Priklausomybių įdiegimas ir konfigūracija
  - [ ] 1.1 Įdiegti `recharts` biblioteką grafikams (`npm install recharts`)
  - [ ] 1.2 Įdiegti `react-leaflet` ir `leaflet` bibliotekas žemėlapiams (`npm install react-leaflet leaflet @types/leaflet`)
  - [ ] 1.3 Įdiegti `papaparse` biblioteką CSV eksportui (`npm install papaparse @types/papaparse`)
  - [ ] 1.4 Įdiegti `@react-pdf/renderer` biblioteką PDF eksportui (`npm install @react-pdf/renderer`)
  - [ ] 1.5 Sukurti `src/lib/chart-colors.ts` su grafikų spalvų konstantomis (CHART_COLORS objektas)
  - [ ] 1.6 Atnaujinti `src/types/index.ts` - pridėti `DateFilter`, `ReportData`, `ChartDataPoint` interfaces
  - [ ] 1.7 Sukurti `src/lib/report-utils.ts` su pagalbinėmis funkcijomis (datos formatavimas, grupavimas, agregavimas)

- [ ] 2.0 Vertintojų modulis
  - [ ] 2.1 Atnaujinti `src/app/api/admin/valuators/route.ts` - pridėti statistikos skaičiavimą (priskirtų užsakymų skaičius, atliktų, vykdomų)
  - [ ] 2.2 Sukurti `src/app/api/admin/valuators/[id]/route.ts` - GET endpoint vertintojo detalėms ir jo užsakymų sąrašui su filtrais
  - [ ] 2.3 Sukurti `src/components/admin/ValuatorTable.tsx` - vertintojų lentelė (ID, kodas, vardas, pavardė, tel, email, aktyvus, užsakymų sk.)
  - [ ] 2.4 Sukurti `src/components/admin/ValuatorCard.tsx` - vertintojo statistikos kortelė (viso užsakymų, šio mėnesio, atliktų, vykdomų)
  - [ ] 2.5 Sukurti `src/components/admin/ValuatorOrdersList.tsx` - vertintojo užsakymų sąrašas su filtrais (statusas, data)
  - [ ] 2.6 Sukurti `src/app/(admin)/admin/valuators/page.tsx` - vertintojų sąrašo puslapis su paieška
  - [ ] 2.7 Sukurti `src/app/(admin)/admin/valuators/[id]/page.tsx` - vertintojo detalių puslapis su kortelė + užsakymais + mini grafikas
  - [ ] 2.8 Pridėti paiešką pagal vardą, pavardę, kodą vertintojų sąraše
  - [ ] 2.9 Implementuoti mini grafiką vertintojo kortelėje (užsakymų per mėnesį, Recharts)
  - [ ] 2.10 Atnaujinti admin navigaciją - pridėti "Vertintojai" nuorodą

- [ ] 3.0 Žemėlapių integracija (OpenStreetMap/Leaflet)
  - [ ] 3.1 Sukurti `src/lib/coordinates.ts` su MySQL POINT → [lat, lng] konvertavimo funkcija
  - [ ] 3.2 Sukurti `src/components/map/MapView.tsx` - bazinis OpenStreetMap žemėlapio komponentas (dynamic import, client-only)
  - [ ] 3.3 Implementuoti zoom in/out funkcionalumą žemėlapyje
  - [ ] 3.4 Implementuoti pilno ekrano režimą žemėlapyje
  - [ ] 3.5 Sukurti `src/components/map/MapMarker.tsx` - marker su popup (adresas: savivaldybė, miestas, gatvė, namo nr.)
  - [ ] 3.6 Integruoti MapView į kliento užsakymo detalių puslapį (`src/app/(dashboard)/dashboard/orders/[id]/page.tsx`)
  - [ ] 3.7 Integruoti MapView į admin užsakymo detalių puslapį (`src/app/(admin)/admin/orders/[id]/page.tsx`)
  - [ ] 3.8 Implementuoti "Koordinatės nenurodytos" pranešimą, kai address_coordinates yra NULL
  - [ ] 3.9 Pridėti responsive dydžius: 300px aukštis desktop, 200px mobile
  - [ ] 3.10 Pridėti Leaflet CSS importą ir stilius (rounded corners, shadow)

- [ ] 4.0 Ataskaitų modulis - bazinė infrastruktūra
  - [ ] 4.1 Sukurti `src/components/filters/DateRangeFilter.tsx` - datos filtro komponentas (preset: today, week, month, quarter, year, custom)
  - [ ] 4.2 Sukurti `src/components/reports/StatsCard.tsx` - statistikos kortelės komponentas (title, value, trend, icon)
  - [ ] 4.3 Sukurti `src/app/(admin)/admin/reports/page.tsx` - ataskaitų dashboard puslapis su tabs/sections
  - [ ] 4.4 Implementuoti datos filtro state management (URL params arba React state)
  - [ ] 4.5 Sukurti bazinį dashboard layout su kortelėmis ir sekcijomis
  - [ ] 4.6 Atnaujinti admin navigaciją - pridėti "Ataskaitos" nuorodą
  - [ ] 4.7 Sukurti `src/components/charts/ChartWrapper.tsx` - bendras grafikų wrapper su loading state

- [ ] 5.0 Ataskaitų modulis - užsakymų ir pajamų statistika
  - [ ] 5.1 Sukurti `src/app/api/admin/reports/orders/route.ts` - užsakymų statistikos API su datos filtru
  - [ ] 5.2 Sukurti `src/components/charts/LineChart.tsx` - Recharts linijinis grafikas
  - [ ] 5.3 Sukurti `src/components/charts/PieChart.tsx` - Recharts skritulinė diagrama
  - [ ] 5.4 Sukurti `src/components/charts/BarChart.tsx` - Recharts stulpelinė diagrama
  - [ ] 5.5 Sukurti `src/components/reports/OrdersStats.tsx` - užsakymų statistikos sekcija
  - [ ] 5.6 Implementuoti grafiką: Užsakymų skaičius per laikotarpį (line chart, grupuota pagal dieną/savaitę/mėnesį)
  - [ ] 5.7 Implementuoti grafiką: Užsakymų pasiskirstymas pagal paslaugos tipą (pie chart)
  - [ ] 5.8 Implementuoti grafiką: Užsakymų pasiskirstymas pagal statusą (pie chart)
  - [ ] 5.9 Implementuoti grafiką: Užsakymų pasiskirstymas pagal savivaldybę (bar chart, top 10)
  - [ ] 5.10 Implementuoti grafiką: Užsakymų pasiskirstymas pagal turto tipą (pie chart)
  - [ ] 5.11 Sukurti `src/app/api/admin/reports/revenue/route.ts` - pajamų statistikos API
  - [ ] 5.12 Sukurti `src/components/reports/RevenueStats.tsx` - pajamų statistikos sekcija
  - [ ] 5.13 Implementuoti grafiką: Pajamos per laikotarpį (bar chart, grupuota pagal mėnesį)
  - [ ] 5.14 Implementuoti grafiką: Pajamų pasiskirstymas pagal paslaugos tipą (pie chart)
  - [ ] 5.15 Implementuoti pajamų skaičiavimo logiką: TYPE_1=8€, TYPE_2=30€, TYPE_3/4=price laukas
  - [ ] 5.16 Implementuoti rodiklius: vidutinė užsakymo vertė, bendros pajamos, prognozuojamos pajamos
  - [ ] 5.17 Pridėti hover tooltip su detalėmis visiems grafikams

- [ ] 6.0 Ataskaitų modulis - vertintojų ir klientų ataskaitos
  - [ ] 6.1 Sukurti `src/app/api/admin/reports/valuators/route.ts` - vertintojų apkrovimo API
  - [ ] 6.2 Sukurti `src/components/charts/AreaChart.tsx` - Recharts srities grafikas (stacked)
  - [ ] 6.3 Sukurti `src/components/reports/ValuatorWorkload.tsx` - vertintojų apkrovimo sekcija
  - [ ] 6.4 Implementuoti grafiką: Užsakymų skaičius pagal vertintoją (horizontal bar chart)
  - [ ] 6.5 Implementuoti grafiką: Vertintojų apkrovimas per laiką (stacked area chart)
  - [ ] 6.6 Implementuoti lentelę: Vertintojų reitingas pagal atliktų užsakymų skaičių
  - [ ] 6.7 Implementuoti rodiklius: vidutinis užsakymų skaičius, labiausiai/mažiausiai apkrautas vertintojas
  - [ ] 6.8 Sukurti `src/app/api/admin/reports/clients/route.ts` - klientų aktyvumo API
  - [ ] 6.9 Sukurti `src/components/reports/ClientActivity.tsx` - klientų aktyvumo sekcija
  - [ ] 6.10 Implementuoti grafiką: Naujų klientų registracijos per laiką (line chart)
  - [ ] 6.11 Implementuoti grafiką: Klientų aktyvumas pagal užsakymų skaičių (histogram)
  - [ ] 6.12 Implementuoti lentelę: Top 10 aktyviausių klientų
  - [ ] 6.13 Implementuoti rodiklius: viso klientų, aktyvių klientų, naujų šį mėnesį
  - [ ] 6.14 Sukurti `src/app/api/admin/reports/geography/route.ts` - geografinės statistikos API
  - [ ] 6.15 Sukurti `src/components/reports/GeographyStats.tsx` - geografinė statistika sekcija
  - [ ] 6.16 Implementuoti grafiką: Užsakymų pasiskirstymas pagal savivaldybę (bar chart)
  - [ ] 6.17 Implementuoti grafiką: Užsakymų pasiskirstymas pagal miestą (top 20, bar chart)

- [ ] 7.0 Eksporto funkcionalumas (CSV/PDF)
  - [ ] 7.1 Sukurti `src/lib/export/csv-export.ts` - CSV generavimo funkcijos (papaparse)
  - [ ] 7.2 Sukurti `src/lib/export/pdf-export.ts` - PDF generavimo funkcijos (@react-pdf/renderer)
  - [ ] 7.3 Sukurti `src/components/reports/ExportButton.tsx` - eksporto mygtukas (CSV/PDF dropdown)
  - [ ] 7.4 Sukurti `src/app/api/admin/reports/export/route.ts` - POST endpoint eksportui
  - [ ] 7.5 Implementuoti CSV eksportą užsakymų statistikai
  - [ ] 7.6 Implementuoti CSV eksportą pajamų ataskaitai
  - [ ] 7.7 Implementuoti CSV eksportą vertintojų apkrovimui
  - [ ] 7.8 Implementuoti CSV eksportą klientų aktyvumui
  - [ ] 7.9 Implementuoti CSV eksportą geografinei statistikai
  - [ ] 7.10 Implementuoti PDF eksportą su grafikais (charts as images)
  - [ ] 7.11 Pridėti datos filtro taikymą eksportuojamiems duomenims
  - [ ] 7.12 Pridėti eksporto limitą (max 10,000 įrašų)
  - [ ] 7.13 Pridėti loading state eksporto mygtukui

- [ ] 8.0 Testavimas ir optimizacija
  - [ ] 8.1 Paleisti `npm run build` ir pataisyti klaidas
  - [ ] 8.2 Paleisti `npm run lint` ir pataisyti klaidas
  - [ ] 8.3 Testuoti vertintojų sąrašo puslapį ir paiešką
  - [ ] 8.4 Testuoti vertintojo detalių puslapį su užsakymais
  - [ ] 8.5 Testuoti žemėlapio rodymą kliento puslapyje (su ir be koordinačių)
  - [ ] 8.6 Testuoti žemėlapio rodymą admin puslapyje
  - [ ] 8.7 Testuoti ataskaitų dashboard su visais grafikais
  - [ ] 8.8 Testuoti datos filtro veikimą (visi preset'ai + custom)
  - [ ] 8.9 Testuoti CSV eksportą (visoms ataskaitoms)
  - [ ] 8.10 Testuoti PDF eksportą
  - [ ] 8.11 Testuoti responsive dizainą (mobile) - grafikai ir žemėlapis
  - [ ] 8.12 Optimizuoti API queries su DB indeksais (jei reikia)
  - [ ] 8.13 Patikrinti ataskaitų užkrovimo laiką (tikslas < 3s)
  - [ ] 8.14 Patikrinti žemėlapio užkrovimo laiką (tikslas < 1s)

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
