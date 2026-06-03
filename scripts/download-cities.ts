import { promises as fs } from 'fs';
import path from 'path';

const CSV_URL = 'https://raw.githubusercontent.com/datasets/world-cities/master/data/world-cities.csv';
const OUTPUT_DIR = path.join(__dirname, '../lib/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cities.json');

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function run() {
  console.log('Fetching world cities CSV...');
  const res = await fetch(CSV_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.statusText}`);
  }
  const text = await res.text();
  const lines = text.split('\n');

  console.log(`Parsing ${lines.length} lines...`);
  const cities: Array<{ n: string; c: string; s: string }> = [];

  // Skip header line (name,country,subcountry,geonameid)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = parseCSVLine(line);
    if (parts.length >= 3) {
      const name = parts[0];
      const country = parts[1];
      const subcountry = parts[2];
      
      // Clean quotes if present
      const cleanName = name.replace(/^"|"$/g, '').trim();
      const cleanCountry = country.replace(/^"|"$/g, '').trim();
      const cleanSubcountry = subcountry.replace(/^"|"$/g, '').trim();
      
      if (cleanName && cleanCountry) {
        cities.push({
          n: cleanName,
          c: cleanCountry,
          s: cleanSubcountry
        });
      }
    }
  }

  console.log(`Found ${cities.length} cities. Writing to ${OUTPUT_FILE}...`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(cities), 'utf-8');
  console.log('Cities database generated successfully!');
}

run().catch(err => {
  console.error('Error generating cities database:', err);
  process.exit(1);
});
