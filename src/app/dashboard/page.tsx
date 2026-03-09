'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    Users,
    Briefcase,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Plus,
    Search,
    Filter,
    Bell,
    User,
    Shield,
    LogOut,
    Clock,
    MapPin,
    ClipboardList,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalLeads: 45,
        activeWorkOrders: 12,
        completedToday: 4,
        weeklyProjection: 85
    })

    const [activeTasks, setActiveTasks] = useState([
        { id: '1', title: 'Instalación CCTV Residencial', client: 'Familia García', priority: 'High', status: 'Doing', date: 'Hoy' },
        { id: '2', title: 'Mantenimiento preventivo', client: 'Empresa Alfas', priority: 'Medium', status: 'Todo', date: 'Mañana' },
        { id: '3', title: 'Configuración de red', client: 'Oficina Central', priority: 'Critical', status: 'Todo', date: 'Hoy' }
    ])

    const [workOrders, setWorkOrders] = useState([
        { id: 'WO-101', client: 'Roberto Sánchez', technician: 'Juan Pérez', status: 'En Proceso', address: 'Calle 123, Polanco' },
        { id: 'WO-102', client: 'Elena Martínez', technician: 'María López', status: 'Programada', address: 'Av. Reforma 450' }
    ])

    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-background bg-grid text-white flex">
            {/* Sidebar */}
            <aside className="w-72 glass border-r border-white/5 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-12 h-12 relative overflow-hidden rounded-xl bg-white/5 flex items-center justify-center p-1 shadow-lg shadow-red-600/10">
                        <Image src="/logo.png" alt="Global Telecom" fill className="object-contain p-1" priority />
                    </div>
                    <span className="text-lg font-black uppercase tracking-tighter italic">Global <span className="text-accent underline decoration-2 underline-offset-4">Telecom</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<TrendingUp className="w-5 h-5" />} label="Resumen" active />
                    <SidebarItem icon={<Users className="w-5 h-5" />} label="Clientes" />
                    <SidebarItem icon={<Briefcase className="w-5 h-5" />} label="Órdenes de Trabajo" />
                    <SidebarItem icon={<ClipboardList className="w-5 h-5" />} label="Proyecciones" />
                    <SidebarItem icon={<Calendar className="w-5 h-5" />} label="Calendario" />
                </nav>

                <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-4 px-4 py-3 glass rounded-2xl border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-gray-400">A</div>
                        <div>
                            <p className="text-sm font-bold">Admin Pro</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Global Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm">
                        <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Panel de <span className="text-accent underline decoration-2 underline-offset-8">Operaciones</span></h1>
                        <p className="text-muted-foreground font-medium mt-2">Bienvenido de nuevo. Aquí está la actividad de hoy.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-4 glass rounded-2xl border-white/5 relative hover:bg-white/10 transition-all">
                            <Bell className="w-6 h-6 text-gray-400" />
                            <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full border-2 border-[#0a0f1e]"></div>
                        </button>
                        <button className="btn-primary group">
                            <Plus className="w-5 h-5" /> Nueva Tarea
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard label="Prospectos Semanales" value={stats.totalLeads} icon={<Users className="text-blue-500" />} trend="+15%" />
                    <StatCard label="Órdenes Activas" value={stats.activeWorkOrders} icon={<Briefcase className="text-yellow-500" />} trend="+2 hoy" />
                    <StatCard label="Listas Hoy" value={stats.completedToday} icon={<CheckCircle2 className="text-green-500" />} trend="100%" />
                    <StatCard label="Proyección Mes" value={`${stats.weeklyProjection}%`} icon={<TrendingUp className="text-purple-500" />} trend="En meta" />
                </section>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Work Orders List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass rounded-[40px] border-white/5 p-10 overflow-hidden relative">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                                    Órdenes de Trabajo Prioritarias
                                </h2>
                                <div className="flex gap-2">
                                    <button className="p-3 glass rounded-xl border-white/5 hover:bg-white/10 transition-all"><Search className="w-4 h-4 text-gray-400" /></button>
                                    <button className="p-3 glass rounded-xl border-white/5 hover:bg-white/10 transition-all"><Filter className="w-4 h-4 text-gray-400" /></button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {workOrders.map((wo) => (
                                    <div key={wo.id} className="p-6 glass rounded-[24px] border-white/5 hover:border-accent/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                                <MapPin className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <p className="font-black italic uppercase tracking-tighter text-lg">{wo.client}</p>
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/20 italic">{wo.id}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium mt-1">{wo.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-bold text-gray-400">Técnico: {wo.technician}</span>
                                            </div>
                                            <span className="px-4 py-2 bg-accent/10 text-accent rounded-xl text-[10px] font-black uppercase tracking-widest border border-accent/10">{wo.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-4 glass text-[10px] font-black uppercase tracking-[3px] border-white/10 hover:bg-accent/5 hover:border-accent/30 transition-all flex items-center justify-center gap-2">
                                Ver todas las órdenes <ArrowRight className="w-4 h-4 text-accent" />
                            </button>
                        </div>
                    </div>

                    {/* Weekly Tasks / Projections */}
                    <div className="space-y-8">
                        <div className="glass rounded-[40px] border-accent/20 bg-accent/5 p-10 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 blur-2xl rounded-full"></div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Tareas <span className="text-accent underline underline-offset-4">Semana</span></h2>

                            <div className="space-y-6">
                                {activeTasks.map((task) => (
                                    <div key={task.id} className="flex gap-4 group/task">
                                        <div className="pt-1 flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${task.status === 'Doing' ? 'bg-accent shadow-glow' : 'bg-slate-700'} transition-all`}></div>
                                            <div className="w-px h-full bg-white/5 my-2"></div>
                                        </div>
                                        <div className="pb-8">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{task.date}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${task.priority === 'Critical' ? 'bg-red-950/40 text-red-500 border-red-500/20' : 'bg-white/5 text-gray-400 border-white/5'}`}>{task.priority}</span>
                                            </div>
                                            <p className="font-bold underline decoration-white/10 decoration-2 transition-all hover:decoration-accent hover:text-accent cursor-pointer">{task.title}</p>
                                            <p className="text-[11px] text-muted-foreground font-medium mt-1">Ref: {task.client}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full btn-secondary text-xs font-black uppercase tracking-[3px] py-4 rounded-2xl group hover:border-accent/40">
                                <Calendar className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" /> Programar Tarea
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl transform transition-all cursor-pointer group ${active ? 'glass border-accent/20 bg-accent/5 text-accent font-black shadow-lg shadow-red-900/10' : 'text-muted-foreground hover:bg-white/5 hover:text-white font-bold'}`}>
            <div className={`transition-transform duration-500 group-hover:scale-110 ${active ? 'text-accent' : ''}`}>
                {icon}
            </div>
            <span className="text-sm tracking-wide uppercase italic tracking-tighter">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-accent rounded-full shadow-glow"></div>}
        </div>
    )
}

function StatCard({ label, value, icon, trend }: { label: string, value: any, icon: React.ReactNode, trend: string }) {
    return (
        <div className="glass p-8 rounded-[32px] border-white/5 group hover:border-accent/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-white/5 text-white">
                    {icon}
                </div>
                <span className="text-[10px] font-black bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full border border-green-500/20">{trend}</span>
            </div>
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</h3>
                <p className="text-4xl font-black italic">{value}</p>
            </div>
        </div>
    )
}
