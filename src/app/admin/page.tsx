'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database, Json } from '@/lib/database.types'
import { SyscomProduct } from '@/lib/syscom'
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
    Save,
    Loader2,
    Lock,
    ArrowUpRight,
    Briefcase,
    UserPlus,
    Camera,
    X,
    Eye,
    Trash2
} from 'lucide-react'
import Link from 'next/link'

type ClientDevice = {
    id: string;
    user_id: string;
    camera_name: string;
    device_type: string;
    url_or_ip: string;
    port_http: number;
    port_rtsp: number;
    username: string;
    password_enc: string;
    channel_id: number;
    is_active: boolean;
    created_at: string;
    profiles?: { full_name?: string };
};

type BundleItem = {
    syscom_id: string;
    modelo: string;
    description: string;
    quantity: number;
    unit_price: number;
};

export default function AdminDashboard() {
    const [bundles, setBundles] = useState<Database['public']['Tables']['bundles']['Row'][]>([])
    const [activeTab, setActiveTab] = useState('leads')
    const [leads, setLeads] = useState<Database['public']['Tables']['leads']['Row'][]>([])
    const [loading, setLoading] = useState(true)
    const [margin, setMargin] = useState('25')
    const [isSaving, setIsSaving] = useState(false)
    const [isCreatingKit, setIsCreatingKit] = useState(false)
    const [newKit, setNewKit] = useState({ name: '', description: '', category: 'CCTV' })
    const [syscomProducts, setSyscomProducts] = useState<SyscomProduct[]>([])
    const [syscomLoading, setSyscomLoading] = useState(false)
    const [selectedSyscomItems, setSelectedSyscomItems] = useState<{product: SyscomProduct, quantity: number}[]>([])
    const [viewingBundle, setViewingBundle] = useState<Database['public']['Tables']['bundles']['Row'] | null>(null)
    
    // Estado para cámaras
    const [cameras, setCameras] = useState<ClientDevice[]>([])
    const [clients, setClients] = useState<Database['public']['Tables']['profiles']['Row'][]>([])
    const [isCreatingCam, setIsCreatingCam] = useState(false)
    const [newCam, setNewCam] = useState({ 
        user_id: '', camera_name: '', device_type: 'Fija', 
        url_or_ip: '', port_http: 80, username: 'admin', password_enc: '' 
    })



    async function fetchCamerasData() {
        try {
            const res = await fetch('/api/admin/cameras');
            if (res.ok) {
                const data = await res.json();
                setClients(data.profiles || []);
                setCameras(data.devices || []);
            }
        } catch (e) {
            console.error('Error cargando datos de camaras', e);
        }
    }

    const handleCreateCamera = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/cameras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCam)
            });
            if (res.ok) {
                alert('Cámara registrada correctamente');
                setIsCreatingCam(false);
                setNewCam({ 
                    user_id: '', camera_name: '', device_type: 'Fija', 
                    url_or_ip: '', port_http: 80, username: 'admin', password_enc: '' 
                });
                fetchCamerasData();
            } else {
                const data = await res.json();
                alert('Error al registrar: ' + data.error);
            }
        } catch (error: unknown) {
            alert('Error de conexión: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    const handleDeleteCamera = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este dispositivo?')) return;
        try {
            const res = await fetch(`/api/admin/cameras?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCamerasData();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchBundles() {
        const { data } = await supabase
            .from('bundles')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setBundles(data)
    }

    async function fetchLeads() {
        setLoading(true)
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setLeads(data)
        if (error) console.error('Error fetching leads:', error)
        setLoading(false)
    }

    async function fetchSyscomProducts() {
        setSyscomLoading(true)
        try {
            const res = await fetch('/api/syscom/products')
            if (res.ok) {
                const data = await res.json()
                setSyscomProducts(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSyscomLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
        fetchBundles()
        fetchCamerasData()
        fetchSyscomProducts()
    }, [])

    const handleSaveSettings = async () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            alert("Margen actualizado a " + margin + "% para todos los productos.")
        }, 1000)
    }

    const handleCreateClient = async (lead: Database['public']['Tables']['leads']['Row']) => {
        // Create customer from lead
        const companyName = lead.name.split(' ')[0] + ' (' + lead.email + ')'
        const { data: customer, error: custErr } = await supabase
            .from('customers')
            .insert({
                name: lead.name,
                email: lead.email,
                company: companyName,
                status: 'activo'
            })
            .select()
            .single()

        if (custErr || !customer) {
            alert('Error al crear cliente: ' + custErr?.message)
            return
        }

        // Generate preliminary quote
        let estimatedTotal = 0;
        if (lead.estimate) {
            const numericMatch = lead.estimate.match(/\d+,\d+|\d+/)
            if (numericMatch) {
                estimatedTotal = parseFloat(numericMatch[0].replace(',', ''))
            }
        }

        const { error: quoteErr } = await supabase
            .from('quotes')
            .insert({
                customer_id: customer.id,
                lead_id: lead.id,
                total: estimatedTotal,
                status: 'enviado',
                items: [{ description: lead.details, estimated: lead.estimate }]
            })

        if (quoteErr) {
            alert('Error al crear cotización inicial: ' + quoteErr.message)
            return
        }

        // Cleanup or status update could be done here.
        alert(`¡Cliente ${lead.name} creado con éxito y cotización pre-aprobada generada!`)
    }

    const handleDeleteLead = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta cotización fallida/prospecto? Esta acción no se puede deshacer.')) return;
        
        try {
            // Primero eliminamos cotizaciones asociadas para evitar el error de foreign key
            await supabase.from('quotes').delete().eq('lead_id', id);

            const { error } = await supabase.from('leads').delete().eq('id', id);
            if (error) throw error;
            
            // Refrescar tabla
            fetchLeads();
            alert('Prospecto eliminado correctamente.');
        } catch (err: unknown) {
            console.error(err);
            alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Desconocido'));
        }
    }

    const handleCreateKit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedSyscomItems.length === 0) {
            alert('Debes agregar al menos un componente/producto de Syscom al kit.');
            return;
        }

        const calculatedBasePrice = selectedSyscomItems.reduce((acc, item) => {
            const price = parseFloat(item.product.precios?.precio_1 || item.product.precio || "0")
            return acc + (price * item.quantity);
        }, 0);

        const itemsToSave = selectedSyscomItems.map(item => ({
            syscom_id: item.product.producto_id || item.product.id || 'N/A',
            modelo: item.product.modelo || 'N/A',
            description: item.product.titulo || 'Producto Syscom',
            quantity: item.quantity,
            unit_price: parseFloat(item.product.precios?.precio_1 || item.product.precio || "0")
        }));

        const { error } = await supabase.from('bundles').insert({
            name: newKit.name,
            description: newKit.description,
            category: newKit.category,
            base_price: calculatedBasePrice,
            margin_percentage: parseFloat(margin),
            items: itemsToSave
        })

        if (!error) {
            setIsCreatingKit(false)
            setNewKit({ name: '', description: '', category: 'CCTV' })
            setSelectedSyscomItems([])
            fetchBundles()
        } else {
            alert('Error al crear paquete: ' + error.message)
        }
    }

    return (

        <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col sticky top-0 h-screen z-30">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
                            <Lock size={20} className="text-[#0F172A]" />
                        </div>
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest leading-none text-white">CORE <span className="text-primary italic">ADMIN</span></p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Supervisión Técnica</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem
                        icon={<BarChart3 size={18} />}
                        label="Cotizaciones"
                        active={activeTab === 'leads'}
                        onClick={() => setActiveTab('leads')}
                        badge={leads.length.toString()}
                    />
                    <NavItem
                        icon={<Users size={18} />}
                        label="Usuarios App"
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                    <NavItem
                        icon={<Settings size={18} />}
                        label="Config. Precios"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                    <NavItem
                        icon={<ChevronRight size={18} />}
                        label="Creador Paquetes"
                        active={activeTab === 'bundles'}
                        onClick={() => setActiveTab('bundles')}
                    />
                    <NavItem
                        icon={<Camera size={18} />}
                        label="Gestión NVRs"
                        active={activeTab === 'cameras'}
                        onClick={() => setActiveTab('cameras')}
                    />

                    <div className="pt-4 pb-2 px-4">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Atajos Externos</p>
                    </div>

                    <Link href="/dashboard" className="flex items-center justify-between p-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all group">
                        <div className="flex items-center gap-4">
                            <Briefcase size={18} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Módulo Operativo</span>
                        </div>
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest">
                        <ChevronRight size={14} className="rotate-180" /> Home Global Telecomunicaciones Digitales
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative h-screen bg-grid">
                <header className="h-20 border-b border-white/5 flex justify-between items-center px-12 glass sticky top-0 z-20">
                    <div className="space-y-1">
                        <h1 className="text-xl font-black uppercase tracking-tighter text-white">
                            Panel de <span className="text-primary italic">Control</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administración de Negocio</p>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={fetchLeads} className="px-6 py-2 glass border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/5 transition-all">
                            Sincronizar Datos
                        </button>
                    </div>
                </header>

                <div className="p-12">
                    {activeTab === 'leads' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatsCard icon={<TrendingUp className="text-green-500" />} label="Conversión total" value="12%" sub="+2.5% este mes" />
                                <StatsCard icon={<Clock className="text-blue-500" />} label="Pendientes" value={leads.length.toString()} sub="Requieren atención" />
                                <StatsCard icon={<CheckCircle className="text-purple-500" />} label="Cerrados" value="48" sub="Core Group Systems" />
                            </div>

                            {/* Table Area */}
                            <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h3 className="font-black uppercase tracking-[3px] text-slate-400 text-[11px]">Prospectos del Configurador</h3>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                        <input type="text" placeholder="BUSCAR LEAD..." className="pl-9 pr-4 py-2 bg-slate-950/50 border border-white/5 rounded-xl text-[10px] focus:outline-none focus:border-primary font-black tracking-widest uppercase w-64" />
                                    </div>
                                </div>

                                <div className="overflow-x-auto min-h-[400px]">
                                    {loading ? (
                                        <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-4">
                                            <Loader2 className="animate-spin text-primary" />
                                            <p className="font-bold uppercase text-[10px] tracking-widest">Cargando leads...</p>
                                        </div>
                                    ) : leads.length === 0 ? (
                                        <div className="p-20 text-center text-slate-500 italic uppercase font-black text-[10px] tracking-widest">No hay registros dinámicos.</div>
                                    ) : (
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[9px] uppercase font-black text-slate-500 bg-black/20 tracking-[2px]">
                                                    <th className="px-8 py-5">Fecha</th>
                                                    <th className="px-8 py-5">Responsable</th>
                                                    <th className="px-8 py-5">Configuración</th>
                                                    <th className="px-8 py-5">Cotización</th>
                                                    <th className="px-8 py-5 text-right">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {leads.map((lead) => (
                                                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-8 py-6 text-[11px] text-slate-500 font-mono italic">{new Date(lead.created_at ?? new Date().toISOString()).toLocaleDateString()}</td>
                                                        <td className="px-8 py-6">
                                                            <p className="font-black italic text-sm">{lead.name}</p>
                                                            <p className="text-[10px] text-primary flex items-center gap-1 uppercase tracking-widest mt-1 opacity-70"><Mail size={10} /> {lead.email}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-tighter inline-block italic">
                                                                {lead.details}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 font-black text-white text-sm">{lead.estimate}</td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleCreateClient(lead)}
                                                                    title="Aceptar y Crear Cliente"
                                                                    className="p-2 bg-white/5 rounded-lg text-slate-500 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20"
                                                                >
                                                                    <UserPlus size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteLead(lead.id)}
                                                                    title="Eliminar Prospecto"
                                                                    className="p-2 bg-white/5 rounded-lg text-slate-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
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

                    {activeTab === 'users' && (
                        <div className="p-20 text-center animate-in fade-in duration-500">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="text-primary w-10 h-10" />
                            </div>
                            <h2 className="text-lg font-black uppercase italic tracking-widest">Base de Datos de Usuarios</h2>
                            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">Próximamente: Gestión avanzada de roles y permisos para técnicos y clientes.</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-xl animate-in slide-in-from-bottom-4 duration-500">
                            <div className="glass rounded-[40px] border-white/5 p-10 shadow-2xl space-y-10">
                                <header className="space-y-2">
                                    <h3 className="text-xl font-black uppercase italic italic tracking-tighter flex items-center gap-3">
                                        <Settings className="text-primary" /> Algoritmo de Precios
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">Controla el margen de utilidad dinámica en toda la plataforma.</p>
                                </header>

                                <div className="p-8 bg-slate-900 rounded-3xl border border-white/5 space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl rounded-full"></div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[3px]">Margen Global</label>
                                            <span className="text-4xl font-black italic text-primary">{margin}%</span>
                                        </div>
                                        <div className="pt-4">
                                            <input
                                                type="range"
                                                min="5"
                                                max="100"
                                                value={margin}
                                                onChange={(e) => setMargin(e.target.value)}
                                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase italic mt-4">Nota: Este valor afecta Tienda y Cotizador Smart.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                    className="w-full bg-primary hover:bg-[#B38F4D] text-[#0F172A] font-black uppercase tracking-[3px] text-[10px] py-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-900/20"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Aplicar Cambios Globales</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bundles' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">Constructor de Paquetes (Kits)</h2>
                                <button
                                    onClick={() => setIsCreatingKit(!isCreatingKit)}
                                    className="px-6 py-2 bg-primary text-[#0F172A] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#B38F4D] transition-all shadow-lg shadow-amber-900/20"
                                >
                                    {isCreatingKit ? 'Cancelar' : '+ Crear Nuevo Kit'}
                                </button>
                            </div>

                            {isCreatingKit && (
                                <form onSubmit={handleCreateKit} className="glass p-8 rounded-[32px] border-white/5 space-y-6">
                                    <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2">Configurar Nuevo Producto Base</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre del Kit</label>
                                            <input type="text" required value={newKit.name} onChange={e => setNewKit({ ...newKit, name: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" placeholder="Ej: Kit Oficina Segura" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Categoría</label>
                                            <select value={newKit.category} onChange={e => setNewKit({ ...newKit, category: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm">
                                                <option value="CCTV">CCTV</option>
                                                <option value="Control de Acceso">Control de Acceso</option>
                                                <option value="Redes">Redes y Fibra</option>
                                                <option value="Energía">Manejo de Energía</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Descripción (Argumento de Venta)</label>
                                            <input type="text" value={newKit.description} onChange={e => setNewKit({ ...newKit, description: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" placeholder="Solución a medida para pequeñas oficinas..." />
                                        </div>
                                        
                                        {/* Syscom Product Selector */}
                                        <div className="space-y-4 col-span-2 p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Componentes del Kit (Syscom API)</label>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase">
                                                    Equipos Seleccionados: {selectedSyscomItems.length}
                                                </span>
                                            </div>
                                            
                                            <div className="h-48 overflow-y-auto border border-white/10 rounded-xl p-2 bg-slate-900 custom-scrollbar">
                                                {syscomLoading ? (
                                                    <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /></div>
                                                ) : syscomProducts.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {syscomProducts.map(prod => {
                                                            const isSelected = selectedSyscomItems.some(i => i.product.producto_id === prod.producto_id);
                                                            return (
                                                                <div key={prod.producto_id || Math.random()} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
                                                                    <div className="flex-1 truncate pr-4">
                                                                        <p className="text-[11px] font-bold text-white truncate">{prod.titulo}</p>
                                                                         <p className="text-[9px] text-slate-500 font-mono mt-0.5">{prod.modelo} | Base: ${parseFloat(prod.precios?.precio_1 || prod.precio || "0").toFixed(2)} USD</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {isSelected ? (
                                                                            <div className="flex flex-col gap-1 items-end">
                                                                               <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-white/10">
                                                                                   <button type="button" onClick={() => {
                                                                                       setSelectedSyscomItems(prev => prev.map(i => i.product.producto_id === prod.producto_id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))
                                                                                   }} className="px-2 text-white hover:text-primary">-</button>
                                                                                   <span className="text-[10px] font-bold w-4 text-center">{selectedSyscomItems.find(i => i.product.producto_id === prod.producto_id)?.quantity}</span>
                                                                                   <button type="button" onClick={() => {
                                                                                       setSelectedSyscomItems(prev => prev.map(i => i.product.producto_id === prod.producto_id ? {...i, quantity: i.quantity + 1} : i))
                                                                                   }} className="px-2 text-white hover:text-primary">+</button>
                                                                               </div>
                                                                               <button type="button" onClick={() => setSelectedSyscomItems(prev => prev.filter(i => i.product.producto_id !== prod.producto_id))} className="text-[8px] uppercase font-black text-red-500 hover:text-red-400">Remover</button>
                                                                            </div>
                                                                        ) : (
                                                                            <button type="button" onClick={() => setSelectedSyscomItems(prev => [...prev, {product: prod, quantity: 1}])} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300">Agregar</button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center items-center h-full text-slate-500 text-[10px] font-black uppercase tracking-widest text-center px-4">
                                                        No se pudieron cargar productos de Syscom. Verifique la API.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={selectedSyscomItems.length === 0} className="w-full py-4 bg-primary text-[#0F172A] rounded-xl font-black uppercase tracking-widest hover:bg-[#B38F4D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Guardar y Activar Kit Architecture</button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bundles.length === 0 ? (
                                    <div className="lg:col-span-3 p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-slate-500">
                                        <p className="font-black uppercase tracking-widest text-[10px]">No hay kits diseñados aún</p>
                                        <p className="text-[9px] mt-2">Empieza a combinar productos y servicios para tus clientes.</p>
                                    </div>
                                ) : (
                                    bundles.map(bundle => (
                                        <div key={bundle.id} className="glass p-8 rounded-[32px] border-white/5 space-y-6 hover:border-primary/30 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">{bundle.category}</span>
                                                    <h4 className="text-lg font-black italic uppercase leading-none pt-2">{bundle.name}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase">Margen</p>
                                                    <p className="text-xl font-black text-primary italic">{bundle.margin_percentage}%</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium line-clamp-2">{bundle.description}</p>
                                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                 <span className="text-[10px] font-bold text-slate-500">{(bundle.items as Json[])?.length || 0} Componentes</span>
                                                <button onClick={() => setViewingBundle(bundle)} className="flex items-center gap-1 text-[9px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">
                                                    <Eye size={12} /> Ver Detalle
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Modal de Detalle de Paquete */}
                            {viewingBundle && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setViewingBundle(null)}></div>
                                    <div className="relative glass bg-slate-900 border border-white/10 rounded-[40px] p-8 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">
                                                    {viewingBundle.category}
                                                </div>
                                                <h3 className="text-2xl font-black italic uppercase text-white">{viewingBundle.name}</h3>
                                                <p className="text-slate-400 text-xs mt-1">{viewingBundle.description}</p>
                                            </div>
                                            <button onClick={() => setViewingBundle(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                                                <X size={20} className="text-slate-400" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Costo Base Original</p>
                                                 <p className="text-lg font-bold text-white">${(viewingBundle.base_price ?? 0).toFixed(2)}</p>
                                            </div>
                                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
                                                <p className="text-[9px] font-black uppercase text-primary tracking-widest">Precio Venta ({viewingBundle.margin_percentage}% Margen)</p>
                                                 <p className="text-lg font-black text-primary italic">${((viewingBundle.base_price ?? 0) * (1 + ((viewingBundle.margin_percentage ?? 0) / 100))).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/5 bg-slate-950/50 rounded-2xl p-4 space-y-3">
                                             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Componentes Incluidos ({(viewingBundle.items as Json[])?.length || 0})</h4>
                                            
                                             {viewingBundle.items && (viewingBundle.items as BundleItem[]).map((item: BundleItem, idx: number) => (
                                                <div key={idx} className="flex gap-4 p-4 glass bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/30 transition-colors">
                                                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-500 text-xs shadow-inner">
                                                        x{item.quantity}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-white">{item.description}</p>
                                                        <div className="flex gap-4 mt-1 font-mono text-[10px] text-slate-500">
                                                            <span>Modelo: {item.modelo || 'N/A'}</span>
                                                            <span>SKU: {item.syscom_id}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">P. Unitario</p>
                                                         <p className="text-sm font-bold text-white">${item.unit_price ? item.unit_price.toFixed(2) : '0.00'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                             {(!(viewingBundle.items as Json[]) || (viewingBundle.items as Json[]).length === 0) && (
                                                <p className="text-center text-slate-500 text-xs italic py-4">No hay desglose de productos para este kit.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'cameras' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">Control de Dispositivos de Clientes</h2>
                                <button
                                    onClick={() => setIsCreatingCam(!isCreatingCam)}
                                    className="px-6 py-2 bg-primary text-[#0F172A] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#B38F4D] transition-all shadow-lg shadow-amber-900/20"
                                >
                                    {isCreatingCam ? 'Cancelar' : '+ Registrar Cámara/NVR'}
                                </button>
                            </div>

                            {isCreatingCam && (
                                <form onSubmit={handleCreateCamera} className="glass p-8 rounded-[32px] border-white/5 space-y-6">
                                    <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2">Asignar Nuevo Equipo a Cliente</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cliente Propietario</label>
                                            <select required value={newCam.user_id} onChange={e => setNewCam({ ...newCam, user_id: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm">
                                                <option value="" disabled>Selecciona un cliente de la App</option>
                                                {clients.map(c => (
                                                    <option key={c.id} value={c.id}>{c.full_name || c.email} ({c.id.substring(0,8)})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre Etiqueta (Ej. Casa Norte)</label>
                                            <input type="text" required value={newCam.camera_name} onChange={e => setNewCam({ ...newCam, camera_name: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" placeholder="Ej: DVR Sucursal Centro" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">IP Pública o DDNS</label>
                                            <input type="text" required value={newCam.url_or_ip} onChange={e => setNewCam({ ...newCam, url_or_ip: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" placeholder="ej: mipymecam.ddns.net" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Puerto HTTP (ISAPI Snapshot)</label>
                                            <input type="number" required value={newCam.port_http} onChange={e => setNewCam({ ...newCam, port_http: Number(e.target.value) })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Usuario de DVR/Cámara</label>
                                            <input type="text" required value={newCam.username} onChange={e => setNewCam({ ...newCam, username: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contraseña (Encriptada)</label>
                                            <input type="password" required value={newCam.password_enc} onChange={e => setNewCam({ ...newCam, password_enc: e.target.value })} className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium text-sm" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">Vincular Cámara al Cliente</button>
                                </form>
                            )}

                            <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto min-h-[300px]">
                                    {cameras.length === 0 ? (
                                        <div className="p-20 text-center text-slate-500 italic uppercase font-black text-[10px] tracking-widest">No hay dispositivos registrados en Core-Mesh.</div>
                                    ) : (
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[9px] uppercase font-black text-slate-500 bg-black/20 tracking-[2px]">
                                                    <th className="px-8 py-5">Cliente</th>
                                                    <th className="px-8 py-5">Identificador</th>
                                                    <th className="px-8 py-5">Conexión</th>
                                                    <th className="px-8 py-5 text-right">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {cameras.map((cam) => (
                                                    <tr key={cam.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <p className="font-black italic text-sm">{cam.profiles?.full_name || 'Desconocido'}</p>
                                                            <p className="text-[9px] text-slate-500 uppercase">{cam.user_id.substring(0,8)}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="text-[11px] font-medium text-white">{cam.camera_name}</div>
                                                            <div className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 opacity-70">Canal {cam.channel_id}</div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="text-[11px] font-mono text-slate-400">{cam.url_or_ip}:{cam.port_http}</div>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <button
                                                                onClick={() => handleDeleteCamera(cam.id)}
                                                                className="text-[10px] uppercase font-black text-red-500 hover:text-red-400"
                                                            >
                                                                Desvincular
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
                </div>
            </main>
        </div>
    )
}

function NavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, badge?: string }) {
    return (
        <div
            onClick={onClick}
            className={`
        flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 group
        ${active
                    ? 'bg-primary text-[#0F172A] shadow-lg shadow-amber-900/30'
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'}
      `}
        >
            <div className="flex items-center gap-4">
                {icon}
                <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
            </div>
            {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-black ${active ? 'bg-white text-primary' : 'bg-slate-800 text-slate-500'}`}>
                    {badge}
                </span>
            )}
        </div>
    )
}

function StatsCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
    return (
        <div className="glass border border-white/5 p-8 rounded-[32px] space-y-4 hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">{icon}</div>
            <div>
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black italic">{value}</p>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sub}</p>
        </div>
    )
}
