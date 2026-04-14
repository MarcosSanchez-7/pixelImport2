const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=')) {
    process.env.CLOUDINARY_CLOUD_NAME = line.split('=')[1].trim();
  }
  if (line.startsWith('CLOUDINARY_API_KEY=')) {
    process.env.CLOUDINARY_API_KEY = line.split('=')[1].trim();
  }
  if (line.startsWith('CLOUDINARY_API_SECRET=')) {
    process.env.CLOUDINARY_API_SECRET = line.split('=')[1].trim();
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  try {
    const res = await cloudinary.api.ping();
    console.log('¡CONEXIÓN EXITOSA A CLOUDINARY! ✅', res);
  } catch (error) {
    console.error('ERROR AL CONECTAR CON CLOUDINARY ❌:', error);
  }
}

testCloudinary();
