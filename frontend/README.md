# روندیکس (RONDIX) — فرانت‌اند

بازار تخصصی خرید و فروش شماره رند. این پوشه **فاز اول** پروژه است: فرانت‌اند کامل با داده‌ی نمونه.
فاز دوم (Fastify + PostgreSQL + Redis) در پوشه‌ی `../backend` ساخته می‌شود.

## اجرا

```bash
npm install
```

```bash
npm run dev
```

سپس <http://localhost:3000>.

| دستور | کار |
| --- | --- |
| `npm run dev` | سرور توسعه (Turbopack) |
| `npm run build` | بیلد پروداکشن |
| `npm start` | اجرای بیلد |
| `npm run lint` | ESLint |

## پشته

| ابزار | نسخه |
| --- | --- |
| Next.js (App Router) | 16.3 |
| React | 19.2 |
| Tailwind CSS | 4.3 (پیکربندی CSS-first) |
| TypeScript | 5 |
| Estedad + Sora | تایپوگرافی (از `next/font`، self-host) |
| zustand | سبد خرید، علاقه‌مندی، مقایسه (با `persist`) |
| next-themes | تم روشن/تاریک |
| recharts | نمودارهای پنل مدیریت |
| lucide-react | آیکون‌ها |
| sonner | نوتیفیکیشن |

## تم اختصاصی — «Midnight Aurum»

بن‌مایه‌ی بصری: زمینه‌ی نیلیِ نیمه‌شب + طلایی (aurum) برای ارزش و تمایز.

- همه‌ی توکن‌ها در `src/app/globals.css` تعریف شده‌اند؛ مقادیر خام روی `:root` و `.dark`،
  و نگاشت آن‌ها به یوتیلیتی‌های Tailwind داخل `@theme inline` (تا یک کلاس در هر دو تم کار کند).
- رنگ‌ها با **OKLCH** نوشته شده‌اند و کنتراست متن‌ها در هر دو تم اندازه‌گیری و تنظیم شده است
  (همه‌ی رنگ‌های متنی بالای ۴.۵:۱ روی سطح خودشان).
- طلایی دو گونه دارد: `foil` (گرادیان براق، فقط برای تیترهای بزرگ) و `text-price`
  (طلایی تخت و خوانا برای قیمت‌ها در اندازه‌های کوچک). روی سطوح همیشه‌تاریک از `foil-plate` استفاده شود.
- یوتیلیتی‌های اختصاصی: `glass`، `hairline`، `foil`، `foil-plate`، `brand-gradient`،
  `lattice`، `grid-lines`، `grain`، `no-scrollbar`، `container-page`.

### تایپوگرافی

دو نقش، و فقط دو نقش:

- **Estedad** (متغیر، ۱۰۰–۹۰۰) → تمام متن فارسی، از بدنه تا تیترها. تیترها با **وزن و لیدینگ**
  از متن جدا می‌شوند، نه با فونت دوم. چون فونت متغیر است، وزن‌های بولد واقعی‌اند و مرورگر
  هیچ‌وقت بولد یا ایتالیک مصنوعی نمی‌سازد (`font-synthesis: none`).
- **Sora** (`font-num`) → فقط اعداد مستقل: پلاک شماره، قیمت‌ها، شمارنده‌ها و مونوگرام
  اپراتورها. این فونت گلیف عربی ندارد و عمداً هرگز روی متن فارسی نمی‌نشیند.

قواعدی که رعایت شده‌اند:

- **تراکینگ منفی روی فارسی ممنوع.** خط فارسی متصل است؛ `letter-spacing` منفی — که برای
  تیترهای لاتین عرف است — اتصال حروف را خراب می‌کند. تراکینگ تیترها صفر است و فقط جایی که
  `dir="ltr"` باشد (نام‌های لاتین، کدها) آزاد می‌شود.
- **مقیاس لیدینگ فارسی.** لیدینگ پیش‌فرض Tailwind برای لاتین تنظیم شده. همه‌ی
  `--text-*--line-height`ها بازتعریف شده‌اند: در اندازه‌های خواندنی بازتر (‏xs=1.65 تا
  base=1.85) و در اندازه‌های نمایشی جمع‌تر (‏5xl=1.3)، چون فارسی هم صعودی‌های بلند دارد و هم
  نزولی‌های عمیق.
- فونت‌ها با `next/font` سلف‌هاست می‌شوند (بدون وابستگی به CDN گوگل که در ایران قابل اتکا نیست).

### پلاک شماره

`NumberPlate` امضای بصری سایت است: شماره روی یک سطح تیره‌ی «حکاکی‌شده» نمایش داده می‌شود و
**فقط رقم‌هایی که الگوی رند را می‌سازند طلایی می‌شوند** (تکرار، ترتیب، آینه، رول، پله، سال تولد).
منطق تشخیص در `highlightFlags()` و `analyzeNumber()` در `src/lib/utils.ts` است و این دو همیشه
باید هم‌راستا بمانند — اگر الگویی امتیاز می‌گیرد، باید روی پلاک هم دیده شود.

## ساختار

```
src/
  app/
    (main)/          صفحات عمومی سایت (هدر + فوتر مشترک)
      page.tsx       خانه
      numbers/       فهرست + صفحه‌ی شماره
      cart, checkout, favorites, compare
      sell, valuation, faq, about, contact, terms, privacy
      dashboard/     پنل کاربری (سفارش‌ها، آگهی‌ها، کیف پول، تنظیمات)
    admin/           پنل مدیریت (چیدمان مستقل با سایدبار)
    auth/            ورود و ثبت‌نام (چیدمان دوستونی)
    globals.css      سیستم طراحی
  components/
    ui/              پریمیتیوها: Button, Badge, Card, field, disclosure, misc…
    layout/          Header, Footer, Logo, ThemeToggle, PanelNav, AuthForm
    numbers/         NumberPlate, NumberCard, FiltersPanel, PurchasePanel…
    home/            بخش‌های صفحه‌ی خانه
    admin/           جدول‌ها و نمودارهای پنل مدیریت
  lib/
    types.ts         مدل دامنه
    utils.ts         فرمت‌دهی، تاریخ جلالی، تحلیل رندی
    filters.ts       تبدیل دوطرفه‌ی URL ↔ فیلترها
    valuation.ts     موتور قیمت‌گذاری
    data/            داده‌ی نمونه (site, numbers, account, admin)
  store/             zustand: cart, favorites, compare
  hooks/             useIsHydrated
```

## نکته‌های پیاده‌سازی

**RTL.** کل سایت `dir="rtl"` است و همه‌جا از خواص منطقی استفاده شده
(`ps-`/`pe-`، `ms-`/`me-`، `start-`/`end-`، `text-start`). فیلدهای عددی عمداً `dir="ltr"` ندارند:
ارقام لاتین به‌خودی‌خود چپ‌به‌راست رندر می‌شوند و تغییر جهتِ خودِ اینپوت باعث می‌شد آیکون و
پدینگ در دو سمت مخالف بیفتند.

**تاریخ جلالی.** تبدیل میلادی→شمسی به‌صورت محلی در `utils.ts` پیاده شده و از `Intl` استفاده
نمی‌کند، تا خروجی سرور و کلاینت هرگز اختلاف نداشته باشد (جلوگیری از hydration mismatch).

**داده‌ی قطعی.** کاتالوگ ۲۲۰ شماره‌ای با یک PRNG با seed ثابت ساخته می‌شود، پس در هر رندر
یکسان است. هیچ `Math.random()` یا `Date.now()` در مسیر رندر وجود ندارد.

**فیلترها روی URL.** منبع حقیقتِ نتایج، query string است (`?operator=mci&rond=repeat-4&…`).
پنل فیلتر فقط یک draft محلی نگه می‌دارد. نتیجه: لینک‌ها قابل اشتراک‌گذاری و دکمه‌ی back درست کار می‌کند.

## اتصال به بک‌اند (فاز دوم)

لایه‌ی داده عمداً پشت چند تابع ایزوله شده تا جایگزینی‌اش هیچ کامپوننتی را تغییر ندهد.
کافی است بدنه‌ی این توابع در `src/lib/data/numbers.ts` به `fetch` تبدیل شود:

| تابع | متد و مسیر پیشنهادی |
| --- | --- |
| `queryNumbers(filters)` | `GET /api/numbers?…` |
| `getNumber(id)` | `GET /api/numbers/:msisdn` |
| `getFeatured / getLatest / getBudgetPicks / getDiscounted` | `GET /api/numbers?sort=…&limit=…` |
| `getSimilar(item)` | `GET /api/numbers/:msisdn/similar` |
| `countByRondType / countByOperator` | `GET /api/numbers/facets` |
| `valuate(msisdn, simType)` | `POST /api/valuation` |
| `MY_ORDERS / MY_LISTINGS / WALLET_TX` | `GET /api/me/*` |
| `ADMIN_ORDERS / ADMIN_USERS / PENDING_LISTINGS` | `GET /api/admin/*` |

قراردادِ نوع‌ها از قبل در `src/lib/types.ts` تعریف شده و همان چیزی است که API باید برگرداند.
Redis برای کش کردن facetها و نتایج پرتکرارِ `queryNumbers` مناسب است.

## وضعیت

- ۲۴۹ مسیر بیلد می‌شود؛ `tsc --noEmit` و `eslint` بدون خطا.
- احراز هویت، پرداخت و ثبت آگهی فعلاً شبیه‌سازی‌شده‌اند (کد تأیید نمایشی: `12345`).
- داده‌ها نمونه‌اند و در فاز دوم با API واقعی جایگزین می‌شوند.
