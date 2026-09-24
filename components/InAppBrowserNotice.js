"use client";
import { useEffect, useState } from "react";

export default function InAppBrowserNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // الكود الذي يكتشف إذا كان المستخدم داخل تطبيق واتساب أو فيسبوك
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /FBAN|FBAV|Instagram|WhatsApp|MicroMessenger/i.test(ua);

    if (isInApp) {
      setShowNotice(true);
    }
  }, []);

  if (!showNotice) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(8, 11, 20, 0.95)', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#F3F4F8', textAlign: 'center', padding: '24px',
      fontFamily: "'Tajawal', sans-serif"
    }}>
      <div style={{ maxWidth: '400px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#00D4FF' }}>
          لفتح المسارات التعليمية ⚠️
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#99A3B8' }}>
          متصفح واتساب الداخلي لا يدعم تشغيل بعض المميزات. لعرض الموقع بشكل صحيح والتمكن من الضغط على المسارات:
        </p>
        <p style={{ fontSize: '17px', fontWeight: '700', color: '#F3F4F8' }}>
          1. اضغط على النقاط الثلاث (⋮) في أعلى الصفحة.<br/>
          2. اختر <span style={{ color: '#00D4FF' }}>"فتح في المتصفح" (Open in browser)</span>.
        </p>
      </div>
    </div>
  );
}