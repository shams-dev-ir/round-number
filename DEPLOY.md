# راه‌اندازی CI/CD روی سرور خودت

هدف: هر بار که روی شاخه‌ی `main` پوش کنی، گیت‌هاب خودش بیلد بگیرد و سایت روی سرورت
به‌روز شود — بدون هیچ کار دستی.

**چطور کار می‌کند:** بیلد کاملاً روی گیت‌هاب انجام می‌شود و فقط فایل‌های آماده با `rsync`
روی سرور کپی می‌شوند. سرور هیچ‌وقت `npm install` یا بیلد اجرا نمی‌کند؛ فقط فایل می‌گیرد و
سرویس را ری‌استارت می‌کند. برای همین دیپلوی سریع است و رم سرور درگیر بیلد نمی‌شود.

---

## پیش‌نیازها

- یک سرور مجازی (VPS) با اوبونتو ۲۲/۲۴ یا دبیان ۱۲ — حداقل ۱ گیگ رم
- دسترسی root با SSH
- یک اکانت گیت‌هاب

**دامنه نداری؟ لازم نیست.** از سرویس‌های wildcard-DNS استفاده کن که خودکار به IP تو
اشاره می‌کنند. اگر IP سرورت `203.0.113.5` است، این دامنه بدون هیچ تنظیمی کار می‌کند:

```
203.0.113.5.nip.io
```

هم برای تست عالی است، هم Let's Encrypt رویش گواهی SSL می‌دهد. بعداً که دامنه‌ی واقعی
گرفتی فقط `server_name` را در nginx عوض می‌کنی.

---

## گام ۱ — ریپوی گیت‌هاب را بساز

در گیت‌هاب یک ریپوی **خالی** بساز (بدون README و بدون gitignore) — مثلاً `rondix`.
بعد در همین پوشه:

```bash
git commit -m "Rondix frontend + CI/CD"
```

```bash
git remote add origin https://github.com/USERNAME/rondix.git
```

```bash
git push -u origin main
```

از این لحظه فایل `.github/workflows/ci.yml` روی هر پوش اجرا می‌شود و تایپ‌چک، لینت و
بیلد را می‌سنجد. دیپلوی هنوز کار نمی‌کند چون کلیدهایش را نساخته‌ایم.

---

## گام ۲ — کلید SSH مخصوص دیپلوی بساز

روی کامپیوتر خودت:

```bash
ssh-keygen -t ed25519 -C "github-actions-rondix" -f ~/.ssh/rondix_deploy -N ""
```

دو فایل ساخته می‌شود:

- `~/.ssh/rondix_deploy` → **کلید خصوصی**، این را به گیت‌هاب می‌دهی
- `~/.ssh/rondix_deploy.pub` → **کلید عمومی**، این را روی سرور می‌گذاری

> این کلید را جدا از کلید شخصی‌ات نگه دار. اگر روزی لو رفت فقط همین را باطل می‌کنی.

---

## گام ۳ — سرور را آماده کن (فقط یک‌بار)

فایل‌های پوشه‌ی `deploy/` را روی سرور کپی کن و اسکریپت را اجرا کن:

```bash
scp -r deploy root@SERVER_IP:/root/
```

بعد روی سرور، به‌جای `203.0.113.5.nip.io` دامنه‌ی خودت را بگذار:

```bash
ssh root@SERVER_IP "cd /root/deploy && bash server-setup.sh 203.0.113.5.nip.io"
```

این اسکریپت این کارها را می‌کند:

- نصب Node 22، nginx و rsync
- ساخت کاربر `deploy` و پوشه‌ی `/var/www/rondix`
- نصب سرویس systemd به نام `rondix`
- دادن دسترسی sudo فقط و فقط برای ری‌استارت همین سرویس
- تنظیم nginx به‌عنوان reverse proxy روی پورت ۸۰

---

## گام ۴ — کلید عمومی را روی سرور بگذار

```bash
ssh root@SERVER_IP "cat >> /home/deploy/.ssh/authorized_keys" < ~/.ssh/rondix_deploy.pub
```

تست کن که کار می‌کند:

```bash
ssh -i ~/.ssh/rondix_deploy deploy@SERVER_IP "echo ok"
```

اگر `ok` چاپ شد، مرحله بعد.

---

## گام ۵ — Secrets را در گیت‌هاب ثبت کن

در ریپو برو به **Settings → Secrets and variables → Actions → New repository secret**
و این‌ها را بساز:

| نام | مقدار |
| --- | --- |
| `SSH_HOST` | آی‌پی سرور، مثلاً `203.0.113.5` |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | **کل محتوای** فایل `~/.ssh/rondix_deploy` (با خط اول و آخرش) |
| `DEPLOY_PATH` | `/var/www/rondix` |

اختیاری:

| نام | مقدار |
| --- | --- |
| `SSH_PORT` | اگر پورت SSH‌ات ۲۲ نیست |
| `SERVICE_NAME` | اگر اسم سرویس را عوض کردی (پیش‌فرض `rondix`) |
| `SSH_KNOWN_HOSTS` | خروجی `ssh-keyscan SERVER_IP` — امن‌تر است، پایین توضیح داده‌ام |

برای خواندن کلید خصوصی:

```bash
cat ~/.ssh/rondix_deploy
```

> ⚠️ این متن را جایی جز فرم Secrets گیت‌هاب کپی نکن.

---

## گام ۶ — اولین دیپلوی

هر پوشی روی `main` حالا دیپلوی می‌کند. برای اجرای دستی: تب **Actions** → workflow
با نام **Deploy** → **Run workflow**.

بعد از چند دقیقه سایت بالاست:

```
http://203.0.113.5.nip.io
```

---

## گام ۷ — HTTPS رایگان

```bash
ssh root@SERVER_IP "apt-get install -y certbot python3-certbot-nginx && certbot --nginx -d 203.0.113.5.nip.io --agree-tos -m you@example.com --redirect -n"
```

certbot خودش بلوک TLS و ریدایرکت ۸۰ به ۴۴۳ را به کانفیگ nginx اضافه می‌کند و تمدید
خودکار را هم فعال می‌کند.

---

## عیب‌یابی

**لاگ زنده‌ی اپ:**

```bash
ssh root@SERVER_IP "journalctl -u rondix -f"
```

**وضعیت سرویس:**

```bash
ssh root@SERVER_IP "systemctl status rondix"
```

**اگر دیپلوی سبز شد ولی سایت بالا نیامد** — تقریباً همیشه یعنی سرویس بالا نیست.
هلث‌چک آخر workflow همین را می‌سنجد و اگر رد شود لاگ سرویس را چاپ می‌کند.

**برگشت به نسخه‌ی قبل (rollback):** پنج نسخه‌ی آخر روی سرور نگه داشته می‌شود:

```bash
ssh root@SERVER_IP "ls -1t /var/www/rondix/releases | head -5"
```

```bash
ssh root@SERVER_IP "ln -sfn /var/www/rondix/releases/COMMIT_SHA /var/www/rondix/current && systemctl restart rondix"
```

---

## چند نکته‌ی امنیتی

- کاربر `deploy` فقط اجازه‌ی `systemctl restart rondix` را با sudo دارد، نه چیز دیگری.
- اپ Next روی `127.0.0.1:3000` گوش می‌دهد، نه روی IP عمومی. تنها راه ورود nginx است.
- سرویس با `ProtectSystem=strict` اجرا می‌شود و فقط به `/var/www/rondix` دسترسی نوشتن دارد.
- **پین‌کردن کلید سرور:** به‌صورت پیش‌فرض workflow اولین‌بار کلید سرور را می‌پذیرد
  (trust-on-first-use). برای امن‌تر شدن، خروجی این دستور را در سکرت `SSH_KNOWN_HOSTS` بگذار:

  ```bash
  ssh-keyscan 203.0.113.5
  ```

---

## ساختار فایل‌ها

```
.github/workflows/ci.yml       تایپ‌چک + لینت + بیلد روی هر پوش
.github/workflows/deploy.yml   بیلد و دیپلوی روی main
deploy/server-setup.sh         آماده‌سازی یک‌باره‌ی سرور
deploy/rondix.service          یونیت systemd
deploy/nginx.conf              کانفیگ reverse proxy
```

## چرا دیپلوی بدون قطعی است

هر نسخه در `releases/<commit-sha>` آپلود می‌شود و در آخرین لحظه یک symlink به نام
`current` به آن اشاره می‌کند. اگر آپلود نصفه بماند، هیچ‌وقت نسخه‌ی زنده نمی‌شود؛ و
برگشت به عقب فقط یعنی جابه‌جا کردن همان symlink.
