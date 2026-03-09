'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronRight, Camera, HardDrive, Shield, Loader2, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SmartConfigurator() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [config, setConfig] = useState({
        cameras: 4,
        quality: '1080P', // 1080P, 5MP, 4K
        storage: '1TB',
        name: '',
        email: '',
    })

    // Precios estimados base (para el ejemplo, luego podemos jalarlos de SYSCOM)
    const calculateEstimate = () => {
        let base = 2500 // Kit base DVR + Fuentes
        base += config.cameras * 650 // Precio por cámara promedio
        if (config.quality === '5MP') base += 1200
        if (config.quality === '4K') base += 3500
        if (config.storage === '2TB') base += 800
        if (config.storage === '4TB') base += 1800

        return (base * 1.25).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
    }

    const handleSubmit = async () => {
        setLoading(true)
        // Guardar en Supabase
        const { error } = await supabase.from('leads').insert([
            {
                name: config.name,
                email: config.email,
                details: `Cámaras: ${config.cameras}, Calidad: ${config.quality}, Disco: ${config.storage}`,
                estimate: calculateEstimate()
            }
        ])

        setTimeout(() => {
            setLoading(false)
            setSuccess(true)
        }, 1500)
    }

    return (
        <section className="py-24 px-6 bg-slate-900 border-y border-slate-800 relative overflow-hidden" id="configurador">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[3px]">
                        Smart Engineer Tool
                    </div>
                    <h2 className="text-4xl font-extrabold uppercase tracking-tight text-white">Configura tu <span className="text-blue-500">Proyecto CCTV</span></h2>
                    <p className="text-slate-400 font-medium">Obtén un presupuesto profesional basado en el catálogo de Syscom en menos de 1 minuto.</p>
                </div>

                {!success ? (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
                        {/* Steps Progress */}
                        <div className="flex items-center justify-between mb-12 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex-1 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                        {step > i ? <Check size={14} /> : i}
                                    </div>
                                    <div className={`hidden md:block h-0.5 flex-1 rounded-full ${step > i ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Cameras */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-xl font-bold flex items-center gap-3"><Camera className="text-blue-500" /> ¿Cuántas cámaras necesitas monitorear?</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[2, 4, 8, 16].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setConfig({ ...config, cameras: num })}
                                            className={`p-6 rounded-3xl border-2 transition-all text-center group ${config.cameras === num ? 'border-blue-600 bg-blue-600/10' : 'border-slate-700 hover:border-slate-600'}`}
                                        >
                                            <p className="text-2xl font-black mb-1">{num}</p>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-slate-300">Puntos</p>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all mt-8"
                                >
                                    Siguiente paso <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Quality */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-xl font-bold flex items-center gap-3"><Shield className="text-blue-500" /> Resolución y Calidad de Imagen</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { id: '1080P', label: 'Estandar HD', sub: 'Ideal para hogares' },
                                        { id: '5MP', label: 'Ultra HD Pro', sub: 'Nivel Corporativo' },
                                        { id: '4K', label: 'Elite 8MP', sub: 'Detalle Quirúrgico' }
                                    ].map(q => (
                                        <button
                                            key={q.id}
                                            onClick={() => setConfig({ ...config, quality: q.id })}
                                            className={`p-6 rounded-3xl border-2 transition-all text-left group ${config.quality === q.id ? 'border-blue-600 bg-blue-600/10' : 'border-slate-700 hover:border-slate-600'}`}
                                        >
                                            <p className="text-lg font-black mb-1">{q.label}</p>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">{q.sub}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 bg-slate-700 text-white font-bold py-5 rounded-2xl">Atrás</button>
                                    <button onClick={() => setStep(3)} className="flex-[2] bg-blue-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2">Continuar <ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Contact */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="bg-blue-600/10 border border-blue-600/20 p-6 rounded-3xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Presupuesto Estimado</p>
                                        <span className="text-2xl font-black text-white">{calculateEstimate()}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500">Incluye: DVR Hikvision TurboHD, Cámaras Profesionales, Fuentes de poder, Disco especial y Conectores.</p>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del Responsable"
                                        className="w-full p-5 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                        value={config.name}
                                        onChange={e => setConfig({ ...config, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo de contacto corporativo"
                                        className="w-full p-5 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                        value={config.email}
                                        onChange={e => setConfig({ ...config, email: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !config.name || !config.email}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Enviar Cotización a Ingeniería</>}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-[40px] p-12 text-center space-y-6 shadow-2xl animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                            <Check className="text-green-500 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">¡Petición Enviada!</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">Un ingeniero de Global Telecom revisará tu configuración y se pondrá en contacto en menos de 2 horas con la propuesta final.</p>
                        <button onClick={() => { setStep(1); setSuccess(false) }} className="text-blue-500 font-bold hover:underline">Crear otra configuración</button>
                    </div>
                )}
            </div>
        </section>
    )
}
