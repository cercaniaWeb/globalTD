'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, User, ArrowRight, Loader2, LogIn, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
        setTimeout(() => router.push('/login'), 3000)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                        <CheckCircle2 className="text-green-500 w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">¡Cuenta Creada!</h2>
                        <p className="text-slate-500 font-medium">Hemos enviado un correo de confirmación. Por favor verifica tu bandeja de entrada.</p>
                    </div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest animate-pulse">Redirigiendo al login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 bg-grid flex items-center justify-center px-6 py-12">
            <div className="max-w-[440px] w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl shadow-blue-900/5 group-hover:scale-105 transition-transform border border-slate-100">
                            <Shield className="w-full h-full text-primary" />
                        </div>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">
                            Registro de <span className="text-primary italic">Socios</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">
                            Únete a la red de Global Telecom
                        </p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-2xl shadow-blue-900/5 space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold text-center uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/group-focus-within: -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nombre Completo o Razón Social"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-900 font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Corporativo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-900 font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Contraseña Segura"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-900 font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-blue-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed h-[56px]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Crear Mi Cuenta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col gap-4 pt-6 border-t border-slate-50">
                        <div className="text-center text-[9px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">¿Ya tienes cuenta?</span>{' '}
                            <Link href="/login" className="text-primary hover:text-blue-800 transition-colors inline-flex items-center gap-1">
                                <LogIn className="w-3 h-3" /> Iniciar Sesión
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[3px]">
                        Tu información está protegida
                    </p>
                </div>
            </div>
        </div>
    )
}
