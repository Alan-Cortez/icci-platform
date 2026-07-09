import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { SITE, SCHEDULES } from "@/lib/constants";

const quickLinks = [
  { href: "/conocenos", label: "Conócenos" },
  { href: "/campus",   label: "Campus"    },
  { href: "/eventos",  label: "Eventos"   },
  { href: "/predicaciones", label: "Predicaciones" },
  { href: "/blog",     label: "Blog"      },
];

const supportLinks = [
  { href: "/oracion", label: "Solicitud de Oración" },
  { href: "/donaciones", label: "Donaciones" },
  { href: "/contacto", label: "Contacto" },
  { href: "/galeria", label: "Galería" },
  { href: "/devocionales", label: "Devocionales" },
  { href: "/testimonios", label: "Testimonios" },
  { href: "/calendario", label: "Calendario" },
];

// Just show first 4 schedules in footer
const schedulePreview = SCHEDULES.slice(0, 4);

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Thin gold separator line */}
      <div className="h-px w-full bg-gold opacity-30" />
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="ICCI Logo" className="w-10 h-10 object-contain" />
            </div>
            <p className="font-display text-display text-white leading-none mb-1">ICCI</p>
            <p className="font-serif text-white/50 text-sm italic font-light mb-5">
              Una familia de fe, esperanza y amor
            </p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Sirviendo a nuestra comunidad desde Allende, Coahuila.
            </p>
            {/* Social icons */}
            <div className="flex flex-wrap gap-3">
              {/* Facebook */}
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-200 text-white">
                <Facebook className="w-4 h-4" />
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-200 text-white">
                <Instagram className="w-4 h-4" />
              </a>
              {/* YouTube */}
              <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-200 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                </svg>
              </a>
              {/* Spotify */}
              <a href={SITE.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-200 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-200 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.72a4.85 4.85 0 01-1.01-.03z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="label-eyebrow mb-4">Navegar</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <p className="label-eyebrow mb-4">Comunidad</p>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Schedules */}
          <div>
            <p className="label-eyebrow mb-4">Contáctanos</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{SITE.address}, {SITE.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-gold transition-colors">
                  {SITE.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold transition-colors">
                  {SITE.email}
                </a>
              </div>
            </div>
            <h4 className="font-semibold text-xs text-white/50 uppercase tracking-widest mb-3">Horarios</h4>
            <div className="space-y-2">
              {schedulePreview.map((s) => (
                <div key={s.title + s.days} className="flex justify-between text-xs">
                  <span className="text-white/50">{s.days}</span>
                  <span className="text-gold font-medium">{s.time}</span>
                </div>
              ))}
              <Link href="/calendario" className="inline-block text-xs text-gold hover:underline mt-1">
                Ver todos los horarios →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
