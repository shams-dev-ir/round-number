"use client";

import { Button } from "@/components/ui/button";
import { Checkbox, Input, Label } from "@/components/ui/field";
import { Divider } from "@/components/ui/misc";
import { OtpInput } from "@/components/ui/otp-input";
import { formatMsisdn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, KeyRound, Smartphone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CODE_LENGTH = 5;
const RESEND_SECONDS = 90;
/** Demo code — the real one will arrive by SMS from the API. */
const DEMO_CODE = "12345";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [step, setStep] = useState<"identity" | "code">("identity");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [terms, setTerms] = useState(mode === "login");
  const [invalid, setInvalid] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const phoneValid = /^09\d{9}$/.test(phone);
  const identityValid = phoneValid && (mode === "login" || (name.trim().length > 2 && terms));

  useEffect(() => {
    if (step !== "code" || seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, seconds]);

  const sendCode = () => {
    setStep("code");
    setSeconds(RESEND_SECONDS);
    setCode("");
    setInvalid(false);
    toast.success("کد تأیید ارسال شد", { description: `کد نمایشی: ${DEMO_CODE}` });
  };

  const verify = () => {
    if (code !== DEMO_CODE) {
      setInvalid(true);
      toast.error("کد تأیید نادرست است");
      return;
    }
    toast.success(mode === "login" ? "خوش آمدید" : "حساب شما ساخته شد");
    router.push("/dashboard");
  };

  /* ------------------------------ code step ------------------------------ */
  if (step === "code") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setStep("identity")}
          className="mb-7 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-primary"
        >
          <ArrowRight className="size-3.5" />
          ویرایش شماره
        </button>

        <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
          <KeyRound className="size-5" />
        </span>

        <h1 className="font-display text-2xl font-extrabold text-foreground">کد تأیید را وارد کنید</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          کد {CODE_LENGTH} رقمی به شماره{" "}
          <span dir="ltr" className="font-semibold text-foreground tabular-nums">
            {formatMsisdn(phone)}
          </span>{" "}
          پیامک شد.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
          className="mt-8"
        >
          <OtpInput
            length={CODE_LENGTH}
            value={code}
            onChange={(v) => {
              setCode(v);
              setInvalid(false);
            }}
            autoFocus
            invalid={invalid}
          />

          <Button type="submit" size="lg" className="mt-7 w-full" disabled={code.length < CODE_LENGTH}>
            تأیید و ورود
            <ArrowLeft />
          </Button>
        </form>

        <div className="mt-5 text-center">
          {seconds > 0 ? (
            <p className="text-xs text-subtle">
              ارسال مجدد کد تا{" "}
              <span className="font-semibold text-foreground tabular-nums">{seconds}</span> ثانیه
            </p>
          ) : (
            <button
              type="button"
              onClick={sendCode}
              className="text-xs font-semibold text-primary hover:underline"
            >
              ارسال مجدد کد
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------- identity step ---------------------------- */
  return (
    <div>
      <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
        {mode === "login" ? <Smartphone className="size-5" /> : <User className="size-5" />}
      </span>

      <h1 className="font-display text-2xl font-extrabold text-foreground">
        {mode === "login" ? "ورود به روندیکس" : "ساخت حساب کاربری"}
      </h1>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">
        {mode === "login"
          ? "شماره موبایلتان را وارد کنید؛ کد تأیید برایتان پیامک می‌شود."
          : "با ساخت حساب، سفارش‌ها، علاقه‌مندی‌ها و آگهی‌های فروشتان را یک‌جا مدیریت می‌کنید."}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (identityValid) sendCode();
        }}
        className="mt-8 space-y-5"
      >
        {mode === "register" ? (
          <div>
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام کامل"
              autoComplete="name"
              icon={<User />}
              required
            />
          </div>
        ) : null}

        <div>
          <Label htmlFor="phone">شماره موبایل</Label>
          <Input
            id="phone"
            digitsOnly
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09123456789"
            autoComplete="tel"
            icon={<Smartphone />}
            invalid={phone.length > 0 && !phoneValid}
            required
          />
        </div>

        {mode === "register" ? (
          <Checkbox
            label={
              <span className="text-xs leading-relaxed">
                <Link href="/terms" className="text-primary hover:underline">
                  قوانین و مقررات
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  حریم خصوصی
                </Link>{" "}
                را می‌پذیرم.
              </span>
            }
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={!identityValid}>
          دریافت کد تأیید
          <ArrowLeft />
        </Button>
      </form>

      <Divider label="یا" className="my-7" />

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            حساب کاربری ندارید؟{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:underline">
              ثبت‌نام کنید
            </Link>
          </>
        ) : (
          <>
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              وارد شوید
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
