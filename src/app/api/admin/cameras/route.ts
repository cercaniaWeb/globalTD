import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Usamos Service Role Key para operaciones de inserción/borrado que requieran bypassing RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
    return profile?.role === 'admin';
}

export async function GET() {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return all profiles so the admin can select a client
    const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return also all currently registered devices
    const { data: devices } = await supabaseAdmin
        .from('client_devices')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });

    return NextResponse.json({ profiles, devices: devices || [] });
}

export async function POST(request: Request) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        
        const { data, error } = await supabaseAdmin
            .from('client_devices')
            .insert([{
                user_id: body.user_id,
                camera_name: body.camera_name,
                device_type: body.device_type,
                url_or_ip: body.url_or_ip,
                port_http: parseInt(body.port_http) || 80,
                port_rtsp: parseInt(body.port_rtsp) || 554,
                username: body.username,
                password_enc: body.password_enc,
                channel_id: parseInt(body.channel_id) || 101,
            }])
            .select('*')
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 });

        const { error } = await supabaseAdmin
            .from('client_devices')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
