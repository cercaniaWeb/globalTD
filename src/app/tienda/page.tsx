'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Search, ShoppingCart, CheckCircle, Package, ShieldCheck, ArrowLeft, X, Trash2 } from 'lucide-react'

const CATEGORIES = ["Todos", "CCTV", "Control de Acceso", "Redes", "Energía"];

// MOCK_PRODUCTS removed as it was unused

interface Product {
    producto_id: string;
    modelo: string;
    titulo: string;
    marca: string;
    precio_cliente: string;
    moneda: string;
    img_portada?: string;
    categorias?: { nombre: string }[];
}

export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Todos");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Product[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ title: string, message: string } | null>(null);
    const [user] = useState<{ email: string, full_name?: string, role?: string } | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('cs_user');
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return null;
                }
            }
        }
        return null;
    });

    const cartTotal = cart.reduce((acc, curr) => acc + (parseFloat(curr.precio_cliente) || 0), 0);

    const handleAddToCart = (product: Product) => {
        setCart([...cart, product]);
        setToastMessage({
            title: "Producto Agregado",
            message: `${product.modelo} listo para cotizar.`
        });
        setTimeout(() => setToastMessage(null), 3000);
    }

    useEffect(() => {
        fetch('/api/syscom/products')
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const removeFromCart = (indexToRemove: number) => {
        setCart(cart.filter((_, index) => index !== indexToRemove));
    }

    const handleCheckout = async () => {
        if (!user) {
            setToastMessage({
                title: "Atención",
                message: "Por favor, Inicia Sesión desde 'Mi Cuenta' para solicitar una cotización."
            });
            setTimeout(() => setToastMessage(null), 4000);
            return;
        }

        const detailsStr = cart.map(item => `1x ${item.modelo}`).join(', ');
        const totalFormatted = `$${cartTotal.toFixed(2)} MXN estimación tienda`;

        const { error } = await supabase.from('leads').insert({
            name: user.full_name || user.email.split('@')[0],
            email: user.email,
            estimate: totalFormatted,
            details: `(Desde Tienda) ${detailsStr}`
        });

        if (error) {
            setToastMessage({
                title: "Error",
                message: "Hubo un problema al registrar la solicitud. " + error.message
            });
            setTimeout(() => setToastMessage(null), 5000);
            return;
        }

        setToastMessage({
            title: "Cotización Creada",
            message: `¡Tu proyecto ha sido enviado al equipo técnico para su revisión!`
        });
        setTimeout(() => setToastMessage(null), 5000);

        setCart([]);
        setIsCartOpen(false);
    }

    // Filter products based on live Syscom category mapping
    const filteredProducts = products.filter(p => {
        const searchMatch = p.titulo.toLowerCase().includes(search.toLowerCase()) ||
            p.modelo.toLowerCase().includes(search.toLowerCase());

        if (filter === "Todos") return searchMatch;

        // Mapeo manual de categorías del frontend a las de Syscom
        const categoryMap: Record<string, string[]> = {
            "CCTV": ["Videovigilancia", "Cámaras IP", "DVR", "NVR", "CCTV"],
            "Control de Acceso": ["Control de Acceso", "Videoporteros IP", "Cerraduras"],
            "Redes": ["Redes", "Networking", "Wi-Fi", "Switches"],
            "Energía": ["Energía", "UPS", "Baterías", "Fuentes de Poder"]
        };

        const targetCategories = categoryMap[filter] || [filter];

        // Verificamos si alguna categoría del producto coincide
        const productCategories = p.categorias?.map((c: { nombre: string }) => c.nombre.trim().toLowerCase()) || [];

        const categoryMatch = targetCategories.some((tc: string) =>
            productCategories.some((pc: string) => pc.includes(tc.toLowerCase()))
        );

        return categoryMatch && searchMatch;
    });

    return (
        <div className="min-h-screen bg-slate-50 bg-grid pb-20">
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver Inicio
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative">
                            <Image 
                                src="/logo-global.png" 
                                alt="Global++ Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="hidden sm:inline-block text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                            CORE <span className="text-primary">SYSTEMS</span>
                        </span>
                    </div>
                    {user ? (
                        <Link href={user.role === 'admin' ? '/admin' : '/portal'} className="px-6 py-2 bg-primary rounded-full text-[10px] text-[#0F172A] font-bold uppercase tracking-widest hover:bg-[#B38F4D] transition-all border border-amber-600/20 shadow-md">
                            Mi Ecosistema
                        </Link>
                    ) : (
                        <Link href="/login" className="px-6 py-2 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all text-slate-900 border border-slate-200">
                            Mi Cuenta
                        </Link>
                    )}
                </div>
            </nav>

            <header className="pt-32 pb-12 px-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 text-primary" /> Distribuidor Autorizado Syscom
                            </div>
                            <h1 className="text-5xl font-extrabold uppercase tracking-tight text-slate-900 leading-none">Suministro <span className="text-primary">Técnico</span></h1>
                            <p className="text-slate-500 font-medium max-w-xl">Soluciones integrales en el suministro de equipos críticos con el respaldo de Global++.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar equipo o modelo..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-slate-200 w-full sm:w-80 font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900"
                                />
                            </div>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="hidden md:flex px-6 py-3 bg-white rounded-2xl border border-slate-200 items-center justify-center gap-3 font-bold hover:bg-slate-50 transition-all text-slate-900 shadow-sm"
                            >
                                <ShoppingCart className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Carrito ({cart.length})</span>
                            </button>
                        </div>
                    </div>

                <div className="flex flex-wrap gap-4 mb-12">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            aria-pressed={filter === cat}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all cursor-pointer ${
                                filter === cat 
                                ? 'bg-[#1B263B] text-primary shadow-xl shadow-amber-900/20 scale-105 border-transparent' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30 hover:text-slate-900 shadow-sm'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                </div>
            </header>

            <main className="px-6 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Sincronizando con Syscom...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No se encontraron equipos</h3>
                        <p className="text-slate-500">Intenta con otros filtros o términos de búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.producto_id} product={product} onAdd={() => handleAddToCart(product)} />
                        ))}
                    </div>
                )}
            </main>

            {/* Custom Toast Notification */}
            {toastMessage && (
                <div className="fixed top-24 right-6 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{toastMessage.title}</p>
                            <p className="font-bold text-sm text-white">{toastMessage.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Cart Button */}
            {cart.length > 0 && !isCartOpen && (
                <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="relative">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-16 h-16 bg-[#1B263B] text-primary rounded-[24px] shadow-2xl shadow-amber-900/20 hover:scale-105 active:scale-95 hover:-rotate-3 transition-all flex items-center justify-center relative group"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-md group-hover:opacity-100 opacity-0 transition-opacity rounded-[24px]"></div>
                            <ShoppingCart className="w-7 h-7 relative z-10" />
                        </button>
                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[11px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm z-20 animate-in zoom-in pointer-events-none">
                            {cart.length}
                        </span>
                    </div>
                </div>
            )}

            {/* Slide-over Cart Panel */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right-full duration-500 border-l border-slate-200 flex flex-col">

                        {/* Header */}
                        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <ShoppingCart size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-widest">Resumen Cotización</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{cart.length} Componentes listos</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <Package className="w-16 h-16 text-slate-200" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">El carrito está vacío</p>
                                    <button onClick={() => setIsCartOpen(false)} className="text-primary hover:underline font-bold text-sm">Explorar Catálogo</button>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                        <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {item.img_portada ? (
                                                <Image src={item.img_portada} alt={item.modelo} width={40} height={40} className="object-contain" />
                                            ) : (
                                                <Package className="w-6 h-6 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">{item.modelo}</p>
                                            <p className="font-bold text-slate-900 text-sm truncate">{item.titulo}</p>
                                            <p className="text-xs font-black text-slate-500 mt-1">${item.precio_cliente} MXN</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(idx)}
                                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-slate-100 bg-white space-y-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        <span>Subtotal Estimado</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-900">Total a Cotizar</span>
                                        <span className="text-3xl font-black text-primary">${cartTotal.toFixed(2)} <span className="text-sm">MXN</span></span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary text-[#0F172A] py-5 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-amber-900/20 hover:bg-[#B38F4D] transition-all active:scale-95"
                                >
                                    Confirmar y Solicitar Ingeniería
                                </button>
                                <p className="text-center text-[9px] font-bold text-slate-400">Los costos de instalación se calcularán posteriormente.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
    return (
        <div className="group bg-white rounded-[32px] border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <span className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full text-white">
                    {product.modelo}
                </span>
            </div>

            <div className="p-8 relative aspect-square flex items-center justify-center bg-white border-b border-slate-50">
                <div className="relative w-full h-full p-4 group-hover:scale-105 transition-transform duration-700">
                    <div className="w-full h-full relative">
                        {product.img_portada ? (
                            <Image
                                src={product.img_portada}
                                alt={product.modelo}
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl">
                                <Package className="w-12 h-12 text-slate-200" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <div className="text-[9px] font-bold uppercase tracking-[3px] text-slate-400 mb-3">{product.marca}</div>
                <h3 className="text-lg font-bold leading-snug mb-4 text-slate-900 group-hover:text-primary transition-all line-clamp-2 min-h-[3.5rem]">
                    {product.titulo}
                </h3>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                    <div className="space-y-0.5">
                        <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Precio Inversión</div>
                        <div className="text-2xl font-bold text-slate-900">
                            ${product.precio_cliente} <span className="text-[10px] font-medium text-slate-500">{product.moneda}</span>
                        </div>
                    </div>

                    <button 
                        onClick={onAdd} 
                        aria-label={`Agregar ${product.modelo} al carrito`}
                        className="w-12 h-12 bg-[#1B263B] rounded-xl flex items-center justify-center text-primary shadow-lg shadow-amber-900/10 hover:bg-[#25334D] transition-all active:scale-95 border border-primary/20 cursor-pointer"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
