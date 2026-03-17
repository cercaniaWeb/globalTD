'use client'

import { useState, useEffect } from 'react'
import { X, Search, Plus, Trash2, FileText, Download, DollarSign, Package, ShoppingCart } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { supabase } from '@/lib/supabase'
import { SyscomProduct } from '@/lib/syscom'

type QuoteItem = SyscomProduct & { quantity: number };
type Lead = { id: string; client_name?: string; notes?: string | null; };

export default function CotizadorModal({ lead, onClose, addNotification }: { lead: Lead, onClose: () => void, addNotification: (message: string, type: string) => void }) {
    const [products, setProducts] = useState<SyscomProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Line items en la cotización
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
    const [handLabor, setHandLabor] = useState(0)

    useEffect(() => {
        fetch('/api/syscom/products')
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const filteredProducts = products.filter((p: SyscomProduct) =>
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addItem = (product: SyscomProduct) => {
        const existing = quoteItems.find((item: QuoteItem) => item.producto_id === product.producto_id)
        if (existing) {
            setQuoteItems(quoteItems.map((item: QuoteItem) =>
                item.producto_id === product.producto_id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ))
        } else {
            setQuoteItems([...quoteItems, { ...product, quantity: 1 }])
        }
    }

    const removeItem = (id: string) => {
        setQuoteItems(quoteItems.filter((item: QuoteItem) => item.producto_id !== id))
    }

    const updateQuantity = (id: string, qty: number) => {
        if (qty < 1) return
        setQuoteItems(quoteItems.map((item: QuoteItem) =>
            item.producto_id === id ? { ...item, quantity: qty } : item
        ))
    }

    const subtotal = quoteItems.reduce((acc: number, item: QuoteItem) => acc + (parseFloat(item.precio_cliente ?? '0') * item.quantity), 0)
    const total = subtotal + handLabor

    const generatePDF = async () => {
        if (quoteItems.length === 0) {
            addNotification('Agrega productos a la cotización primero', 'error')
            return
        }

        try {
            addNotification('GENERANDO DOCUMENTO...', 'info')
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()

            const getImageData = (url: string): Promise<{ data: string, w: number, h: number }> => {
                return new Promise((resolve) => {
                    const img = new Image()
                    img.crossOrigin = 'Anonymous'
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')
                        canvas.width = img.width
                        canvas.height = img.height
                        ctx?.drawImage(img, 0, 0)
                        resolve({ data: canvas.toDataURL('image/jpeg', 0.5), w: img.width, h: img.height })
                    }
                    img.onerror = () => resolve({ data: '', w: 0, h: 0 })
                    img.src = url
                })
            }

            // Header Fixed (Oxford Blue)
            doc.setFillColor(27, 38, 59)
            doc.rect(0, 0, pageWidth, 45, 'F')
            
            // Gold Accent Bar
            doc.setFillColor(197, 160, 89)
            doc.rect(0, 45, pageWidth, 2, 'F')

            doc.setTextColor(255, 255, 255)
            doc.setFontSize(22)
            doc.setFont('helvetica', 'bold')
            doc.text('Global++', 14, 20)
            doc.setFontSize(8)
            doc.setTextColor(197, 160, 89)
            doc.text('INGENIERÍA DE DETALLE EN SEGURIDAD ELECTRÓNICA', 14, 28)

            // Folio (GT -> CS)
            doc.setFillColor(15, 23, 42)
            doc.roundedRect(pageWidth - 65, 10, 50, 25, 3, 3, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(7)
            doc.text('FOLIO:', pageWidth - 60, 18)
            doc.setFontSize(10)
            doc.text(`CS-${Math.floor(Date.now() / 1000).toString().slice(-6)}`, pageWidth - 60, 25)

            // Client
            doc.setFillColor(248, 250, 252)
            doc.roundedRect(14, 52, pageWidth - 28, 20, 2, 2, 'F')
            doc.setTextColor(15, 23, 42)
            doc.setFontSize(10)
            doc.text(`CLIENTE: ${lead?.client_name?.toUpperCase() || 'MOSTRADOR'}`, 20, 64)

            const rows: string[][] = []
            const imgs: { data: string; w: number; h: number }[] = []

            for (const item of quoteItems) {
                let imgObj = { data: '', w: 0, h: 0 }
                if (item.img_portada) {
                    imgObj = await getImageData(item.img_portada)
                }
                imgs.push(imgObj)
                rows.push([
                    '', // Image cell MUST be empty
                    `${item.modelo}\n${item.marca}`,
                    item.titulo.substring(0, 100),
                    item.quantity.toString(),
                    `$${parseFloat(item.precio_cliente ?? '0').toFixed(2)}`,
                    `$${(parseFloat(item.precio_cliente ?? '0') * item.quantity).toFixed(2)}`
                ])
            }

            if (handLabor > 0) {
                rows.push(['', 'MANO DE OBRA', 'Instalación y puesta en marcha', '1', `$${handLabor.toFixed(2)}`, `$${handLabor.toFixed(2)}` ])
            }

            autoTable(doc, {
                startY: 80,
                head: [['IMG', 'MODELO', 'DESCRIPCIÓN', 'CANT', 'PRECIO', 'TOTAL']],
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [27, 38, 59], textColor: [255, 255, 255], fontSize: 8 },
                styles: { fontSize: 7, cellPadding: 4, minCellHeight: 20, valign: 'middle' },
                columnStyles: { 0: { cellWidth: 20 }, 1: { fontStyle: 'bold' } },
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 0) {
                        const img = imgs[data.row.index]
                        if (img && img.data) {
                            const padding = 2
                            const cw = data.cell.width - (padding * 2)
                            const ch = data.cell.height - (padding * 2)
                            const r = Math.min(cw / img.w, ch / img.h)
                            const w = img.w * r
                            const h = img.h * r
                            doc.addImage(img.data, 'JPEG', data.cell.x + (data.cell.width - w) / 2, data.cell.y + (data.cell.height - h) / 2, w, h)
                        }
                    }
                }
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const finalY = (doc as any).lastAutoTable.finalY + 10
            const iva = total * 0.16
            const gt = total + iva

            doc.setFontSize(9)
            doc.text(`SUBTOTAL: $${total.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' })
            doc.text(`IVA (16%): $${iva.toFixed(2)}`, pageWidth - 20, finalY + 6, { align: 'right' })
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(27, 38, 59)
            doc.text(`TOTAL: $${gt.toFixed(2)} MXN`, pageWidth - 20, finalY + 14, { align: 'right' })

            doc.setFontSize(7)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(150, 150, 150)
            doc.text('Este documento es una propuesta técnica basada en Soluciones por Global++.', 14, pageHeight - 15)

            doc.save(`Cotizacion_${lead?.client_name?.replace(/\s+/g, '_')}.pdf`)

            const pdfBlob = doc.output('blob')
            const fileName = `quote_${lead.id}_${Date.now()}.pdf`
            const { error: upErr } = await supabase.storage.from('cotizaciones').upload(fileName, pdfBlob, { contentType: 'application/pdf' })
            if (!upErr) {
                const { data: { publicUrl } } = supabase.storage.from('cotizaciones').getPublicUrl(fileName)
                await supabase.from('crm_leads').update({ status: 'Cotizado', notes: (lead.notes || '') + `\n[COTIZACIÓN GENERADA]: ${publicUrl}` }).eq('id', lead.id)
                addNotification('COTIZACIÓN GUARDADA', 'success')
            }
            onClose()
        } catch (e) {
            console.error(e)
            addNotification('Error crítico en PDF', 'error')
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-5xl h-[85vh] flex overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Panel Izquierdo: Catálogo */}
                <div className="w-1/2 flex flex-col border-r border-white/5 bg-slate-900/50">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Catálogo Syscom</h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar modelo o descripción..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[10px] uppercase font-bold text-white focus:outline-none focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <Search className="w-8 h-8 animate-spin mb-4 text-primary" />
                                <span className="text-[10px] uppercase tracking-widest">Sincronizando Precios...</span>
                            </div>
                        ) : filteredProducts.map(p => (
                            <div key={p.producto_id} className="flex gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
                                    {p.img_portada ? (
                                        <img src={p.img_portada} alt={p.modelo} className="max-w-full max-h-full object-contain p-1 mix-blend-multiply" />
                                    ) : <Package className="text-slate-300" />}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">{p.marca} | {p.modelo}</span>
                                    <span className="text-xs font-bold text-white line-clamp-1">{p.titulo}</span>
                                    <span className="text-[10px] font-mono text-emerald-400 mt-1">${p.precio_cliente} {p.moneda}</span>
                                </div>
                                <button
                                    onClick={() => addItem(p)}
                                    className="p-3 my-auto bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel Derecho: Cotización Actual */}
                <div className="w-1/2 flex flex-col bg-slate-900 relative">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tighter italic text-white flex items-center gap-2">
                                <FileText size={20} className="text-primary" /> Constructor de Cotización
                            </h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Lead: <span className="text-primary">{lead?.client_name || 'Desconocido'}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {quoteItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <ShoppingCart className="w-12 h-12 mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Sin productos</p>
                            </div>
                        ) : quoteItems.map(item => (
                            <div key={item.producto_id} className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-white/5">
                                <div className="flex-1">
                                    <p className="text-[9px] font-black tracking-widest text-slate-400">{item.modelo}</p>
                                    <p className="text-xs font-bold text-slate-200 line-clamp-1">{item.titulo}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
                                    <button
                                        onClick={() => updateQuantity(item.producto_id, item.quantity - 1)}
                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                                    >-</button>
                                    <span className="w-6 text-center text-[10px] font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.producto_id, item.quantity + 1)}
                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                                    >+</button>
                                </div>
                                <div className="w-20 text-right font-mono text-[10px] text-emerald-400">
                                    ${(parseFloat(item.precio_cliente ?? '0') * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeItem(item.producto_id)}
                                    className="text-slate-600 hover:text-red-500 p-2"
                                ><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-slate-950 border-t border-white/5">
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Subtotal Equipos:</span>
                                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Mano de Obra (MXN):</span>
                                <div className="flex items-center gap-2">
                                    <DollarSign size={14} className="text-primary" />
                                    <input
                                        type="number"
                                        value={handLabor}
                                        onChange={(e) => setHandLabor(parseFloat(e.target.value) || 0)}
                                        className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-white focus:outline-none focus:border-primary font-mono"
                                    />
                                </div>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <div className="flex justify-between items-center text-xl font-black">
                                <span className="text-white">TOTAL INVERSIÓN:</span>
                                <span className="font-mono text-emerald-400">${total.toFixed(2)} MXN</span>
                            </div>
                        </div>

                        <button
                            onClick={generatePDF}
                            className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/30"
                        >
                            <Download size={18} /> Generar PDF Oficial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
