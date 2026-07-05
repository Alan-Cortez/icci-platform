"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";
import { CAMPUSES } from "@/lib/constants";

// ─── Marquee ticker ────────────────────────────────────────────────────────────

function Marquee() {
  const items = Array(8).fill("COMPARTE TU HISTORIA");
  return (
    <div className="overflow-hidden bg-[#f0ede8] border-y border-gray-200 py-5 select-none">
      <div className="flex gap-8 animate-[marquee_18s_linear_infinite] whitespace-nowrap w-max">
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-5 text-2xl font-black tracking-tight text-gray-900 uppercase">
            {/* Sun / burst icon */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
              <circle cx="12" cy="12" r="3" />
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <line
                  key={deg}
                  x1="12" y1="12"
                  x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                  y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
      <h2 className="text-3xl font-black text-gray-900 mb-3">
        ¡Petición recibida!
      </h2>
      <p className="text-gray-600 max-w-md leading-relaxed mb-8">
        Nuestro equipo pastoral orará por ti. Que Dios responda conforme a Su
        perfecta voluntad.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-navy transition-colors"
      >
        Volver al inicio <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function OracionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/oracion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.get("nombre")} ${form.get("apellidos")}`,
          phone: form.get("celular"),
          message: form.get("message"),
          campusId: form.get("campusId") || null,
          type: form.get("tipo"),
        }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* ── Hero headline ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Big title */}
          <div className="lg:col-span-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-gray-900 uppercase">
              Queremos orar y celebrar contigo
            </h1>
          </div>

          {/* Small left label */}
          <div className="lg:col-span-1 flex items-end">
            <p className="text-gray-500 text-sm max-w-xs">
              Envíanos tus peticiones de oración o comparte tu gratitud
            </p>
          </div>

          {/* Description + CTA */}
          <div className="lg:col-span-1">
            <p className="text-gray-700 leading-relaxed mb-5 text-sm">
              Como iglesia creemos en el poder de la oración y en dar gracias a
              Dios por todo lo que Él hace. Aquí puedes compartir tus peticiones
              para que podamos unirnos a orar por ti, y también tus
              agradecimientos para inspirar y animar a otros. Cada historia y
              cada petición nos llenan de fe y nos recuerdan que Dios sigue
              actuando hoy.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("form-oracion")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 border border-gray-400 text-gray-700 px-5 py-2.5 rounded-full text-sm hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              Comparte aquí <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Hero image ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-full h-64 sm:h-96 lg:h-[480px] rounded-3xl overflow-hidden bg-gradient-to-br from-navy via-navy-light to-[#0a1628] flex items-center justify-center">
          {/* Placeholder — replace with <img src="/oracion-hero.jpg" ... /> */}
          <div className="text-center">
            <p className="text-gold/60 text-6xl mb-4">🙏</p>
            <p className="text-white/30 text-sm">
              Coloca una imagen en{" "}
              <code className="text-gold/60">public/oracion-hero.jpg</code>
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────────────────── */}
      <section
        id="form-oracion"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight text-gray-900 mb-12">
            Cuéntanos tu historia
            <br />o haz una petición de oración
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de petición */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Tipo de petición
              </label>
              <select
                name="tipo"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              >
                <option value="">Selecciona una opción</option>
                <option value="oracion">Petición de oración</option>
                <option value="testimonio">Testimonio / Historia</option>
                <option value="agradecimiento">Agradecimiento</option>
              </select>
            </div>

            {/* Campus */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                ¿Asistes a un campus ICCI?
              </label>
              <select
                name="campusId"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              >
                <option value="">Selecciona un campus</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.state}
                  </option>
                ))}
                <option value="ninguno">No asisto a ningún campus</option>
              </select>
            </div>

            {/* Nombre + Apellidos */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Nombre
                </label>
                <input
                  name="nombre"
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-300 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Apellidos
                </label>
                <input
                  name="apellidos"
                  className="w-full bg-transparent border-0 border-b border-gray-300 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
                  placeholder="Tus apellidos"
                />
              </div>
            </div>

            {/* Celular */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Celular
              </label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-gray-900 transition-colors">
                <span className="text-sm text-gray-600 pr-3 py-3 flex items-center gap-1.5 flex-shrink-0">
                  🇲🇽 +52
                </span>
                <input
                  name="celular"
                  type="tel"
                  className="flex-1 bg-transparent border-0 py-3 text-gray-900 text-sm focus:outline-none placeholder:text-gray-400"
                  placeholder="222 123 4567"
                />
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Tu mensaje de petición o agradecimiento
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full bg-transparent border-0 border-b border-gray-300 py-3 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400 resize-none"
                placeholder="Cuéntanos..."
              />
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-gray-900 cursor-pointer"
              />
              <label
                htmlFor="consent"
                className="text-xs text-gray-500 leading-relaxed cursor-pointer"
              >
                *Doy consentimiento para que Iglesias Comunidad De Cristo
                Internacional almacene estos datos para poder ponerse en
                contacto conmigo.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full bg-[#c8843c] hover:bg-[#b5722f] disabled:bg-gray-300 text-white font-semibold py-4 rounded-sm text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar tu mensaje"}
            </button>
          </form>
        </div>
      </section>

      {/* ── Marquee ticker ────────────────────────────────────────────── */}
      <Marquee />
    </div>
  );
}
