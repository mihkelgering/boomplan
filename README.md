# BoomPlan

Rust raid calculator for ships, buildings, walls and more. Plan your raid, know your cost.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at vercel.com — it auto-detects SvelteKit.

## Updating weapon data

All weapon data is in `src/lib/weapons.json`. Each entry:

```json
{
  "id": "unique_id",
  "name": "Display Name",
  "category": "Explosive | Melee | Submarine | Incendiary",
  "damage": 350,
  "sulfur": 2200,
  "notes": "Optional note shown in table."
}
```

Set `"sulfur": 0` for weapons with no sulfur cost (melee, etc).

## Buy Me a Coffee

Update the link in `src/routes/+page.svelte`:

```html
<a class="coffee-btn" href="https://buymeacoffee.com/YOUR_USERNAME" ...>
```

## Features

- Default mode: enter ship HP → see all weapons with hits needed + sulfur cost
- Planning mode: pick weapons + quantities → see HP remaining and shortfall suggestions
- Category filters, sort by hits or sulfur cost
- Ship HP presets (update estimates as you verify in-game)
- Shareable URL — full calculator state encoded in URL params
