// scripts/download-icons.js
import https from 'https';
import fs from 'fs';
import path from 'path';

const BASE = 'https://files.facepunch.com/rust/item/';

const ICONS = {
  torpedo:           'submarine.torpedo.straight_512.png',
  c4:                'explosive.timed_512.png',
  rocket:            'ammo.rocket.basic_512.png',
  satchel:           'explosive.satchel_512.png',
  explosive_ammo:    'ammo.rifle.explosive_512.png',
  cannon:            'cannon_512.png',
  incendiary_rocket: 'ammo.rocket.fire_512.png',
  fire_arrow:        'arrow.fire_512.png',
  chainsaw:          'chainsaw_512.png',
  salvaged_axe:      'axe.salvaged_512.png',
  hatchet:           'hatchet_512.png',
  stone_hatchet:     'stonehatchet_512.png',
  pickaxe:           'pickaxe_512.png',
};

const outDir = path.resolve('static/weapons');
fs.mkdirSync(outDir, { recursive: true });

const results = [];

function download(id, file) {
  return new Promise((resolve) => {
    const url = BASE + file;
    const dest = path.join(outDir, `${id}.png`);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        results.push(`FAIL ${id}: HTTP ${res.statusCode} — ${url}`);
        resolve();
        return;
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on('finish', () => {
        results.push(`OK   ${id}`);
        resolve();
      });
    }).on('error', (err) => {
      results.push(`FAIL ${id}: ${err.message}`);
      resolve();
    });
  });
}

Promise.all(Object.entries(ICONS).map(([id, file]) => download(id, file)))
  .then(() => {
    results.sort().forEach(r => console.log(r));
    const fails = results.filter(r => r.startsWith('FAIL'));
    if (fails.length > 0) {
      console.error(`\n${fails.length} failed.`);
      process.exit(1);
    }
  });
