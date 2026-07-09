import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Lock, Mail, UserCircle2, ShieldCheck } from "lucide-react";

export default async function AdminLoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a365d] via-navy to-[#050b14] flex items-center justify-center p-4 sm:p-8">
      {/* Container with entrance animation */}
      <div className="w-full max-w-[900px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Left Side: Decorative Background */}
        <div className="md:w-[45%] relative bg-navy overflow-hidden hidden md:block group">
          {/* Animated geometric shapes mimicking the inspiration with added depth */}
          <div className="absolute inset-0 z-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0d213b] to-[#050b14]" />
            
            {/* Floating shapes with slow transition on hover */}
            <div className="absolute -left-[20%] -top-[10%] w-[150%] h-[150%] bg-[#122b4d] transform rotate-[-25deg] shadow-2xl transition-transform duration-[3000ms] ease-out group-hover:rotate-[-20deg] group-hover:scale-105" />
            <div className="absolute -left-[30%] top-[40%] w-[150%] h-[150%] bg-[#081221] transform rotate-[35deg] shadow-2xl transition-transform duration-[3000ms] ease-out group-hover:rotate-[40deg] group-hover:scale-105" />

            {/* Glowing Gold accent lines */}
            <div className="absolute -left-[10%] top-[60%] w-[150%] h-14 bg-gradient-to-r from-gold to-[#e0a96d] transform rotate-[-15deg] shadow-[0_0_30px_rgba(200,132,60,0.4)] transition-transform duration-[3000ms] ease-out group-hover:-translate-y-2" />
            <div className="absolute left-[30%] -top-[20%] w-10 h-[150%] bg-gradient-to-b from-[#e0a96d] to-gold transform rotate-[45deg] shadow-[0_0_30px_rgba(200,132,60,0.4)] transition-transform duration-[3000ms] ease-out group-hover:translate-x-2" />
            
            {/* Overlay gradient to blend edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent pointer-events-none" />
          </div>

          {/* Elegant Tab-like cutout effect */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-32 bg-white rounded-l-3xl z-10 hidden md:block shadow-[-10px_0_20px_rgba(0,0,0,0.1)]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mt-[72px] w-6 h-6 bg-transparent shadow-[6px_6px_0_0_white] rounded-br-full z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 mt-[72px] w-6 h-6 bg-transparent shadow-[6px_-6px_0_0_white] rounded-tr-full z-10" />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <span className="text-navy font-black text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-sm" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Login
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-[55%] p-10 sm:p-14 md:p-16 flex flex-col justify-center relative z-10 bg-white">
          <div className="text-center mb-10 animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            <div className="relative inline-block mb-5">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-navy via-[#1a365d] to-[#0a1628] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <ShieldCheck className="w-12 h-12 text-gold" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl font-black text-navy tracking-tight">Acceso Privado</h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">Panel de administración ICCI</p>
          </div>

          {/* Google Login Only */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
              El panel administrativo utiliza autenticación segura integrada. Inicia sesión con una cuenta de Google autorizada.
            </p>

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/admin" });
              }}
            >
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 hover:shadow-md transition-all text-navy font-bold text-base group cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 transition-transform group-hover:scale-110" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Iniciar sesión con Google
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
