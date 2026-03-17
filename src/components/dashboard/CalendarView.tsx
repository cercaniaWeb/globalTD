'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays
} from 'date-fns'

export default function CalendarView({ addNotification }: { addNotification: (message: string, type: string) => void }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [events, setEvents] = useState<Database['public']['Tables']['calendar_events']['Row'][]>([])
    const [showEventModal, setShowEventModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const fetchEvents = async () => {
        const { data } = await supabase.from('calendar_events').select('*')
        if (data) setEvents(data)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEvents()
        if (Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }, [])

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy"
        return (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Calendario <span className="text-primary italic underline underline-offset-8">Operativo</span></h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Sincronización de eventos y despliegues en tiempo real.</p>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">Anterior</button>
                    <span className="text-sm font-black uppercase tracking-[3px] italic">{format(currentMonth, dateFormat).toUpperCase()}</span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">Siguiente</button>
                </div>
            </div>
        )
    }

    const renderDays = () => {
        const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map(day => (
                    <div key={day} className="text-[10px] font-black uppercase tracking-[4px] text-slate-500 text-center">{day}</div>
                ))}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ""

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d")
                const cloneDay = day
                const dayEvents = events.filter(e => isSameDay(new Date(e.start_time), cloneDay))

                days.push(
                    <div
                        key={day.toString()}
                        className={`h-32 md:h-40 glass border border-white/5 p-4 transition-all hover:bg-white/[0.02] cursor-pointer ${!isSameMonth(day, monthStart) ? "opacity-20" : ""
                            } ${isSameDay(day, new Date()) ? "border-primary shadow-glow" : ""}`}
                        onClick={() => {
                            setSelectedDate(cloneDay)
                            setShowEventModal(true)
                        }}
                    >
                        <span className="text-[10px] font-black text-slate-500 mb-4 block">{formattedDate}</span>
                        <div className="space-y-1 overflow-y-auto max-h-24 custom-scrollbar">
                            {dayEvents.map(event => (
                                <div key={event.id} className={`text-[8px] font-black uppercase p-1.5 rounded bg-${event.color}-500/10 text-${event.color}-500 border border-${event.color}-500/20 truncate`}>
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            )
            days = []
        }
        return <div className="rounded-[40px] overflow-hidden border border-white/5">{rows}</div>
    }

    return (
        <div className="animate-in fade-in duration-500">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            {showEventModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                    <div className="glass w-full max-w-md rounded-[32px] border-white/5 p-10 space-y-8 animate-in zoom-in duration-300">
                        <h3 className="text-xl font-black uppercase italic tracking-widest text-primary">Agendar Evento</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha: {selectedDate.toLocaleDateString()}</p>
                        <div className="space-y-6">
                            <input id="ev-title" type="text" placeholder="TITULO DEL EVENTO..." className="w-full bg-slate-900 border border-white/5 rounded-xl px-6 py-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:outline-none" />
                            <div className="flex gap-4">
                                <button onClick={async () => {
                                    const title = (document.getElementById('ev-title') as HTMLInputElement).value
                                    if (!title) return
                                    const { data } = await supabase.from('calendar_events').insert([{
                                        title,
                                        start_time: selectedDate.toISOString(),
                                        end_time: selectedDate.toISOString(),
                                        category: 'reunion',
                                        color: 'blue'
                                    }]).select()
                                    if (data) {
                                        setEvents([...events, data[0]])
                                        setShowEventModal(false)
                                        addNotification(`EVENTO "${title.toUpperCase()}" AGENDADO`, 'success')
                                        if (Notification.permission === 'granted') {
                                            new Notification('Evento Agendado', { body: `Evento: ${title}` })
                                        }
                                    }
                                }} className="flex-1 bg-primary py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-glow">Guardar</button>
                                <button onClick={() => setShowEventModal(false)} className="flex-1 bg-white/5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
