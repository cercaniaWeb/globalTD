'use client'

import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Line, Grid, Text as DreiText, Float } from '@react-three/drei'
import { X, Ruler, Activity, Layers } from 'lucide-react'
import * as THREE from 'three'

type Measurement3D = {
    id: string
    created_at: string
    from_point: { x: number; y: number; z: number }
    to_point: { x: number; y: number; z: number }
    distance: number
    label: string
}

export default function MeasurementViewer({ 
    measurements, 
    onClose 
}: { 
    measurements: Measurement3D[], 
    onClose: () => void 
}) {
    // Calculate overall center for OrbitControls
    const allPoints = useMemo(() => {
        const pts: THREE.Vector3[] = []
        measurements.forEach(m => {
            pts.push(new THREE.Vector3(m.from_point.x, m.from_point.y, m.from_point.z))
            pts.push(new THREE.Vector3(m.to_point.x, m.to_point.y, m.to_point.z))
        })
        return pts
    }, [measurements])

    const center = useMemo(() => {
        if (allPoints.length === 0) return new THREE.Vector3(0, 0, 0)
        const c = new THREE.Vector3()
        allPoints.forEach(p => c.add(p))
        return c.divideScalar(allPoints.length)
    }, [allPoints])

    const totalDistance = measurements.reduce((acc, m) => acc + m.distance, 0)

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950 animate-in fade-in duration-500 overflow-hidden font-sans">
            <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                        <Activity className="text-primary w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Visor de Levantamiento <span className="text-primary underline underline-offset-4">3D</span></h2>
                        <p className="text-[8px] font-black tracking-widest uppercase text-slate-500 mt-2">Reconstrucción de nubes de puntos y trayectorias.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex gap-4">
                        <div className="glass px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                            <Layers className="text-primary w-4 h-4" />
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase">Segmentos</p>
                                <p className="text-sm font-black text-white">{measurements.length}</p>
                            </div>
                        </div>
                        <div className="glass px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                            <Ruler className="text-primary w-4 h-4" />
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase">Longitud Total</p>
                                <p className="text-sm font-black text-white">{totalDistance.toFixed(2)} m</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-4 hover:bg-white/5 rounded-full transition-all text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>
            </header>

            <main className="flex-1 relative cursor-move">
                <Canvas shadows gl={{ antialias: true }}>
                    <PerspectiveCamera makeDefault position={[3, 3, 3]} />
                    <OrbitControls target={center} makeDefault />
                    
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={2} castShadow />
                    
                    <Grid 
                        infiniteGrid 
                        fadeDistance={25} 
                        sectionThickness={1} 
                        sectionColor="#1e293b" 
                        cellColor="#334155" 
                    />

                    {measurements.map((m) => (
                        <group key={m.id}>
                            {/* Line from point A to B */}
                            <Line 
                                points={[
                                    new THREE.Vector3(m.from_point.x, m.from_point.y, m.from_point.z),
                                    new THREE.Vector3(m.to_point.x, m.to_point.y, m.to_point.z)
                                ]}
                                color="#EAB308"
                                lineWidth={3}
                            />
                            
                            {/* Point A */}
                            <mesh position={[m.from_point.x, m.from_point.y, m.from_point.z]}>
                                <sphereGeometry args={[0.03, 16, 16]} />
                                <meshStandardMaterial color="#EAB308" emissive="#EAB308" emissiveIntensity={2} />
                            </mesh>

                            {/* Point B */}
                            <mesh position={[m.to_point.x, m.to_point.y, m.to_point.z]}>
                                <sphereGeometry args={[0.03, 16, 16]} />
                                <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={2} />
                            </mesh>

                            {/* Distance Label */}
                            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                                <DreiText
                                    position={[
                                        (m.from_point.x + m.to_point.x) / 2,
                                        (m.from_point.y + m.to_point.y) / 2 + 0.2,
                                        (m.from_point.z + m.to_point.z) / 2
                                    ]}
                                    fontSize={0.12}
                                    color="#22d3ee"
                                    anchorX="center"
                                    anchorY="middle"
                                    font="https://fonts.gstatic.com/s/robotomono/v12/L0X5DF4xlVMF-9hA9Xp2bMzXDTeZVmETLPHyTMY.woff"
                                >
                                    {m.distance.toFixed(2)}m
                                </DreiText>
                            </Float>

                            {/* Measurement Label */}
                            {m.label && (
                                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                                    <DreiText
                                        position={[
                                            (m.from_point.x + m.to_point.x) / 2,
                                            (m.from_point.y + m.to_point.y) / 2 + 0.4,
                                            (m.from_point.z + m.to_point.z) / 2
                                        ]}
                                        fontSize={0.08}
                                        color="#94a3b8"
                                        anchorX="center"
                                        anchorY="middle"
                                    >
                                        {m.label}
                                    </DreiText>
                                </Float>
                            )}
                        </group>
                    ))}

                    <DreiText
                        position={[center.x, center.y + 0.8, center.z]}
                        fontSize={0.15}
                        color="white"
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
                    >
                        {`LEVANTAMIENTO TOTAL: ${totalDistance.toFixed(2)}m`}
                    </DreiText>
                </Canvas>

                {/* Legend/Controls Info */}
                <div className="absolute bottom-10 left-10 space-y-4">
                    <div className="glass p-6 rounded-3xl border border-white/5 space-y-4 max-w-xs transition-opacity duration-300 pointer-events-none">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Controles del Visor</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                                <span>Rotar</span>
                                <span className="text-white">Click Izquierdo</span>
                            </div>
                            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                                <span>Pan</span>
                                <span className="text-white">Click Derecho</span>
                            </div>
                            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">
                                <span>Zoom</span>
                                <span className="text-white">Scroll</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute right-10 top-1/2 -translate-y-1/2 space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                    {measurements.map((m, idx) => (
                        <div key={m.id} className="glass p-4 rounded-2xl border border-white/5 min-w-[200px] hover:border-primary/20 transition-all cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                    #{idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[8px] font-black text-slate-500 uppercase truncate">{m.label || 'Segmento'}</p>
                                    <p className="text-xs font-black text-white">{m.distance.toFixed(2)}m</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="h-16 bg-slate-900 flex items-center justify-center border-t border-white/5 gap-10 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[3px] text-slate-500">Sistema Activo</span>
                </div>
                <div className="text-[8px] font-black uppercase tracking-[3px] text-slate-700">|</div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[3px] text-slate-500">Render Engine: WebGL 2.0</span>
                </div>
            </footer>
        </div>
    )
}
