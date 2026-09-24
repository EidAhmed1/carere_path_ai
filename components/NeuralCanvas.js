"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

export default function NeuralCanvas({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const lineRGB = theme === "light" ? "90,86,220" : "140,160,255";
    const nodeRGB = theme === "light" ? "70,64,200" : "190,205,255";
    let raf = null;
    let width = 0;
    let height = 0;
    let nodes = [];
    let isVisible = true; // متغير لتتبع إذا كان القسم ظاهراً للمستخدم

    function buildNodes() {
      // تقليل عدد النقاط على الجوالات لتخفيف الضغط على المعالج
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const divisor = isMobile ? 25000 : 16000;
      const count = Math.min(isMobile ? 25 : 55, Math.max(15, Math.floor((width * height) / divisor)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }));
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;
          if (dist < maxDist) {
            const o = (1 - dist / maxDist) * (theme === "light" ? 0.28 : 0.22);
            ctx.strokeStyle = `rgba(${lineRGB},${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${nodeRGB},0.75)`;
        ctx.arc(n.x, n.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      // إذا كان المستخدم قد نزل بالأسكرول ولم يعد يرى الرسمة، أوقف الأنيميشن فوراً
      if (!isVisible) {
        if (raf) cancelAnimationFrame(raf);
        return; 
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      drawFrame();
      raf = requestAnimationFrame(step);
    }

    // مراقب لتتبع إذا كان الكانفس ظاهراً على الشاشة أم لا
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reduced) {
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(step);
        } else {
          if (raf) cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    resize();
    if (reduced) {
      drawFrame();
    } else {
      raf = requestAnimationFrame(step);
    }
    
    window.addEventListener("resize", resize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [theme]);

  // تم تغيير اسم الكلاس ليطابق إصلاحات الـ CSS
  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}