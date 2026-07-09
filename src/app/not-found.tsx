import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a365d] via-[#050b14] to-[#010307] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="relative inline-block mb-6 animate-bounce duration-[2000ms]">
          <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#1a365d] to-[#0a1628] rounded-full flex items-center justify-center border-2 border-gold shadow-2xl">
            <Compass className="w-12 h-12 text-gold animate-spin duration-[10000ms]" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gold mt-2 font-serif italic">Página no encontrada</h2>
        
        <p className="text-gray-400 mt-4 leading-relaxed font-light">
          Lo sentimos, el recurso que estás buscando no existe o fue movido. Navega de vuelta al inicio de nuestra comunidad.
        </p>

        <div className="mt-8 flex justify-center">
          <Button href="/" className="inline-flex items-center gap-2 group">
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
