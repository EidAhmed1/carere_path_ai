import "./globals.css";

// هذا السطر هو الأهم لكي يعرف الجوال أن الموقع متوافق معه ويضبط حجم الشاشة
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: "مسارات الذكاء الاصطناعي",
  description: "منصة تعليمية ومجتمع طلابي لاستكشاف مسارات الذكاء الاصطناعي",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      {/* نقلنا استيراد الخطوط هنا ليعمل بشكل أسرع ولا يكسر الموقع على الجوال */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400..700&family=Tajawal:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}