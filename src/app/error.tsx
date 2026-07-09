"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a365d] via-[#050b14] to-[#010307] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#1a365d] to-[#0a1628] rounded-full flex items-center justify-center border-2 border-red-500 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-white tracking-tight">Ocurrió un error</h1>
        <h2 className="text-lg font-medium text-gold mt-2 font-serif italic">Algo no salió como esperábamos</h2>
        
        <p className="text-gray-400 mt-4 leading-relaxed font-light text-sm">
          Se ha producido un error inesperado al procesar esta página. El equipo técnico ha sido notificado. Puedes intentar recargar la página o volver a la de inicio.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gold hover:bg-[#c8843c] text-navy font-bold shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          
          <Button href="/" variant="outline" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
