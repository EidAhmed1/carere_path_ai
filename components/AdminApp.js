"use client";
import { useState, useEffect } from "react";
import { hexToRgba } from "@/lib/hooks";
import { GearIcon, PlusIcon, TrashIcon, PencilIcon, ArrowUpDownIcon } from "./Icons";

function StepEditor({ step, stepIndex, total, onUpdate, onRemove, onMove, onAddSource, onUpdateSource, onRemoveSource }) {
  return (
    <div className="step-box">
      <div className="step-box-head">
        <span className="step-box-num">{stepIndex + 1}</span>
        <input
          className="field-input step-title-input"
          value={step.title}
          onChange={(e) => onUpdate(stepIndex, "title", e.target.value)}
          placeholder="اسم الموضوع (مثال: Python Basics)"
        />
        <div className="step-box-actions">
          <button type="button" className="icon-btn" disabled={stepIndex === 0} onClick={() => onMove(stepIndex, -1)} aria-label="نقل لأعلى"><ArrowUpDownIcon dir="up" /></button>
          <button type="button" className="icon-btn" disabled={stepIndex === total - 1} onClick={() => onMove(stepIndex, 1)} aria-label="نقل لأسفل"><ArrowUpDownIcon dir="down" /></button>
          <button type="button" className="icon-btn icon-btn-danger" onClick={() => onRemove(stepIndex)} aria-label="حذف الموضوع"><TrashIcon /></button>
        </div>
      </div>

      <label className="form-label">الوسوم / المفاهيم الفرعية (افصل بفاصلة)</label>
      <input
        className="field-input"
        value={(step.tags || []).join(", ")}
        onChange={(e) => onUpdate(stepIndex, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
        placeholder="Variables, Loops, Functions"
      />

      <label className="form-label">المدة (اختياري)</label>
      <input
        className="field-input"
        value={step.duration || ""}
        onChange={(e) => onUpdate(stepIndex, "duration", e.target.value)}
        placeholder="مثال: ٣ أسابيع"
      />

      <div className="sources-editor">
        <div className="sources-editor-head">
          <span className="form-label" style={{ margin: 0 }}>المصادر</span>
          <button type="button" className="btn-tiny" onClick={() => onAddSource(stepIndex)}><PlusIcon /> إضافة مصدر</button>
        </div>
        {(step.sources || []).length === 0 && <span className="source-empty">لا يوجد مصادر مضافة لهذا الموضوع</span>}
        {(step.sources || []).map((s, si) => (
          <div className="source-row" key={si}>
            <input
              className="field-input source-row-label"
              value={s.label}
              onChange={(e) => onUpdateSource(stepIndex, si, "label", e.target.value)}
              placeholder="اسم توضيحي (مثال: برمجة بايثون)"
            />
            <input
              className="field-input source-row-url"
              value={s.url}
              onChange={(e) => onUpdateSource(stepIndex, si, "url", e.target.value)}
              placeholder="https://..."
            />
            <button type="button" className="icon-btn icon-btn-danger" onClick={() => onRemoveSource(stepIndex, si)} aria-label="حذف المصدر"><TrashIcon /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminView({ pathsData, onSave, onDelete, onBack }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  function startEdit(p) {
    setDraft(JSON.parse(JSON.stringify(p)));
    setEditingId(p.id);
  }
  function startNew() {
    setDraft({
      id: `path-${Date.now()}`,
      emoji: "🧩",
      titleAr: "",
      titleEn: "",
      accent: "#7C6FF0",
      accentSoft: hexToRgba("#7C6FF0", 0.16),
      tagline: "",
      def: "",
      why: "",
      opportunities: "",
      core: null,
      roadmap: [],
    });
    setEditingId("new");
  }
  function cancel() {
    setDraft(null);
    setEditingId(null);
  }
  function save() {
    if (!draft.titleAr.trim()) {
      alert("لازم تكتب اسم المسار بالعربي على الأقل");
      return;
    }
    onSave({ ...draft, accentSoft: hexToRgba(draft.accent, 0.16) }, editingId === "new");
    cancel();
  }

  function updateField(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }
  function updateStep(idx, field, value) {
    setDraft((d) => {
      const roadmap = [...d.roadmap];
      roadmap[idx] = { ...roadmap[idx], [field]: value };
      return { ...d, roadmap };
    });
  }
  function addStep() {
    setDraft((d) => ({ ...d, roadmap: [...d.roadmap, { title: "موضوع جديد", tags: [], sources: [] }] }));
  }
  function removeStep(idx) {
    setDraft((d) => ({ ...d, roadmap: d.roadmap.filter((_, i) => i !== idx) }));
  }
  function moveStep(idx, dir) {
    setDraft((d) => {
      const roadmap = [...d.roadmap];
      const target = idx + dir;
      if (target < 0 || target >= roadmap.length) return d;
      [roadmap[idx], roadmap[target]] = [roadmap[target], roadmap[idx]];
      return { ...d, roadmap };
    });
  }
  function addSource(stepIdx) {
    setDraft((d) => {
      const roadmap = [...d.roadmap];
      roadmap[stepIdx] = { ...roadmap[stepIdx], sources: [...(roadmap[stepIdx].sources || []), { label: "", url: "" }] };
      return { ...d, roadmap };
    });
  }
  function updateSource(stepIdx, srcIdx, field, value) {
    setDraft((d) => {
      const roadmap = [...d.roadmap];
      const sources = [...roadmap[stepIdx].sources];
      sources[srcIdx] = { ...sources[srcIdx], [field]: value };
      roadmap[stepIdx] = { ...roadmap[stepIdx], sources };
      return { ...d, roadmap };
    });
  }
  function removeSource(stepIdx, srcIdx) {
    setDraft((d) => {
      const roadmap = [...d.roadmap];
      roadmap[stepIdx] = { ...roadmap[stepIdx], sources: roadmap[stepIdx].sources.filter((_, i) => i !== srcIdx) };
      return { ...d, roadmap };
    });
  }

  if (draft) {
    return (
      <div className="admin-view">
        <div className="admin-header">
          <button className="back-btn" onClick={cancel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            رجوع للقائمة
          </button>
          <h1 className="admin-title">{editingId === "new" ? "إضافة مسار جديد" : `تعديل: ${draft.titleAr || draft.titleEn}`}</h1>
        </div>

        <div className="admin-form-grid">
          <div>
            <label className="form-label">الإيموجي</label>
            <input className="field-input" value={draft.emoji} onChange={(e) => updateField("emoji", e.target.value)} />
          </div>
          <div>
            <label className="form-label">اللون المميز</label>
            <input className="field-input field-color" type="color" value={draft.accent} onChange={(e) => updateField("accent", e.target.value)} />
          </div>
        </div>
        <label className="form-label">الاسم بالعربي</label>
        <input className="field-input" value={draft.titleAr} onChange={(e) => updateField("titleAr", e.target.value)} placeholder="مثال: محلل بيانات" />
        <label className="form-label">الاسم بالإنجليزي</label>
        <input className="field-input" value={draft.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} placeholder="Data Analyst" />
        <label className="form-label">نبذة قصيرة (تظهر على الكارد)</label>
        <textarea className="field-input field-textarea" rows={2} value={draft.tagline} onChange={(e) => updateField("tagline", e.target.value)} />
        <label className="form-label">تعريف بالمسمى الوظيفي</label>
        <textarea className="field-input field-textarea" rows={3} value={draft.def} onChange={(e) => updateField("def", e.target.value)} />
        <label className="form-label">ليش مهم ومستقبله</label>
        <textarea className="field-input field-textarea" rows={3} value={draft.why} onChange={(e) => updateField("why", e.target.value)} />
        <label className="form-label">فرص التوظيف بسوق العمل</label>
        <textarea className="field-input field-textarea" rows={3} value={draft.opportunities} onChange={(e) => updateField("opportunities", e.target.value)} />

        <div className="admin-steps-head">
          <h3>خطوات المسار ({draft.roadmap.length})</h3>
          <button type="button" className="btn-tiny" onClick={addStep}><PlusIcon /> إضافة موضوع</button>
        </div>
        {(Array.isArray(draft.roadmap) ? draft.roadmap : []).map((step, i) => (
          <StepEditor
            key={i}
            step={step}
            stepIndex={i}
            total={draft.roadmap.length}
            onUpdate={updateStep}
            onRemove={removeStep}
            onMove={moveStep}
            onAddSource={addSource}
            onUpdateSource={updateSource}
            onRemoveSource={removeSource}
          />
        ))}

        <div className="admin-save-row">
          <button className="btn-primary" onClick={save}>حفظ المسار</button>
          <button className="btn-ghost" onClick={cancel}>إلغاء</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-view">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          رجوع للموقع
        </button>
        <h1 className="admin-title">لوحة الإدارة — المسارات الوظيفية</h1>
        <button className="btn-primary" onClick={startNew}><PlusIcon /> مسار جديد</button>
      </div>

      <div className="admin-list">
        {pathsData.map((p) => (
          <div className="admin-row" key={p.id} style={{ "--accent": p.accent }}>
            <span className="admin-row-emoji">{p.emoji}</span>
            <div className="admin-row-text">
              <strong>{p.titleAr || "بدون اسم"}</strong>
              <span>{p.titleEn} · {p.roadmap.length} موضوع</span>
            </div>
            <div className="admin-row-actions">
              <button className="icon-btn" onClick={() => startEdit(p)} aria-label="تعديل"><PencilIcon /></button>
              <button className="icon-btn icon-btn-danger" onClick={() => onDelete(p.id)} aria-label="حذف"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [pathsData, setPathsData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/paths")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setPathsData(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setError("تعذر تحميل المسارات. تأكد إن قاعدة البيانات متصلة."); });
    return () => { cancelled = true; };
  }, []);

  async function handleSave(pathObj, isNew) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(isNew ? "/api/paths" : `/api/paths/${pathObj.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pathObj),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "فشل الحفظ");
      }
      const saved = await res.json();
      setPathsData((prev) => (isNew ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p))));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("متأكد إنك بدك تحذف هذا المسار؟ ما في تراجع.")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/paths/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      setPathsData((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="app" dir="rtl" data-theme="dark">
      <div className="aurora" />
      <div className="topo" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" className="btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }}>معاينة الموقع ↗</a>
        <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }}>تسجيل خروج</button>
      </div>

      {error && (
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "16px auto 0", padding: "0 24px" }}>
          <div className="admin-gate-error" style={{ background: "rgba(232,93,79,0.1)", border: "1px solid rgba(232,93,79,0.3)", borderRadius: 10, padding: "10px 14px" }}>{error}</div>
        </div>
      )}

      {pathsData === null ? (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
          جاري تحميل المسارات...
        </div>
      ) : (
        <AdminView
          pathsData={pathsData}
          onSave={handleSave}
          onDelete={handleDelete}
          onBack={() => { window.location.href = "/"; }}
        />
      )}
    </div>
  );
}
