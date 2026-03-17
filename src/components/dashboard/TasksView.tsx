'use client'

import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'
import { ArrowRight } from 'lucide-react'
import { Database } from '@/lib/database.types'

type Task = Database['public']['Tables']['tasks']['Row']

export default function TasksView({ addNotification }: { addNotification: (message: string, type: string) => void }) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState({ title: '', priority: 'media', due_date: '' })

    const fetchTasks = async () => {
        const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true }) as { data: Task[] | null, error: PostgrestError | null }
        if (error) {
            console.error(error)
            return
        }
        if (data) setTasks(data as Task[])
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTasks()
    }, [])

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault()
        if (!newTask.title) return
        const { data, error } = await supabase.from('tasks').insert([{
            title: newTask.title,
            priority: newTask.priority,
            due_date: newTask.due_date || new Date().toISOString(),
            status: 'pendiente',
            reminder_sent: false
        }]).select() as { data: Task[] | null, error: PostgrestError | null }

        if (error) {
            console.error(error)
            return
        }

        if (data && data.length > 0) {
            setTasks([data[0], ...tasks])
            setNewTask({ title: '', priority: 'media', due_date: '' })
            addNotification(`TAREA "${newTask.title.toUpperCase()}" REGISTRADA`, 'success')
            if (Notification.permission === 'granted') {
                new Notification('Tarea Creada', { body: `Has añadido: ${newTask.title}` })
            }
        }
    }

    const toggleTask = async (task: Task) => {
        const states = ['pendiente', 'en_proceso', 'completada']
        const currentIndex = states.indexOf(task.status ?? 'pendiente')
        const nextStatus = states[(currentIndex + 1) % states.length]

        const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id) as { error: PostgrestError | null }
        if (!error) {
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t))
            addNotification(`Tarea "${task.title.toUpperCase()}" movida a ${nextStatus.replace('_', ' ').toUpperCase()}`, 'info')
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Gestión de <span className="text-primary italic underline underline-offset-8">Tareas</span></h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Lista de pendientes tácticos y recordatorios operativos.</p>
                </div>
                <form onSubmit={handleAddTask} className="flex flex-wrap gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="NUEVA TAREA..."
                        className="bg-slate-900 border border-white/5 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest focus:border-primary focus:outline-none flex-1 md:w-64"
                    />
                    <input
                        type="datetime-local"
                        value={newTask.due_date}
                        onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                        className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-slate-400 focus:border-primary focus:outline-none"
                    />
                    <select
                        value={newTask.priority}
                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                        className="bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:border-primary focus:outline-none"
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                    <button type="submit" className="bg-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-glow">Agregar</button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['pendiente', 'en_proceso', 'completada'].map(status => (
                    <div key={status} className="glass rounded-[32px] border-white/5 p-8 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[4px] text-slate-500 flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${status === 'pendiente' ? 'bg-yellow-500' : status === 'en_proceso' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                            {status.replace('_', ' ')}
                        </h3>
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === status).map(task => (
                                <div key={task.id}
                                    onClick={() => toggleTask(task)}
                                    className="p-5 glass border-white/5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[11px] font-black uppercase tracking-tight text-white flex items-center justify-between gap-2">
                                            <span className={task.status === 'completada' ? 'line-through text-slate-600' : ''}>{task.title}</span>
                                            <ArrowRight size={10} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </p>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${task.priority === 'alta' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'}`}>{task.priority}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                                        Vence: {task.due_date ? new Date(task.due_date).toLocaleString() : 'Sin fecha'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
