'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Mail, ArrowRight, Loader2, UserPlus, Cpu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'



export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (authError) throw authError

            // Obtener el perfil real para saber el rol
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                console.error('Error fetching profile:', profileError)
                setLoading(false)
                router.push('/portal')
                return
            }

            const role = profile?.role || 'client'
            setLoading(false)

            // Redirigir según el rol real de la DB
            if (role === 'admin' || role === 'cajero') {
                router.push('/admin')
            } else if (role === 'tech') {
                router.push('/tech')
            } else {
                router.push('/portal')
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error de autenticación';
            setError(errorMsg === 'Invalid login credentials' ? 'Credenciales inválidas. Revise su correo y contraseña.' : errorMsg)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-6 py-12 relative overflow-hidden">

            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none z-10"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none z-10"></div>

            <div className="max-w-[460px] w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-[22px] flex items-center justify-center p-3 shadow-2xl group-hover:scale-105 group-hover:border-primary/50 transition-all relative overflow-hidden">
                            <Image 
                                src="/logo-global.png" 
                                alt="Global++" 
                                fill
                                className="object-contain p-1 drop-shadow-glow"
                            />
                        </div>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                            Acceso <span className="text-primary italic">Seguro</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[4px]">
                            Ecosistema Global++
                        </p>
                    </div>
                </div>



                <div className="glass p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Correo Corporativo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-950/50 rounded-2xl border border-white/5 text-white font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Clave de Acceso"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-950/50 rounded-2xl border border-white/5 text-white font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            aria-label={loading ? "Autenticando..." : "Autenticar en el ecosistema"}
                            className="w-full bg-primary hover:bg-[#B38F4D] text-[#0F172A] py-5 rounded-2xl font-black uppercase tracking-[3px] text-[10px] transition-all shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Autenticar Ecosistema <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-white/5 space-y-3">
                        <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">Entornos Demo (Un Clic)</p>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => { setEmail('cliente@globaltelecomunicaciones.mx'); setPassword('password123'); }}
                                aria-label="Simular acceso como Cliente"
                                className="py-3 px-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-300 hover:bg-white/10 hover:text-white transition-all text-center flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <Shield className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                <span>Cliente</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('admin@globaltelecomunicaciones.mx'); setPassword('password123'); }}
                                aria-label="Simular acceso como Administrador"
                                className="py-3 px-2 bg-primary/10 border border-primary/20 rounded-xl text-[9px] font-black uppercase tracking-wider text-primary hover:bg-primary/20 transition-all text-center flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <Lock className="w-4 h-4 text-primary" />
                                <span>Admin</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('tech@globaltelecomunicaciones.mx'); setPassword('password123'); }}
                                aria-label="Simular acceso como Técnico"
                                className="py-3 px-2 bg-slate-800/50 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-400 hover:bg-slate-700 transition-all text-center flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <Cpu className="w-4 h-4 text-slate-500" />
                                <span>Técnico</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                            <Link href="/recuperar" className="hover:text-primary transition-colors hover:underline">Recuperar Acceso</Link>
                            <Link href="/registro" className="text-primary hover:text-blue-400 transition-colors flex items-center gap-1.5 group">
                                <UserPlus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:underline">Crear Cuenta Socios</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-6 pt-4">
                    <div className="flex justify-center gap-8 text-[8px] font-black uppercase text-slate-600 tracking-[2px]">
                        <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-primary" /> Multi-Layer Encryption</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Servidor Operativo</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[4px]">
                        © 2026 Global++ | INGENIERÍA DE DETALLE
                    </p>
                </div>
            </div>
        </div>
    )
}
