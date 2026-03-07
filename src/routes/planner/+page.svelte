<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import weapons from '$lib/weapons.json';

  let shipHP = 1000;
  let filterCategory = 'All';
  let planning = Object.fromEntries(weapons.map(w => [w.id, 0]));

  const PRESETS = [
    { label: 'Rowboat (est.)', hp: 400 },
    { label: 'RHIB (est.)', hp: 500 },
    { label: 'Tugboat (est.)', hp: 2000 },
  ];

  const CATEGORIES = ['All', ...new Set(weapons.map(w => w.category))];

  $: planningDamage = weapons.reduce((sum, w) => sum + (planning[w.id] || 0) * w.damage, 0);
  $: planningHPLeft = Math.max(0, shipHP - planningDamage);
  $: planningTotalSulfur = weapons.reduce((sum, w) => sum + (planning[w.id] || 0) * w.sulfur, 0);
  $: planningWeaponsUsed = weapons.filter(w => planning[w.id] > 0);
  $: planningFiltered = weapons.filter(w => filterCategory === 'All' || w.category === filterCategory);

  $: if (browser) syncToURL(shipHP, planning);

  function syncToURL(hp, p) {
    const url = new URL(window.location.href);
    url.searchParams.set('hp', hp);
    const picks = Object.entries(p)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    if (picks) url.searchParams.set('picks', picks);
    else url.searchParams.delete('picks');
    window.history.replaceState({}, '', url);
  }

  function loadFromURL() {
    if (!browser) return;
    const url = new URL(window.location.href);
    const hp = parseInt(url.searchParams.get('hp'));
    const picks = url.searchParams.get('picks');
    if (hp && !isNaN(hp)) shipHP = hp;
    if (picks) {
      picks.split(',').forEach(pair => {
        const [id, qty] = pair.split(':');
        if (id in planning) planning[id] = parseInt(qty) || 0;
      });
    }
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
        <span class="subtitle">Planner</span>
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
      <button class="share-btn" on:click={copyShareURL}>
        {copied ? '✓ Copied!' : '🔗 Share'}
      </button>
    </div>

    <div class="planning-layout">
      <div class="planning-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Weapon</th>
              <th>Category</th>
              <th>Dmg / Hit</th>
              <th>Quantity</th>
              <th>Total Dmg</th>
            </tr>
          </thead>
          <tbody>
            {#each planningFiltered as w}
              <tr class={planning[w.id] > 0 ? 'selected-row' : ''}>
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
                <td class="qty-cell">
                  <button class="qty-btn" on:click={() => planning[w.id] = Math.max(0, (planning[w.id] || 0) - 1)}>−</button>
                  <input
                    class="qty-input"
                    type="number"
                    min="0"
                    bind:value={planning[w.id]}
                  />
                  <button class="qty-btn" on:click={() => planning[w.id] = (planning[w.id] || 0) + 1}>+</button>
                </td>
                <td class="num {planning[w.id] > 0 ? 'dmg-positive' : ''}">
                  {planning[w.id] > 0 ? (planning[w.id] * w.damage).toLocaleString() : '—'}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="result-panel">
        <h2>Result</h2>

        {#if planningWeaponsUsed.length === 0}
          <p class="result-empty">Add weapons to see the result.</p>
        {:else}
          <div class="result-stats">
            <div class="stat">
              <span class="stat-label">Ship HP</span>
              <span class="stat-value">{shipHP.toLocaleString()}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Damage</span>
              <span class="stat-value dmg">{planningDamage.toLocaleString()}</span>
            </div>
            <div class="stat">
              <span class="stat-label">HP Remaining</span>
              <span class="stat-value {planningHPLeft === 0 ? 'sunk' : 'remaining'}">
                {planningHPLeft === 0 ? '💀 SUNK' : planningHPLeft.toLocaleString()}
              </span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Sulfur</span>
              <span class="stat-value">{planningTotalSulfur.toLocaleString()}</span>
            </div>
          </div>

          <div class="hp-bar-wrap">
            <div class="hp-bar">
              <div
                class="hp-bar-fill {planningHPLeft === 0 ? 'full-dmg' : ''}"
                style="width: {Math.min(100, (planningDamage / shipHP) * 100)}%"
              ></div>
            </div>
            <div class="hp-bar-labels">
              <span>0</span>
              <span>{shipHP.toLocaleString()}</span>
            </div>
          </div>

          {#if planningHPLeft > 0}
            <div class="shortfall">
              <p>Still need <strong>{planningHPLeft.toLocaleString()} more damage</strong> to sink.</p>
              <p class="shortfall-hint">Cheapest options to cover the gap:</p>
              <ul>
                {#each [...weapons].sort((a, b) => {
                  const costA = a.sulfur > 0 ? (Math.ceil(planningHPLeft / a.damage) * a.sulfur) : Infinity;
                  const costB = b.sulfur > 0 ? (Math.ceil(planningHPLeft / b.damage) * b.sulfur) : Infinity;
                  return costA - costB;
                }).slice(0, 3) as w}
                  <li>
                    <span class="w-name">{w.name}</span>
                    — {Math.ceil(planningHPLeft / w.damage)} more
                    {w.sulfur > 0 ? `(${(Math.ceil(planningHPLeft / w.damage) * w.sulfur).toLocaleString()} sulfur)` : '(no sulfur cost)'}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <div class="weapons-used">
            <h3>Weapons in plan</h3>
            {#each planningWeaponsUsed as w}
              <div class="used-row">
                <span>{w.name}</span>
                <span class="used-qty">×{planning[w.id]}</span>
              </div>
            {/each}
          </div>
        {/if}

        <button class="reset-btn" on:click={() => {
          planning = Object.fromEntries(weapons.map(w => [w.id, 0]));
        }}>Reset Plan</button>
      </div>
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
  .filter-group { display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; }
  .filter-btn {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    color: #888;
    font-size: 0.78rem;
    padding: 0.3rem 0.65rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn.active { background: #2d1a10; border-color: #c2440a; color: #e8500a; }
  .filter-btn:hover:not(.active) { border-color: #555; color: #ccc; }
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

  .planning-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; align-items: start; }
  @media (max-width: 780px) { .planning-layout { grid-template-columns: 1fr; } }

  .planning-table-wrap { overflow-x: auto; }
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
  .selected-row td { background: #1a1206; }
  .weapon-name { font-weight: 500; color: #ddd; }
  .weapon-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    vertical-align: middle;
    margin-right: 0.5rem;
  }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .qty-cell { display: flex; align-items: center; gap: 0.3rem; }
  .qty-btn {
    background: #252525;
    border: 1px solid #333;
    border-radius: 4px;
    color: #ccc;
    font-size: 1rem;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
  }
  .qty-btn:hover { border-color: #c2440a; color: #e8500a; }
  .qty-input {
    width: 52px;
    text-align: center;
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.25rem 0.3rem;
  }
  .dmg-positive { color: #e8500a; font-weight: 700; }

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

  .result-panel {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 1.25rem;
    position: sticky;
    top: 1rem;
  }
  .result-panel h2 { font-size: 1rem; color: #aaa; margin-bottom: 1rem; }
  .result-empty { color: #444; font-size: 0.85rem; }
  .result-stats { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
  .stat { display: flex; justify-content: space-between; align-items: baseline; }
  .stat-label { color: #666; font-size: 0.8rem; }
  .stat-value { font-weight: 700; font-size: 1rem; }
  .stat-value.dmg { color: #e8500a; }
  .stat-value.sunk { color: #4caf50; }
  .stat-value.remaining { color: #f0c040; }

  .hp-bar-wrap { margin-bottom: 1rem; }
  .hp-bar { height: 10px; background: #2a2a2a; border-radius: 99px; overflow: hidden; margin-bottom: 0.25rem; }
  .hp-bar-fill { height: 100%; background: #c2440a; border-radius: 99px; transition: width 0.2s; }
  .hp-bar-fill.full-dmg { background: #4caf50; }
  .hp-bar-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: #444; }

  .shortfall { background: #1e1206; border: 1px solid #3a2010; border-radius: 6px; padding: 0.75rem; margin-bottom: 1rem; font-size: 0.82rem; }
  .shortfall p { color: #bbb; margin-bottom: 0.4rem; }
  .shortfall-hint { color: #888; font-size: 0.78rem; }
  .shortfall ul { list-style: none; margin-top: 0.4rem; display: flex; flex-direction: column; gap: 0.3rem; }
  .shortfall li { color: #aaa; }
  .w-name { color: #e8500a; font-weight: 600; }

  .weapons-used { margin-bottom: 1rem; }
  .weapons-used h3 { font-size: 0.78rem; color: #555; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem; }
  .used-row { display: flex; justify-content: space-between; font-size: 0.83rem; color: #aaa; padding: 0.2rem 0; border-bottom: 1px solid #1e1e1e; }
  .used-qty { color: #e8500a; font-weight: 700; }

  .reset-btn {
    width: 100%;
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 6px;
    color: #888;
    font-size: 0.82rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .reset-btn:hover { border-color: #c2440a; color: #e8500a; }

  footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #1e1e1e; color: #444; font-size: 0.78rem; line-height: 1.7; }
</style>
