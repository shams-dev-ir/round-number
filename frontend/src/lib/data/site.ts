import type { Operator, OperatorId, RondType, SimType, SortKey } from "@/lib/types";

export const SITE = {
  name: "روندیکس",
  nameLatin: "RONDIX",
  tagline: "بازار تخصصی شماره‌های رند",
  description:
    "خرید و فروش شماره رند همراه اول، ایرانسل و رایتل با ضمانت انتقال سند، پرداخت امن و کارشناسی قیمت.",
  phone: "021-91009100",
  email: "support@rondix.ir",
  address: "تهران، خیابان ولیعصر، برج نگین، طبقه ۱۲",
  socials: [
    { label: "اینستاگرام", href: "#" },
    { label: "تلگرام", href: "#" },
    { label: "واتساپ", href: "#" },
    { label: "لینکدین", href: "#" },
  ],
} as const;

export const OPERATORS: Operator[] = [
  {
    id: "mci",
    name: "همراه اول",
    shortName: "همراه اول",
    prefixes: ["0912", "0911", "0913", "0914", "0915", "0916", "0917", "0918", "0919", "0990", "0991", "0992"],
    colorVar: "var(--op-mci)",
    logo: "MCI",
  },
  {
    id: "irancell",
    name: "ایرانسل",
    shortName: "ایرانسل",
    prefixes: ["0901", "0902", "0903", "0904", "0905", "0930", "0933", "0935", "0936", "0937", "0938", "0939"],
    colorVar: "var(--op-irancell)",
    logo: "MTN",
  },
  {
    id: "rightel",
    name: "رایتل",
    shortName: "رایتل",
    prefixes: ["0920", "0921", "0922"],
    colorVar: "var(--op-rightel)",
    logo: "RTL",
  },
  {
    id: "shatel",
    name: "شاتل موبایل",
    shortName: "شاتل",
    prefixes: ["0998"],
    colorVar: "var(--op-shatel)",
    logo: "SHM",
  },
  {
    id: "aptel",
    name: "آپتل",
    shortName: "آپتل",
    prefixes: ["0999"],
    colorVar: "var(--op-aptel)",
    logo: "APT",
  },
];

export const OPERATOR_MAP: Record<OperatorId, Operator> = Object.fromEntries(
  OPERATORS.map((o) => [o.id, o]),
) as Record<OperatorId, Operator>;

export const SIM_TYPE_LABELS: Record<SimType, string> = {
  permanent: "دائمی",
  credit: "اعتباری",
};

export const STATUS_LABELS = {
  available: "موجود",
  reserved: "رزرو شده",
  sold: "فروخته شده",
} as const;

interface RondMeta {
  id: RondType;
  label: string;
  example: string;
  hint: string;
}

export const ROND_TYPES: RondMeta[] = [
  { id: "repeat-5", label: "پنج رقم تکراری", example: "0912 111 1110", hint: "کم‌یاب‌ترین دسته بازار" },
  { id: "repeat-4", label: "چهار رقم تکراری", example: "0912 345 5555", hint: "انتخاب اول برندها" },
  { id: "repeat-3", label: "سه رقم تکراری", example: "0912 764 4400", hint: "رند اقتصادی و پرفروش" },
  { id: "code-low", label: "کد پایین", example: "0912 xxx xxxx", hint: "اعتبار و قدمت خط" },
  { id: "thousand", label: "هزاری", example: "0912 486 2000", hint: "به‌یادماندنی برای کسب‌وکار" },
  { id: "hundred", label: "صدی", example: "0912 486 2100", hint: "شروع قیمت مناسب" },
  { id: "mirror", label: "آینه‌ای", example: "0912 341 1433", hint: "قرینه از دو سو" },
  { id: "sequential", label: "ترتیبی", example: "0912 345 6789", hint: "خوانش آسان و روان" },
  { id: "pair", label: "جفت جفت", example: "0912 764 4499", hint: "ریتم‌دار و خوش‌آهنگ" },
  { id: "ladder", label: "پله‌ای", example: "0912 764 5656", hint: "الگوی متناوب" },
  { id: "roll", label: "رول", example: "0912 4 121212", hint: "تکرار یک جفت رقم" },
  { id: "balance", label: "ترازویی", example: "0912 431 1340", hint: "تعادل مجموع ارقام" },
  { id: "birthdate", label: "تاریخ تولد", example: "0912 764 1372", hint: "شخصی و خاص" },
  { id: "speakable", label: "گفتاری", example: "0912 764 8090", hint: "راحت در مکالمه" },
];

export const ROND_LABELS: Record<RondType, string> = Object.fromEntries(
  ROND_TYPES.map((t) => [t.id, t.label]),
) as Record<RondType, string>;

export const CITIES = [
  "تهران",
  "مشهد",
  "اصفهان",
  "شیراز",
  "تبریز",
  "کرج",
  "اهواز",
  "قم",
  "کرمان",
  "رشت",
  "یزد",
  "ارومیه",
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "score-desc", label: "رندترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "popular", label: "پربازدیدترین" },
];

export const PRICE_TIERS = [
  { label: "تا ۵ میلیون", min: 0, max: 5_000_000 },
  { label: "۵ تا ۲۰ میلیون", min: 5_000_000, max: 20_000_000 },
  { label: "۲۰ تا ۱۰۰ میلیون", min: 20_000_000, max: 100_000_000 },
  { label: "۱۰۰ تا ۵۰۰ میلیون", min: 100_000_000, max: 500_000_000 },
  { label: "بالای ۵۰۰ میلیون", min: 500_000_000, max: null },
];

export const MAIN_NAV = [
  { label: "خانه", href: "/" },
  { label: "شماره‌ها", href: "/numbers" },
  { label: "دسته‌بندی رند", href: "/numbers#categories" },
  { label: "فروش شماره", href: "/sell" },
  { label: "قیمت‌گذاری", href: "/valuation" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "تماس با ما", href: "/contact" },
];

export const FOOTER_NAV = [
  {
    title: "بازار",
    links: [
      { label: "همه شماره‌ها", href: "/numbers" },
      { label: "شماره‌های VIP", href: "/numbers?vip=1" },
      { label: "همراه اول", href: "/numbers?operator=mci" },
      { label: "ایرانسل", href: "/numbers?operator=irancell" },
      { label: "رایتل", href: "/numbers?operator=rightel" },
    ],
  },
  {
    title: "خدمات",
    links: [
      { label: "ثبت آگهی فروش", href: "/sell" },
      { label: "کارشناسی قیمت", href: "/valuation" },
      { label: "خرید اقساطی", href: "/faq#installment" },
      { label: "انتقال سند", href: "/faq#transfer" },
      { label: "پنل کاربری", href: "/dashboard" },
    ],
  },
  {
    title: "روندیکس",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "تماس با ما", href: "/contact" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "قوانین و مقررات", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
    ],
  },
];

export const TRUST_POINTS = [
  {
    icon: "shield",
    title: "پرداخت امن امانی",
    body: "مبلغ تا لحظه تأیید انتقال سند در حساب امانی روندیکس نگه داشته می‌شود.",
  },
  {
    icon: "badge",
    title: "اصالت‌سنجی شماره",
    body: "هر شماره پیش از انتشار از نظر مالکیت، بدهی و وضعیت انتقال بررسی می‌شود.",
  },
  {
    icon: "gauge",
    title: "کارشناسی قیمت",
    body: "موتور قیمت‌گذاری ما بر پایه هزاران معامله واقعی، بازه منصفانه را پیشنهاد می‌دهد.",
  },
  {
    icon: "headset",
    title: "پشتیبانی اختصاصی",
    body: "از انتخاب شماره تا تحویل سیم‌کارت، یک کارشناس همراه شماست.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "۰۱",
    title: "شماره را انتخاب کنید",
    body: "با فیلترهای دقیق روی الگوی رند، اپراتور، بازه قیمت و نوع سیم‌کارت، شماره دلخواه را پیدا کنید.",
  },
  {
    step: "۰۲",
    title: "رزرو و پرداخت امانی",
    body: "شماره به نام شما رزرو می‌شود و مبلغ در حساب امانی می‌ماند؛ فروشنده تا تأیید شما به پول دسترسی ندارد.",
  },
  {
    step: "۰۳",
    title: "انتقال سند رسمی",
    body: "کارشناس ما فرآیند انتقال را در دفتر خدمات اپراتور انجام می‌دهد و مدارک را ثبت می‌کند.",
  },
  {
    step: "۰۴",
    title: "تحویل و تضمین",
    body: "سیم‌کارت با پیک ویژه تحویل داده می‌شود و تا ۷ روز ضمانت بازگشت وجه دارید.",
  },
];

export const FAQS = [
  {
    id: "transfer",
    q: "فرآیند انتقال سند شماره چگونه انجام می‌شود؟",
    a: "پس از پرداخت، کارشناس روندیکس زمان حضور در دفتر خدمات اپراتور را با شما و فروشنده هماهنگ می‌کند. انتقال با ارائه کارت ملی طرفین و در حضور کارشناس ما انجام می‌شود و کل فرآیند معمولاً بین ۲۴ تا ۷۲ ساعت کاری زمان می‌برد.",
  },
  {
    id: "escrow",
    q: "پول من تا زمان انتقال کجا نگهداری می‌شود؟",
    a: "مبلغ پرداختی شما در حساب امانی روندیکس بلوکه می‌شود. فروشنده تنها پس از ثبت تأیید نهایی شما در پنل کاربری، به وجه دسترسی پیدا می‌کند. در صورت انصراف فروشنده، مبلغ کامل تا ۲۴ ساعت به حساب شما بازمی‌گردد.",
  },
  {
    id: "installment",
    q: "امکان خرید اقساطی وجود دارد؟",
    a: "بله. شماره‌هایی که نشان «اقساطی» دارند با پیش‌پرداخت ۴۰٪ و بازپرداخت ۳ تا ۱۲ ماهه قابل خرید هستند. سند شماره پس از تسویه کامل به نام خریدار منتقل می‌شود و در این مدت خط در اختیار شما قرار می‌گیرد.",
  },
  {
    id: "pricing",
    q: "قیمت شماره‌های رند بر چه اساسی تعیین می‌شود؟",
    a: "الگوی رند، کد اپراتور، تعداد ارقام تکراری، نوع سیم‌کارت (دائمی یا اعتباری) و میزان تقاضای بازار در امتیاز رندی شماره اثر می‌گذارند. موتور قیمت‌گذاری ما این عوامل را با داده معاملات واقعی می‌سنجد و بازه پیشنهادی می‌دهد.",
  },
  {
    id: "sell",
    q: "برای فروش شماره‌ام چه کاری باید انجام دهم؟",
    a: "در صفحه «فروش شماره» مشخصات خط را ثبت کنید. کارشناسان ما حداکثر تا ۴ ساعت کاری قیمت پیشنهادی را اعلام می‌کنند و پس از تأیید شما، آگهی با نشان «اصالت‌سنجی شده» منتشر می‌شود. کمیسیون روندیکس ۳٪ مبلغ معامله است.",
  },
  {
    id: "guarantee",
    q: "اگر شماره مشکل حقوقی داشته باشد چه می‌شود؟",
    a: "همه شماره‌ها پیش از انتشار از نظر بدهی، مسدودی و مالکیت استعلام می‌شوند. با این حال اگر پس از انتقال مشکلی کشف شود، روندیکس تا ۷ روز مبلغ کامل معامله را بازمی‌گرداند و پیگیری حقوقی را بر عهده می‌گیرد.",
  },
  {
    id: "sim",
    q: "تفاوت سیم‌کارت دائمی و اعتباری در قیمت چقدر است؟",
    a: "سیم‌کارت‌های دائمی به دلیل قابلیت انتقال سند رسمی، اعتبار بیشتر و امکان استفاده سازمانی، معمولاً بین ۳۰ تا ۸۰ درصد گران‌تر از اعتباری با الگوی مشابه هستند.",
  },
];

export const TESTIMONIALS = [
  {
    name: "امیر رضایی",
    role: "مدیر بازاریابی، دیجی‌لند",
    body: "برای کمپین برند به یک شماره چهار رقم تکراری نیاز داشتیم. کارشناسی قیمت روندیکس دقیقاً همان بازه‌ای بود که بازار می‌گفت و انتقال سند در دو روز کاری انجام شد.",
    rating: 5,
  },
  {
    name: "سارا موسوی",
    role: "بنیان‌گذار، کافه ویونا",
    body: "اول از خرید آنلاین شماره می‌ترسیدم، اما حساب امانی خیالم را راحت کرد. تا وقتی خودم انتقال را تأیید نکردم، پول آزاد نشد.",
    rating: 5,
  },
  {
    name: "محمد کاظمی",
    role: "فروشنده حرفه‌ای",
    body: "به‌عنوان فروشنده، پنل مدیریت آگهی‌ها و گزارش بازدیدها را از هر جای دیگری بهتر دیدم. تسویه‌ها هم دقیق و سر وقت انجام می‌شود.",
    rating: 4,
  },
  {
    name: "نگار احمدی",
    role: "مشاور املاک",
    body: "شماره‌ام را با قیمت خوبی فروختم و همان روز آگهی جدیدم تأیید شد. پشتیبانی واقعاً پاسخگو بود.",
    rating: 5,
  },
];

export const STATS = [
  { value: 48_620, suffix: "+", label: "شماره فعال در بازار" },
  { value: 12_400, suffix: "+", label: "معامله موفق" },
  { value: 96, suffix: "%", label: "رضایت خریداران" },
  { value: 24, suffix: " ساعت", label: "میانگین زمان انتقال" },
];
