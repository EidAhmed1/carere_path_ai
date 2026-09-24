"use client";
import { useState, useEffect, useRef } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// دالة للتأكد إذا كان الجهاز يعمل باللمس (جوال) أم ماوس (لابتوب)
function isTouchDevice() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return !window.matchMedia("(hover: hover)").matches;
}

export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // حماية: إذا كان المتصفح لا يدعم IntersectionObserver (مثل متصفحات واتساب القديمة)
    if (typeof IntersectionObserver === "undefined") {
      setInView(true); // اظهر العنصر فوراً بدون أنيميشن
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export function useScrollProgress(active) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!active) return;
    let ticking = false;
    
    function onScroll() {
      if (!ticking) {
        // استخدام requestAnimationFrame لمنع التعلق أثناء التمرير السريع
        window.requestAnimationFrame(() => {
          const doc = document.documentElement;
          const scrollTop = window.scrollY || doc.scrollTop;
          const scrollHeight = doc.scrollHeight - doc.clientHeight;
          setProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
          ticking = false;
        });
        ticking = true;
      }
    }
    
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active]);
  return progress;
}

const THEME_KEY = "career-paths-theme";

export function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch (e) {
      /* localStorage unavailable */
    }
  }, []);

  function toggle() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* theme still switches for this session even if it can't be saved */
      }
      return next;
    });
  }

  return [theme, toggle];
}

export function handleTiltMove(e) {
  if (prefersReducedMotion()) return;
  // منع عمل الميلان على الجوالات لأنه يسبب التعلق والقفز
  if (isTouchDevice()) return;

  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const px = x / rect.width;
  const py = y / rect.height;
  const rotateY = (px - 0.5) * 8;
  const rotateX = (0.5 - py) * 8;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
}

export function handleTiltLeave(e) {
  e.currentTarget.style.transform = "";
}

export function hexToRgba(hex, alpha) {
  const clean = (hex || "#7C6FF0").replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full, 16) || 0x7c6ff0;
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}