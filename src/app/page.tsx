import Image from "next/image";
import Link from "next/link";
import { Shield, ShieldCheck, Cpu, Headphones, ArrowRight, Menu, CheckCircle2 } from "lucide-react";
import SmartConfigurator from "@/components/SmartConfigurator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-grid selection:bg-accent/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/10">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold uppercase tracking-tighter text-slate-900">
              Global <span className="text-primary border-b-2 border-primary pb-0.5">Telecom</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-slate-600">
            <Link href="#servicios" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Servicios</Link>
            <Link href="#soluciones" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Soluciones</Link>
            <Link href="/tienda" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Tienda Pro</Link>
            <Link href="/login" className="px-6 py-2 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all text-slate-900">Portal Cliente</Link>
          </div>

          <button className="md:hidden p-2 text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Partner Certificado Hikvision & Syscom
              </div>

              <h1 className="text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[1] text-slate-900">
                Seguridad <br /> <span className="text-primary">Estratégica</span> <br /> de Alto Nivel
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
                Ingeniería avanzada en Videovigilancia, Control de Acceso y Redes. Revendemos el mejor hardware de Syscom con el plus de nuestra instalación profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="#configurador" className="btn-primary group text-lg">
                  Cotizar Proyecto <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/tienda" className="btn-secondary text-lg">Ver Catálogo</Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-12 border-t border-white/5">
                <div>
                  <p className="text-3xl font-bold text-slate-900 border-b-2 border-primary inline-block">10+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Años de Expertis</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 border-b-2 border-primary inline-block">500+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Proyectos Listos</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-3xl font-bold text-slate-900 border-b-2 border-primary inline-block">24/7</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Soporte Técnico</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 blur-[100px] rounded-full opacity-50 animate-pulse"></div>
              <div className="relative bg-slate-50 rounded-[48px] overflow-hidden border border-slate-200 aspect-square lg:aspect-video flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
                <Shield className="w-48 h-48 text-primary/10" />
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-xl flex items-center gap-6">
                  <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-tight text-slate-900">Infraestructura Verificada</p>
                    <p className="text-[10px] font-medium text-slate-500">Sistemas redundantes configurados correctamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SmartConfigurator />

      {/* Services Quick View */}
      <section id="servicios" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold uppercase tracking-tight text-slate-900">Servicios <span className="text-primary">Especializados</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Ofrecemos soluciones integrales desde la venta del equipo hasta la configuración final.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Shield className="w-8 h-8" />}
              title="CCTV & Monitoreo"
              description="Instalación de cámaras IP, térmicas y PTZ con análisis de video inteligente Hikvision."
            />
            <ServiceCard
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Control de Acceso"
              description="Biométricos faciales, torniquetes y chapas magnéticas integradas a tu red local."
            />
            <ServiceCard
              icon={<Cpu className="w-8 h-8" />}
              title="Redes & Enlaces"
              description="Infraestructura de red, fibra óptica y enlaces inalámbricos para zonas sin cobertura."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-white p-10 rounded-[32px] border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 text-slate-900">
        {icon}
      </div>
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
        {icon}
      </div>
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
