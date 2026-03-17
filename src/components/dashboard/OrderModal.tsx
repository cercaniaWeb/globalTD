'use client'

import React, { useState } from 'react'
import type { Client, Technician, Branch } from '@/app/dashboard/page'
import { Hammer, X, Search, Plus, MapPin, ArrowRight } from 'lucide-react'

type OrderFormData = {
    clientName: string;
    branchName: string;
    technicianName: string;
    address: string;
    priority: string;
    type: 'Levantamiento' | 'Instalación';
    instructions: string[];
};

export default function OrderModal({ onClose, onSubmit, MOCK_CLIENTS, MOCK_TECHNICIANS }: { onClose: () => void, onSubmit: (data: OrderFormData) => void, MOCK_CLIENTS: Client[], MOCK_TECHNICIANS: Technician[] }) {
    const [isNewClient, setIsNewClient] = useState(false)
    const [formData, setFormData] = useState({
        client: '0',
        branch: '0',
        tech: '0',
        priority: 'Medium',
        orderType: 'Levantamiento' as 'Levantamiento' | 'Instalación',
        newClientName: '',
        newClientAddress: '',
        instructions: ''
    })

    const selectedClient = MOCK_CLIENTS[parseInt(formData.client)]
    const selectedBranch = !isNewClient ? selectedClient.branches[parseInt(formData.branch)] : null
    const selectedTech = MOCK_TECHNICIANS[parseInt(formData.tech)]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            clientName: isNewClient ? formData.newClientName : selectedClient.name,
            branchName: isNewClient ? 'Sede Matriz (Nuevo)' : selectedBranch!.name,
            technicianName: selectedTech.name,
            address: isNewClient ? formData.newClientAddress : selectedBranch?.address || '',
            priority: formData.priority,
            type: formData.orderType,
            instructions: formData.instructions.split('\n').filter((i: string) => i.trim() !== '')
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
            <div className="relative glass w-full max-w-2xl rounded-[48px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                <header className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20"><Hammer size={24} /></div>
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Desplegar <span className="text-primary italic">Operación</span></h2>
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-[3px] mt-2">Configuración de Misión Táctica</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-500 transition-colors"><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-4">
                        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsNewClient(false)}
                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isNewClient ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >Socio Existente</button>
                            <button
                                type="button"
                                onClick={() => setIsNewClient(true)}
                                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isNewClient ? 'bg-primary text-[#0F172A] shadow-lg shadow-amber-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                            >Alta Nuevo Cliente</button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Tipo de Misión</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, orderType: 'Levantamiento' })}
                                className={`flex items-center justify-center gap-3 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${formData.orderType === 'Levantamiento' ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
                            >
                                <Search size={14} /> Levantamiento Técnico
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, orderType: 'Instalación' })}
                                className={`flex items-center justify-center gap-3 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${formData.orderType === 'Instalación' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-white/5 text-slate-500 hover:border-white/10'}`}
                            >
                                <Plus size={14} /> Nueva Instalación
                            </button>
                        </div>
                    </div>

                    {!isNewClient ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Cliente Seleccionado</label>
                                <select
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all cursor-pointer text-white"
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value, branch: '0' })}
                                >
                                    {MOCK_CLIENTS.map((c: Client, i: number) => <option key={c.id} value={i}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Sede de Operación</label>
                                <select
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all cursor-pointer text-white"
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                >
                                    {selectedClient.branches.map((b: Branch, i: number) => <option key={b.id} value={i}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Nombre o Razón Social</label>
                                <input
                                    type="text"
                                    placeholder="EJ: CORPORATIVO PATRIA S.A."
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all text-white"
                                    value={formData.newClientName}
                                    onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Dirección de Instalación</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="CALLE, NÚMERO, COLONIA, C.P."
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-medium uppercase tracking-widest focus:outline-none focus:border-primary transition-all text-white"
                                        value={formData.newClientAddress}
                                        onChange={(e) => setFormData({ ...formData, newClientAddress: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Ingeniero Asignado</label>
                            <select
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all cursor-pointer text-white"
                                value={formData.tech}
                                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                            >
                                {MOCK_TECHNICIANS.map((t: Technician, i: number) => <option key={t.id} value={i}>{t.name} ({t.status})</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Urgencia</label>
                            <div className="flex gap-2">
                                {['Low', 'Medium', 'High'].map(p => (
                                    <button
                                        key={p} type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`flex-1 py-3.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-primary border-primary text-[#0F172A] shadow-lg shadow-amber-900/20' : 'bg-white/5 border-white/5 text-slate-500'}`}
                                    >{p}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-[3px]">Protocolo de Misión (Acciones por línea)</label>
                        <textarea
                            placeholder="EJ: Instalar Cámaras en Lobby&#10;Configurar acceso Biométrico&#10;Pruebas de Bitrate y Red"
                            className="w-full bg-slate-950 border border-white/5 rounded-3xl px-6 py-4 text-xs font-medium focus:outline-none focus:border-primary transition-all h-32 resize-none text-white"
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        ></textarea>
                    </div>

                    <footer className="pt-4 flex gap-4 shrink-0">
                        <button type="button" onClick={onClose} className="flex-1 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[4px] text-slate-500 border border-white/10 hover:bg-white/5 transition-all">Abortar</button>
                        <button
                            type="submit"
                            className="flex-[2] bg-primary hover:bg-[#B38F4D] text-[#0F172A] py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[4px] shadow-xl shadow-amber-900/30 transition-all flex items-center justify-center gap-3 group shrink-0"
                        >
                            Desplegar Orden de Trabajo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
}
