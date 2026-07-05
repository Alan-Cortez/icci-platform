"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, CheckCircle, Clock } from "lucide-react";
import { Button, Input, Textarea, Select, Card, Badge } from "@/components/ui";
import { CAMPUSES, MINISTRIES } from "@/lib/constants";
import { createCampus, deleteCampus, createEvent, deleteEvent, createSermon, deleteSermon, createDevotional, deleteDevotional } from "@/app/actions/admin";

// ─── Shared types ─────────────────────────────────────────────────────────────

interface RowAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

// ─── Generic table ─────────────────────────────────────────────────────────────

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-gray-400">
                No hay registros aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-navy text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {active ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

// ─── Campus module ─────────────────────────────────────────────────────────────

function CampusModule({ initialData = [] }: { initialData?: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    await createCampus(data);
    setShowForm(false);
  };

  const rows = initialData.map((c) => [
    <span key="name" className="font-medium text-navy">{c.name}</span>,
    c.state,
    c.pastor,
    c.phone,
    <StatusBadge key="status" active={c.isActive} />,
    c.isMain ? <Badge key="badge" variant="gold">Principal</Badge> : null,
    <div key="actions" className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
      <button 
        disabled={loadingId === c.id}
        onClick={async () => {
          setLoadingId(c.id);
          await deleteCampus(c.id);
          setLoadingId(null);
        }}
        className="text-red-400 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{initialData.length} campus registrados</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo campus
        </Button>
      </div>
      <Card>
        <DataTable headers={["Nombre", "Estado", "Pastor", "Teléfono", "Estado", "Tipo", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nuevo campus" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Nombre del campus *" name="name" required />
            <Input label="Estado / Ciudad *" name="state" required />
            <Input label="Pastor *" name="pastor" required />
            <Input label="Dirección" name="address" />
            <Input label="Teléfono" name="phone" type="tel" />
            <Input label="Correo" name="email" type="email" />
            <Textarea label="Descripción" name="description" rows={3} />
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Guardar campus</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Usuarios module ──────────────────────────────────────────────────────────

function UsuariosModule() {
  const [showForm, setShowForm] = useState(false);
  const users = [
    { name: "Administrador", email: "admin@icci.org.mx", role: "Super Admin", campus: "—", active: true },
    { name: "Pastor General", email: "pastor@icci.org.mx", role: "Pastor General", campus: "Allende", active: true },
  ];
  const rows = users.map((u) => [
    <span className="font-medium text-navy">{u.name}</span>,
    u.email,
    <span className="text-xs bg-navy/10 text-navy px-2 py-0.5 rounded-full">{u.role}</span>,
    u.campus,
    <StatusBadge active={u.active} />,
    <div className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
      <button className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{users.length} usuarios</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo usuario
        </Button>
      </div>
      <Card>
        <DataTable headers={["Nombre", "Correo", "Rol", "Campus", "Estado", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nuevo usuario" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <Input label="Nombre completo *" name="name" required />
            <Input label="Correo electrónico *" name="email" type="email" required />
            <Input label="Contraseña *" name="password" type="password" required />
            <Select label="Rol *" name="role">
              <option value="super_admin">Super Administrador</option>
              <option value="pastor_general">Pastor General</option>
              <option value="campus_pastor">Pastor de Campus</option>
              <option value="leader">Líder</option>
              <option value="social_admin">Admin de Redes</option>
            </Select>
            <Select label="Campus asignado" name="campusId">
              <option value="">Sin campus específico</option>
              {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Crear usuario</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Eventos module ───────────────────────────────────────────────────────────

function EventosModule({ initialData = [], allCampuses = [] }: { initialData?: any[], allCampuses?: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    await createEvent(data);
    setShowForm(false);
  };

  const rows = initialData.map((ev) => [
    <span key="title" className="font-medium text-navy">{ev.title}</span>,
    allCampuses.find((c: any) => c.id === ev.campusId)?.name || "Todos los campus",
    ev.startDate, 
    ev.time,
    <StatusBadge key="status" active={ev.isPublished} />,
    <div key="actions" className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
      <button 
        disabled={loadingId === ev.id}
        onClick={async () => {
          setLoadingId(ev.id);
          await deleteEvent(ev.id);
          setLoadingId(null);
        }}
        className="text-red-400 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{initialData.length} eventos</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo evento
        </Button>
      </div>
      <Card>
        <DataTable headers={["Título", "Campus", "Fecha", "Hora", "Estado", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nuevo evento" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Título *" name="title" required />
            <Textarea label="Descripción" name="description" rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Fecha *" name="startDate" type="date" required />
              <Input label="Hora" name="time" placeholder="7:00 PM" />
            </div>
            <Select label="Campus" name="campusId">
              <option value="">Todos los campus</option>
              {allCampuses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Input label="Lugar" name="location" />
            <Input label="Responsable" name="responsible" />
            <Input label="Cupo máximo" name="capacity" type="number" />
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Guardar evento</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Ministerios module ───────────────────────────────────────────────────────

function MinisteriosModule() {
  const [showForm, setShowForm] = useState(false);
  const rows = MINISTRIES.map((m) => [
    <span className="font-medium text-navy">{m.name}</span>,
    "Principal",
    m.schedule,
    <StatusBadge active={true} />,
    <div className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{MINISTRIES.length} ministerios</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo ministerio
        </Button>
      </div>
      <Card>
        <DataTable headers={["Nombre", "Campus", "Horario", "Estado", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nuevo ministerio" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <Input label="Nombre *" name="name" required />
            <Select label="Categoría *" name="category">
              <option value="varones">Varones</option>
              <option value="femenil">Femenil</option>
              <option value="jovenes">Jóvenes</option>
              <option value="ninos">Niños</option>
              <option value="matrimonios">Matrimonios</option>
              <option value="evangelismo">Evangelismo</option>
              <option value="adoracion">Adoración/Alabanza</option>
              <option value="otro">Otro</option>
            </Select>
            <Select label="Campus" name="campusId">
              {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Textarea label="Descripción" name="description" rows={3} />
            <Input label="Horario" name="schedule" placeholder="Sábado 7:00 PM" />
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Guardar ministerio</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Predicaciones module ─────────────────────────────────────────────────────

function PredicacionesModule({ initialData = [], allCampuses = [] }: { initialData?: any[], allCampuses?: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    await createSermon(data);
    setShowForm(false);
  };

  const rows = initialData.map((s) => [
    <span key="title" className="font-medium text-navy">{s.title}</span>,
    s.series, s.pastor,
    allCampuses.find((c: any) => c.id === s.campusId)?.name || "Todos los campus", 
    s.date,
    <StatusBadge key="status" active={s.isPublished} />,
    <div key="actions" className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
      <button 
        disabled={loadingId === s.id}
        onClick={async () => {
          setLoadingId(s.id);
          await deleteSermon(s.id);
          setLoadingId(null);
        }}
        className="text-red-400 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{initialData.length} predicaciones</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nueva predicación
        </Button>
      </div>
      <Card>
        <DataTable headers={["Título", "Serie", "Pastor", "Campus", "Fecha", "Estado", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nueva predicación" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Título *" name="title" required />
            <Input label="Serie" name="series" placeholder="Nombre de la serie" />
            <Input label="Pastor *" name="pastor" required />
            <Select label="Campus" name="campusId">
              <option value="">General</option>
              {allCampuses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Input label="Enlace de YouTube" name="videoUrl" placeholder="https://youtube.com/watch?v=..." />
            <Input label="Fecha *" name="date" type="date" required />
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Publicar predicación</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Devocionales module ──────────────────────────────────────────────────────

function DevocionalesModule({ initialData = [] }: { initialData?: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    await createDevotional(data);
    setShowForm(false);
  };

  const rows = initialData.map((d) => [
    <span key="title" className="font-medium text-navy">{d.title}</span>,
    d.verse, d.author, d.date,
    <StatusBadge key="status" active={d.isPublished} />,
    <div key="actions" className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
      <button 
        disabled={loadingId === d.id}
        onClick={async () => {
          setLoadingId(d.id);
          await deleteDevotional(d.id);
          setLoadingId(null);
        }}
        className="text-red-400 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{initialData.length} devocionales</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo devocional
        </Button>
      </div>
      <Card>
        <DataTable headers={["Título", "Versículo", "Autor", "Fecha", "Estado", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nuevo devocional" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Título *" name="title" required />
            <Input label="Versículo *" name="verse" required placeholder="Proverbios 3:5" />
            <Textarea label="Reflexión *" name="reflection" rows={4} required />
            <Input label="Autor *" name="author" required />
            <Input label="Fecha *" name="date" type="date" required />
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Publicar devocional</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Blog module ──────────────────────────────────────────────────────────────

function BlogModule() {
  const [showForm, setShowForm] = useState(false);
  const posts = [
    { title: "Cómo crecer en tu fe este año", author: "Equipo Pastoral", category: "Crecimiento", date: "Junio 2026", published: true },
  ];
  const rows = posts.map((p) => [
    <span className="font-medium text-navy">{p.title}</span>,
    p.author, p.category,
    <StatusBadge active={p.published} />,
    <div className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
      <button className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{posts.length} artículos</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo artículo
        </Button>
      </div>
      <Card>
        <DataTable headers={["Título", "Autor", "Categoría", "Estado", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Nuevo artículo" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <Input label="Título *" name="title" required />
            <Input label="Extracto" name="excerpt" placeholder="Resumen breve del artículo" />
            <Textarea label="Contenido *" name="content" rows={6} required />
            <Input label="Autor" name="author" />
            <Select label="Categoría" name="category">
              <option value="crecimiento">Crecimiento</option>
              <option value="comunidad">Comunidad</option>
              <option value="familia">Familia</option>
              <option value="ministerio">Ministerio</option>
              <option value="finanzas">Finanzas</option>
            </Select>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Publicar artículo</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Galería module ───────────────────────────────────────────────────────────

function GaleriaModule() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">Administra las fotos de la galería</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Agregar foto
        </Button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center relative group cursor-pointer">
            <span className="text-gray-300 text-xs">Foto {i + 1}</span>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all flex items-center justify-center gap-1">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <div
          onClick={() => setShowForm(true)}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-colors"
        >
          <Plus className="w-6 h-6 text-gray-300" />
        </div>
      </div>
      {showForm && (
        <Modal title="Agregar foto" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-colors">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Haz clic para seleccionar imagen</p>
            </div>
            <Input label="Título / Descripción" name="title" />
            <Select label="Categoría" name="category">
              <option value="campus">Campus</option>
              <option value="eventos">Eventos</option>
              <option value="ministerios">Ministerios</option>
              <option value="general">General</option>
            </Select>
            <Select label="Campus" name="campusId">
              <option value="">General</option>
              {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Guardar foto</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Bautizos module ──────────────────────────────────────────────────────────

function BautizosModule() {
  const [showForm, setShowForm] = useState(false);
  const baptisms = [
    { name: "Juan García", date: "2026-06-01", pastor: "Pastor General", campus: "Allende" },
  ];
  const rows = baptisms.map((b) => [
    <span className="font-medium text-navy">{b.name}</span>,
    b.date, b.pastor, b.campus,
    <div className="flex gap-2">
      <button className="text-gold hover:text-gold-light"><Pencil className="w-4 h-4" /></button>
    </div>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{baptisms.length} registros</p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo bautizo
        </Button>
      </div>
      <Card>
        <DataTable headers={["Persona", "Fecha", "Pastor", "Campus", "Acciones"]} rows={rows} />
      </Card>
      {showForm && (
        <Modal title="Registrar bautizo" onClose={() => setShowForm(false)}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <Input label="Nombre de la persona *" name="personName" required />
            <Input label="Fecha del bautizo *" name="date" type="date" required />
            <Input label="Pastor que ofició *" name="pastor" required />
            <Select label="Campus *" name="campusId" required>
              {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Textarea label="Notas adicionales" name="notes" rows={3} />
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Registrar bautizo</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ─── Donaciones module ────────────────────────────────────────────────────────

function DonacionesModule() {
  const donations = [
    { donor: "Anónimo", amount: "$500 MXN", method: "Efectivo", campus: "Allende", status: "completado", date: "2026-06-01" },
  ];
  const rows = donations.map((d) => [
    d.donor,
    <span className="font-bold text-navy">{d.amount}</span>,
    d.method, d.campus, d.date,
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{d.status}</span>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">Total: {donations.length} donaciones</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Integración de pagos: próximamente</span>
        </div>
      </div>
      <Card>
        <DataTable headers={["Donante", "Monto", "Método", "Campus", "Fecha", "Estado"]} rows={rows} />
      </Card>
    </>
  );
}

// ─── Oración module ───────────────────────────────────────────────────────────

function OracionModule() {
  const [filter, setFilter] = useState("Todas");
  const requests = [
    { name: "María González", message: "Por la salud de mi familia.", campus: "Allende", status: "pendiente", date: "2026-07-01" },
    { name: "Carlos Rodríguez", message: "Por mi trabajo y finanzas.", campus: "Sabinas", status: "atendida", date: "2026-06-28" },
  ];
  const filtered = filter === "Todas" ? requests : requests.filter((r) => r.status === filter.toLowerCase());
  const rows = filtered.map((r) => [
    <span className="font-medium text-navy">{r.name}</span>,
    <span className="text-sm">{r.message}</span>,
    r.campus, r.date,
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === "pendiente" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
      {r.status}
    </span>,
    <button className="text-gold hover:text-gold-light text-xs font-medium">
      {r.status === "pendiente" ? "Marcar atendida" : "Ver"}
    </button>,
  ]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {["Todas", "Pendiente", "Atendida"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">{filtered.length} peticiones</p>
      </div>
      <Card>
        <DataTable headers={["Nombre", "Petición", "Campus", "Fecha", "Estado", "Acción"]} rows={rows} />
      </Card>
    </>
  );
}

// ─── Configuración module ─────────────────────────────────────────────────────

function ConfiguracionModule() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-navy mb-4">Información del sitio</h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Nombre de la iglesia" defaultValue="Iglesias Comunidad De Cristo Internacional" name="siteName" />
          <Input label="Correo de contacto" defaultValue="contacto@icci.org.mx" name="email" type="email" />
          <Input label="Teléfono" defaultValue="+52 862 101 3598" name="phone" />
          <Input label="Dirección principal" defaultValue="Calle Benito Juárez #1705 Norte, Allende, Coahuila" name="address" />
          <Button type="submit" size="sm">Guardar cambios</Button>
        </form>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold text-navy mb-4">Redes sociales</h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Facebook" defaultValue="https://facebook.com" name="facebook" />
          <Input label="Instagram" placeholder="https://instagram.com/..." name="instagram" />
          <Input label="TikTok" placeholder="https://tiktok.com/..." name="tiktok" />
          <Button type="submit" size="sm">Guardar redes</Button>
        </form>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold text-navy mb-4">Seguridad</h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Nueva contraseña" name="password" type="password" />
          <Input label="Confirmar contraseña" name="confirmPassword" type="password" />
          <Button type="submit" size="sm" variant="outline">Cambiar contraseña</Button>
        </form>
      </Card>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const moduleComponents: Record<string, React.ComponentType<any>> = {
  campus: CampusModule,
  usuarios: UsuariosModule,
  eventos: EventosModule,
  ministerios: MinisteriosModule,
  predicaciones: PredicacionesModule,
  devocionales: DevocionalesModule,
  blog: BlogModule,
  galeria: GaleriaModule,
  bautizos: BautizosModule,
  donaciones: DonacionesModule,
  oracion: OracionModule,
  configuracion: ConfiguracionModule,
};

export function AdminModulePage({
  title,
  description,
  module,
  initialData,
  allCampuses,
}: {
  title: string;
  description: string;
  module: string;
  initialData?: any;
  allCampuses?: any;
}) {
  const ModuleContent = moduleComponents[module];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
      {ModuleContent ? <ModuleContent initialData={initialData} allCampuses={allCampuses} /> : (
        <Card className="p-12 text-center text-gray-400">
          Módulo en construcción.
        </Card>
      )}
    </div>
  );
}
