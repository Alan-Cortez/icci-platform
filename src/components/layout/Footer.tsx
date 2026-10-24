import Link from "next/link";
import { Facebook, Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Main footer container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── Col 1: Brand, Tagline & Socials (6 cols) ── */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3.5">
              <img src="/images/logo.png" alt="ICCI Logo" className="w-14 h-14 object-contain" />
              <div>
                <p className="font-display text-3xl tracking-wider text-white leading-none">ICCI</p>
                <p className="text-xs uppercase tracking-[0.2em] text-gold font-bold mt-1">
                  Comunidad de Cristo
                </p>
              </div>
            </div>

            <p className="font-serif text-white/80 text-lg italic font-light leading-relaxed max-w-lg">
              &ldquo;{SITE.tagline}&rdquo;
            </p>

            <p className="text-white/50 text-sm leading-relaxed max-w-lg font-light">
              Una iglesia cristiana con propósito y visión, edificando familias y extendiendo el reino de Dios desde Allende, Coahuila hacia todo el norte de México.
            </p>

            {/* Social pills */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-gold hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-white/80"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-gold hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-white/80"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                </svg>
              </a>
              <a
                href={SITE.spotify}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-white/80"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-gold hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 text-white/80"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.72a4.85 4.85 0 01-1.01-.03z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: Direct Contact & Service Info (6 cols) ── */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-gold mb-6">
              Visítanos & Contáctanos
            </p>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">Ubicación Principal</p>
                  <p className="text-sm text-white/90 font-medium mt-0.5 leading-snug">
                    {SITE.address}
                  </p>
                  <p className="text-xs text-white/50">{SITE.location}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">Teléfono</p>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="text-sm text-white/90 hover:text-gold font-medium mt-0.5 inline-block transition-colors"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-gold group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold">Correo Electrónico</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-white/90 hover:text-gold font-medium mt-0.5 inline-block transition-colors"
                  >
                    {SITE.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Aesthetic card for Sunday Service */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/10 flex items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Servicio Dominical</p>
                  <p className="text-xs text-gold font-semibold">Domingos · 10:00 AM</p>
                </div>
              </div>
              <Link
                href="/campus/allende"
                className="text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0"
              >
                Horarios <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</p>
          <p className="font-serif italic text-white/40 text-xs">Somos uno, uno somos</p>
        </div>
      </div>
    </footer>
  );
}
