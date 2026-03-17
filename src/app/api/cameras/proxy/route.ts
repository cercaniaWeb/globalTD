import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import DigestFetch from 'digest-fetch';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cameraId = searchParams.get('id');

    if (!cameraId) {
        return NextResponse.json({ error: 'Missing camera id' }, { status: 400 });
    }

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

    // 1. Verify Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Camera Credentials securely from Backend (RLS ensures user owns the camera)
    const { data: camera, error } = await supabase
        .from('client_devices')
        .select('*')
        .eq('id', cameraId)
        .eq('user_id', user.id) // Final safety check
        .single();

    if (error || !camera) {
        return NextResponse.json({ error: 'Camera not found or access denied' }, { status: 404 });
    }

    if (!camera.is_active) {
        return NextResponse.json({ error: 'Device is offline' }, { status: 403 });
    }

    // 3. Make digest request to ISAPI
    try {
        // Initialize Digest Fetch Client
        const client = new DigestFetch(camera.username, camera.password_enc);
        
        // Remove any credentials that might be in url_or_ip since
        // the new URL parser throws an error on URLs like http://admin:pass@host
        // We already pass credentials directly into DigestFetch.
        let safeHost = camera.url_or_ip;
        if (safeHost.includes('@')) {
            safeHost = safeHost.split('@')[1];
        }

        const isapiUrl = `http://${safeHost}:${camera.port_http}/ISAPI/Streaming/channels/${camera.channel_id}/picture`;
        
        // Timeout to avoid hanging requests if the client's modem is unreachable
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const isapiResponse = await client.fetch(isapiUrl, {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!isapiResponse.ok) {
            console.error(`ISAPI error: ${isapiResponse.status} from ${camera.url_or_ip}`);
            // Return 502 Bad Gateway to the dashboard, indicating the camera modem is unreachable or erroring
            return NextResponse.json({ error: `ISAPI Error: ${isapiResponse.statusText}` }, { status: 502 });
        }

        // Return the RAW image stream to the client browser!
        const imageBuffer = await isapiResponse.arrayBuffer();
        
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-store, max-age=0', // Prevent Safari/Chrome from caching snapshots
            },
        });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Proxy Error:', message);
        return NextResponse.json({ error: 'Failed to contact camera remotely', details: message }, { status: 502 });
    }
}
