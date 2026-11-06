import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Sparkles, Quote, MapPin, Users, HeartHandshake, ShieldCheck, Flame, ArrowRight, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestra Historia – ICCI",
  description: "Una visión nacida en el corazón de Dios: Testimonio del Pastor Teodoro Oscar Sosa Espinoza sobre el nacimiento y crecimiento de Iglesias Comunidad De Cristo Internacional.",
};

const timelineHighlights = [
  {
    year: "2010",
    title: "El llamado en medio de la adversidad",
    desc: "Llegada a Allende, Coahuila en una época de extrema inseguridad y violencia. Una asignación del cielo para encender una luz en la oscuridad.",
  },
  {
    year: "Inicio",
    title: "El primer servicio: 5 personas",
    desc: "Comenzando desde cero: Pastor Oscar, su esposa Raquel y tres personas más. Predicando con fuego y excelencia como si hubiera mil.",
  },
  {
    year: "6 Meses",
    title: "De 5 a 90 personas",
    desc: "Crecimiento sobrenatural que asombró a la comunidad. Confirmación divina: 'Cuando Dios da la visión, Él prepara la provisión'.",
  },
  {
    year: "Expansión",
    title: "Amor fuera de las cuatro paredes",
    desc: "Alimentos, despensas, literatura bíblica y servicio práctico a las familias más vulnerables y la comunidad.",
  },
  {
    year: "Hoy",
    title: "Presencia en 3 estados de México",
    desc: "Red de campus y cobertura pastoral en Coahuila, Nuevo León y Durango, trascendiendo fronteras con la Gran Comisión.",
  },
];

export default function HistoriaPage() {
  return (
    <div className="py-16 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link
          href="/conocenos"
          className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold mb-8 hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Conócenos
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold-dark mb-4 border border-gold/30">
            Documental • Testimonio Fundacional
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy leading-tight tracking-tight mb-4">
            Una visión nacida en el corazón de Dios
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            Por el Pastor Teodoro Oscar Sosa Espinoza • Iglesia Comunidad de Cristo Internacional
          </p>
        </div>

        {/* ── Frase Distintiva (Golden Quote Card) ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-navy-light text-white p-8 sm:p-12 shadow-2xl border border-gold/40 mb-14">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4 text-center max-w-3xl mx-auto">
            <Quote className="w-10 h-10 text-gold/40 mx-auto" />
            <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl italic font-normal text-white leading-relaxed">
              &ldquo;No comenzamos porque teníamos todos los recursos; comenzamos porque teníamos una palabra de Dios. Y cuando Dios entrega una visión, también prepara la provisión para cumplirla.&rdquo;
            </blockquote>
            <p className="text-gold font-bold text-xs sm:text-sm uppercase tracking-widest pt-2">
              — Pastor Teodoro Oscar Sosa Espinoza
            </p>
          </div>
        </div>

        {/* ── Video Documental Embed ── */}
        <div className="mb-16">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-navy-light border-2 border-navy/10 relative">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/6t1sApLp0ro?controls=1&rel=0"
              title="Testimonio e Historia de Comunidad de Cristo Internacional"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-xs text-gray-500 mt-3 italic">
            Conoce en video el testimonio de fe, valentía y milagros que dio inicio a nuestra casa espiritual.
          </p>
        </div>

        {/* ── El Relato Testimonial Completo ── */}
        <article className="prose prose-lg max-w-none text-gray-700 bg-white p-8 sm:p-12 md:p-14 rounded-3xl border border-gray-100 shadow-sm space-y-10 leading-relaxed">

          {/* Capítulo 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">1</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                El llamado en medio de la adversidad (2010)
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Nuestra historia no comenzó con un plan humano ni con comodidades; comenzó en el año <strong>2010</strong>, cuando Dios puso en mi corazón una sed inagotable por predicar su Palabra, compartir el Evangelio y alcanzar vidas para Cristo. Desde el principio entendí que no se trataba simplemente de abrir una iglesia más, sino de responder en obediencia a una asignación sagrada que Dios había depositado en mis manos.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Llegar a Allende, Coahuila en aquella época representó uno de los mayores retos de nuestras vidas. Era un tiempo difícil, marcado por un ambiente de inseguridad y delincuencia organizada que azotaba la región. Recibimos advertencias y amenazas directas para que dejáramos de predicar el evangelio. Vivimos momentos de violencia extrema y peligro constante que pusieron a prueba nuestra valentía, pero sobre todo, nuestra fe.
            </p>
          </section>

          {/* Capítulo 2 */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">2</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                Del «¿Por qué?» al «¿Para qué?»
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              En medio de aquellas circunstancias tan duras, confieso que hubo momentos de quebranto en los que le preguntaba a Dios en oración: <em>«Señor, ¿por qué me enviaste aquí?»</em>. Durante un tiempo no encontraba respuesta, hasta que el Espíritu Santo transformó mi corazón y comprendí que la pregunta no debía ser <em>por qué</em> me había enviado, sino <strong>para qué</strong> me había traído a este lugar.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Entonces todo cobró sentido: la oscuridad no era una señal para huir, sino la razón por la cual Dios nos había colocado como antorcha. No estábamos en Allende por casualidad; había una asignación del cielo para traer consuelo, esperanza y salvación a familias que lo necesitaban con urgencia. A pesar de las críticas, la resistencia y los obstáculos de diferentes sectores, nuestra convicción fue más fuerte: sabíamos quién nos había llamado.
            </p>
          </section>

          {/* Capítulo 3 */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">3</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                Cinco personas: El valor de la obediencia
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              El día que Dios me ordenó abrir las puertas de la iglesia, comenzamos literalmente desde cero. En nuestro primer servicio <strong>solamente éramos cinco personas</strong>: mi esposa Raquel, yo y otras tres personas. 
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Cualquiera hubiera podido desanimarse ante un inicio tan pequeño, pero decidimos honrar la presencia de Dios. Realizamos aquel servicio con la misma pasión, entrega y fuego como si estuviéramos predicando frente a mil personas. Porque cuando sirves al Señor, la mirada no está puesta en el número de asistentes, sino en la grandeza de Dios y en la reverencia a su llamado.
            </p>
          </section>

          {/* Capítulo 4 */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">4</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                La confirmación: Dios da la provisión
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Al siguiente domingo me postré ante el Señor y le dije: <em>«Padre, ya abrimos; ya dimos el primer paso de fe»</em>. Y para nuestra sorpresa y gozo, en ese segundo servicio llegaron <strong>doce personas</strong> que caminaron por iniciativa propia hasta el lugar para congregarse. Aquello encendió mi fe y confirmó una certeza que hasta el día de hoy guía mi vida: <strong>cuando Dios da la visión, Él también prepara la provisión.</strong>
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              En menos de <strong>seis meses</strong>, por pura gracia divina, aquella reunión de cinco personas creció hasta reunir a cerca de <strong>90 congregantes</strong>. La gente en la ciudad se sorprendía y se preguntaba qué estaba pasando y cómo una iglesia nacida de la nada estaba floreciendo con tal rapidez. La respuesta siempre fue la misma: era el favor sobrenatural de Dios sobre un paso de obediencia.
            </p>
          </section>

          {/* Capítulo 5 */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">5</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                Una iglesia viva fuera de cuatro paredes
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              A lo largo de este camino, Dios nos enseñó que la iglesia no existe únicamente para reunir personas dentro de un templo, sino para transformar la sociedad mediante el conocimiento del Reino de Dios y la compasión práctica.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Por eso salimos continuamente a las calles: repartiendo literatura cristiana, compartiendo el mensaje de salvación casa por casa, entregando alimentos calientes y apoyando a familias vulnerables con despensas. Hemos construido también lazos de bendición con autoridades, representantes públicos y empresarios locales, procurando siempre ser instrumentos de paz y bienestar para nuestra comunidad.
            </p>
          </section>

          {/* Capítulo 6 */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">6</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                Expansión ministerial y cobertura pastoral
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Hace poco más de tres años comenzó una nueva etapa en nuestra casa espiritual. Diversos pastores de distintas ciudades y congregaciones comenzaron a acercarse a nosotros buscando ayuda, respaldo, fraternidad y acompañamiento ministerial.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Dios puso entonces en nuestro corazón la visión de <strong>brindar cobertura espiritual a otros campos y ministerios</strong>. La obra se extendió, fortaleciendo pastores y consolidando congregaciones bajo una misma paternidad espiritual, una misma doctrina bíblica y un mismo propósito.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              De ahí nació con mayor fuerza el nombre <strong>Comunidad de Cristo Internacional</strong>: no se trataba solo de una congregación local, sino de una familia de iglesias unidas por el Reino de Dios, cuya influencia trasciende fronteras.
            </p>
          </section>

          {/* Capítulo 7 */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm flex items-center justify-center shrink-0">7</span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy m-0">
                Presencia en tres estados y lo que está por venir
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Actualmente tenemos presencia activa en tres estados: <strong>Coahuila, Nuevo León y Durango</strong> (con campus en Allende, Sabinas, Múzquiz, Barroterán, Anáhuac y Durango). Esto llena nuestro corazón de gratitud y de una enorme expectativa santa, porque creemos que Dios continuará expandiendo su Reino a través de la obediencia.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Hoy miramos hacia atrás y vemos que cada dificultad, cada amenaza, cada lágrima y cada desafío fueron parte del proceso mediante el cual Dios nos enseñó a depender al 100% de Él. Nuestra historia no es el monumento al esfuerzo de un hombre; es el testimonio viviente de una visión que nació en el corazón de Dios, que floreció en medio de la adversidad y que continuará multiplicándose por generaciones.
            </p>
            
            <div className="p-6 bg-gold/10 rounded-2xl border border-gold/30 mt-6">
              <p className="font-bold text-navy text-base sm:text-lg text-center m-0">
                «Porque cuando Dios entrega una visión, también prepara la provisión. Y cuando hay obediencia, su propósito puede alcanzar mucho más allá de lo que un día imaginamos».
              </p>
            </div>
          </section>

        </article>

        {/* ── Resumen de Hitos Cronológicos ── */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-navy text-2xl mb-8 text-center">
            Línea del tiempo de nuestra historia
          </h3>
          <div className="relative border-l-2 border-gold/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
            {timelineHighlights.map((h, i) => (
              <div key={i} className="relative group">
                <span className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-navy border-2 border-gold flex items-center justify-center text-[10px] text-gold font-bold">
                  {i + 1}
                </span>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full mb-1">
                  {h.year}
                </span>
                <h4 className="font-bold text-navy text-lg">{h.title}</h4>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Call to action ── */}
        <div className="mt-16 text-center space-y-6 bg-gradient-to-br from-navy via-navy to-navy-light text-white p-10 sm:p-12 rounded-3xl shadow-xl border border-gold/30">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            ¿Quieres ser parte de esta historia?
          </h3>
          <p className="text-white/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            La historia de Comunidad de Cristo Internacional continúa escribiéndose. Cada persona y familia que se suma es un nuevo milagro de la gracia de Dios.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/campus"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold px-7 py-3 rounded-full transition-all shadow-md cursor-pointer"
            >
              Conoce nuestros campus <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/conocenos/vision"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all border border-white/20 cursor-pointer"
            >
              Nuestra Visión y Misión
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
