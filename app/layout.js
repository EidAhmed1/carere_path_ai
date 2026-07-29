import "./globals.css";

export const metadata = {
  title: "مسارات الذكاء الاصطناعي",
  description: "منصة تعليمية ومجتمع طلابي لاستكشاف مسارات الذكاء الاصطناعي",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
