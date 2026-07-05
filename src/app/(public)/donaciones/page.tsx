import type { Metadata } from "next";
import { HandCoins, CreditCard } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Donaciones" };

export default function DonacionesPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Generosidad"
          title="Donaciones"
          description="Tu apoyo permite que sigamos extendiendo el evangelio en nuestra región."
        />
        <Card className="p-8 text-center mb-8">
          <HandCoins className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2">Próximamente</h3>
          <p className="text-gray-600 leading-relaxed">
            Estamos preparando la integración de donaciones en línea. Muy pronto podrás contribuir
            de forma segura a través de nuestra plataforma.
          </p>
        </Card>
        <div className="grid sm:grid-cols-3 gap-4">
          {["Mercado Pago", "PayPal", "Stripe"].map((method) => (
            <Card key={method} className="p-4 text-center opacity-50">
              <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">{method}</p>
              <p className="text-xs text-gray-400 mt-1">Próximamente</p>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">
          Por ahora, puedes contactarnos directamente para información sobre donaciones.
        </p>
      </div>
    </div>
  );
}
