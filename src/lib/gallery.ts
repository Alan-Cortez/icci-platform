/**
 * Shared helpers for the photo bank of services ("cultos").
 * Used by both server components/actions and client components,
 * so this file must NOT contain "use server" / "use client".
 */

export interface ServiceType {
  key: string;
  label: string;
  /** Usual day of the week, shown as a hint in the admin form */
  day: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  { key: "domingo", label: "Servicio Dominical", day: "Domingo" },
  { key: "general", label: "Servicio General", day: "Jueves" },
  { key: "femenil", label: "Servicio Femenil", day: "Miércoles" },
  { key: "jovenes", label: "Jóvenes Con Todo", day: "Sábado" },
  { key: "varones", label: "Ministerio de Varones", day: "Sábado" },
  { key: "oracion", label: "Servicio de Oración", day: "Lunes a viernes" },
  { key: "vigilia", label: "Vigilia de Oración", day: "Último viernes" },
  { key: "evangelismo", label: "Jornada de Evangelización", day: "Último domingo" },
  { key: "ninos", label: "Ministerio de Niños", day: "" },
  { key: "especial", label: "Evento Especial", day: "" },
  { key: "otro", label: "Otros", day: "" },
];

export function serviceLabel(key: string | null | undefined): string {
  return SERVICE_TYPES.find((s) => s.key === key)?.label ?? "Culto";
}

export const WEEKDAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Date of the service as "YYYY-MM-DD".
 * Dates are stored at 12:00 UTC so they never shift to another day with time zones.
 */
export function toDateKey(value: Date | number | string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" -> Date at 12:00 UTC */
export function dateFromKey(key: string): Date {
  return new Date(`${key}T12:00:00.000Z`);
}

export function formatLongDate(key: string): string {
  if (!key) return "";
  const d = dateFromKey(key);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()].toLowerCase()} de ${d.getUTCFullYear()}`;
}

export function weekdayOf(key: string): number {
  return dateFromKey(key).getUTCDay();
}

/** Today as a "YYYY-MM-DD" key using the user's local calendar day */
export function todayKey(): string {
  const n = new Date();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${n.getFullYear()}-${m}-${d}`;
}

/** Monday of the week that contains the given "YYYY-MM-DD" key */
export function startOfWeekKey(key: string): string {
  const d = dateFromKey(key);
  const offset = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

export function addDaysKey(key: string, days: number): string {
  const d = dateFromKey(key);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface BankPhoto {
  id: string;
  campusId: string | null;
  title: string;
  description: string | null;
  imageUrl: string;
  ministry: string;
  /** "YYYY-MM-DD" */
  dateKey: string;
}

export interface Album {
  key: string;
  dateKey: string;
  ministry: string;
  title: string;
  description: string;
  photos: BankPhoto[];
}

/** Groups photos of the same day and service into albums, newest first. */
export function groupIntoAlbums(photos: BankPhoto[]): Album[] {
  const map = new Map<string, Album>();
  for (const p of photos) {
    const key = `${p.dateKey}|${p.ministry}|${p.campusId ?? ""}`;
    let album = map.get(key);
    if (!album) {
      album = {
        key,
        dateKey: p.dateKey,
        ministry: p.ministry,
        title: p.title,
        description: "",
        photos: [],
      };
      map.set(key, album);
    }
    if (!album.description && p.description) album.description = p.description;
    album.photos.push(p);
  }
  return Array.from(map.values()).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
