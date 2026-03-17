'use client'

import { useState } from 'react'
import { 
    Layout, 
    Plus, 
    MoreVertical, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    BarChart3
} from 'lucide-react'

type ProjectStatus = 'Planificación' | 'Ejecución' | 'Pruebas' | 'Completado' | 'En Pausa';

interface Project {
    id: string;
    name: string;
    client: string;
    startDate: string;
    endDate: string;
    progress: number;
    status: ProjectStatus;
    tasksCount: number;
    completedTasks: number;
}

const MOCK_PROJECTS: Project[] = [
    {
        id: 'PRJ-001',
        name: 'Instalación CCTV - Corporativo Polanco',
        client: 'Gruma S.A.',
        startDate: '2024-03-01',
        endDate: '2024-04-15',
        progress: 65,
        status: 'Ejecución',
        tasksCount: 24,
        completedTasks: 16
    },
    {
        id: 'PRJ-002',
        name: 'Control de Acceso Biométrico - Planta Toluca',
        client: 'Logística Express',
        startDate: '2024-03-10',
        endDate: '2024-03-30',
        progress: 30,
        status: 'Ejecución',
        tasksCount: 12,
        completedTasks: 4
    },
    {
        id: 'PRJ-003',
        name: 'Actualización NVR y Red - Sucursal Satélite',
        client: 'Roberto Sánchez',
        startDate: '2024-02-15',
        endDate: '2024-03-05',
        progress: 100,
        status: 'Completado',
        tasksCount: 8,
        completedTasks: 8
    },
    {
        id: 'PRJ-004',
        name: 'Auditoría de Seguridad Perimetral',
        client: 'Centro Comercial Santa Fe',
        startDate: '2024-04-01',
        endDate: '2024-04-10',
        progress: 0,
        status: 'Planificación',
        tasksCount: 5,
        completedTasks: 0
    }
];

export default function ProjectsView({ addNotification }: { addNotification: (msg: string, type?: string) => void }) {
    const [projects] = useState<Project[]>(MOCK_PROJECTS)

    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case 'Completado': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Ejecución': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Planificación': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'En Pausa': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    }

    const getStatusIcon = (status: ProjectStatus) => {
        switch (status) {
            case 'Completado': return <CheckCircle2 size={12} />;
            case 'Ejecución': return <BarChart3 size={12} />;
            case 'Planificación': return <Clock size={12} />;
            case 'En Pausa': return <AlertCircle size={12} />;
            default: return <Clock size={12} />;
        }
    }

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                        PROJECT <span className="text-primary underline underline-offset-8">CONTROL</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[4px]">Gestión Central de Implementaciones</p>
                </div>
                <button 
                    onClick={() => addNotification('INICIANDO ASISTENTE DE PROYECTO...', 'info')}
                    className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/40 group"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Crear Proyecto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="glass p-8 rounded-[32px] border-white/5 relative group hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(project.status)}`}>
                                {getStatusIcon(project.status)}
                                {project.status}
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-black italic text-white uppercase leading-tight group-hover:text-primary transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    Cliente: <span className="text-slate-300">{project.client}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Progreso General</span>
                                    <span className="text-xs font-mono text-primary">{project.progress}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(197,160,89,0.3)]" 
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={14} className="text-primary/50" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest">Inicio</p>
                                        <p className="text-[10px] font-bold text-slate-300">{project.startDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Layout size={14} className="text-primary/50" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest">Misiones</p>
                                        <p className="text-[10px] font-bold text-slate-300">{project.completedTasks}/{project.tasksCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
                                Detalles
                            </button>
                            <button 
                                onClick={() => addNotification(`ABRIENDO TABLERO KANBAN: ${project.id}`, 'info')}
                                className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                                Gestionar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
