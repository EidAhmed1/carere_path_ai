"use client";

export default function Error({ error, reset }) {
  return (
    <div className="app" dir="rtl" data-theme="dark">
      <div className="aurora" />
      <div className="topo" />
      <div className="admin-gate">
        <div className="admin-gate-card">
          <h2>صار خطأ غير متوقع</h2>
          <p>
            في مشكلة بتحميل البيانات — الأغلب قاعدة البيانات مش متصلة صح.
            تأكد من متغير <code>DATABASE_URL</code> بإعدادات Vercel، وإنك عملت Deploy من جديد بعد إضافته.
          </p>
          {error?.digest && (
            <p style={{ fontFamily: "monospace", fontSize: 12 }}>Digest: {error.digest}</p>
          )}
          <button className="btn-primary admin-gate-submit" onClick={() => reset()}>
            أعد المحاولة
          </button>
        </div>
      </div>
    </div>
  );
}
