<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import weapons from '$lib/weapons.json';

  let shipHP = 1000;
  let sortBy = 'hits';
  let filterCategory = 'All';

  const PRESETS = [
    { label: 'Rowboat (est.)', hp: 400 },
    { label: 'RHIB (est.)', hp: 500 },
    { label: 'Tugboat (est.)', hp: 2000 },
  ];

  const CATEGORIES = ['All', ...new Set(weapons.map(w => w.category))];

  $: filtered = weapons.filter(w => filterCategory === 'All' || w.category === filterCategory);

  $: withCalc = filtered.map(w => ({
    ...w,
    hitsNeeded: Math.ceil(shipHP / w.damage),
    totalSulfur: Math.ceil(shipHP / w.damage) * w.sulfur
  }));

  $: sorted = [...withCalc].sort((a, b) => {
    if (sortBy === 'hits') return a.hitsNeeded - b.hitsNeeded;
    if (sortBy === 'sulfur') return a.totalSulfur - b.totalSulfur;
    return 0;
  });

  $: if (browser) syncToURL(shipHP);

  function syncToURL(hp) {
    const url = new URL(window.location.href);
    url.searchParams.set('hp', hp);
    window.history.replaceState({}, '', url);
  }

  function loadFromURL() {
    if (!browser) return;
    const url = new URL(window.location.href);
    const hp = parseInt(url.searchParams.get('hp'));
    if (hp && !isNaN(hp)) shipHP = hp;
  }

  let copied = false;

  function copyShareURL() {
    navigator.clipboard.writeText(window.location.href);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  onMount(loadFromURL);
</script>

<main>
  <header>
    <div class="header-inner">
      <div class="title-group">
        <a class="back-link" href="/">← Back</a>
        <a href="/" class="logo-link"><h1>💥 BoomPlan</h1></a>
        <span class="subtitle">Calculator</span>
      </div>
      <a class="coffee-btn" href="https://buymeacoffee.com/mihkelgerih" target="_blank" rel="noopener">
        ☕ Buy me a coffee
      </a>
    </div>
  </header>

  <div class="container">

    <section class="hp-section">
      <label for="hp-input">Ship HP</label>
      <div class="hp-row">
        <input
          id="hp-input"
          type="number"
          min="1"
          bind:value={shipHP}
          placeholder="Enter ship HP..."
        />
        <div class="presets">
          {#each PRESETS as preset}
            <button class="preset-btn" on:click={() => (shipHP = preset.hp)}>
              {preset.label}
            </button>
          {/each}
        </div>
      </div>
      <p class="hp-note">⚠️ Presets are estimates. Enter actual HP for accurate results.</p>
    </section>

    <div class="controls">
      <div class="filter-group">
        {#each CATEGORIES as cat}
          <button
            class="filter-btn {filterCategory === cat ? 'active' : ''}"
            on:click={() => (filterCategory = cat)}
          >
            {cat}
          </button>
        {/each}
      </div>
      <div class="right-controls">
        <div class="sort-group">
          <span class="sort-label">Sort:</span>
          <button class="sort-btn {sortBy === 'hits' ? 'active' : ''}" on:click={() => (sortBy = 'hits')}>Hits</button>
          <button class="sort-btn {sortBy === 'sulfur' ? 'active' : ''}" on:click={() => (sortBy = 'sulfur')}>Sulfur</button>
        </div>
        <button class="share-btn" on:click={copyShareURL}>
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Category</th>
            <th>Dmg / Hit</th>
            <th>Hits to Sink</th>
            <th>Total Sulfur</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {#each sorted as w}
            <tr>
              <td class="weapon-name">
                <img
                  src="/weapons/{w.id}.png"
                  alt={w.name}
                  class="weapon-icon"
                  on:error={e => e.currentTarget.style.display = 'none'}
                />
                {w.name}
              </td>
              <td><span class="badge {w.category.toLowerCase()}">{w.category}</span></td>
              <td class="num">{w.damage}</td>
              <td class="num hits">{w.hitsNeeded}</td>
              <td class="num sulfur">{w.sulfur === 0 ? '—' : w.totalSulfur.toLocaleString()}</td>
              <td class="notes">{w.notes}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <footer>
      <p>Damage values are community-verified estimates. <strong>Always double-check in-game.</strong></p>
    </footer>
  </div>
</main>

<style>
  header {
    background: #1a1a1a;
    border-bottom: 2px solid #c2440a;
    padding: 1rem 1.5rem;
  }
  .header-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .title-group { display: flex; align-items: baseline; gap: 0.75rem; }
  .back-link { color: #666; font-size: 0.85rem; text-decoration: none; transition: color 0.15s; }
  .back-link:hover { color: #e8500a; }
  h1 { font-size: 1.5rem; color: #e8500a; font-weight: 700; }
  .logo-link { text-decoration: none; }
  .subtitle { color: #777; font-size: 0.85rem; }
  .coffee-btn {
    background: #c2440a;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.45rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .coffee-btn:hover { background: #e8500a; }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
  }

  .hp-section { margin-bottom: 1.5rem; }
  label { display: block; color: #aaa; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
  .hp-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  input[type="number"] {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 6px;
    color: #fff;
    font-size: 1.1rem;
    padding: 0.5rem 0.75rem;
    width: 160px;
    outline: none;
    transition: border-color 0.15s;
  }
  input[type="number"]:focus { border-color: #c2440a; }
  .presets { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .preset-btn {
    background: #252525;
    border: 1px solid #333;
    border-radius: 5px;
    color: #bbb;
    font-size: 0.78rem;
    padding: 0.4rem 0.7rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .preset-btn:hover { border-color: #c2440a; color: #e8500a; }
  .hp-note { font-size: 0.75rem; color: #555; margin-top: 0.5rem; }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .right-controls { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .filter-group, .sort-group { display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; }
  .filter-btn, .sort-btn {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    color: #888;
    font-size: 0.78rem;
    padding: 0.3rem 0.65rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn.active, .sort-btn.active { background: #2d1a10; border-color: #c2440a; color: #e8500a; }
  .filter-btn:hover:not(.active), .sort-btn:hover:not(.active) { border-color: #555; color: #ccc; }
  .sort-label { color: #555; font-size: 0.78rem; }
  .share-btn {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 6px;
    color: #999;
    font-size: 0.82rem;
    padding: 0.4rem 0.9rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .share-btn:hover { border-color: #c2440a; color: #e8500a; }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  thead tr { border-bottom: 1px solid #2a2a2a; }
  th {
    color: #666;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.6rem 0.75rem;
    text-align: left;
  }
  td { padding: 0.65rem 0.75rem; border-bottom: 1px solid #1e1e1e; }
  tr:hover td { background: #181818; }
  .weapon-name { font-weight: 500; color: #ddd; }
  .weapon-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    vertical-align: middle;
    margin-right: 0.5rem;
  }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .hits { color: #e8500a; font-weight: 700; font-size: 0.95rem; }
  .sulfur { color: #f0c040; }
  .notes { color: #555; font-size: 0.78rem; max-width: 200px; }

  .badge {
    display: inline-block;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .badge.submarine { background: #0a2a4a; color: #4ab0f0; }
  .badge.explosive  { background: #3a1a0a; color: #f07040; }
  .badge.incendiary { background: #2a1a00; color: #f0a020; }
  .badge.melee      { background: #1a2a1a; color: #60c060; }

  footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #1e1e1e; color: #444; font-size: 0.78rem; line-height: 1.7; }
</style>
