"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, CheckCircle } from "lucide-react";
import { Button, Input, SectionHeading, Textarea } from "@/components/ui";
import { SITE } from "@/lib/constants";

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Escríbenos"
          title="Contacto"
          description="Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios."
        />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { icon: MapPin, label: "Dirección", value: `${SITE.address}, ${SITE.location}` },
              { icon: Phone, label: "Teléfono", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
              { icon: Mail, label: "Correo", value: SITE.email, href: `mailto:${SITE.email}` },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-navy">{label}</p>
                  {href ? (
                    <a href={href} className="text-gray-600 hover:text-navy">{value}</a>
                  ) : (
                    <p className="text-gray-600">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-bold text-navy text-lg">Mensaje enviado</h3>
              <p className="text-gray-600 mt-2">Te responderemos a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Nombre *" name="name" required />
              <Input label="Correo *" name="email" type="email" required />
              <Input label="Asunto" name="subject" />
              <Textarea label="Mensaje *" name="message" required rows={5} />
              <Button type="submit" className="w-full">Enviar mensaje</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
