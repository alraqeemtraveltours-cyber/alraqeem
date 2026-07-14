"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { adminLogin } from "@/app/admin/actions";

export default function AdminLoginForm() {
  const [showPasscode, setShowPasscode] = useState(false);
  const hasError = useSearchParams().get("error");

  return (
    <form action={adminLogin} className="space-y-4">
      {hasError && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Incorrect passcode. Please try again.
        </p>
      )}
      <div className="relative">
        <input
          type={showPasscode ? "text" : "password"}
          name="passcode"
          placeholder="Passcode"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-slate-500 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
        />
        <button
          type="button"
          onClick={() => setShowPasscode((current) => !current)}
          aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
          title={showPasscode ? "Hide passcode" : "Show passcode"}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-white"
        >
          <FontAwesomeIcon icon={showPasscode ? faEyeSlash : faEye} className="h-4 w-4" />
        </button>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Enter
      </button>
    </form>
  );
}
