'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronRight, Camera, Shield, Loader2, Send, HardDrive, Download, FileText, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SyscomProduct } from '@/lib/syscom'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF with autotable types for TypeScript
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: unknown) => jsPDF
        lastAutoTable: {
            finalY: number
        }
    }
}

export default function SmartConfigurator() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const [config, setConfig] = useState({
        cameras: 4,
        quality: '1080P', // 1080P, 5MP, 4K
        storage: '1TB',
        name: '',
        email: '',
    })

    const [realProducts, setRealProducts] = useState<SyscomProduct[]>([])
    const [matchingProduct, setMatchingProduct] = useState<SyscomProduct | null>(null)

    // Fetch real products from Syscom API on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/syscom/products')
                const data = await res.json()
                setRealProducts(data)
            } catch (err) {
                console.error('Error fetching syscom products:', err)
            }
        }
        fetchProducts()
    }, [])

    // Update matching product when config changes
    useEffect(() => {
        const matchingKit = realProducts.find(p => {
            const title = p.titulo.toUpperCase()
            const matchesCams = title.includes(`${config.cameras} CAMARAS`) || title.includes(`${config.cameras} CÁMARAS`)
            const matchesQuality = title.includes(config.quality)
            return title.includes('KIT') && matchesCams && matchesQuality
        })
        setMatchingProduct(matchingKit || null)
    }, [config.cameras, config.quality, realProducts])

    // Precios estimados base mejorados con heurística de productos reales
    const getNumericEstimate = () => {
        if (matchingProduct && matchingProduct.precio_cliente) {
            const basePrice = parseFloat(matchingProduct.precio_cliente)
            // Añadimos extras como disco duro y margen de instalación
            let total = basePrice
            if (config.storage === '2TB') total += 1200 // Precio cliente aprox
            if (config.storage === '4TB') total += 2600
            return total
        }

        // Fallback Heurístico si no hay match exacto
        let base = 3500
        base += config.cameras * 1850 // Precio por cámara instalada incl. cableado y mano de obra
        if (config.quality === '5MP') base += 2500
        if (config.quality === '4K') base += 6000
        if (config.storage === '2TB') base += 1400
        if (config.storage === '4TB') base += 2800
        return base // Ya tiene margen incluido en la heurística manual
    }

    const calculateEstimate = () => {
        const estimate = getNumericEstimate()
        return estimate.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
    }

    const generatePDF = () => {
        const doc = new jsPDF()
        const total = getNumericEstimate()

        // Brand Design
        doc.setFillColor(15, 23, 42) // Slate-900
        doc.rect(0, 0, 210, 40, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text('GLOBAL++', 20, 20)
        doc.setFontSize(10)
        doc.text('INGENIERÍA DIGITAL Y VIDEOVIGILANCIA INTELIGENTE', 20, 28)

        doc.setTextColor(50, 50, 50)
        doc.setFontSize(14)
        doc.text(`Propuesta para: ${config.name}`, 20, 55)
        doc.setFontSize(10)
        doc.text(`Email: ${config.email}`, 20, 62)
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 150, 55)

        // Configuration Table
        const tableData = [
            ['Componente', 'Especificación', 'Detalle Técnico'],
            ['Cámaras', `${config.cameras} Unidades`, 'Cámaras Bullet/Domo Exterior IP67'],
            ['Resolución', config.quality, config.quality === '4K' ? 'Ultra Alta Definición' : 'Alta Definición Avanzada'],
            ['Almacenamiento', config.storage, `Disco Duro Sata III - ${config.storage}`],
            ['Infraestructura', 'Cableado UTP Cat6', 'Incluye Conectores y Fuente de Poder'],
            ['Instalación', 'Servicio Profesional', 'Validación Técnica y Configuración App Mobile']
        ]

        doc.autoTable({
            startY: 75,
            head: [tableData[0]],
            body: tableData.slice(1),
            theme: 'striped',
            headStyles: { fillStyle: [184, 134, 11], textColor: [255, 255, 255] }, // Goldish for Primary
            margin: { top: 75 }
        })

        // Total
        const finalY = doc.lastAutoTable.finalY + 20
        const tax = total * 0.16
        const grandTotal = total + tax

        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text('Subtotal:', 140, finalY)
        doc.text(total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }), 170, finalY, { align: 'right' })

        doc.text('IVA (16%):', 140, finalY + 7)
        doc.text(tax.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }), 170, finalY + 7, { align: 'right' })

        doc.setFillColor(15, 23, 42)
        doc.rect(138, finalY + 12, 50, 10, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('TOTAL:', 140, finalY + 19)
        doc.text(grandTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }), 185, finalY + 19, { align: 'right' })

        doc.setTextColor(100, 100, 100)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('* Precios sujetos a cambios. Requiere levantamiento físico para confirmación.', 20, finalY + 15)
        doc.text('Global++ S.A. de C.V. | Proyectos Especiales', 105, 285, { align: 'center' })

        doc.save(`Cotizacion_GlobalTech_${config.name.replace(/\s+/g, '_')}.pdf`)
    }

    const handleSubmit = async () => {
        setLoading(true)
        setSubmitError(null)
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_name: config.name,
                    contact_email: config.email,
                    status: 'Prospecto',
                    notes: `SISTEMA SMART: ${config.cameras} Cams, ${config.quality}, ${config.storage}. Match: ${matchingProduct?.modelo || 'N/A'}`,
                    estimated_value: getNumericEstimate(),
                    source: 'Configurador Web'
                })
            })

            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error || `Error ${res.status}`)
            }

            setSuccess(true)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error desconocido'
            console.error('Error saving lead:', msg)
            setSubmitError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 px-6 bg-slate-900 border-y border-slate-800 relative overflow-hidden" id="configurador">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center space-y-4 mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[3px] shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Precision Engine v2.4
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.9]"
                    >
                        Diseña tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">Blindaje Digital</span>
                    </motion.h2>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto italic text-lg leading-relaxed">
                        Obtén una configuración técnica validada con inventario real y optimización de presupuesto institucional.
                    </p>
                </div>

                {!success ? (
                    <motion.div 
                        layout
                        className="bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
                    >
                        {/* Steps Progress */}
                        <div className="flex items-center justify-between mb-12 gap-2 max-w-md mx-auto">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex-1 flex items-center gap-0">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${step >= i ? 'bg-amber-500 border-amber-500 text-[#0F172A] shadow-lg shadow-amber-500/20 rotate-3' : 'bg-slate-800 border-slate-700 text-slate-500 rotate-0'}`}>
                                        {step > i ? <Check size={18} strokeWidth={3} /> : i}
                                    </div>
                                    {i < 4 && <div className={`h-1 flex-1 transition-colors duration-500 ${step > i ? 'bg-amber-500' : 'bg-slate-700'}`}></div>}
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {/* Step 1: Cameras */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8 text-center md:text-left"
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black flex items-center justify-center md:justify-start gap-3 text-white uppercase tracking-tight">
                                            <Camera className="text-amber-500" /> Cobertura perimetral
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium">Seleccione el número de puntos de visión críticos para su inmueble.</p>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[2, 4, 8, 16].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setConfig({ ...config, cameras: num })}
                                                className={`p-8 rounded-[32px] border-2 transition-all text-center group relative overflow-hidden ${config.cameras === num ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20' : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600'}`}
                                            >
                                                <p className={`text-4xl font-black mb-1 transition-colors ${config.cameras === num ? 'text-amber-500' : 'text-white/50 group-hover:text-white'}`}>{num}</p>
                                                <p className="text-[10px] uppercase font-black text-slate-500 group-hover:text-amber-500/60 tracking-widest whitespace-nowrap">Nodos de Red</p>
                                                {config.cameras === num && (
                                                    <motion.div layoutId="activeStep" className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full bg-amber-500 hover:bg-amber-400 text-[#0F172A] font-black uppercase tracking-[3px] py-6 rounded-2xl flex items-center justify-center gap-3 transition-all mt-8 shadow-xl shadow-amber-500/10 group active:scale-95"
                                    >
                                        Definir Estándar de Video <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Quality */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-tight"><Shield className="text-primary" /> Estándar de Visualización Operativa</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: '1080P', label: 'Resolución HD+', sub: 'Entornos de baja densidad' },
                                            { id: '5MP', label: 'Super HD 5MP', sub: 'Estándar Institucional' },
                                            { id: '4K', label: 'Ultra 4K Elite', sub: 'Análisis de Detalle Crítico' }
                                        ].map(q => (
                                            <button
                                                key={q.id}
                                                onClick={() => setConfig({ ...config, quality: q.id })}
                                                className={`p-6 rounded-3xl border-2 transition-all text-left group ${config.quality === q.id ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-600'}`}
                                            >
                                                <p className="text-lg font-black mb-1 text-white">{q.label}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">{q.sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="flex-1 bg-slate-700 text-white font-bold py-5 rounded-2xl hover:bg-slate-600 transition-all">Atrás</button>
                                        <button onClick={() => setStep(3)} className="flex-[2] bg-primary text-[#0F172A] font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#B38F4D] transition-all transform hover:scale-[1.01]">Continuar <ChevronRight size={18} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Storage */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <h3 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-tight"><HardDrive className="text-primary" /> Almacenamiento de Respaldo Crítico</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: '1TB', label: '1 Terabyte', sub: 'Hasta 15 días (Standard)' },
                                            { id: '2TB', label: '2 Terabytes', sub: 'Hasta 30 días (Vigilancia 24/7)' },
                                            { id: '4TB', label: '4 Terabytes', sub: 'Respaldo Institucional Pro' }
                                        ].map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setConfig({ ...config, storage: s.id })}
                                                className={`p-6 rounded-3xl border-2 transition-all text-left group ${config.storage === s.id ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-600'}`}
                                            >
                                                <p className="text-lg font-black mb-1 text-white">{s.label}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">{s.sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(2)} className="flex-1 bg-slate-700 text-white font-bold py-5 rounded-2xl hover:bg-slate-600 transition-all">Atrás</button>
                                        <button onClick={() => setStep(4)} className="flex-[2] bg-primary text-[#0F172A] font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#B38F4D] transition-all transform hover:scale-[1.01]">Generar Presupuesto <ChevronRight size={18} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Contact */}
                            {step === 4 && (
                                <motion.div 
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 p-8 rounded-[40px] relative overflow-hidden shadow-inner ring-1 ring-white/5">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
                                        {matchingProduct && (
                                            <div className="absolute -right-14 top-8 rotate-45 bg-amber-500 text-[#0F172A] px-14 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl z-20">
                                                Stock Validado
                                            </div>
                                        )}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black uppercase tracking-[4px] text-amber-500/70">Inversión Estimada</p>
                                                <div className="flex items-baseline gap-2">
                                                    <h4 className="text-5xl font-black text-white tracking-tighter tabular-nums">{calculateEstimate()}</h4>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">MXN + IVA</span>
                                                </div>
                                                {matchingProduct && (
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-3 font-medium bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                        Hardware Pro: {matchingProduct.modelo} 
                                                    </p>
                                                )}
                                            </div>
                                            <div className="hidden md:grid grid-cols-2 gap-x-6 gap-y-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                <div className="flex items-center gap-2"><Check size={10} className="text-amber-500" /> Instalación Pro</div>
                                                <div className="flex items-center gap-2"><Check size={10} className="text-amber-500" /> App Móvil</div>
                                                <div className="flex items-center gap-2"><Check size={10} className="text-amber-500" /> Respaldo UPS</div>
                                                <div className="flex items-center gap-2"><Check size={10} className="text-amber-500" /> Soporte 24/7</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-500 ml-2 block italic">Responsable Legal/Técnico</label>
                                            <input
                                                type="text"
                                                placeholder="Nombre del titular"
                                                className="w-full p-6 bg-slate-900/60 border border-white/5 rounded-3xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-base font-bold text-white placeholder:text-slate-700 shadow-sm"
                                                value={config.name}
                                                onChange={e => setConfig({ ...config, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-500 ml-2 block italic">Email Corporativo</label>
                                            <input
                                                type="email"
                                                placeholder="direccion@empresa.com"
                                                className="w-full p-6 bg-slate-900/60 border border-white/5 rounded-3xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-base font-bold text-white placeholder:text-slate-700 shadow-sm"
                                                value={config.email}
                                                onChange={e => setConfig({ ...config, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        {submitError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400"
                                            >
                                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-wider">Error al enviar</p>
                                                    <p className="text-[11px] mt-1 font-medium">{submitError}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading || !config.name || !config.email}
                                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0F172A] font-black uppercase tracking-[4px] py-7 rounded-[32px] flex items-center justify-center gap-4 transition-all disabled:opacity-40 shadow-2xl shadow-amber-900/40 group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={22} className="relative z-10" /> <span className="relative z-10">Activar Validación Técnica</span></>}
                                        </button>
                                        <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[2px]">
                                            Respuesta técnica en menos de <span className="text-amber-500/80">30 minutos</span> hábiles
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800/40 backdrop-blur-2xl border border-primary/20 rounded-[48px] p-12 text-center space-y-10 shadow-2xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                            <FileText size={120} className="text-primary rotate-12" />
                        </div>

                        <div className="space-y-4">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-lg shadow-primary/10">
                                <Check className="text-primary w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">¡Configuración Exitosa!</h3>
                            <p className="text-slate-400 max-w-lg mx-auto font-medium">
                                Hemos recibido los parámetros de su diseño. Un ingeniero de Global++ validará la viabilidad técnica y disponibilidad de inventario.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={generatePDF}
                                className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10 group active:scale-95"
                            >
                                <Download size={20} className="text-primary group-hover:animate-bounce" /> Descargar Cotización PDF
                            </button>
                            <button 
                                onClick={() => { setStep(1); setSuccess(false) }} 
                                className="px-8 py-5 bg-primary text-[#0F172A] rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-[#B38F4D] active:scale-95 shadow-lg shadow-amber-900/20"
                            >
                                Nuevo Diseño
                            </button>
                        </div>
                        
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global++ | Priority Support 24/7</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
