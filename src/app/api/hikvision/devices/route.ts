import { NextResponse } from 'next/server';
import { getHikvisionDevices } from '@/lib/hikvision';

export async function GET() {
    console.log('GET /api/hikvision/devices called');
    try {
        const devices = await getHikvisionDevices();
        console.log(`Successfully fetched ${devices.length} devices`);
        return NextResponse.json({ devices });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Error in /api/hikvision/devices:', err);
        return NextResponse.json({ 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}
