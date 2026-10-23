"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Camera, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  MONTHS,
  SERVICE_TYPES,
  WEEKDAYS,
  addDaysKey,
  formatLongDate,
  groupIntoAlbums,
  serviceLabel,
  startOfWeekKey,
  todayKey,
  weekdayOf,
  type BankPhoto,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

const ALBUMS_PER_PAGE = 6;
const PHOTOS_PER_ALBUM_PREVIEW = 8;

type Period = "all" | "week" | "lastWeek" | "month" | "lastMonth";

const PERIODS: { key: Period; label: string }[] = [
  { key: "all", label: "Todo el tiempo" },
  { key: "week", label: "Esta semana" },
  { key: "lastWeek", label: "Semana pasada" },
  { key: "month", label: "Este mes" },
  { key: "lastMonth", label: "Mes pasado" },
];

function inPeriod(dateKey: string, period: Period): boolean {
  if (period === "all") return true;
  const today = todayKey();
  if (period === "week" || period === "lastWeek") {
    const start = startOfWeekKey(period === "week" ? today : addDaysKey(today, -7));
    const end = addDaysKey(start, 6);
    return dateKey >= start && dateKey <= end;
  }
  const [y, m] = today.split("-").map(Number);
  const target = period === "month" ? new Date(Date.UTC(y, m - 1, 1)) : new Date(Date.UTC(y, m - 2, 1));
  return dateKey.startsWith(target.toISOString().slice(0, 7));
}

const selectClass =
  "px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-navy font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold cursor-pointer";

export function CampusGallery({ photos, campusName }: { photos: BankPhoto[]; campusName: string }) {
  const [ministry, setMinistry] = useState("all");
  const [period, setPeriod] = useState<Period>("all");
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [weekday, setWeekday] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleAlbums, setVisibleAlbums] = useState(ALBUMS_PER_PAGE);
  const [active, setActive] = useState<number | null>(null);

  // Options available in the filters (only what actually exists)
  const ministriesPresent = useMemo(() => {
    const counts = new Map<string, number>();
    photos.forEach((p) => counts.set(p.ministry, (counts.get(p.ministry) ?? 0) + 1));
    return SERVICE_TYPES.filter((s) => counts.has(s.key)).map((s) => ({ ...s, count: counts.get(s.key)! }));
  }, [photos]);

  const years = useMemo(
    () => Array.from(new Set(photos.map((p) => p.dateKey.slice(0, 4)))).sort().reverse(),
    [photos]
  );

  const monthsPresent = useMemo(() => {
    const set = new Set<number>();
    photos.forEach((p) => {
      if (year === "all" || p.dateKey.startsWith(year)) set.add(Number(p.dateKey.slice(5, 7)) - 1);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [photos, year]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos.filter((p) => {
      if (ministry !== "all" && p.ministry !== ministry) return false;
      if (year !== "all" && !p.dateKey.startsWith(year)) return false;
      if (month !== "all" && Number(p.dateKey.slice(5, 7)) - 1 !== Number(month)) return false;
      if (weekday !== "all" && weekdayOf(p.dateKey) !== Number(weekday)) return false;
      if (!inPeriod(p.dateKey, period)) return false;
      if (q) {
        const haystack = `${p.title} ${p.description ?? ""} ${serviceLabel(p.ministry)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [photos, ministry, year, month, weekday, period, query]);

  const albums = useMemo(() => groupIntoAlbums(filtered), [filtered]);
  // Flat list in the order shown, used by the lightbox
  const flat = useMemo(() => albums.flatMap((a) => a.photos), [albums]);
  const shownAlbums = albums.slice(0, visibleAlbums);

  const hasFilters =
    ministry !== "all" || period !== "all" || year !== "all" || month !== "all" || weekday !== "all" || query !== "";

  function clearFilters() {
    setMinistry("all");
    setPeriod("all");
    setYear("all");
    setMonth("all");
    setWeekday("all");
    setQuery("");
  }

  // Keep dependent filters coherent and go back to the first page when filters change
  useEffect(() => setVisibleAlbums(ALBUMS_PER_PAGE), [ministry, period, year, month, weekday, query]);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + flat.length) % flat.length)),
    [flat.length]
  );
  const next = useCallback(() => setActive((i) => (i === null ? i : (i + 1) % flat.length)), [flat.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  if (photos.length === 0) return null;

  const current = active !== null ? flat[active] : null;
  const currentAlbum = current ? albums.find((a) => a.photos.some((p) => p.id === current.id)) : null;

  function openPhoto(id: string) {
    const index = flat.findIndex((p) => p.id === id);
    if (index >= 0) setActive(index);
  }

  return (
    <section className="py-16 bg-off-white" id="fotos-cultos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="label-eyebrow mb-3">Banco de fotos · {campusName}</p>
          <div className="divider-gold mb-4 mx-auto block" />
          <h2 className="font-display text-display text-navy">Fotos de Nuestros Cultos</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto font-light">
            Revive lo que Dios hace cada semana en nuestra familia. Filtra por ministerio, día,
            semana, mes o año.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-10 space-y-4">
          {/* Ministry / service chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            <button
              onClick={() => setMinistry("all")}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border",
                ministry === "all"
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-navy"
              )}
            >
              Todos ({photos.length})
            </button>
            {ministriesPresent.map((s) => (
              <button
                key={s.key}
                onClick={() => setMinistry(s.key)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border",
                  ministry === s.key
                    ? "bg-gold text-navy border-gold"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-navy"
                )}
              >
                {s.label} ({s.count})
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={selectClass} aria-label="Período">
              {PERIODS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setMonth("all");
              }}
              className={selectClass}
              aria-label="Año"
            >
              <option value="all">Todos los años</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass} aria-label="Mes">
              <option value="all">Todos los meses</option>
              {monthsPresent.map((m) => (
                <option key={m} value={m}>
                  {MONTHS[m]}
                </option>
              ))}
            </select>

            <select value={weekday} onChange={(e) => setWeekday(e.target.value)} className={selectClass} aria-label="Día de la semana">
              <option value="all">Cualquier día</option>
              {WEEKDAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>

            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en descripciones..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-navy hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Limpiar
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 font-medium">
            {flat.length} foto(s) en {albums.length} álbum(es)
          </p>
        </div>

        {/* ── Albums ── */}
        <div className="space-y-12">
          {shownAlbums.map((album) => {
            const preview = album.photos.slice(0, PHOTOS_PER_ALBUM_PREVIEW);
            const extra = album.photos.length - preview.length;
            return (
              <article key={album.key}>
                <header className="mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-gold/15 text-gold-dark border border-gold/30 px-3 py-1 rounded-full">
                      {serviceLabel(album.ministry)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatLongDate(album.dateKey)}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-navy leading-snug">{album.title}</h3>
                  {album.description && (
                    <p className="text-gray-600 mt-1.5 max-w-3xl leading-relaxed">{album.description}</p>
                  )}
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                  {preview.map((photo, i) => {
                    const isLastWithExtra = extra > 0 && i === preview.length - 1;
                    return (
                      <button
                        key={photo.id}
                        onClick={() => openPhoto(photo.id)}
                        className={cn(
                          "group relative block overflow-hidden rounded-2xl bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                          i === 0 && album.photos.length > 3
                            ? "col-span-2 row-span-2 aspect-square md:aspect-auto"
                            : "aspect-[4/3]"
                        )}
                        aria-label={`Ver foto de ${album.title}`}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={`${album.title} - ${formatLongDate(album.dateKey)}`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isLastWithExtra && (
                          <div className="absolute inset-0 bg-navy/70 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">+{extra + 1}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}

          {albums.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy mb-1">No encontramos fotos</h3>
              <p className="text-gray-500 text-sm mb-4">Prueba con otros filtros.</p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-navy-light transition-colors cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {albums.length > visibleAlbums && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleAlbums((n) => n + ALBUMS_PER_PAGE)}
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-navy-light transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-gold" />
              Ver más cultos ({albums.length - visibleAlbums} restantes)
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {current && currentAlbum && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {flat.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <figure className="max-w-5xl max-h-full flex flex-col items-center">
            <img
              src={current.imageUrl}
              alt={currentAlbum.title}
              className="max-h-[75vh] max-w-full object-contain rounded-xl"
            />
            <figcaption className="mt-4 text-center max-w-2xl">
              <p className="text-white font-semibold">{currentAlbum.title}</p>
              <p className="text-gold text-xs font-medium mt-0.5">
                {serviceLabel(currentAlbum.ministry)} · {formatLongDate(currentAlbum.dateKey)}
              </p>
              {currentAlbum.description && (
                <p className="text-white/70 text-sm mt-1.5">{currentAlbum.description}</p>
              )}
              <p className="text-white/40 text-xs mt-2">
                {(active ?? 0) + 1} / {flat.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
