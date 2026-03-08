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
  cannon:            'https://wiki.rustclash.com/img/items180/cannonball.png',
  incendiary_rocket: 'ammo.rocket.fire_512.png',
  fire_arrow:        'arrow.fire_512.png',
  chainsaw:          'chainsaw_512.png',
  salvaged_axe:      'axe.salvaged_512.png',
  hatchet:           'hatchet_512.png',
  stone_hatchet:     'stonehatchet_512.png',
  pickaxe:           'pickaxe_512.png',
  // New melee weapons
  rock:              'rock_512.png',
  bone_club:         'bone.club_512.png',
  bone_knife:        'knife.bone_512.png',
  hunting_knife:     'knife.butcher_512.png',
  combat_knife:      'knife.combat_512.png',
  wooden_spear:      'spear.wooden_512.png',
  stone_spear:       'spear.stone_512.png',
  machete:           'machete_512.png',
  mace:              'mace_512.png',
  salvaged_cleaver:  'salvaged.cleaver_512.png',
  salvaged_sword:    'salvaged.sword_512.png',
  longsword:         'longsword_512.png',
  salvaged_hammer:   'hammer.salvaged_512.png',
};

const outDir = path.resolve('static/weapons');
fs.mkdirSync(outDir, { recursive: true });

const results = [];

function download(id, file) {
  return new Promise((resolve) => {
    const url = file.startsWith('http') ? file : BASE + file;
    const dest = path.join(outDir, `${id}.png`);
    if (fs.existsSync(dest)) {
      results.push(`SKIP ${id}: already exists`);
      resolve();
      return;
    }
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
