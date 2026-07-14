"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_MAX_AGE } from "@/lib/adminAuth";

export async function adminLogin(formData: FormData) {
  const passcode = String(formData.get("passcode") ?? "");
  const expected = process.env.ADMIN_PASSCODE;

  // Fail closed: with no passcode configured, or a wrong one, never sign in.
  if (!expected || passcode !== expected) {
    redirect("/admin?error=1");
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}
