'use client'

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5" role="navigation">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Global++ - Home">
          <div className="relative w-12 h-12">
            <Image 
              src="/logo-global.png" 
              alt="Logo Global++ - Ingeniería en Seguridad" 
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">
              Global++
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-slate-400">
          <Link href="/#servicios" className="text-[10px] font-black uppercase tracking-[3px] hover:text-primary transition-colors">Ingeniería</Link>
          <Link href="/#soluciones" className="text-[10px] font-black uppercase tracking-[3px] hover:text-primary transition-colors">Soluciones</Link>
          <Link href="/tienda" className="text-[10px] font-black uppercase tracking-[3px] hover:text-primary transition-colors">Suministro Técnico</Link>
          <Link href="/login" className="px-6 py-2.5 bg-primary text-[#0F172A] rounded-xl text-[10px] font-black uppercase tracking-[3px] hover:bg-[#B38F4D] transition-all shadow-lg shadow-amber-900/20">Acceso VIP</Link>
        </div>

        <button 
          className="md:hidden p-4 text-white hover:text-primary transition-colors cursor-pointer" 
          aria-label="Abrir menú de navegación"
          title="Menu"
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
