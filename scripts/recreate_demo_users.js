import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE URL or SERVICE KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDemoUsers() {
  const usersToCreate = [
    { email: 'admin@globaltelecomunicaciones.mx', password: 'password123', name: 'Admin Global', role: 'admin' },
    { email: 'cliente@globaltelecomunicaciones.mx', password: 'password123', name: 'Cliente VIP', role: 'client' },
    { email: 'tech@globaltelecomunicaciones.mx', password: 'password123', name: 'Ingeniero Instalador', role: 'tech' }
  ];

  for (const user of usersToCreate) {
    console.log(`Setting up ${user.email}...`);
    
    // Create the user in auth system using admin api
    let authUserResult = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    });

    let userId = authUserResult.data?.user?.id;

    if (authUserResult.error) {
      if (authUserResult.error.message.includes('already exists')) {
        console.log(`User ${user.email} already exists. Trying to get ID...`);
        // User exists, try listing
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users?.find(u => u.email === user.email);
        if (existingUser) {
          userId = existingUser.id;
          // Update password just in case it was changed
          await supabase.auth.admin.updateUserById(userId, { password: user.password });
        }
      } else {
        console.error("Auth creation error:", authUserResult.error);
        continue;
      }
    }

    if (!userId) {
      console.log('Could not determine User ID for', user.email);
      continue;
    }

    // Upsert the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: user.email,
        full_name: user.name,
        role: user.role
      });

    if (profileError) {
      console.error(`Error upserting profile for ${user.email}:`, profileError);
    } else {
      console.log(`Successfully configured ${user.email}`);
    }
  }

  console.log("Demo users setup complete.");
  process.exit(0);
}

setupDemoUsers();
