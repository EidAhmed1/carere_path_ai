"use client";
import { useState, useEffect } from "react";
import { WHATSAPP_LINK } from "@/lib/config";
import { useInView, useScrollProgress, useTheme, handleTiltMove, handleTiltLeave } from "@/lib/hooks";
import { WhatsAppIcon, SunIcon, MoonIcon, AiMarkIcon, LinkIcon, GearIcon } from "./Icons";
import NeuralCanvas from "./NeuralCanvas";
import HeroIllustration from "./HeroIllustration";

function HomeCard({ p, onOpen, maxSteps }) {
  const ringDeg = (p.roadmap.length / maxSteps) * 360;
  const [ref, inView] = useInView(0.15);
  return (
    <button
      ref={ref}
      className={`card ${inView ? "in-view" : ""}`}
      style={{ "--accent": p.accent, "--accent-soft": p.accentSoft }}
      onClick={() => onOpen(p.id)}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
    >
      <span className="card-border-glow" />
      <span className="card-spotlight" />
      <div className="card-top">
        <span className="card-emoji">{p.emoji}</span>
        <div className="card-heading">
          <h3 className="card-title">{p.titleAr}</h3>
          <span className="card-en">{p.titleEn}</span>
        </div>
        <span className="card-ring" style={{ background: `conic-gradient(var(--accent) ${ringDeg}deg, rgba(120,120,140,0.18) 0deg)` }}>
          <span className="card-ring-inner">{p.roadmap.length}</span>
        </span>
      </div>
      <p className="card-tagline">{p.tagline}</p>
      <span className="card-cta">
        ابدأ المسار
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

function SectionCard({ icon, heading, children, index }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div className={`section-card ${inView ? "in-view" : ""}`} ref={ref} style={{ "--d": `${index * 90}ms` }}>
      <div className="section-icon">{icon}</div>
      <div>
        <h4 className="section-heading">{heading}</h4>
        <div className="section-body">{children}</div>
      </div>
    </div>
  );
}

function Waypoint({ step, index }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div className={`waypoint ${inView ? "in-view" : ""}`} ref={ref} style={{ "--d": `${Math.min(index * 70, 380)}ms` }}>
      <span className="waypoint-marker">{index + 1}</span>
      <div className="waypoint-content">
        <div className="waypoint-head">
          <h4 className="waypoint-title">{step.title}</h4>
          {step.duration && <span className="waypoint-duration">{step.duration}</span>}
        </div>
        <div className="waypoint-tags">
          {step.tags.map((t) => (
            <span className="tag-chip" key={t}>{t}</span>
          ))}
        </div>
        <div className="waypoint-sources">
          {step.sources && step.sources.length > 0 ? (
            step.sources.map((s, i) => (
              <a className="source-chip" href={s.url} target="_blank" rel="noopener noreferrer" key={`${s.url}-${i}`}>
                <LinkIcon />
                {s.label || s.url}
              </a>
            ))
          ) : (
            <span className="source-empty">🔗 لا توجد مصادر بعد لهذا الموضوع</span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailView({ p, onBack }) {
  const progress = useScrollProgress(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [p.id]);

  return (
    <div className="detail" style={{ "--accent": p.accent, "--accent-soft": p.accentSoft }}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <button className="back-btn" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        كل المسارات
      </button>

      <div className="detail-hero">
        <span className="detail-emoji">{p.emoji}</span>
        <div>
          <h1 className="detail-title">{p.titleAr}</h1>
          <span className="detail-en">{p.titleEn}</span>
          <p className="detail-tagline">{p.tagline}</p>
        </div>
      </div>

      <div className="sections-grid sections-grid-3">
        <SectionCard icon="📖" heading="ما هو هذا المسار؟" index={0}>{p.def}</SectionCard>
        <SectionCard icon="🚀" heading="ليش مهم ومستقبله؟" index={1}>{p.why}</SectionCard>
        <SectionCard icon="💼" heading="فرص التوظيف بسوق العمل" index={2}>{p.opportunities}</SectionCard>
      </div>

      {p.core && (
        <div className="core-block">
          <span className="core-label">الأساس المشترك لهندسة الذكاء الاصطناعي</span>
          <div className="core-row">
            {p.core.map((c) => (
              <span className="core-chip" key={c}>{c}</span>
            ))}
          </div>
        </div>
      )}

      <div className="roadmap-heading">
        <h2 className="roadmap-title">خط سير التعلّم</h2>
        <span className="roadmap-sub">{p.roadmap.length} محطة نحو الاحتراف — مصادر كل موضوع تلاقيها تحت خطوته مباشرة 👇</span>
      </div>

      <div className="trail">
        <span className="trail-line" />
        {(Array.isArray(p.roadmap) ? p.roadmap : []).map((step, i) => (
          <Waypoint step={step} index={i} key={step.title} />
        ))}
        <div className="trail-finish">🏁 وصلت لآخر محطة — دورك تبني مشروع حقيقي وتشارك إنجازك مع المجتمع</div>
      </div>
    </div>
  );
}

function TopBar({ theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo"><AiMarkIcon /></span>
        <div className="topbar-brand-text">
          <span className="topbar-name">مسارات الذكاء الاصطناعي</span>
          <span className="topbar-tag">منصة تعليمية ومجتمع طلابي لاستكشاف مسارات الذكاء الاصطناعي</span>
        </div>
      </div>
      <div className="topbar-actions">
        <a className="topbar-community" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          <span className="topbar-community-text">مجتمعنا</span>
        </a>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="تبديل الوضع الليلي/النهاري">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <a className="theme-toggle" href="/admin" aria-label="لوحة الإدارة">
          <GearIcon />
        </a>
      </div>
    </header>
  );
}


export default function PublicSite({ initialPaths }) {
  const [selectedId, setSelectedId] = useState(null);
  const [theme, toggleTheme] = useTheme();
  const paths = initialPaths;
  const selected = paths.find((p) => p.id === selectedId);
  const maxSteps = Math.max(1, ...paths.map((p) => p.roadmap.length));
  const totalSteps = paths.reduce((s, p) => s + p.roadmap.length, 0);

  function scrollToPaths() {
    const el = document.getElementById("paths-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="app" dir="rtl" data-theme={theme}>
      <div className="aurora" />
      <div className="topo" />

      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <a className="whatsapp-fab" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" aria-label="انضم لمجتمع واتساب">
        <WhatsAppIcon />
      </a>

      {!selected ? (
        <>
          <section className="hero">
            <NeuralCanvas theme={theme} />
            <span className="hero-shape hero-shape-a" />
            <span className="hero-shape hero-shape-b" />
            <div className="hero-inner">
              <div className="hero-text header">
                <span className="eyebrow"><span className="eyebrow-dot" />AI Career Paths</span>
                <h1>مسارات الذكاء الاصطناعي</h1>
                <p className="lead">اختر مسمى وظيفي لتتعرف على تعريفه، أهميته، فرصه بسوق العمل، وخط سير التعلّم خطوة بخطوة.</p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={scrollToPaths}>
                    استكشف المسارات
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <a className="btn-ghost" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">انضم لمجتمع الطلاب</a>
                </div>
                <div className="stats-row">
                  <span className="stat-chip"><strong>{paths.length}</strong> مسارات مهنية</span>
                  <span className="stat-chip"><strong>{totalSteps}+</strong> خطوة تعلّم عملية</span>
                  <span className="stat-chip">🤝 مجتمع طلاب داعم على واتساب</span>
                </div>
              </div>
              <div className="hero-illustration-wrap">
                <HeroIllustration />
              </div>
            </div>
          </section>

          <main className="home" id="paths-section">
            <span className="section-eyebrow">// choose your path</span>
            <h2 className="section-title">استكشف مسارك المهني</h2>
            <div className="path-grid">
              {paths.map((p) => (
                <HomeCard key={p.id} p={p} onOpen={setSelectedId} maxSteps={maxSteps} />
              ))}
            </div>
          </main>
        </>
      ) : (
        <DetailView p={selected} onBack={() => setSelectedId(null)} />
      )}
    </div>
  );
}
