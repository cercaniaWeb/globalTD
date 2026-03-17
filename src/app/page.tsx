'use client'

import Image from "next/image";
import Link from "next/link";
import { Cpu, ArrowRight, Camera, Shield, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const SmartConfigurator = dynamic(() => import("@/components/SmartConfigurator"), {
  loading: () => (
    <div className="h-[800px] w-full flex flex-col items-center justify-center space-y-4 bg-slate-950/50 backdrop-blur-xl border border-white/5 rounded-3xl animate-pulse my-20">
      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
        <Cpu className="w-6 h-6 text-primary animate-spin-slow" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[5px] text-primary">Inicializando Configurador...</p>
    </div>
  ),
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background bg-grid selection:bg-primary/30 text-slate-100">
      <article>
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.1)_0%,transparent_70%)] pointer-events-none z-0"></div>

          <div className="max-w-7xl mx-auto relative z-30 w-full">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-32 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-10 relative z-40 max-w-2xl"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-[4px] drop-shadow-glow">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div> Partner Certificado Hikvision & Syscom
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.95] italic text-white drop-shadow-3xl">
                  Ingeniería de <br /> <span className="text-primary text-shadow-glow">CCTV</span> <br /> Institucional
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed uppercase tracking-wider drop-shadow-lg">
                  Desplegamos infraestructura de videovigilancia de alta integridad con estándar industrial para empresas y residencias de alto valor.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <Link href="#configurador" className="btn-primary group py-6 px-12 text-xs shadow-2xl shadow-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    Diseñar Mi Sistema <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link href="/tienda" className="px-12 py-6 glass rounded-[22px] border border-white/10 text-xs font-black uppercase tracking-[4px] hover:bg-white/10 transition-all text-center">Catálogo Técnico</Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 pt-16 border-t border-white/10">
                  <div className="space-y-2">
                    <p className="text-4xl font-black italic text-white">10+</p>
                    <p className="text-[9px] uppercase font-black tracking-[3px] text-primary/70">Años de Expertise</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-black italic text-white">500+</p>
                    <p className="text-[9px] uppercase font-black tracking-[3px] text-primary/70">Sistemas Instalados</p>
                  </div>
                  <div className="hidden sm:block space-y-2">
                    <p className="text-4xl font-black italic text-white">24/7</p>
                    <p className="text-[9px] uppercase font-black tracking-[3px] text-primary/70">SOC Operativo</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative group p-4 sm:p-20 underline-offset-8"
              >
                <div className="relative rounded-[56px] overflow-hidden border border-white/10 aspect-square shadow-4xl z-10">
                   <Image 
                      src="/hero-cctv.png" 
                      alt="Sistema de CCTV Profesional - Global Telecomunicaciones Digitales" 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-all group-hover:scale-110 duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                      priority
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                </div>
                
                <div className="absolute -bottom-8 -right-4 md:-right-8 w-full max-w-[320px] p-8 glass-premium backdrop-blur-[40px] rounded-3xl border border-primary/30 shadow-4xl flex items-center gap-6 group-hover:translate-y-[-10px] transition-all duration-700 z-30">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-inner">
                    <CheckCircle2 className="text-primary w-8 h-8 animate-pulse" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black uppercase tracking-widest text-white text-sm">Empresa Verificada</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">Hikvision Pro Partner</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-32 px-6 bg-background relative border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 text-balance">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[3px]">
                  Servicios Global Tech
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-none">
                  Ingeniería en <br /><span className="text-primary text-shadow-glow">Seguridad Crítica</span>
                </h2>
              </div>
              <p className="text-slate-400 font-medium max-w-sm uppercase tracking-widest text-[10px] leading-relaxed">
                Nuestros procesos de ingeniería garantizan que cada pixel cuente y cada acceso esté bajo control total en todo México.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Video Inteligente",
                  desc: "CCTV con analíticas de IA para detección de intrusos y reconocimiento facial.",
                  icon: <Camera className="w-10 h-10" />,
                  image: "/service-cctv.png"
                },
                {
                  title: "Acceso Biométrico",
                  desc: "Control de personal y visitas mediante reconocimiento facial y dactilar.",
                  icon: <Shield className="w-10 h-10" />,
                  image: "/service-access.png"
                },
                {
                  title: "Conectividad Pro",
                  desc: "Redes de fibra óptica e infraestructura inalámbrica industrial.",
                  icon: <Globe className="w-10 h-10" />,
                  image: "/service-network.png"
                }
              ].map((service, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-slate-900/50 hover:bg-slate-900 transition-all duration-700"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image src={service.image} alt={service.title} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-10 space-y-4 relative -mt-10">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                    <div className="pt-6">
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-primary group-hover:gap-4 transition-all">
                        Explorar Ingeniería <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="soluciones" className="py-32 px-6 bg-slate-950 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[3px]">
                   Verticales de Negocio
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-[0.9]">
                  Soluciones <br /><span className="text-primary text-shadow-glow">Especializadas</span>
                </h2>
                
                <div className="space-y-6">
                   {[
                     { title: "Corporativo & Pyme", desc: "Sistemas Centralizados para edificios y locales comerciales." },
                     { title: "Residencial de Lujo", desc: "Seguridad invisible y conectada para hogares de alta gama." },
                     { title: "Industria & Almacén", desc: "Control de perímetros y monitoreo de procesos productivos." },
                     { title: "Educación & Salud", desc: "Entornos seguros con gestión inteligente de usuarios." }
                   ].map((item, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="flex gap-6 p-6 rounded-3xl border border-white/5 hover:border-primary/20 hover:bg-white/5 transition-all group cursor-default"
                     >
                       <div className="text-primary font-black text-2xl italic opacity-50 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                       <div className="space-y-1">
                         <h4 className="text-lg font-black uppercase text-white tracking-widest">{item.title}</h4>
                         <p className="text-slate-500 text-sm">{item.desc}</p>
                       </div>
                     </motion.div>
                   ))}
                </div>
                
                <div className="pt-6">
                   <button className="btn-primary py-5 px-10 text-[10px]">
                      Agendar Consultoría Técnica
                   </button>
                </div>
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="relative z-10 rounded-[56px] overflow-hidden border border-white/10 aspect-[4/5] shadow-4xl group">
                   <Image src="/service-cctv.png" alt="Soluciones CCTV" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                   <div className="absolute bottom-12 left-12 right-12 p-8 glass-premium rounded-3xl border border-white/10">
                      <p className="text-primary text-[10px] font-black uppercase tracking-[4px] mb-2">Casos de Éxito</p>
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">+1,200 Nodos Instalados</h4>
                      <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">En parques industriales de México</p>
                   </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/10 blur-[100px] rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <div id="configurador" className="relative z-10 scroll-mt-24 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <SmartConfigurator />
          </div>
        </div>

        {/* Footer */}
        <footer className="py-20 px-6 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
              <Image src="/logo-global.png" alt="Global Tech Logo" width={50} height={50} />
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase text-white leading-none">Global <span className="text-primary">Telecomunicaciones</span></span>
                <span className="text-[7px] font-bold text-slate-500 tracking-[3px] mt-1 uppercase">Digitales México</span>
              </div>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[4px]">© 2026 Global Telecomunicaciones Digitales. Expertos en Seguridad.</p>
            <div className="flex gap-8">
              <Link href="#" className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[2px]">Aviso de Privacidad</Link>
              <Link href="#" className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[2px]">Términos Legales</Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
