"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ─── Testimonies ─────────────────────────────────────────────────────────────

const TESTIMONIES = [
  {
    id: "t1",
    name: "María",
    role: "Maestra",
    text: "ICCI ha sido mi hogar espiritual. Aquí encontré una familia que me ama y me impulsa a crecer en mi fe cada día.",
    rotate: "-rotate-2",
  },
  {
    id: "t2",
    name: "Carlos",
    role: "Comerciante",
    text: "Soy alcohólico en recuperación. Después de tocar fondo entré a la iglesia y encontré en Dios la fuerza para cambiar. Gracias a esta familia ahora soy una nueva persona.",
    rotate: "rotate-1",
  },
  {
    id: "t3",
    name: "Nuri",
    role: "Diseñadora",
    text: "Estoy agradecida por mi bebé. Aunque ser madre primeriza es muy cansado, sé que Dios cada día me sostiene y me da fuerza, amor y paciencia.",
    rotate: "-rotate-1",
  },
  {
    id: "t4",
    name: "Luis Andrés",
    role: "Médico",
    text: "Agradezco a Dios porque aún en el semestre más difícil de mi carrera me permitió obtener mi título. Él obró para que lograra un resultado favorable.",
    rotate: "rotate-2",
  },
  {
    id: "t5",
    name: "Aldo",
    role: "Médico",
    text: "Me dedico a la salud, pero sé que lo que realizo es Dios. He visto y experimentado muchos cambios en mis pacientes — milagros — y en mí por la voluntad de Dios.",
    rotate: "-rotate-3",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeSections() {
  return (
    <>
      {/* ── Un lugar para conectar ──────────────────────────────────────── */}
      <section className="bg-off-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-12">

            {/* Logo spinning */}
            <div className="relative flex-shrink-0 w-28 h-28">
              <img
                src="/images/logo.png"
                alt="ICCI Logo"
                className="w-full h-full object-contain animate-[spin_20s_linear_infinite]"
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="label-eyebrow mb-3">Nuestra comunidad</p>
              <div className="divider-gold mb-4" />
              <h2 className="font-serif text-serif-xl text-navy font-semibold leading-tight mb-4">
                Un lugar para{" "}
                <em className="text-gold italic font-light">conectar con Jesús</em>
              </h2>
              <p className="text-gray-600 max-w-lg leading-relaxed mb-6 font-light">
                Cada semana en nuestras reuniones generales puedes conocer nuevas
                amistades. Creemos que aquí puedes encontrar a tus mejores amigos
                y una familia que te acompaña en la fe.
              </p>
              <Link
                href="/campus"
                className="inline-flex items-center gap-1 text-navy font-semibold border-b-2 border-gold pb-0.5 hover:text-gold transition-colors"
              >
                Ubicaciones y horarios <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cuéntanos tu historia ───────────────────────────────────────── */}
      <section className="bg-navy py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <p className="label-eyebrow mb-3">Testimonios</p>
              <div className="divider-gold mb-4" />
              <h2 className="font-display text-display text-white leading-none">
                Cuéntanos<br />
                <span className="text-gold">Tu Historia</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-white/60 text-sm leading-relaxed mb-5 font-light">
                Sé parte de nuestra casa, haz amigos y conéctate con personas
                que aman a Jesús. Nos encantaría escuchar tu historia.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contacto"
                  className="text-sm border-2 border-white/40 text-white px-5 py-2 rounded-full hover:bg-white hover:text-navy transition-colors font-medium"
                >
                  Ver historias
                </Link>
                <Link
                  href="/contacto"
                  className="text-sm bg-gold text-navy px-5 py-2 rounded-full hover:bg-gold-light transition-colors font-semibold"
                >
                  Comparte la tuya
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop: scattered cards */}
          <div className="hidden md:flex flex-wrap gap-4 justify-center">
            {TESTIMONIES.map((t, i) => (
              <div
                key={t.id}
                className={`w-52 bg-white rounded-2xl p-5 shadow-md border border-white/10 ${t.rotate} transition-all hover:rotate-0 hover:scale-105 hover:shadow-2xl hover:border-gold/30 duration-300`}
                style={{ marginTop: i % 2 === 0 ? "0px" : "40px" }}
              >
                <p className="text-xs font-bold text-navy">{t.name}</p>
                <p className="text-xs text-gold mb-3 font-semibold">{t.role}</p>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-6 font-serif italic font-light">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div
            className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {TESTIMONIES.map((t) => (
              <div
                key={t.id}
                className="flex-shrink-0 w-60 snap-start bg-white rounded-2xl p-5 shadow-md border border-white/10"
              >
                <p className="text-xs font-bold text-navy">{t.name}</p>
                <p className="text-xs text-gold mb-3 font-semibold">{t.role}</p>
                <p className="text-xs text-gray-600 leading-relaxed font-serif italic font-light">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
