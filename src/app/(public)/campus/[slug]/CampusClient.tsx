"use client";

import { useState } from "react";
import { Calendar, Clock, Mail, MapPin, Phone, User, X, ChevronRight } from "lucide-react";
import { Button, Card, SectionHeading } from "@/components/ui";
import { SCHEDULES } from "@/lib/constants";

interface CampusClientProps {
  campus: any;
  pastorName: string;
  googleMapsUrl: string;
}

export function CampusClient({ campus, pastorName, googleMapsUrl }: CampusClientProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Schedules that should open a modal
  const INTERACTIVE_SCHEDULES = ["Jóvenes", "Varones", "Servicio femenil"];

  // Determine pastor details based on name
  let pastorImg = null;
  let pastorColor = "from-navy-light to-navy";
  
  if (pastorName.includes("Oscar") || pastorName.includes("Óscar")) {
    pastorImg = "/images/pastores-sosa.jpg";
    pastorColor = "from-navy to-navy-light";
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Pastor + Ubicación */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pastor Visual Card */}
          <div 
            className="relative group rounded-3xl overflow-hidden shadow-md border border-gray-100" 
            style={{ height: "300px" }}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${pastorColor}`}>
              {pastorImg && (
                <img
                  src={pastorImg}
                  alt={pastorName}
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="inline-flex items-center gap-1.5 text-gold text-xs font-bold uppercase tracking-widest mb-3 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <User className="w-3.5 h-3.5" /> Pastor
              </div>
              <p className="font-black text-white text-2xl leading-none">{pastorName}</p>
            </div>
          </div>

          {/* Ubicación & Contacto */}
          <div className="space-y-6 flex flex-col justify-between">
            <Card className="p-6 flex-1 flex flex-col justify-center">
              <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" /> Ubicación
              </h2>
              <p className="text-gray-700">{campus.address}</p>
              <div>
                <a
                  href={campus.isMain ? googleMapsUrl : `https://maps.google.com/?q=${encodeURIComponent(campus.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold border-2 border-navy text-navy px-5 py-2 rounded-full hover:bg-navy hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Cómo llegar
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="space-y-3">
                  <h2 className="font-bold text-navy text-sm uppercase tracking-wider">Contacto</h2>
                  <div className="flex flex-col gap-2 text-gray-600 text-sm">
                    <a href={`tel:${campus.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-navy transition-colors">
                      <Phone className="w-4 h-4 text-gold" /> {campus.phone}
                    </a>
                    <a href="mailto:contacto@icci.org.mx" className="flex items-center gap-2 hover:text-navy transition-colors">
                      <Mail className="w-4 h-4 text-gold" /> contacto@icci.org.mx
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Button href="/oracion" size="sm" className="w-full">Solicitar oración</Button>
                  <Button href="/eventos" variant="outline" size="sm" className="w-full">
                    <Calendar className="w-4 h-4 mr-1" /> Eventos
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Schedules (main campus only) */}
        {campus.isMain && (
          <div>
            <SectionHeading subtitle="Horarios" title="Servicios y actividades" centered={false} />
            <div className="grid sm:grid-cols-2 gap-4">
              {SCHEDULES.map((schedule) => {
                const isInteractive = INTERACTIVE_SCHEDULES.includes(schedule.title);
                
                return (
                  <Card 
                    key={schedule.title + schedule.days} 
                    className={`p-4 flex items-center justify-between gap-4 ${isInteractive ? 'cursor-pointer hover:border-gold/40 hover:shadow-md transition-all duration-300' : ''}`}
                    onClick={() => isInteractive && setActiveModal(schedule.title)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isInteractive ? 'bg-gold text-navy' : 'bg-gold/10 text-gold'}`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy">{schedule.title}</p>
                        <p className="text-sm text-gray-500">{schedule.days} · {schedule.time}</p>
                      </div>
                    </div>
                    {isInteractive && (
                      <ChevronRight className="w-5 h-5 text-gray-300 mr-2" />
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Interactive Schedules */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-navy transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <p className="text-gold font-bold text-xs uppercase tracking-widest mb-2">Más información</p>
            <h3 className="text-3xl font-black text-navy mb-4">{activeModal}</h3>
            <div className="h-0.5 w-10 bg-gold mb-6" />
            <p className="text-gray-600 leading-relaxed mb-8">
              La información detallada sobre {activeModal} estará disponible próximamente.
            </p>
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-navy text-white font-semibold py-3 rounded-xl hover:bg-navy-light transition-colors"
            >
              Cerrar ventana
            </button>
          </div>
        </div>
      )}
    </>
  );
}
