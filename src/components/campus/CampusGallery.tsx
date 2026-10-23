"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
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
  type Album,
  type BankPhoto,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

const ALBUMS_PER_PAGE = 9;

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

function shortDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 3).toLowerCase()} ${y}`;
}

function monthHeading(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

const selectClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-navy font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold cursor-pointer";

export function CampusGallery({ photos, campusName }: { photos: BankPhoto[]; campusName: string }) {
  const [ministry, setMinistry] = useState("all");
  const [period, setPeriod] = useState<Period>("all");
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [weekday, setWeekday] = useState("all");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleAlbums, setVisibleAlbums] = useState(ALBUMS_PER_PAGE);

  const [openAlbumKey, setOpenAlbumKey] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // ── Data for filters / stats ──────────────────────────────────────
  const allAlbums = useMemo(() => groupIntoAlbums(photos), [photos]);

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

  // ── Filtering ─────────────────────────────────────────────────────
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
  const shownAlbums = albums.slice(0, visibleAlbums);

  // Albums grouped by month ("Octubre 2026") for the timeline
  const monthGroups = useMemo(() => {
    const groups: { key: string; label: string; albums: Album[] }[] = [];
    for (const album of shownAlbums) {
      const key = album.dateKey.slice(0, 7);
      let g = groups[groups.length - 1];
      if (!g || g.key !== key) {
        g = { key, label: monthHeading(key), albums: [] };
        groups.push(g);
      }
      g.albums.push(album);
    }
    return groups;
  }, [shownAlbums]);

  const activeFilterCount = [ministry, period, year, month, weekday].filter((v) => v !== "all").length + (query ? 1 : 0);
  const secondaryFilterCount = [period, year, month, weekday].filter((v) => v !== "all").length + (query ? 1 : 0);

  function clearFilters() {
    setMinistry("all");
    setPeriod("all");
    setYear("all");
    setMonth("all");
    setWeekday("all");
    setQuery("");
  }

  useEffect(() => setVisibleAlbums(ALBUMS_PER_PAGE), [ministry, period, year, month, weekday, query]);

  // ── Album viewer + lightbox ───────────────────────────────────────
  const openAlbum = openAlbumKey ? allAlbums.find((a) => a.key === openAlbumKey) ?? null : null;
  const lightboxPhoto = openAlbum && lightbox !== null ? openAlbum.photos[lightbox] : null;
  const photoCount = openAlbum?.photos.length ?? 0;

  const closeAlbum = useCallback(() => {
    setLightbox(null);
    setOpenAlbumKey(null);
  }, []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null || photoCount === 0 ? i : (i - 1 + photoCount) % photoCount)),
    [photoCount]
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null || photoCount === 0 ? i : (i + 1) % photoCount)),
    [photoCount]
  );

  useEffect(() => {
    if (!openAlbumKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox !== null) setLightbox(null);
        else closeAlbum();
      }
      if (lightbox !== null && e.key === "ArrowLeft") prev();
      if (lightbox !== null && e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openAlbumKey, lightbox, closeAlbum, prev, next]);

  if (photos.length === 0) return null;

  const latest = allAlbums[0];

  return (
    <section className="py-16 sm:py-20 bg-off-white" id="fotos-cultos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <p className="label-eyebrow mb-3">Banco de fotos · {campusName}</p>
          <div className="divider-gold mb-4 mx-auto block" />
          <h2
            className="font-display text-navy"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            Fotos de nuestros cultos
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Revive lo que Dios hace cada semana en nuestra familia. Explora los álbumes por
            ministerio, día, mes o año.
          </p>

          {/* Quick stats */}
          <div className="mt-8 inline-grid grid-cols-3 divide-x divide-gray-200 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {[
              { icon: Camera, value: String(photos.length), label: "Fotos" },
              { icon: Images, value: String(allAlbums.length), label: "Álbumes" },
              { icon: Calendar, value: latest ? shortDate(latest.dateKey) : "—", label: "Último culto" },
            ].map((s) => (
              <div key={s.label} className="px-4 sm:px-8 py-3.5 text-center">
                <s.icon className="w-4 h-4 text-gold mx-auto mb-1" />
                <p className="font-bold text-navy text-sm sm:text-lg leading-none">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-10 space-y-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            <button
              onClick={() => setMinistry("all")}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border",
                ministry === "all"
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gold hover:text-navy"
              )}
            >
              Todos
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
                {s.label}
                <span className={cn("ml-1.5 font-semibold", ministry === s.key ? "text-navy/60" : "text-gray-400")}>
                  {s.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer",
                showFilters || secondaryFilterCount > 0
                  ? "bg-navy/5 border-navy/20 text-navy"
                  : "bg-white border-gray-200 text-gray-600 hover:text-navy"
              )}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Fecha y día
              {secondaryFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-navy text-[11px] font-extrabold flex items-center justify-center">
                  {secondaryFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Período</span>
                <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={selectClass}>
                  {PERIODS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Año</span>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setMonth("all");
                  }}
                  className={selectClass}
                >
                  <option value="all">Todos</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Mes</span>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
                  <option value="all">Todos</option>
                  {monthsPresent.map((m) => (
                    <option key={m} value={m}>
                      {MONTHS[m]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Día de la semana</span>
                <select value={weekday} onChange={(e) => setWeekday(e.target.value)} className={selectClass}>
                  <option value="all">Cualquiera</option>
                  {WEEKDAYS.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium pt-3">
              {filtered.length} foto(s) en {albums.length} álbum(es)
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 pt-3 text-xs font-bold text-gold-dark hover:text-navy transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* ── Timeline of albums, grouped by month ── */}
        <div className="space-y-12">
          {monthGroups.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-4 mb-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-navy whitespace-nowrap">
                  {group.label}
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                  {group.albums.length} {group.albums.length === 1 ? "culto" : "cultos"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {group.albums.map((album) => {
                  const cover = album.photos[0];
                  return (
                    <button
                      key={album.key}
                      onClick={() => setOpenAlbumKey(album.key)}
                      className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <div className="relative aspect-[4/3] bg-navy overflow-hidden">
                        <img
                          src={cover.imageUrl}
                          alt={`${album.title} - ${formatLongDate(album.dateKey)}`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase bg-gold text-navy px-3 py-1 rounded-full shadow-sm">
                          {serviceLabel(album.ministry)}
                        </span>
                        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <Images className="w-3.5 h-3.5" />
                          {album.photos.length}
                        </span>
                      </div>
                      <div className="p-4 sm:p-5">
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          {formatLongDate(album.dateKey)}
                        </p>
                        <h4 className="font-bold text-navy text-lg leading-snug group-hover:text-gold-dark transition-colors">
                          {album.title}
                        </h4>
                        {album.description && (
                          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {album.description}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-navy group-hover:gap-2 transition-all">
                          Ver álbum <ChevronRight className="w-3.5 h-3.5 text-gold" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

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

      {/* ── Album viewer ── */}
      {openAlbum && (
        <div
          className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Álbum ${openAlbum.title}`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-gold text-navy px-3 py-1 rounded-full">
                    {serviceLabel(openAlbum.ministry)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/60 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {formatLongDate(openAlbum.dateKey)}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{openAlbum.title}</h3>
                {openAlbum.description && (
                  <p className="text-white/70 mt-2 max-w-3xl leading-relaxed">{openAlbum.description}</p>
                )}
                <p className="text-white/40 text-xs mt-2">{openAlbum.photos.length} foto(s)</p>
              </div>
              <button
                onClick={closeAlbum}
                className="shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="Cerrar álbum"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>*]:mb-3">
              {openAlbum.photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setLightbox(i)}
                  className="group relative block w-full overflow-hidden rounded-xl bg-white/5 break-inside-avoid cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={`Ampliar foto ${i + 1}`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={`${openAlbum.title} - foto ${i + 1}`}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox (inside the opened album) ── */}
      {openAlbum && lightboxPhoto && (
        <div
          className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            aria-label="Cerrar foto"
          >
            <X className="w-5 h-5" />
          </button>

          {openAlbum.photos.length > 1 && (
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
              src={lightboxPhoto.imageUrl}
              alt={openAlbum.title}
              className="max-h-[78vh] max-w-full object-contain rounded-xl"
            />
            <figcaption className="mt-4 text-center max-w-2xl">
              <p className="text-white font-semibold">{openAlbum.title}</p>
              <p className="text-gold text-xs font-medium mt-0.5">
                {serviceLabel(openAlbum.ministry)} · {formatLongDate(openAlbum.dateKey)}
              </p>
              <p className="text-white/40 text-xs mt-2">
                {(lightbox ?? 0) + 1} / {openAlbum.photos.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
