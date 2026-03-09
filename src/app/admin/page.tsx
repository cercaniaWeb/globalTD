'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
    Users,
    BarChart3,
    Settings,
    Search,
    CheckCircle,
    Clock,
    ChevronRight,
    TrendingUp,
    Mail,
    Smartphone,
    Save,
    Loader2,
    Lock
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('leads')
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [margin, setMargin] = useState('25')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setLeads(data)
        setLoading(false)
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        // Aquí iría el guardado real en base de datos
        setTimeout(() => {
            setIsSaving(false)
            alert("Margen actualizado a " + margin + "% para todos los productos.")
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <Lock size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-xs uppercase tracking-widest leading-none">Global Admin</p>
                            <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">Management Suite</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem
                        icon={<BarChart3 size={18} />}
                        label="Leads & Cotizaciones"
                        active={activeTab === 'leads'}
                        onClick={() => setActiveTab('leads')}
                        badge={leads.length.toString()}
                    />
                    <NavItem
                        icon={<Users size={18} />}
                        label="Usuarios Registrados"
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                    <NavItem
                        icon={<Settings size={18} />}
                        label="Ajustes Globales"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2">
                        <ChevronRight size={14} className="rotate-180" /> Volver al Sitio Público
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                            Panel de <span className="text-blue-600">Control</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Gestión interna de Global Telecomunicaciones Digitales</p>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={fetchLeads} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                            Actualizar Datos
                        </button>
                    </div>
                </header>

                {activeTab === 'leads' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsCard icon={<TrendingUp className="text-green-500" />} label="Conversión total" value="12%" sub="+2.5% este mes" />
                            <StatsCard icon={<Clock className="text-blue-500" />} label="Leads Pendientes" value={leads.length.toString()} sub="Requieren atención" />
                            <StatsCard icon={<CheckCircle className="text-purple-500" />} label="Proyectos Cerrados" value="48" sub="Global Group" />
                        </div>

                        {/* Table Area */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold uppercase tracking-widest text-slate-800 text-sm">Prospectos del Configurador</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input type="text" placeholder="Filtrar por nombre..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin" />
                                        <p className="font-bold uppercase text-[10px] tracking-widest">Cargando leads...</p>
                                    </div>
                                ) : leads.length === 0 ? (
                                    <div className="p-20 text-center text-slate-500 italic">No hay leads registrados aún.</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-[10px] uppercase font-black text-slate-400 bg-slate-50 tracking-[2px]">
                                                <th className="px-8 py-4">Fecha</th>
                                                <th className="px-8 py-4">Responsable</th>
                                                <th className="px-8 py-4">Configuración</th>
                                                <th className="px-8 py-4">Cotización</th>
                                                <th className="px-8 py-4">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {leads.map((lead) => (
                                                <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-8 py-6 text-xs text-slate-500 font-medium">{new Date(lead.created_at).toLocaleDateString()}</td>
                                                    <td className="px-8 py-6">
                                                        <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                                                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Mail size={10} /> {lead.email}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase italic">
                                                            {lead.details}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 font-black text-slate-900">{lead.estimate}</td>
                                                    <td className="px-8 py-6">
                                                        <button className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            <Smartphone size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-2xl space-y-8">
                            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                                <Settings className="text-blue-600" /> Configuración de Precios
                            </h3>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Margen de Utilidad (%)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            value={margin}
                                            onChange={(e) => setMargin(e.target.value)}
                                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <span className="text-2xl font-black text-slate-900 w-16">{margin}%</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">Este porcentaje se suma sobre el costo de distribuidor de Syscom en la tienda y el configurador.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Márgenes por Segmento (Próximamente)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-center font-bold text-[10px] uppercase">Residencial</div>
                                    <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-center font-bold text-[10px] uppercase">Corporativo</div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Guardar Ajustes Globales</>}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function NavItem({ icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: string }) {
    return (
        <div
            onClick={onClick}
            className={`
        flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 group
        ${active
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      `}
        >
            <div className="flex items-center gap-4">
                {icon}
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>
            {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${active ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-500'}`}>
                    {badge}
                </span>
            )}
        </div>
    )
}

function StatsCard({ icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
    return (
        <div className="bg-white border border-slate-200 p-8 rounded-[32px] space-y-4 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{label}</p>
                <p className="text-3xl font-black text-slate-900">{value}</p>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">{sub}</p>
        </div>
    )
}
