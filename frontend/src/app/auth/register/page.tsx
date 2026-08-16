import { AuthForm } from "@/components/layout/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  description: "ساخت حساب کاربری در روندیکس برای خرید و فروش شماره رند.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
