"use client";
import { useState } from "react";
import { GearIcon } from "@/components/Icons";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "كلمة المرور غير صحيحة");
      }
      window.location.href = "/admin";
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="app" dir="rtl" data-theme="dark">
      <div className="aurora" />
      <div className="topo" />
      <div className="admin-gate">
        <form className="admin-gate-card" onSubmit={submit}>
          <span className="admin-gate-icon"><GearIcon /></span>
          <h2>دخول لوحة الإدارة</h2>
          <p>هاي حماية بسيطة بس — مش نظام حسابات متعدد. هدفها منع أي زائر عادي من التعديل بالغلط.</p>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="كلمة المرور"
            autoFocus
          />
          {error && <span className="admin-gate-error">{error}</span>}
          <button type="submit" className="btn-primary admin-gate-submit" disabled={busy}>
            {busy ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
