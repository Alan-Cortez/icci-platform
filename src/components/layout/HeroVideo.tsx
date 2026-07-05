"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Wifi, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { SITE } from "@/lib/constants";

const QUICK_LINKS = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Campus",
    desc: "Adora con nosotros en persona en nuestros diferentes campus.",
    link: "/campus",
    cta: "Encuentra el tuyo →",
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: "En Línea",
    desc: "Síguenos en YouTube y únete desde donde estés.",
    link: "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu",
    cta: "Ver canal →",
  },
  {
    icon: <ArrowRight className="w-5 h-5" />,
    title: "Tu primer paso",
    desc: "Estamos muy contentos de que quieras dar tu primer paso con Jesús.",
    link: "/conocenos",
    cta: "Conocer más →",
  },
];

export function HeroVideo() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-navy">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={() => setLoaded(true)}
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4"  type="video/mp4"  />
        <source src="/hero.webm" type="video/webm" />
      </video>

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/65 to-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-center h-full py-24">

          {/* Left — headline */}
          <div
            className={`min-w-0 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="ICCI Logo" className="w-12 h-12 object-contain drop-shadow-lg" />
              <div>
                <p className="label-eyebrow">Iglesias Comunidad De Cristo</p>
                <p className="text-white/50 text-xs tracking-wide mt-0.5">
                  Internacional · Allende, Coah.
                </p>
              </div>
            </div>

            {/* Hero headline — Bebas Neue: constrained size so it stays in col */}
            <h1
              className="font-display text-white leading-none uppercase"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Bienvenido
              <br />
              <span className="text-gold">a {SITE.shortName}</span>
            </h1>

            {/* Sub-line — Cormorant serif */}
            <p className="font-serif text-serif-lg text-white/80 italic mt-4 leading-snug font-light">
              Una familia de fe, esperanza y amor
            </p>

            <p className="mt-5 text-white/65 text-base leading-relaxed max-w-md font-light">
              Te ayudamos a{" "}
              <strong className="text-white font-semibold">conocer a Dios</strong>,
              encontrar libertad y descubrir el propósito que Él tiene para tu vida.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button href="/campus" size="lg">
                Encuentra tu campus
              </Button>
              <Button
                href="/conocenos"
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white hover:text-navy"
              >
                Conócenos <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right — quick links panel */}
          <div
            className={`hidden lg:flex flex-col gap-3 transition-all duration-700 delay-400 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white/8 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:border-gold/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-semibold tracking-wide">{item.title}</p>
                  <p className="text-white/55 text-sm mt-0.5 leading-snug">{item.desc}</p>
                  <p className="text-gold text-xs font-medium mt-2 group-hover:underline">
                    {item.cta}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom blend — strong fade into the off-white section below */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#f8f6f1] via-[#f8f6f1]/60 to-transparent" />
    </section>
  );
}
