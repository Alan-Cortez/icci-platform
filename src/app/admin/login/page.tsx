import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Lock, Mail, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

export default async function AdminLoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side: Decorative Background */}
        <div className="md:w-[45%] relative bg-navy overflow-hidden hidden md:block">
          {/* Decorative geometric shapes mimicking the inspiration */}
          <div className="absolute inset-0 z-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0d213b] to-navy" />
            
            {/* Large polygon top-left to bottom-right */}
            <div className="absolute -left-[20%] -top-[10%] w-[150%] h-[150%] bg-[#122b4d] transform rotate-[-25deg] shadow-2xl" />
            
            {/* Intersecting polygon bottom-left to top-right */}
            <div className="absolute -left-[30%] top-[40%] w-[150%] h-[150%] bg-[#0a1628] transform rotate-[35deg] shadow-2xl" />

            {/* Gold accent line / polygon */}
            <div className="absolute -left-[10%] top-[60%] w-[150%] h-12 bg-gold/80 transform rotate-[-15deg] shadow-lg" />
            <div className="absolute left-[30%] -top-[20%] w-8 h-[150%] bg-gold/60 transform rotate-[45deg] shadow-lg" />
          </div>

          {/* Tab-like cutout effect for the "LOGIN" text on the right side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-24 bg-white rounded-l-2xl z-10 hidden md:block" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mt-[56px] w-4 h-4 bg-transparent shadow-[4px_4px_0_0_white] rounded-br-full z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 mt-[56px] w-4 h-4 bg-transparent shadow-[4px_-4px_0_0_white] rounded-tr-full z-10" />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <span className="text-navy font-bold text-lg tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              LOGIN
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center relative z-10 bg-white">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-navy to-[#1a365d] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserCircle2 className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-navy tracking-wide">LOGIN</h1>
          </div>

          {/* Decorative Email/Password Form (UI Only as requested) */}
          <form className="space-y-6 mb-8" action={async () => {
            "use server";
            // Not implemented yet - using Google below
          }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-navy focus:outline-none transition-colors text-navy placeholder:text-gray-400 font-medium"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-navy focus:outline-none transition-colors text-navy placeholder:text-gray-400 font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button type="button" className="text-sm font-semibold text-gold hover:text-gold-light transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
              <Button type="button" className="px-10 py-2.5 rounded-full shadow-md text-base">
                LOGIN
              </Button>
            </div>
          </form>

          {/* Separator & Google Login */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-semibold text-gray-400 tracking-wider">O Inicia Sesión Con</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/admin" });
              }}
            >
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-navy font-semibold text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
