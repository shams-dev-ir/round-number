import { AuthForm } from "@/components/layout/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود",
  description: "ورود به حساب کاربری روندیکس با شماره موبایل و کد تأیید.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
