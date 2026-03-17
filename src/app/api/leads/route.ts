import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/database.types'

// Server-side client with service role key (bypasses RLS)
const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { client_name, contact_email, status, notes, estimated_value, source } = body

        if (!client_name || !contact_email) {
            return NextResponse.json({ error: 'Nombre y email son requeridos.' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('crm_leads')
            .insert([{ client_name, contact_email, status, notes, estimated_value, source }])
            .select()
            .single()

        if (error) {
            console.error('[API /api/leads] Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 201 })
    } catch (err) {
        console.error('[API /api/leads] Unexpected error:', err)
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
    }
}
