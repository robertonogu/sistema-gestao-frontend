const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

let content = fs.readFileSync(envPath, 'utf8');
content = content.replace(/googleMapsApiKey: '.*?'/, `googleMapsApiKey: '${apiKey}'`);
fs.writeFileSync(envPath, content);

console.log(`environment.prod.ts: googleMapsApiKey ${apiKey ? 'set from GOOGLE_MAPS_API_KEY' : 'left empty (GOOGLE_MAPS_API_KEY not set)'}`);
