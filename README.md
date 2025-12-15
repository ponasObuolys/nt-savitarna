# NT Savitarna - Nekilnojamojo Turto Vertinimo Savitarnos Portalas

Klientų savitarnos portalas, skirtas 1Partner nekilnojamojo turto vertinimo paslaugoms. Sistema leidžia klientams peržiūrėti savo užsakymus, atsisiųsti ataskaitas, o administratoriams - valdyti visus užsakymus ir generuoti ataskaitas.

## Technologijos

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Kalba**: TypeScript 5
- **Duomenų bazė**: MySQL su Prisma 6 ORM
- **Stiliai**: Tailwind CSS 4
- **UI komponentai**: Shadcn/UI (Radix UI pagrindu)
- **Grafikai**: Recharts
- **Autentifikacija**: JWT (jose biblioteka) + bcryptjs
- **Formos**: React Hook Form + Zod validacija
- **Geocoding**: OpenStreetMap Nominatim API

## Projekto struktūra

```
src/
├── app/                      # Next.js App Router puslapiai
│   ├── (admin)/              # Admin route grupė
│   │   └── admin/            # Admin dashboard, užsakymai, ataskaitos
│   ├── (auth)/               # Autentifikacijos route grupė
│   │   ├── login/            # Prisijungimo puslapis
│   │   └── register/         # Registracijos puslapis
│   ├── (dashboard)/          # Kliento dashboard route grupė
│   │   └── dashboard/        # Kliento pradžia, užsakymai
│   ├── api/                  # API endpoints
│   │   ├── admin/            # Admin API (orders, stats, reports)
│   │   ├── auth/             # Auth API (login, logout, register)
│   │   ├── checkout/         # Checkout API
│   │   ├── orders/           # Užsakymų API
│   │   └── seed/             # Dev seed endpoint
│   └── checkout/             # Checkout puslapiai
├── components/               # React komponentai
│   ├── admin/                # Admin komponentai (filtrai, formos)
│   ├── charts/               # Grafikų komponentai
│   ├── layout/               # Layout komponentai (Header, Sidebar)
│   ├── map/                  # Žemėlapio komponentai (Leaflet)
│   ├── orders/               # Užsakymų komponentai
│   ├── reports/              # Ataskaitų komponentai
│   └── ui/                   # Shadcn/UI baziniai komponentai
├── generated/                # Prisma sugeneruotas klientas
├── lib/                      # Utility funkcijos
│   ├── auth.ts               # JWT autentifikacija
│   ├── constants.ts          # Konstantos ir helper funkcijos
│   ├── coordinates.ts        # Koordinačių parsing (MySQL POINT)
│   ├── geocoding.ts          # Adresų geocoding (Nominatim)
│   ├── prisma.ts             # Prisma klientas
│   ├── report-utils.ts       # Ataskaitų helper funkcijos
│   └── utils.ts              # Bendros utility funkcijos
└── types/                    # TypeScript tipai
```

## Diegimas

### 1. Priklausomybių instaliavimas

```bash
npm install
```

### 2. Aplinkos kintamieji

Sukurkite `.env` failą projekto šaknyje:

```env
# Duomenų bazės prisijungimas
DATABASE_URL="mysql://user:password@host:port/database"

# JWT raktas (sugeneruokite saugų raktą)
JWT_SECRET="jusu-saugus-jwt-secret-raktas-minimum-32-simboliai"

# Aplinka
NODE_ENV="development"
```

### 3. Prisma setup

```bash
# Sugeneruoti Prisma klientą
npx prisma generate

# Jei reikia sinchronizuoti schemą su esama DB
npx prisma db pull

# Peržiūrėti duomenų bazę
npx prisma studio
```

### 4. Paleidimas

```bash
# Development režimas
npm run dev

# Production build
npm run build

# Production paleidimas
npm start
```

## Komandos

| Komanda | Aprašymas |
|---------|-----------|
| `npm run dev` | Paleidžia development serverį (http://localhost:3000) |
| `npm run build` | Sukuria production build |
| `npm start` | Paleidžia production serverį |
| `npm run lint` | Paleidžia ESLint tikrinimą |
| `npx prisma generate` | Sugeneruoja Prisma klientą |
| `npx prisma studio` | Atidaro Prisma Studio (DB GUI) |

## Funkcionalumas

### Klientams

- **Prisijungimas/Registracija** - Saugi autentifikacija su JWT
- **Dashboard** - Užsakymų statistika ir greita apžvalga
- **Užsakymų sąrašas** - Visų savo užsakymų peržiūra
- **Užsakymo detalės** - Pilna užsakymo informacija su žemėlapiu
- **PDF atsisiuntimas** - Atliktų vertinimų ataskaitų atsisiuntimas
- **Būsenos sekimas** - Užsakymo būsenos stebėjimas (laukiama/apmokėta/atlikta)

### Administratoriams

- **Admin Dashboard** - Bendra statistika (užsakymai, mėnesio pajamos, klientai)
- **Užsakymų valdymas** - Visų užsakymų peržiūra, filtravimas, redagavimas ir trynimas
- **Užsakymo detalės** - Pilna informacija, žemėlapis, redagavimo forma
- **Paieška** - Užsakymų paieška pagal el. paštą, vardą, token, adresą
- **Filtrai** - Filtravimas pagal būseną, paslaugos tipą, datą
- **Ataskaitos** - Pajamų, klientų aktyvumo, vertintojų apkrovos, geografijos ataskaitos
- **Eksportas** - Ataskaitų eksportas į CSV ir PDF formatus
- **Geocoding** - Automatinis koordinačių nustatymas pagal adresą

### Paslaugų tipai

| Tipas | Pavadinimas | Kaina |
|-------|-------------|-------|
| TYPE_1 | Automatinis vertinimas | 8 € |
| TYPE_2 | Vertintojo nustatymas | 30 € |
| TYPE_3 | Kainos patikslinimas (Apžiūra) | Kintama |
| TYPE_4 | Turto vertinimas (Bankui) | Kintama |

### Užsakymo būsenos

- **Laukiama apmokėjimo** (pending) - Užsakymas sukurtas, laukiama mokėjimo
- **Apmokėta / Vykdoma** (paid) - Mokėjimas gautas, vertinimas vykdomas
- **Atlikta** (completed) - Vertinimas baigtas, galima atsisiųsti PDF

## API Endpoints

### Autentifikacija

```
POST /api/auth/login     - Prisijungimas
POST /api/auth/register  - Registracija
POST /api/auth/logout    - Atsijungimas
```

### Užsakymai

```
GET  /api/orders         - Gauti savo užsakymus (reikia auth)
GET  /api/orders/[id]    - Gauti užsakymo detales (reikia auth)
```

### Admin

```
GET    /api/admin/orders              - Gauti visus užsakymus
GET    /api/admin/orders/[id]         - Gauti užsakymo detales
PUT    /api/admin/orders/[id]         - Atnaujinti užsakymą
DELETE /api/admin/orders/[id]/delete  - Ištrinti užsakymą
POST   /api/admin/orders/[id]/geocode - Nustatyti koordinates pagal adresą
GET    /api/admin/stats               - Gauti statistiką
```

### Ataskaitos (Admin)

```
GET /api/admin/reports/revenue    - Pajamų ataskaita
GET /api/admin/reports/clients    - Klientų aktyvumo ataskaita
GET /api/admin/reports/valuators  - Vertintojų apkrovos ataskaita
GET /api/admin/reports/geography  - Geografijos ataskaita
GET /api/admin/reports/export     - Eksportuoti ataskaitas (CSV/PDF)
```

### Development

```
GET /api/seed            - Sukurti testinius vartotojus (tik dev)
```

## Testiniai prisijungimai

Development aplinkoje galite naudoti `/api/seed` endpoint sukurti testinius vartotojus:

```bash
curl http://localhost:3000/api/seed
```

Arba tiesiog atidaryti naršyklėje: `http://localhost:3000/api/seed`

**Sukuriami vartotojai:**

| Rolė | El. paštas | Slaptažodis |
|------|------------|-------------|
| Admin | admin@1partner.lt | Admin123456 |
| Klientas | test@klientas.lt | client123 |

> **Pastaba:** Admin slaptažodis buvo pakeistas į saugesnį variantą.

## Techniniai sprendimai

### 1. Prisma 6 vietoj Prisma 7

Pasirinkta Prisma 6 versija, nes Prisma 7 reikalauja driver adapters, kurie MySQL palaikymas dar nebuvo pilnai išleistas. Prisma 6 veikia stabiliai su standartiniu MySQL prisijungimu.

### 2. Tipų atskyrimas nuo Prisma kliento

Sukurti atskiri tipai (`src/types/index.ts`) vietoj tiesioginio Prisma tipų importavimo, kad išvengti kliento pusės komponentų problemų su Node.js moduliais.

```typescript
// Vietoj:
import type { uzkl_ivertink1P } from "@/generated/prisma/client";

// Naudojame:
import type { Order } from "@/types";
```

### 3. Service Type enum mapinimas

Prisma schema naudoja `@map("1")` enum reikšmėms saugoti duomenų bazėje, bet TypeScript tipuose naudojamos `"TYPE_1"`, `"TYPE_2"` reikšmės.

```prisma
enum uzkl_ivertink1P_service_type {
  TYPE_1 @map("1")  // DB: "1", TS: "TYPE_1"
  TYPE_2 @map("2")
  ...
}
```

### 4. JWT autentifikacija

Naudojama `jose` biblioteka vietoj `jsonwebtoken`, nes ji geriau veikia su Edge runtime ir Next.js middleware.

### 5. Suspense boundaries

Next.js 16 reikalauja `useSearchParams()` apgaubti `<Suspense>` komponente. Tai implementuota login puslapyje.

### 6. MySQL case sensitivity

MySQL neturi `mode: "insensitive"` palaikymo kaip PostgreSQL. Sprendimas - el. pašto normalizavimas su `.toLowerCase()` prieš saugant ir ieškant.

## Saugumo aspektai

- JWT tokenai saugomi HTTP-only cookies
- Slaptažodžiai hashuojami su bcrypt (12 rounds)
- CSRF apsauga per SameSite cookies
- Role-based access control (admin/client)
- API endpoint apsauga su autentifikacijos middleware

## Žinomos problemos

1. **Middleware deprecation warning** - Next.js 16 rekomenduoja naudoti "proxy" vietoj "middleware". Dabartinė implementacija veikia, bet ateityje reikės migruoti.

2. **PDF atsisiuntimas** - Naudojamas išorinis URL (`vertintojas.pro`). Jei išorinis serveris nepasiekiamas, PDF nebus galima atsisiųsti.

3. **Geocoding rate limit** - Nominatim API turi 1 užklausa/sekundę limitą. Masinis geocoding gali užtrukti.

## Įgyvendintos funkcijos

- [x] Prisijungimas/Registracija su JWT
- [x] Kliento dashboard su statistika
- [x] Admin dashboard su mėnesio pajamomis
- [x] Užsakymų sąrašas su filtrais ir paieška
- [x] Užsakymų redagavimas ir trynimas (admin)
- [x] Interaktyvus žemėlapis su turto lokacija (Leaflet)
- [x] Automatinis geocoding pagal adresą
- [x] Ataskaitos (pajamos, klientai, vertintojai, geografija)
- [x] Ataskaitų eksportas į CSV ir PDF
- [x] PDF ataskaitų atsisiuntimas

## Plėtros galimybės

- [ ] El. pašto notifikacijos
- [ ] Mokėjimų integracija (Stripe/PayPal)
- [ ] Vertintojo priskyrimo funkcionalumas
- [ ] Realaus laiko statusų atnaujinimas (WebSocket)
- [ ] Daugiakalbystė (i18n)
- [ ] PDF generavimas serveryje

## Autoriai

- 1Partner komanda
- Sukurta su Claude Code pagalba

## Licencija

Proprietary - UAB 1Partner. Visos teisės saugomos. Žiūrėti [LICENSE](LICENSE) failą.
