# Fazė 1 - Užduočių sąrašas

Sugeneruota pagal: `prd-phase1-registration-client-admin.md`

## Relevant Files

### Duomenų bazė ir schema
- `prisma/schema.prisma` - Prisma schema su app_users, app_valuators, uzkl_ivertink1P modeliais
- `src/generated/prisma/` - Sugeneruotas Prisma klientas

### Autentifikacija ir registracija
- `src/app/(auth)/register/page.tsx` - Registracijos puslapis su išplėsta forma
- `src/app/api/auth/register/route.ts` - Registracijos API endpoint
- `src/types/index.ts` - TypeScript tipai (User, Valuator interfaces)
- `src/lib/validations.ts` - Zod validacijos schemos (naujas)

### Vertimai
- `src/lib/translations.ts` - Lietuviški laukų pavadinimai ir reikšmių vertimai (naujas)

### Kliento puslapis
- `src/app/(dashboard)/dashboard/orders/[id]/page.tsx` - Užsakymo detalių puslapis (naujas)
- `src/app/api/orders/[id]/route.ts` - Užsakymo detalių API (naujas)
- `src/components/orders/OrderDetails.tsx` - Užsakymo detalių komponentas (naujas)
- `src/components/orders/OrderCategory.tsx` - Kategorijos komponentas (naujas)

### Admin puslapiai
- `src/app/(admin)/admin/users/page.tsx` - Klientų sąrašo puslapis (naujas)
- `src/app/(admin)/admin/orders/page.tsx` - Užsakymų sąrašas (atnaujinamas)
- `src/app/(admin)/admin/orders/[id]/page.tsx` - Užsakymo detalės admin (naujas)
- `src/components/admin/UserTable.tsx` - Klientų lentelė (naujas)
- `src/components/admin/OrderFilters.tsx` - Filtrų komponentas (naujas)
- `src/components/admin/OrderEditForm.tsx` - Užsakymo redagavimo forma (naujas)

### API endpoints
- `src/app/api/admin/users/route.ts` - Klientų sąrašo API (naujas)
- `src/app/api/admin/orders/[id]/route.ts` - Užsakymo detalės/atnaujinimas API (naujas)
- `src/app/api/admin/filters/route.ts` - Filtrų reikšmių API (naujas)
- `src/app/api/admin/valuators/route.ts` - Vertintojų sąrašo API (naujas)

### Notes

- Šis projektas naudoja Next.js 16 App Router
- Prisma ORM su MySQL duomenų baze (nuotolinė)
- Shadcn/UI komponentai jau įdiegti
- JWT autentifikacija su `jose` biblioteka
- Pagination: 50 įrašų puslapyje (server-side)
- Testų nėra šiame projekte (pagal esamą struktūrą)

---

## Tasks

- [x] 1.0 Duomenų bazės schema ir migracijos
  - [x] 1.1 Atnaujinti `prisma/schema.prisma` - pridėti `first_name`, `last_name`, `phone`, `company` laukus į `app_users` modelį
  - [x] 1.2 Pridėti `app_valuators` modelį į Prisma schema (id, code, first_name, last_name, phone, email, is_active, created_at)
  - [x] 1.3 Pridėti `rc_saskaita` lauką į `uzkl_ivertink1P` modelį
  - [x] 1.4 Paleisti `npx prisma db push` duomenų bazės atnaujinimui
  - [x] 1.5 Paleisti `npx prisma generate` Prisma kliento atnaujinimui
  - [x] 1.6 Atnaujinti `src/types/index.ts` - išplėsti `User` interface su naujais laukais
  - [x] 1.7 Sukurti `Valuator` interface `src/types/index.ts`

- [x] 2.0 Registracijos formos išplėtimas
  - [x] 2.1 Sukurti `src/lib/validations.ts` su Zod schema registracijai (įmonė neprivaloma, vardas/pavardė/tel privalomi, tel formato validacija)
  - [x] 2.2 Atnaujinti `src/app/(auth)/register/page.tsx` - pridėti laukus: Įmonė, Vardas, Pavardė, Telefonas
  - [x] 2.3 Pridėti pranešimą "Profilio duomenų vėliau pakeisti negalima" registracijos formoje
  - [x] 2.4 Atnaujinti `src/app/api/auth/register/route.ts` - priimti ir išsaugoti naujus laukus
  - [x] 2.5 Pridėti telefono numerio validaciją (Lietuvos formatas: +370 arba 8 pradžia)
  - [x] 2.6 Patikrinti, kad el. paštas unikalus (jau turėtų būti)
  - [x] 2.7 Testuoti registracijos formą su naujais laukais

- [x] 3.0 Vertimų sistema (translations)
  - [x] 3.1 Sukurti `src/lib/translations.ts` failą
  - [x] 3.2 Pridėti `FIELD_LABELS` objektą su visais laukų pavadinimais lietuviškai (pagal arr_vals_uzkl.php `$arr_vals`)
  - [x] 3.3 Pridėti `VALUE_TRANSLATIONS` objektą su reikšmių vertimais (pagal arr_vals_uzkl.php `$value_translations`)
  - [x] 3.4 Sukurti `translateFieldName(field: string): string` funkciją
  - [x] 3.5 Sukurti `translateValue(value: string | boolean | null): string` funkciją
  - [x] 3.6 Sukurti `formatBoolean(value: boolean | null): string` funkciją ("Taip"/"Ne"/"-")

- [x] 4.0 Kliento užsakymo detalių puslapis
  - [x] 4.1 Sukurti `src/app/api/orders/[id]/route.ts` - GET endpoint užsakymo detalėms (filtruoti pagal user email)
  - [x] 4.2 Sukurti `src/components/orders/OrderCategory.tsx` - sutraukiama kategorija su laukais
  - [x] 4.3 Sukurti `src/components/orders/OrderDetails.tsx` - pagrindinis detalių komponentas su 5 kategorijomis
  - [x] 4.4 Implementuoti kategoriją "Kontaktinė informacija" (vardas, el. paštas, naujienlaiškis)
  - [x] 4.5 Implementuoti kategoriją "Adresas" (savivaldybė, miestas, gatvė, namo nr, koordinatės, vietos detalės)
  - [x] 4.6 Implementuoti kategoriją "Pagrindinė turto informacija" (turto tipas, paskirtis, energinė klasė, santykis, vertinimo paskirtis, ir kt.)
  - [x] 4.7 Implementuoti kategoriją "Turto detalės" (plotas, statybos metai, kambariai, renovacija, būklė, ir kt.)
  - [x] 4.8 Implementuoti kategoriją "Turto ypatybės" (parkavimas, komunikacijos, papildomos ypatybės)
  - [x] 4.9 Implementuoti kategoriją "Vertinimo rezultatai" (data, kaina nuo/iki, statusas, PDF, sąskaita)
  - [x] 4.10 Sukurti `src/app/(dashboard)/dashboard/orders/[id]/page.tsx` puslapis
  - [x] 4.11 Pridėti PDF atsisiuntimo mygtuką (jei rc_filename užpildytas)
  - [x] 4.12 Pridėti sąskaitos atsisiuntimo mygtuką (jei rc_saskaita užpildytas)
  - [x] 4.13 Atnaujinti `src/app/(dashboard)/dashboard/orders/page.tsx` - pridėti nuorodą į detalių puslapį

- [x] 5.0 Admin: Klientų valdymo puslapis
  - [x] 5.1 Sukurti `src/app/api/admin/users/route.ts` - GET endpoint su paieška ir pagination
  - [x] 5.2 Sukurti `src/components/admin/UserTable.tsx` - klientų lentelė (ID, vardas, pavardė, el. paštas, tel, įmonė, data)
  - [x] 5.3 Pridėti paiešką pagal vardą, pavardę, el. paštą, įmonę
  - [x] 5.4 Sukurti `src/app/(admin)/admin/users/page.tsx` puslapis
  - [x] 5.5 Pridėti server-side pagination (50 įrašų puslapyje)
  - [x] 5.6 Pridėti nuorodą "Peržiūrėti užsakymus" prie kiekvieno kliento
  - [x] 5.7 Atnaujinti admin sidebar/navigation su "Klientai" nuoroda

- [x] 6.0 Admin: Užsakymų filtravimo sistema
  - [x] 6.1 Sukurti `src/app/api/admin/filters/route.ts` - GET endpoint (unikalios savivaldybės, miestai iš DB)
  - [x] 6.2 Sukurti `src/app/api/admin/valuators/route.ts` - GET endpoint vertintojų sąrašui
  - [x] 6.3 Sukurti `src/components/admin/OrderFilters.tsx` filtro komponentą
  - [x] 6.4 Implementuoti datos filtro (nuo-iki) su date picker
  - [x] 6.5 Implementuoti statuso filtro (multi-select: visi, laukia, apmokėta, atlikta, nepavyko)
  - [x] 6.6 Implementuoti paslaugos tipo filtro (multi-select: TYPE_1-4)
  - [x] 6.7 Implementuoti savivaldybės filtro (dropdown iš DB)
  - [x] 6.8 Implementuoti miesto filtro (dropdown, filtruojamas pagal savivaldybę)
  - [x] 6.9 Implementuoti turto tipo filtro (namas, butas, sklypas, patalpos)
  - [x] 6.10 Implementuoti laisvos paieškos lauką (token, vardas, el. paštas, adresas)
  - [x] 6.11 Padaryti filtrus reaktyvius (debounce 300ms)
  - [x] 6.12 Pridėti "Išvalyti filtrus" mygtuką
  - [x] 6.13 Atnaujinti `src/app/api/admin/orders/route.ts` - pridėti filtrų palaikymą
  - [x] 6.14 Atnaujinti `src/app/(admin)/admin/orders/page.tsx` - integruoti filtrus
  - [x] 6.15 Pridėti server-side pagination (50 įrašų, "Rodomi 1-50 iš N")

- [x] 7.0 Admin: Užsakymo redagavimo funkcionalumas
  - [x] 7.1 Sukurti `src/app/api/admin/orders/[id]/route.ts` - GET ir PATCH endpoints
  - [x] 7.2 Sukurti `src/components/admin/OrderEditForm.tsx` - redagavimo forma
  - [x] 7.3 Implementuoti statuso keitimą (dropdown: pending, paid, done, failed)
  - [x] 7.4 Implementuoti vertintojo priskyrimą (dropdown su vertintojais iš DB)
  - [x] 7.5 Implementuoti rc_filename lauko redagavimą (teksto laukas su .pdf validacija)
  - [x] 7.6 Implementuoti rc_saskaita lauko redagavimą (teksto laukas su .pdf validacija)
  - [x] 7.7 Sukurti `src/app/(admin)/admin/orders/[id]/page.tsx` - užsakymo detalės su redagavimu
  - [x] 7.8 Rodyti tas pačias kategorijas kaip kliento puslapyje + papildomus admin laukus (opinion, is_enough_data_for_ai)
  - [x] 7.9 Pridėti "Išsaugoti" mygtuką su loading state
  - [x] 7.10 Pridėti success/error toast pranešimus

- [x] 8.0 Testavimas ir validacija
  - [x] 8.1 Paleisti `npm run build` ir pataisyti klaidas
  - [x] 8.2 Paleisti `npm run lint` ir pataisyti klaidas
  - [x] 8.3 Testuoti registracijos formą su visais laukais
  - [x] 8.4 Testuoti kliento užsakymo detalių puslapį
  - [x] 8.5 Testuoti admin klientų sąrašą ir paiešką
  - [x] 8.6 Testuoti admin užsakymų filtravimą (visi filtrai)
  - [x] 8.7 Testuoti admin užsakymo redagavimą (statusas, vertintojas, PDF)
  - [x] 8.8 Testuoti PDF/sąskaitos atsisiuntimą
  - [x] 8.9 Testuoti responsive dizainą (mobile)
  - [x] 8.10 Patikrinti lietuviškus vertimus visuose puslapiuose

---

## Pastabos implementacijai

### Prioritetų tvarka
1. **Pirma** - DB schema (1.0) - būtina viskam kitam
2. **Antra** - Registracija (2.0) ir Vertimai (3.0) - galima lygiagrečiai
3. **Trečia** - Kliento puslapis (4.0)
4. **Ketvirta** - Admin funkcionalumas (5.0, 6.0, 7.0) - galima lygiagrečiai
5. **Penkta** - Testavimas (8.0)

### Shadcn/UI komponentai (jau įdiegti)
- Button, Input, Card, Table - baziniai
- Select - filtrams
- Dialog - modalams
- Accordion - kategorijoms (collapsible)
- Badge - statusams
- DatePicker - datos filtrui (gali reikėti įdiegti)

### API response formatas
```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }

// Pagination
{ success: true, data: T[], total: number, page: number, pageSize: number }
```

---

*Sugeneruota: 2025-12-10*
*Užduočių skaičius: 8 parent tasks, 73 sub-tasks*
