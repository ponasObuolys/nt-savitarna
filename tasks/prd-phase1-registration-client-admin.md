# PRD: Fazė 1 - Registracijos išplėtimas, Kliento rodinys, Admin funkcionalumas

## 1. Įvadas/Apžvalga

Šis dokumentas aprašo NT Vertinimo Savitarnos (vid.ntvertintojas.lt) sistemos išplėtimą, apimantį:
- Išplėstą vartotojų registracijos formą su papildomais profilio laukais
- Detalų kliento užsakymų rodinį su visais turto vertinimo duomenimis
- Administravimo sistemos funkcionalumo išplėtimą

**Problema:** Dabartinė sistema turi minimalią registraciją (tik email/slaptažodis), ribotą užsakymų rodinį ir bazinį admin funkcionalumą. Klientas (1Partner) reikalauja pilnesnės sistemos NMA agentūrai.

**Domenas:** `vid.ntvertintojas.lt`

---

## 2. Tikslai

1. **Išplėsti vartotojų registraciją** - surinkti pilną kliento informaciją (vardas, pavardė, telefonas, įmonė)
2. **Pagerinti kliento užsakymų rodinį** - rodyti visus turto vertinimo duomenis sugrupuotus į logiškas kategorijas
3. **Išplėsti admin funkcionalumą** - leisti valdyti užsakymus, keisti būsenas, priskirti vertintojus, įkelti PDF

---

## 3. Vartotojų istorijos (User Stories)

### Klientas (role: client)
- **US-1:** Kaip naujas vartotojas, noriu užsiregistruoti nurodydamas savo vardą, pavardę, telefoną, įmonę ir el. paštą, kad galėčiau naudotis sistema.
- **US-2:** Kaip klientas, noriu matyti visą savo užsakymo informaciją (adresas, turto detalės, ypatybės) sugrupuotą į aiškias kategorijas.
- **US-3:** Kaip klientas, noriu matyti vertinimo kainą (nuo-iki), PDF ataskaitą ir sąskaitą, kai jos bus pateiktos.
- **US-4:** Kaip klientas, noriu matyti lietuviškus laukų pavadinimus ir reikšmes.

### Administratorius (role: admin)
- **US-5:** Kaip administratorius, noriu matyti visų klientų užsakymus su pilna informacija.
- **US-6:** Kaip administratorius, noriu filtruoti užsakymus pagal datą, statusą, paslaugos tipą, savivaldybę, miestą.
- **US-7:** Kaip administratorius, noriu keisti užsakymo būseną.
- **US-8:** Kaip administratorius, noriu priskirti vertintoją užsakymui.
- **US-9:** Kaip administratorius, noriu įkelti PDF ataskaitą ir sąskaitą klientui.
- **US-10:** Kaip administratorius, noriu matyti klientų sąrašą su jų profilio informacija.

---

## 4. Funkciniai reikalavimai

### 4.1 Registracijos išplėtimas

#### 4.1.1 Duomenų bazės pakeitimai
| # | Reikalavimas |
|---|-------------|
| FR-1 | Sistema turi išplėsti `app_users` lentelę pridedant laukus: `first_name` (VARCHAR 100, NOT NULL), `last_name` (VARCHAR 100, NOT NULL), `phone` (VARCHAR 20, NOT NULL), `company` (VARCHAR 255, NULL) |
| FR-2 | Sistema turi atnaujinti Prisma schemą ir sugeneruoti naują klientą |

#### 4.1.2 Registracijos forma
| # | Reikalavimas |
|---|-------------|
| FR-3 | Registracijos forma turi turėti laukus: Įmonė (neprivaloma), Vardas (privaloma), Pavardė (privaloma), Telefonas (privaloma), El. paštas (privaloma), Slaptažodis (privaloma), Pakartoti slaptažodį (privaloma) |
| FR-4 | Telefono numeris turi būti validuojamas (Lietuvos formatas: +370 arba 8 pradžia) |
| FR-5 | El. pašto adresas turi būti unikalus sistemoje |
| FR-6 | Slaptažodis turi būti bent 6 simbolių |
| FR-7 | Sistema turi rodyti pranešimą, kad profilio duomenų vėliau pakeisti negalima |
| FR-8 | Po sėkmingos registracijos vartotojas nukreipiamas į `/dashboard` |

#### 4.1.3 Profilio apribojimai
| # | Reikalavimas |
|---|-------------|
| FR-9 | Vartotojas NEGALI redaguoti savo profilio duomenų po registracijos |
| FR-10 | Sistema NETURI "Pamiršau slaptažodį" funkcijos |
| FR-11 | Vartotojas NEGALI keisti slaptažodžio |

### 4.2 Kliento užsakymų rodinys

#### 4.2.1 Prisma schema pakeitimai
| # | Reikalavimas |
|---|-------------|
| FR-12 | Sistema turi pridėti `rc_saskaita` (VARCHAR 100, NULL) lauką į `uzkl_ivertink1P` Prisma schemą |
| FR-13 | Sistema turi pridėti `place_di` (TEXT, NULL) lauką į Prisma schemą (jei dar nėra) |

#### 4.2.2 Užsakymo detalių puslapis
| # | Reikalavimas |
|---|-------------|
| FR-14 | Sistema turi rodyti užsakymo detales sugrupuotas į kategorijas |
| FR-15 | **Kategorija: Kontaktinė informacija** - vardas, el. paštas, sutikimas gauti naujienlaiškį |
| FR-16 | **Kategorija: Adresas** - savivaldybė, miestas, gatvė, namo numeris, koordinatės, vietos detalės |
| FR-17 | **Kategorija: Pagrindinė turto informacija** - turto tipas, paskirtis, energinė klasė, santykis su turtu, vertinimo paskirtis, retrospektyviniai metai, ar parduodama, pardavėjas, konsultacija |
| FR-18 | **Kategorija: Turto detalės** - vidaus plotas, sklypo plotas, statybos metai, vonios, aukštas, aukštų skaičius, kambariai, renovacija, būklė, statybos tipas, šiltinimas, nuotraukos |
| FR-19 | **Kategorija: Turto ypatybės** - parkavimas, sandėliukas, terasa, balkonas, sodas, rūsys, garažas, komunikacijos, projekto planas, papildomos ypatybės |
| FR-20 | **Kategorija: Vertinimo rezultatai** - sukūrimo data, kaina, kaina nuo/iki, statusas, paslaugos tipas, paslaugos kaina, PDF ataskaita, sąskaita |

#### 4.2.3 Lietuviški vertimai
| # | Reikalavimas |
|---|-------------|
| FR-21 | Visi laukų pavadinimai turi būti rodomi lietuviškai (pagal `$arr_vals` masyvą) |
| FR-22 | Visos reikšmės turi būti verčiamos į lietuvių kalbą (pagal `$value_translations` masyvą) |
| FR-23 | Boolean reikšmės: `true/1` → "Taip", `false/0` → "Ne" |
| FR-24 | NULL/tuščios reikšmės turi būti rodomos kaip "-" arba nerodomos |

#### 4.2.4 PDF ir sąskaitos atsisiuntimas
| # | Reikalavimas |
|---|-------------|
| FR-25 | Jei `rc_filename` užpildytas, rodyti mygtuką "Atsisiųsti ataskaitą" (URL: `https://www.vertintojas.pro/d_pdf.php?f={rc_filename}`) |
| FR-26 | Jei `rc_saskaita` užpildytas, rodyti mygtuką "Atsisiųsti sąskaitą" (URL: `https://www.vertintojas.pro/d_pdf.php?f={rc_saskaita}`) |
| FR-27 | service_type 2,3 atveju PDF ir sąskaita įkeliama vertintojo (admin), kitais atvejais - automatiškai |

### 4.3 Administravimo sistema

#### 4.3.1 Klientų sąrašas (naujas puslapis)
| # | Reikalavimas |
|---|-------------|
| FR-28 | Sistema turi turėti `/admin/users` puslapį su visų klientų sąrašu |
| FR-29 | Klientų lentelė turi rodyti: ID, vardas, pavardė, el. paštas, telefonas, įmonė, registracijos data |
| FR-30 | Klientų sąrašas turi turėti paiešką pagal vardą, pavardę, el. paštą, įmonę |
| FR-31 | Paspaudus ant kliento, rodyti jo užsakymų sąrašą |

#### 4.3.2 Užsakymų valdymas (išplėstas)
| # | Reikalavimas |
|---|-------------|
| FR-32 | Užsakymų lentelė turi rodyti: ID, token, klientas (vardas pavardė), el. paštas, paslaugos tipas, statusas, kaina nuo/iki, data, vertintojas |
| FR-33 | Sistema turi leisti keisti užsakymo būseną (dropdown: pending, paid, done, failed) |
| FR-34 | Sistema turi leisti priskirti vertintoją užsakymui (dropdown su vertintojų sąrašu) |
| FR-35 | Sistema turi leisti įkelti/pakeisti PDF ataskaitą (`rc_filename`) |
| FR-36 | Sistema turi leisti įkelti/pakeisti sąskaitą (`rc_saskaita`) |

#### 4.3.3 Užsakymų filtravimas
| # | Reikalavimas |
|---|-------------|
| FR-37 | Filtras: Data nuo - iki (date range picker) |
| FR-38 | Filtras: Statusas (multi-select: visi, laukia apmokėjimo, apmokėta, atlikta, nepavyko) |
| FR-39 | Filtras: Paslaugos tipas (multi-select: TYPE_1, TYPE_2, TYPE_3, TYPE_4) |
| FR-40 | Filtras: Savivaldybė (dropdown su visomis savivaldybėmis iš DB) |
| FR-41 | Filtras: Miestas (dropdown, filtruojamas pagal pasirinktą savivaldybę) |
| FR-42 | Filtras: Turto tipas (dropdown: namas, butas, sklypas, patalpos) |
| FR-43 | Paieška: laisvas tekstas (ieško token, vardas, el. paštas, adresas) |
| FR-44 | Visi filtrai turi veikti reaktyviai (be "Ieškoti" mygtuko paspaudimo) |
| FR-45 | Filtrai turi būti kombinuojami (AND logika) |
| FR-46 | Turi būti mygtukas "Išvalyti filtrus" |

#### 4.3.4 Užsakymo detalių peržiūra (admin)
| # | Reikalavimas |
|---|-------------|
| FR-47 | Admin turi matyti tą patį detalų užsakymo rodinį kaip klientas |
| FR-48 | Papildomai admin mato: `opinion`, `is_enough_data_for_ai`, vidinę informaciją |
| FR-49 | Admin gali redaguoti: statusą, vertintoją, rc_filename, rc_saskaita |

#### 4.3.5 PDF failo pavadinimo valdymas
| # | Reikalavimas |
|---|-------------|
| FR-50 | Admin gali įvesti/redaguoti PDF failo pavadinimą (`rc_filename`) per teksto lauką |
| FR-51 | Admin gali įvesti/redaguoti sąskaitos failo pavadinimą (`rc_saskaita`) per teksto lauką |
| FR-52 | Sistema turi validuoti, kad failo pavadinimas baigiasi `.pdf` |
| FR-53 | Failai fiziškai saugomi išoriniame serveryje (vertintojas.pro), sistema saugo tik pavadinimą |

---

## 5. Ne-tikslai (Out of Scope)

| # | Ne-tikslas |
|---|-----------|
| NG-1 | Slaptažodžio keitimo funkcija |
| NG-2 | "Pamiršau slaptažodį" funkcija |
| NG-3 | Profilio redagavimas po registracijos |
| NG-4 | Vartotojų šalinimas |
| NG-5 | Mokėjimų integracija (Paysera) |
| NG-6 | Buhalterinės programos integracija |
| NG-7 | Realaus laiko atnaujinimai (WebSocket) |
| NG-8 | El. pašto pranešimai |
| NG-9 | Žemėlapių integracija (Fazė 3) |
| NG-10 | Ataskaitų modulis (Fazė 3) |

---

## 6. Dizaino gairės

### 6.1 UI/UX principai
- Švarus, minimalistinis dizainas (balta/mėlyna spalvos, 1Partner stilius)
- Responsive dizainas (mobiliems įrenginiams)
- Aiškūs "Call to Action" mygtukai
- Filtrai turi būti kompaktiški, bet lengvai pasiekiami
- Kategorijos turi būti sutraukiamos (collapsible) geresnei navigacijai

### 6.2 Komponentai (Shadcn/UI)
- Naudoti esamus Shadcn/UI komponentus
- Filtrams: Select, DatePicker, Input
- Lentelėms: Table su pagination
- Detalėms: Card, Accordion (kategorijoms)
- Veiksmams: Button, Dialog (modalai)

### 6.3 Spalvų schema
- Primary: #2563eb (mėlyna)
- Success: #22c55e (žalia) - atlikta
- Warning: #f59e0b (geltona) - laukia
- Error: #ef4444 (raudona) - nepavyko
- Info: #3b82f6 (šviesiai mėlyna) - vykdoma

---

## 7. Techniniai svarstymai

### 7.1 Duomenų bazės migracija
```sql
-- app_users lentelės išplėtimas
ALTER TABLE app_users
ADD COLUMN first_name VARCHAR(100) NOT NULL DEFAULT '' AFTER email,
ADD COLUMN last_name VARCHAR(100) NOT NULL DEFAULT '' AFTER first_name,
ADD COLUMN phone VARCHAR(20) NOT NULL DEFAULT '' AFTER last_name,
ADD COLUMN company VARCHAR(255) NULL AFTER phone;

-- uzkl_ivertink1P lentelės papildymas (jei rc_saskaita dar nėra)
ALTER TABLE uzkl_ivertink1P
ADD COLUMN rc_saskaita VARCHAR(100) NULL AFTER rc_filename;

-- Vertintojų lentelė (nauja)
CREATE TABLE app_valuators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7.2 API endpoints (nauji/atnaujinti)
| Endpoint | Metodas | Aprašymas |
|----------|---------|-----------|
| `/api/auth/register` | POST | Atnaujinti - priimti naujus laukus |
| `/api/orders/[id]` | GET | Naujas - gauti užsakymo detales |
| `/api/admin/users` | GET | Naujas - gauti vartotojų sąrašą |
| `/api/admin/orders/[id]` | GET | Naujas - gauti užsakymo detales (admin) |
| `/api/admin/orders/[id]` | PATCH | Naujas - atnaujinti užsakymą (statusas, vertintojas, rc_filename, rc_saskaita) |
| `/api/admin/filters` | GET | Naujas - gauti filtrų reikšmes (savivaldybės, miestai) |
| `/api/admin/valuators` | GET | Naujas - gauti vertintojų sąrašą iš DB |

### 7.3 Failų saugojimas
- PDF failai saugomi išoriniame serveryje (vertintojas.pro)
- DB saugomas tik failo pavadinimas (`rc_filename`, `rc_saskaita`)
- Admin įveda/atnaujina failo pavadinimą per formą (ne upload)

### 7.4 Pagination
- Puslapiavimas: 50 įrašų puslapyje
- Naudoti server-side pagination (ne client-side)
- Rodyti: "Rodomi 1-50 iš 234 įrašų"

### 7.5 Vertimų sistema
- Sukurti `/src/lib/translations.ts` su `$arr_vals` ir `$value_translations` duomenimis
- Eksportuoti funkcijas: `translateFieldName(field)`, `translateValue(value)`

### 7.6 Tipai (TypeScript)
- Išplėsti `User` interface su naujais laukais
- Sukurti `OrderDetails` interface su visais laukais
- Sukurti `OrderFilters` interface filtrams

---

## 8. Sėkmės metrikos

| Metrika | Tikslas |
|---------|---------|
| Registracijos užbaigimo rodiklis | > 90% pradėjusių užbaigia registraciją |
| Admin filtrų naudojimas | Filtrai veikia < 500ms |
| Puslapio užkrovimo laikas | < 2s užsakymų sąrašui |
| Klaidų rodiklis | < 1% API užklausų |

---

## 9. Atviri klausimai (ATSAKYTA)

| # | Klausimas | Atsakymas |
|---|-----------|----------|
| Q-1 | Ar PDF failai bus saugomi lokaliame serveryje ar naudosime esamą vertintojas.pro infrastruktūrą? | ✅ Saugomi nuotolinėje MySQL DB (per Prisma) - tik failo pavadinimas, pats failas vertintojas.pro |
| Q-2 | Ar reikia vertintojų sąrašo valdymo (CRUD), ar pakanka hardcoded sąrašo? | ✅ Vertintojų sąrašas saugomas nuotolinėje MySQL DB (nauja lentelė) |
| Q-3 | Koks maksimalus užsakymų skaičius puslapyje (pagination)? | ✅ 50 įrašų puslapyje |
| Q-4 | Ar filtrai turi būti išsaugomi URL (shareable links)? | ✅ Nereikia - filtrai nesaugomi URL

---

## 10. Priklausomybės

- Esama `uzkl_ivertink1P` lentelė (read-write dabar, ne read-only)
- Esama `app_users` lentelė (išplečiama)
- Esamas JWT autentifikacijos mechanizmas
- Shadcn/UI komponentų biblioteka

---

## 11. Rizikos

| Rizika | Tikimybė | Poveikis | Mitigacija |
|--------|----------|----------|------------|
| DB migracijos problemos | Vidutinė | Aukštas | Backup prieš migraciją, staging testavimas |
| Didelis duomenų kiekis lėtina filtrus | Žema | Vidutinis | DB indeksai, pagination, debounce filtrams |
| Failų įkėlimo saugumo problemos | Vidutinė | Aukštas | Validacija, tipo tikrinimas, dydžio limitas |

---

*Dokumentas sukurtas: 2025-12-10*
*Versija: 1.1 (atnaujinta su atsakytais klausimais)*
*Autorius: Claude Code*
