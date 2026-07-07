"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";
import { CAMPUSES } from "@/lib/constants";
import { createPrayerRequest } from "@/actions/prayers";
import { Button, Input, Select, Textarea, SectionHeading, Card, Badge } from "@/components/ui";

// ─── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="font-display text-display text-navy mb-4">
        ¡Petición recibida!
      </h2>
      <p className="text-gray-600 max-w-md text-lg leading-relaxed mb-8 font-light">
        Nuestro equipo pastoral orará por ti. Que Dios responda conforme a Su
        perfecta voluntad.
      </p>
      <Button href="/">
        Volver al inicio <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function OracionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const nombre = form.get("nombre") as string;
      const apellidos = form.get("apellidos") as string;
      const tipo = form.get("tipo") as string;
      const campusId = form.get("campusId") as string;
      const message = form.get("message") as string;
      
      const combinedMessage = `Tipo: ${tipo}\nCampus: ${campusId}\n\nMensaje: ${message}`;
      
      const serverFormData = new FormData();
      serverFormData.append("name", `${nombre} ${apellidos}`);
      serverFormData.append("phone", form.get("celular") as string);
      serverFormData.append("request", combinedMessage);
      serverFormData.append("isPublic", "false"); 

      await createPrayerRequest(serverFormData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar tu petición. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  return (
    <div className="bg-off-white min-h-screen">
      {/* ── Hero section ──────────────────────────────────────────────── */}
      <section className="bg-navy pt-32 pb-32 px-4 relative overflow-hidden">
        {/* Abstract shapes in the background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Badge variant="gold" className="mb-6">CUIDADO PASTORAL</Badge>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display text-white mb-6 leading-tight">
            Queremos orar <span className="text-gold italic">contigo</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10 font-light">
            Creemos en el poder de la oración. Aquí puedes compartir tus peticiones para que podamos unirnos a orar por ti, y tus agradecimientos para inspirar a otros.
          </p>
          <Button
            onClick={() =>
              document
                .getElementById("form-oracion")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            variant="primary"
            size="lg"
          >
            Comparte aquí <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* ── Form Section ───────────────────────────────────────────────────────── */}
      <section id="form-oracion" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-16">
        <Card className="p-8 md:p-12 shadow-xl border-t-4 border-t-gold">
          <SectionHeading
            subtitle="TU HISTORIA IMPORTA"
            title="Cuéntanos tu historia"
            description="Llenar este formulario es seguro y confidencial. Nuestro equipo pastoral estará al tanto para acompañarte."
          />

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Select label="Tipo de petición" name="tipo" required>
                <option value="">Selecciona una opción</option>
                <option value="oracion">Petición de oración</option>
                <option value="testimonio">Testimonio / Historia</option>
                <option value="agradecimiento">Agradecimiento</option>
              </Select>

              <Select label="¿Asistes a un campus ICCI?" name="campusId" required>
                <option value="">Selecciona un campus</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.state}
                  </option>
                ))}
                <option value="ninguno">No asisto a ningún campus</option>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                name="nombre"
                required
                placeholder="Tu nombre"
              />
              <Input
                label="Apellidos"
                name="apellidos"
                required
                placeholder="Tus apellidos"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-800">Celular</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                  🇲🇽 +52
                </span>
                <input
                  name="celular"
                  type="tel"
                  required
                  className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors placeholder:text-gray-400 focus:outline-none"
                  placeholder="222 123 4567"
                />
              </div>
            </div>

            <Textarea
              label="Tu mensaje de petición o agradecimiento"
              name="message"
              required
              rows={5}
              placeholder="Escribe aquí tu petición o testimonio de forma detallada..."
            />

            <div className="flex items-start gap-4 pt-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-gold focus:ring-gold accent-gold cursor-pointer flex-shrink-0"
              />
              <label
                htmlFor="consent"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                Doy mi consentimiento para que <strong>Iglesias Comunidad De Cristo Internacional</strong> almacene estos datos y pueda ponerse en contacto conmigo si es necesario. Comprendo que la información será tratada con confidencialidad.
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !consent}
              className="w-full disabled:opacity-50"
              size="lg"
            >
              {loading ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
