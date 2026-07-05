export const SITE = {
  name: "Iglesias Comunidad De Cristo Internacional",
  shortName: "ICCI",
  tagline: "Una familia de fe, esperanza y amor",
  location: "Allende, Coahuila, México",
  address: "Calle Benito Juárez #1705 Norte",
  phone: "+52 862 101 3598",
  email: "contacto@icci.org.mx",
  facebook: "https://www.facebook.com/share/1eUnmRAFef/",
  youtube: "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu",
  spotify: "https://open.spotify.com/intl-es/artist/2E4z1JBFkgPCmW1r6ygv9q?si=d9-NlfrwRCqw64bYKUOrVw",
  tiktok: "https://www.tiktok.com/@iglesiacomunidaddecristo",
} as const;

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  PASTOR_GENERAL: "pastor_general",
  CAMPUS_PASTOR: "campus_pastor",
  LEADER: "leader",
  SOCIAL_ADMIN: "social_admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const SCHEDULES = [
  { title: "Servicio de oración", days: "Lunes a viernes", time: "9:00 AM - 10:00 AM" },
  { title: "Servicio femenil", days: "Miércoles", time: "7:00 PM" },
  { title: "Servicio general", days: "Jueves", time: "7:00 PM" },
  { title: "Vigilia", days: "Último viernes de cada mes", time: "7:00 PM" },
  { title: "Jóvenes", days: "Sábado", time: "7:00 PM (11 años en adelante)" },
  { title: "Varones", days: "Sábado", time: "7:00 PM" },
  { title: "Servicio general", days: "Domingo", time: "10:00 AM" },
  { title: "Evangelización", days: "Último domingo del mes", time: "7:00 PM" },
] as const;

export const CAMPUSES = [
  {
    id: "allende",
    name: "Allende",
    state: "Coahuila",
    isMain: true,
    pastor: "Pastor Principal",
    address: "Calle Benito Juárez #1705 Norte, Allende, Coahuila",
    phone: "+52 862 101 3598",
    description: "Campus principal de ICCI, corazón de nuestra comunidad de fe en el norte de Coahuila.",
  },
  {
    id: "sabinas",
    name: "Sabinas",
    state: "Coahuila",
    isMain: false,
    pastor: "Pastor de Campus",
    address: "Sabinas, Coahuila",
    phone: "+52 862 101 3598",
    description: "Comunidad vibrante sirviendo a la región de Sabinas y alrededores.",
  },
  {
    id: "muzquiz",
    name: "Múzquiz",
    state: "Coahuila",
    isMain: false,
    pastor: "Pastor de Campus",
    address: "Múzquiz, Coahuila",
    phone: "+52 862 101 3598",
    description: "Extendiendo el evangelio en Múzquiz con amor y dedicación.",
  },
  {
    id: "barroteran",
    name: "Barroterán",
    state: "Coahuila",
    isMain: false,
    pastor: "Pastor de Campus",
    address: "Barroterán, Coahuila",
    phone: "+52 862 101 3598",
    description: "Una familia de fe creciendo en Barroterán.",
  },
  {
    id: "anahuac",
    name: "Anáhuac",
    state: "Nuevo León",
    isMain: false,
    pastor: "Pastor de Campus",
    address: "Anáhuac, Nuevo León",
    phone: "+52 862 101 3598",
    description: "Llevando la palabra de Dios a la comunidad de Anáhuac.",
  },
  {
    id: "durango",
    name: "Durango",
    state: "Durango",
    isMain: false,
    pastor: "Pastor de Campus",
    address: "Durango, Durango",
    phone: "+52 862 101 3598",
    description: "Ministrando con excelencia en la región de Durango.",
  },
] as const;

export const MINISTRIES = [
  { id: "varones", name: "Varones", description: "Hombres de fe unidos para crecer espiritualmente.", schedule: "Sábado 7:00 PM" },
  { id: "femenil", name: "Femenil", description: "Mujeres fortaleciendo su fe y propósito en Cristo.", schedule: "Miércoles 7:00 PM" },
  { id: "jovenes", name: "Jóvenes", description: "Generación apasionada por conocer a Dios.", schedule: "Sábado 7:00 PM" },
  { id: "ninos", name: "Niños", description: "Formando a los más pequeños en los caminos del Señor.", schedule: "Domingo 10:00 AM" },
] as const;

export const NAV_LINKS = [
  { href: "/conocenos", label: "Conócenos" },
  { href: "/campus", label: "Campus" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/eventos", label: "Eventos" },
  { href: "/predicaciones", label: "Predicaciones" },
  { href: "/devocionales", label: "Devocionales" },
  { href: "/oracion", label: "Oración" },
  { href: "/donaciones", label: "Donaciones" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const ADMIN_MODULES = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/campus", label: "Campus", icon: "MapPin" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "Users" },
  { href: "/admin/eventos", label: "Eventos", icon: "Calendar" },
  { href: "/admin/ministerios", label: "Ministerios", icon: "Heart" },
  { href: "/admin/predicaciones", label: "Predicaciones", icon: "Video" },
  { href: "/admin/devocionales", label: "Devocionales", icon: "BookOpen" },
  { href: "/admin/blog", label: "Blog", icon: "FileText" },
  { href: "/admin/galeria", label: "Galería", icon: "Image" },
  { href: "/admin/bautizos", label: "Bautizos", icon: "Droplets" },
  { href: "/admin/donaciones", label: "Donaciones", icon: "HandCoins" },
  { href: "/admin/oracion", label: "Solicitudes de oración", icon: "MessageCircle" },
  { href: "/admin/configuracion", label: "Configuración", icon: "Settings" },
] as const;
