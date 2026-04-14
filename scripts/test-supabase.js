const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function testConnection() {
  try {
    // Leer el archivo .env.local
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const lines = envFile.split('\n');
    let url = '';
    let key = '';

    lines.forEach(line => {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        url = line.replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim();
      }
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        key = line.replace('NEXT_PUBLIC_SUPABASE_ANON_KEY=', '').trim();
      }
    });

    if (!url || !key || url === 'tu_supabase_project_url_aqui') {
      console.log('ERROR: Las claves en .env.local no están configuradas correctamente o siguen siendo los placeholders.');
      process.exit(1);
    }

    console.log('Intentando conectar a:', url);
    const supabase = createClient(url, key);

    // Intentamos hacer una consulta básica.
    // Usamos una tabla que probablemente no exista para ver si el servidor responde correctamente con un error de PostgreSQL.
    const { data, error } = await supabase.from('test_ping').select('*').limit(1);

    if (error) {
      // El error 42P01 es "relation does not exist", lo cual significa que nos conectamos 
      // correctamente a la BD pero la tabla no está creada, lo cual es normal.
      if (error.code === '42P01') {
        console.log('¡CONEXIÓN EXITOSA! ✅ Comunicación con Supabase y PostgreSQL verificada correctamente.');
      } else {
        console.log('CONEXIÓN ESTABLECIDA ⚠️ Pero con otra respuesta: ', error.message);
      }
    } else {
      console.log('¡CONEXIÓN EXITOSA! ✅');
    }
  } catch (err) {
    console.error('ERROR AL CONECTAR ❌:', err.message);
  }
}

testConnection();
