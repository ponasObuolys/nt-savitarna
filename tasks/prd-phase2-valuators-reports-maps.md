# PRD: Fazė 2 - Vertintojų modulis, Ataskaitų modulis, Žemėlapių integracija

## 1. Įvadas/Apžvalga

Šis dokumentas aprašo NT Vertinimo Savitarnos (vid.ntvertintojas.lt) sistemos antrąją plėtros fazę, apimančią:
- Vertintojų modulį su peržiūros funkcionalumu
- Išsamų ataskaitų modulį su interaktyviais grafikais
- OpenStreetMap žemėlapių integraciją turto lokacijai rodyti

**Priklausomybė:** Ši fazė remiasi Fazės 1 rezultatais (registracijos išplėtimas, kliento rodinys, bazinis admin).

**Domenas:** `vid.ntvertintojas.lt`

---

## 2. Tikslai

1. **Vertintojų peržiūra** - leisti admin matyti vertintojų sąrašą su jų priskirtais užsakymais
2. **Ataskaitų sistema** - sukurti išsamią statistikos ir ataskaitų sistemą su grafikais
3. **Žemėlapių integracija** - rodyti turto lokaciją žemėlapyje tiek klientui, tiek admin

---

## 3. Vartotojų istorijos (User Stories)

### Administratorius (role: admin)
- **US-1:** Kaip administratorius, noriu matyti visų vertintojų sąrašą su jų kontaktine informacija.
- **US-2:** Kaip administratorius, noriu matyti, kiek užsakymų priskirta kiekvienam vertintojui.
- **US-3:** Kaip administratorius, noriu matyti užsakymų statistiką pagal laikotarpį interaktyviuose grafikuose.
- **US-4:** Kaip administratorius, noriu matyti pajamų ataskaitą pagal mėnesius ir paslaugų tipus.
- **US-5:** Kaip administratorius, noriu matyti vertintojų apkrovimą (kiek užsakymų vykdo).
- **US-6:** Kaip administratorius, noriu matyti klientų aktyvumo statistiką.
- **US-7:** Kaip administratorius, noriu matyti turto lokaciją žemėlapyje užsakymo detalėse.
- **US-8:** Kaip administratorius, noriu eksportuoti ataskaitas PDF/CSV formatu.

### Klientas (role: client)
- **US-9:** Kaip klientas, noriu matyti savo turto lokaciją žemėlapyje užsakymo detalėse.

---

## 4. Funkciniai reikalavimai

### 4.1 Vertintojų modulis

#### 4.1.1 Vertintojų sąrašo puslapis
| # | Reikalavimas |
|---|-------------|
| FR-1 | Sistema turi turėti `/admin/valuators` puslapį su vertintojų sąrašu |
| FR-2 | Vertintojų lentelė turi rodyti: ID, kodas, vardas, pavardė, telefonas, el. paštas, aktyvus (taip/ne), priskirtų užsakymų skaičius |
| FR-3 | Vertintojų sąrašas turi turėti paiešką pagal vardą, pavardę, kodą |
| FR-4 | Paspaudus ant vertintojo, rodyti jam priskirtų užsakymų sąrašą |
| FR-5 | Sistema turi rodyti vertintojo statistiką: viso užsakymų, šio mėnesio, atliktų, vykdomų |
| FR-6 | Admin NEGALI pridėti/redaguoti/šalinti vertintojų per sistemą (tik peržiūra) |

#### 4.1.2 Vertintojo detalių rodinys
| # | Reikalavimas |
|---|-------------|
| FR-7 | Vertintojo kortelė turi rodyti: pilną vardą, kontaktus, statusą |
| FR-8 | Vertintojo kortelė turi rodyti: užsakymų sąrašą su filtrais (statusas, data) |
| FR-9 | Vertintojo kortelė turi rodyti: mini statistiką (užsakymų per mėnesį grafikas) |

### 4.2 Ataskaitų modulis

#### 4.2.1 Ataskaitų dashboard puslapis
| # | Reikalavimas |
|---|-------------|
| FR-10 | Sistema turi turėti `/admin/reports` puslapį su ataskaitų dashboard |
| FR-11 | Dashboard turi turėti datos filtrus: šiandien, šią savaitę, šį mėnesį, šį ketvirtį, šiuos metus, pasirinktinis laikotarpis |
| FR-12 | Visi grafikai ir lentelės turi reaguoti į datos filtrą |

#### 4.2.2 Užsakymų statistika
| # | Reikalavimas |
|---|-------------|
| FR-13 | Grafikas: Užsakymų skaičius per laikotarpį (line chart, grupuota pagal dieną/savaitę/mėnesį) |
| FR-14 | Grafikas: Užsakymų pasiskirstymas pagal paslaugos tipą (pie chart) |
| FR-15 | Grafikas: Užsakymų pasiskirstymas pagal statusą (pie chart) |
| FR-16 | Grafikas: Užsakymų pasiskirstymas pagal savivaldybę (bar chart, top 10) |
| FR-17 | Grafikas: Užsakymų pasiskirstymas pagal turto tipą (pie chart) |
| FR-18 | Lentelė: Detali užsakymų statistika su skaičiais |

#### 4.2.3 Pajamų ataskaita
| # | Reikalavimas |
|---|-------------|
| FR-19 | Grafikas: Pajamos per laikotarpį (bar chart, grupuota pagal mėnesį) |
| FR-20 | Grafikas: Pajamų pasiskirstymas pagal paslaugos tipą (pie chart) |
| FR-21 | Lentelė: Detali pajamų ataskaita pagal mėnesius |
| FR-22 | Rodikliai: Vidutinė užsakymo vertė, bendros pajamos, prognozuojamos pajamos |
| FR-23 | Pajamos skaičiuojamos: TYPE_1 = 8€, TYPE_2 = 30€, TYPE_3/4 = pagal `price` lauką arba 0 jei nenurodyta |

#### 4.2.4 Vertintojų apkrovimo ataskaita
| # | Reikalavimas |
|---|-------------|
| FR-24 | Grafikas: Užsakymų skaičius pagal vertintoją (horizontal bar chart) |
| FR-25 | Grafikas: Vertintojų apkrovimas per laiką (stacked area chart) |
| FR-26 | Lentelė: Vertintojų reitingas pagal atliktų užsakymų skaičių |
| FR-27 | Rodikliai: Vidutinis užsakymų skaičius vienam vertintojui, labiausiai/mažiausiai apkrautas |

#### 4.2.5 Klientų aktyvumo ataskaita
| # | Reikalavimas |
|---|-------------|
| FR-28 | Grafikas: Naujų klientų registracijos per laiką (line chart) |
| FR-29 | Grafikas: Klientų aktyvumas pagal užsakymų skaičių (histogram) |
| FR-30 | Lentelė: Top 10 aktyviausių klientų (pagal užsakymų skaičių) |
| FR-31 | Rodikliai: Viso klientų, aktyvių klientų (su užsakymais), naujų šį mėnesį |

#### 4.2.6 Geografinė ataskaita
| # | Reikalavimas |
|---|-------------|
| FR-32 | Grafikas: Užsakymų pasiskirstymas pagal savivaldybę (bar chart) |
| FR-33 | Grafikas: Užsakymų pasiskirstymas pagal miestą (top 20, bar chart) |
| FR-34 | Žemėlapis: Heat map su užsakymų koncentracija (jei yra koordinatės) |

#### 4.2.7 Eksportas
| # | Reikalavimas |
|---|-------------|
| FR-35 | Kiekviena ataskaita turi turėti "Eksportuoti CSV" mygtuką |
| FR-36 | Kiekviena ataskaita turi turėti "Eksportuoti PDF" mygtuką |
| FR-37 | Eksportuoti duomenys turi atitikti pasirinktą datos filtrą |

### 4.3 Žemėlapių modulis

#### 4.3.1 Žemėlapio komponentas
| # | Reikalavimas |
|---|-------------|
| FR-38 | Sistema turi naudoti OpenStreetMap (Leaflet.js) žemėlapių rodymui |
| FR-39 | Žemėlapis turi rodyti turto lokaciją pagal `address_coordinates` lauką |
| FR-40 | Žemėlapis turi turėti zoom in/out funkcionalumą |
| FR-41 | Žemėlapis turi turėti pilno ekrano režimą |
| FR-42 | Marker popup turi rodyti adresą: savivaldybė, miestas, gatvė, namo nr. |

#### 4.3.2 Integracija į užsakymo detales
| # | Reikalavimas |
|---|-------------|
| FR-43 | Žemėlapis turi būti rodomas užsakymo detalių puslapyje (klientui) |
| FR-44 | Žemėlapis turi būti rodomas užsakymo detalių puslapyje (admin) |
| FR-45 | Jei `address_coordinates` yra NULL, rodyti pranešimą "Koordinatės nenurodytos" |
| FR-46 | Žemėlapio dydis: 100% pločio, 300px aukščio (desktop), 200px (mobile) |

#### 4.3.3 Koordinačių apdorojimas
| # | Reikalavimas |
|---|-------------|
| FR-47 | Sistema turi apdoroti MySQL POINT tipo `address_coordinates` lauką |
| FR-48 | Sistema turi konvertuoti koordinates į Leaflet formatą [lat, lng] |
| FR-49 | Numatytasis zoom lygis: 15 (gatvės lygis) |

---

## 5. Ne-tikslai (Out of Scope)

| # | Ne-tikslas |
|---|-----------|
| NG-1 | Vertintojų CRUD (pridėjimas/redagavimas/šalinimas) |
| NG-2 | Klientų atsiliepimų/reitingavimo sistema |
| NG-3 | Automatiniai priminimai el. paštu |
| NG-4 | Google Maps integracija |
| NG-5 | Street View funkcionalumas |
| NG-6 | Realaus laiko duomenų atnaujinimas (WebSocket) |
| NG-7 | Mokėjimų/buhalterijos integracija |

---

## 6. Dizaino gairės

### 6.1 Ataskaitų UI principai
- Dashboard stilius su kortelėmis (cards) statistikai
- Grafikai turi būti interaktyvūs (hover tooltip su detalėmis)
- Spalvų kodavimas pagal duomenų tipą (pajamos - žalia, užsakymai - mėlyna)
- Responsive: grafikai turi prisitaikyti prie ekrano dydžio
- Dark mode palaikymas (jei sistema turi)

### 6.2 Grafikų biblioteka
- **Rekomenduojama:** Recharts (React-native, lengva integracija su Next.js)
- Alternatyva: Chart.js su react-chartjs-2

### 6.3 Žemėlapių stilius
- OpenStreetMap default tiles
- Marker: mėlynas pin su popup
- Žemėlapio konteineris su rounded corners ir shadow

### 6.4 Spalvų schema (grafikams)
```javascript
const CHART_COLORS = {
  primary: '#2563eb',    // mėlyna - užsakymai
  success: '#22c55e',    // žalia - pajamos, atlikta
  warning: '#f59e0b',    // geltona - laukia
  error: '#ef4444',      // raudona - nepavyko
  info: '#3b82f6',       // šviesiai mėlyna
  purple: '#8b5cf6',     // violetinė
  pink: '#ec4899',       // rožinė
  orange: '#f97316',     // oranžinė
};
```

---

## 7. Techniniai svarstymai

### 7.1 Nauji API endpoints
| Endpoint | Metodas | Aprašymas |
|----------|---------|-----------|
| `/api/admin/valuators` | GET | Gauti vertintojų sąrašą su statistika |
| `/api/admin/valuators/[id]` | GET | Gauti vertintojo detales ir užsakymus |
| `/api/admin/reports/orders` | GET | Užsakymų statistika (su datos filtru) |
| `/api/admin/reports/revenue` | GET | Pajamų statistika (su datos filtru) |
| `/api/admin/reports/valuators` | GET | Vertintojų apkrovimo statistika |
| `/api/admin/reports/clients` | GET | Klientų aktyvumo statistika |
| `/api/admin/reports/geography` | GET | Geografinė statistika |
| `/api/admin/reports/export` | POST | Eksportuoti ataskaitą (CSV/PDF) |

### 7.2 Datos filtro parametrai
```typescript
interface DateFilter {
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string; // ISO date
  endDate?: string;   // ISO date
  groupBy?: 'day' | 'week' | 'month'; // agregavimui
}
```

### 7.3 Koordinačių konvertavimas
```typescript
// MySQL POINT → Leaflet [lat, lng]
function parseCoordinates(point: Buffer | null): [number, number] | null {
  if (!point) return null;
  // MySQL POINT binary format parsing
  const lat = point.readDoubleLE(9);  // Y coordinate
  const lng = point.readDoubleLE(1);  // X coordinate
  return [lat, lng];
}
```

### 7.4 Priklausomybės (npm packages)
```json
{
  "recharts": "^2.x",           // Grafikams
  "react-leaflet": "^4.x",      // Žemėlapiams
  "leaflet": "^1.x",            // Leaflet core
  "@react-pdf/renderer": "^3.x", // PDF eksportui
  "papaparse": "^5.x"           // CSV eksportui
}
```

### 7.5 Nauji puslapiai
| Puslapis | Kelias | Aprašymas |
|----------|--------|-----------|
| Vertintojai | `/admin/valuators` | Vertintojų sąrašas |
| Vertintojo detalės | `/admin/valuators/[id]` | Konkretaus vertintojo informacija |
| Ataskaitos | `/admin/reports` | Ataskaitų dashboard |

### 7.6 Nauji komponentai
| Komponentas | Vieta | Aprašymas |
|-------------|-------|-----------|
| `MapView` | `src/components/map/MapView.tsx` | OpenStreetMap žemėlapio komponentas |
| `DateRangeFilter` | `src/components/filters/DateRangeFilter.tsx` | Datos filtras ataskaitoms |
| `StatsCard` | `src/components/reports/StatsCard.tsx` | Statistikos kortelė |
| `LineChart` | `src/components/charts/LineChart.tsx` | Linijinis grafikas |
| `PieChart` | `src/components/charts/PieChart.tsx` | Skritulinė diagrama |
| `BarChart` | `src/components/charts/BarChart.tsx` | Stulpelinė diagrama |
| `ExportButton` | `src/components/reports/ExportButton.tsx` | Eksporto mygtukas |

---

## 8. Sėkmės metrikos

| Metrika | Tikslas |
|---------|---------|
| Ataskaitų užkrovimo laikas | < 3s su 10,000+ užsakymų |
| Žemėlapio užkrovimo laikas | < 1s |
| Grafikų responsyvumas | 60fps interakcijoms |
| PDF eksporto laikas | < 5s |
| CSV eksporto laikas | < 2s |

---

## 9. Atviri klausimai

| # | Klausimas | Atsakymas |
|---|-----------|----------|
| Q-1 | Ar reikia grafikų interaktyvumo (hover, click)? | ✅ Taip, hover tooltip su detalėmis |
| Q-2 | Ar heat map žemėlapyje reikalingas? | ⏳ Nice-to-have, jei lieka laiko |
| Q-3 | Maksimalus eksportuojamų įrašų skaičius? | Siūloma: 10,000 |

---

## 10. Priklausomybės

- **Fazė 1 užbaigta:** Registracijos išplėtimas, kliento rodinys, admin funkcionalumas
- **`app_valuators` lentelė:** Turi būti sukurta Fazėje 1
- **`address_coordinates` laukas:** Turi būti POINT tipo MySQL DB
- **Prisma schema:** Atnaujinta su naujais laukais

---

## 11. Rizikos

| Rizika | Tikimybė | Poveikis | Mitigacija |
|--------|----------|----------|------------|
| Didelis duomenų kiekis lėtina ataskaitas | Vidutinė | Aukštas | DB indeksai, cache, pagination, lazy loading |
| Leaflet SSR problemos | Vidutinė | Vidutinis | Dynamic import, client-side only rendering |
| Koordinačių formato nesuderinamumas | Žema | Vidutinis | Robust parsing, fallback values |
| PDF generavimo atminties problemos | Žema | Aukštas | Streaming, chunk processing |

---

## 12. Implementacijos eiliškumas

### Etapas 2.1: Vertintojų modulis (1-2 dienos)
1. Vertintojų sąrašo puslapis
2. Vertintojo detalių rodinys
3. Vertintojo statistikos kortelė

### Etapas 2.2: Žemėlapių integracija (1 diena)
1. Leaflet/OpenStreetMap setup
2. MapView komponentas
3. Integracija į užsakymo detales (klientas + admin)

### Etapas 2.3: Ataskaitų modulis - bazinis (2-3 dienos)
1. Ataskaitų dashboard puslapis
2. Datos filtro komponentas
3. Statistikos kortelės (StatsCard)
4. Baziniai grafikai (užsakymai, pajamos)

### Etapas 2.4: Ataskaitų modulis - išplėstas (2-3 dienos)
1. Vertintojų apkrovimo ataskaita
2. Klientų aktyvumo ataskaita
3. Geografinė ataskaita
4. CSV/PDF eksportas

---

*Dokumentas sukurtas: 2025-12-10*
*Versija: 1.0*
*Autorius: Claude Code*
