"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ChevronRight, Droplets } from "lucide-react";
import { CAMPUSES } from "@/lib/constants";
import { createBaptismRegistration } from "@/actions/baptisms";

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
      <h2 className="text-3xl font-black text-gray-900 mb-3">
        ¡Registro Exitoso!
      </h2>
      <p className="text-gray-600 max-w-md leading-relaxed mb-8">
        Hemos recibido tus datos para el próximo bautismo. Nuestro equipo se pondrá en contacto contigo pronto con más detalles.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-navy transition-colors"
      >
        Volver al inicio <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function BautizosPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    
    try {
      await createBaptismRegistration(form);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Error al enviar el registro. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Droplets className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="text-5xl sm:text-6xl font-black leading-none tracking-tight text-gray-900 uppercase mb-6">
            Paso de Obediencia
          </h1>
          <p className="text-gray-600 leading-relaxed">
            El bautismo en agua es un paso público de obediencia que declara nuestra fe en Jesús. Si has entregado tu vida a Cristo y estás listo para dar este paso, llena el formulario a continuación.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Nombre Completo</label>
              <input name="fullName" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="Ej. Juan Pérez" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Correo Electrónico</label>
                <input name="email" type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="juan@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Celular</label>
                <input name="phone" type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="222 123 4567" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Edad</label>
                <input name="age" type="number" required min="7" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="Edad" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Campus</label>
                <select name="campus" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50">
                  <option value="">Selecciona un campus</option>
                  {CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Notas Adicionales (Opcional)</label>
              <textarea name="notes" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="¿Hay algo más que debamos saber?" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-navy hover:bg-[#0a1628] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-colors">
              {loading ? "Enviando Registro..." : "Registrarme para Bautismo"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
