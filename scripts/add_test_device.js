// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClient } = require('@supabase/supabase-js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestDevice() {
    // 1. Get the first user (likely the one testing)
    const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
    if (userErr || users.users.length === 0) {
        console.error('Error fetching users:', userErr);
        return;
    }
    const testUser = users.users[0];
    console.log(`Using user: ${testUser.email} (${testUser.id})`);

    // 2. Insert a dummy device for this user
    // We will use a public test stream or a dummy IP since we don't have a real IP yet.
    // For now, let's just insert the record so the UI renders it.
    const { data: device, error: insertErr } = await supabase
        .from('client_devices')
        .insert([
            {
                user_id: testUser.id,
                camera_name: 'Cámara Demo Externa',
                device_type: 'PTZ Hikvision',
                url_or_ip: 'admin:password@192.168.1.100', // We'll put something dummy
                port_http: 80,
                username: 'admin',
                password_enc: 'dummy_pass_1234',
                channel_id: 101,
            }
        ])
        .select()
        .single();

    if (insertErr) {
        console.error('Error inserting device:', insertErr);
    } else {
        console.log('Dummy device inserted successfully:', device.id);
    }
}

addTestDevice();
