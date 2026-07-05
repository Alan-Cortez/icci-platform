# ICCI - Plataforma Web Oficial

Plataforma web para **Iglesias Comunidad De Cristo Internacional** (ICCI).

## Stack

- **Next.js 16** (App Router, React 19)
- **Turso** (libSQL) + **Drizzle ORM**
- **Tailwind CSS 4**
- **Vercel** (despliegue)

## Inicio rápido

```bash
cd icci-platform
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Panel administrativo

- URL: `/admin/login`
- Usuario demo: `admin@icci.org.mx`
- Contraseña: `admin123`

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `TURSO_DATABASE_URL` | URL de Turso (o `file:local.db` en local) |
| `TURSO_AUTH_TOKEN` | Token de autenticación Turso |
| `AUTH_SECRET` | Secreto para sesiones JWT |

## Estructura

```
src/
├── app/
│   ├── (public)/     # Sitio público
│   ├── admin/          # Panel administrativo
│   └── api/            # API routes
├── components/
├── lib/
│   ├── db/             # Esquema y conexión Turso
│   └── auth/           # Autenticación por roles
└── scripts/            # Seed de datos
```

## Campus incluidos

Allende (principal), Sabinas, Múzquiz, Barroterán, Anáhuac, Durango.

## Roles del sistema

- Super Administrador
- Pastor General
- Pastor de Campus
- Líder de Ministerio
- Administrador de Redes

## Próximas fases

- [ ] Integración de pagos (Mercado Pago, PayPal, Stripe)
- [ ] Chatbot con FAQ
- [ ] App móvil (React Native)
- [ ] Calendario interactivo completo
- [ ] IA para chatbot contextual

## Despliegue en Vercel

1. Conecta el repositorio en GitHub
2. Configura las variables de entorno Turso
3. Deploy automático en cada push
