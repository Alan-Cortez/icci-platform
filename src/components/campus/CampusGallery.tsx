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
  Download,
  Share2,
  Check,
  Maximize2,
  Minimize2,
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

  // Theater modal state (Facebook-style view)
  const [theaterAlbumKey, setTheaterAlbumKey] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // ── Theater Mode Logic ────────────────────────────────────────────
  const currentAlbum = useMemo(() => {
    if (!theaterAlbumKey) return null;
    return allAlbums.find((a) => a.key === theaterAlbumKey) ?? null;
  }, [theaterAlbumKey, allAlbums]);

  const currentPhoto = currentAlbum?.photos[photoIndex] ?? null;
  const albumTotalPhotos = currentAlbum?.photos.length ?? 0;

  const closeTheater = useCallback(() => {
    setTheaterAlbumKey(null);
    setPhotoIndex(0);
    setIsFullscreen(false);
  }, []);

  const prevPhoto = useCallback(() => {
    if (!currentAlbum || albumTotalPhotos <= 1) return;
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : albumTotalPhotos - 1));
  }, [currentAlbum, albumTotalPhotos]);

  const nextPhoto = useCallback(() => {
    if (!currentAlbum || albumTotalPhotos <= 1) return;
    setPhotoIndex((prev) => (prev < albumTotalPhotos - 1 ? prev + 1 : 0));
  }, [currentAlbum, albumTotalPhotos]);

  // Keyboard navigation for theater
  useEffect(() => {
    if (!theaterAlbumKey) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTheater();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [theaterAlbumKey, closeTheater, prevPhoto, nextPhoto]);

  // Download handler
  async function handleDownloadPhoto() {
    if (!currentPhoto) return;
    setDownloading(true);
    try {
      const response = await fetch(currentPhoto.imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = `${currentAlbum?.title || "culto"}-${currentAlbum?.dateKey || "foto"}-${photoIndex + 1}.jpg`
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, "_");
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      window.open(currentPhoto.imageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  // Copy share link
  function handleCopyShareLink() {
    if (!currentPhoto) return;
    navigator.clipboard.writeText(currentPhoto.imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }

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
            Revive lo que Dios hace cada semana en nuestra familia. Haz clic en cualquier álbum para
            ver las fotos en tamaño completo y descargarlas en alta resolución.
          </p>

          {/* Quick stats */}
          <div className="mt-8 inline-grid grid-cols-3 divide-x divide-gray-200 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-full">
            {[
              { icon: Camera, value: String(photos.length), label: "Fotos" },
              { icon: Images, value: String(allAlbums.length), label: "Álbumes" },
              { icon: Calendar, value: latest ? shortDate(latest.dateKey) : "—", label: "Último culto" },
            ].map((s) => (
              <div key={s.label} className="px-2.5 sm:px-8 py-3.5 text-center">
                <s.icon className="w-4 h-4 text-gold mx-auto mb-1" />
                <p className="font-bold text-navy text-sm sm:text-lg leading-none">{s.value}</p>
                <p className="text-[9px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
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
                      onClick={() => {
                        setTheaterAlbumKey(album.key);
                        setPhotoIndex(0);
                      }}
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
                        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
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
                          Abrir galería <ChevronRight className="w-3.5 h-3.5 text-gold" />
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

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL TIPO FACEBOOK THEATER (Visor con barra lateral)
          ═══════════════════════════════════════════════════════════════════ */}
      {currentAlbum && currentPhoto && (
        <div
          className="fixed inset-0 z-[150] bg-black/95 flex flex-col lg:flex-row overflow-hidden select-none animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* ── Columna Izquierda: Visor de Foto a Pantalla Completa ── */}
          <div className="relative flex-1 bg-black flex flex-col justify-between items-center min-h-[50vh] lg:min-h-full overflow-hidden">
            {/* Barra superior de controles sobre la imagen */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeTheater}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
                  title="Cerrar (Esc)"
                  aria-label="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-white/80 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  {photoIndex + 1} de {albumTotalPhotos}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm hidden sm:flex"
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={closeTheater}
                  className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Imagen Principal Centrada */}
            <div
              className="relative w-full flex-1 flex items-center justify-center p-2 sm:p-6 lg:p-8"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeTheater();
              }}
            >
              <img
                src={currentPhoto.imageUrl}
                alt={currentAlbum.title}
                className="max-h-[50vh] sm:max-h-[65vh] lg:max-h-[82vh] max-w-full object-contain drop-shadow-2xl transition-all duration-200"
              />

              {/* Botones de navegación Anterior / Siguiente flotantes */}
              {albumTotalPhotos > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg"
                    aria-label="Foto anterior"
                    title="Foto anterior (Flecha izquierda)"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg"
                    aria-label="Siguiente foto"
                    title="Siguiente foto (Flecha derecha)"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Barra inferior de miniaturas (Tira del álbum) */}
            {albumTotalPhotos > 1 && (
              <div className="w-full bg-black/70 backdrop-blur-md border-t border-white/10 p-3 flex justify-center">
                <div className="flex items-center gap-2 overflow-x-auto max-w-2xl scrollbar-hide py-1">
                  {currentAlbum.photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      onClick={() => setPhotoIndex(i)}
                      className={cn(
                        "relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                        i === photoIndex
                          ? "border-gold scale-105 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={photo.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Columna Derecha: Panel de Información Tipo Facebook (Sin reacciones ni comentarios) ── */}
          <div className="w-full lg:w-[380px] xl:w-[420px] bg-white text-navy flex flex-col justify-between shrink-0 max-h-[50vh] lg:max-h-full border-t lg:border-t-0 lg:border-l border-gray-200">
            {/* Header del Panel */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  ICCI
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-navy text-sm leading-tight truncate">
                    Iglesias Comunidad de Cristo
                  </p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    Campus {campusName}
                  </p>
                </div>
              </div>

              <button
                onClick={closeTheater}
                className="hidden lg:flex w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-navy items-center justify-center transition-colors cursor-pointer"
                title="Cerrar visor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido / Descripción del Álbum */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* Etiquetas de fecha y ministerio */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
                  {serviceLabel(currentAlbum.ministry)}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  {formatLongDate(currentAlbum.dateKey)}
                </span>
              </div>

              {/* Título del Álbum */}
              <div>
                <h3 className="font-bold text-navy text-xl leading-snug">
                  {currentAlbum.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Foto {photoIndex + 1} de {albumTotalPhotos} en este álbum
                </p>
              </div>

              {/* Descripción del culto */}
              {currentAlbum.description ? (
                <div className="p-4 rounded-xl bg-off-white border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {currentAlbum.description}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Culto celebrado en Campus {campusName}.
                </p>
              )}

              {/* Descripción específica de la foto si tiene una distinta */}
              {currentPhoto.description && currentPhoto.description !== currentAlbum.description && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Nota de esta foto:
                  </p>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {currentPhoto.description}
                  </p>
                </div>
              )}
            </div>

            {/* Botones de Acción (Descarga y Compartir - SIN reacciones ni comentarios) */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-2.5">
              <button
                onClick={handleDownloadPhoto}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-gold" />
                {downloading ? "Descargando imagen..." : "Descargar foto"}
              </button>

              <button
                onClick={handleCopyShareLink}
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 text-navy font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-gray-500" />
                    Copiar enlace de la foto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
