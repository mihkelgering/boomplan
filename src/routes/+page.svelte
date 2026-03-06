<main>
  <header>
    <div class="header-inner">
      <div class="title-group">
        <h1>💥 BoomPlan</h1>
        <span class="subtitle">Rust Raid Calculator</span>
      </div>
      <a class="coffee-btn" href="https://buymeacoffee.com/mihkelgerih" target="_blank" rel="noopener">
        ☕ Buy me a coffee
      </a>
    </div>
  </header>

  <div class="container">
    <p class="intro">Plan your Rust raid. Enter your target's HP and find the cheapest way to destroy it.</p>

    <div class="cards">
      <div class="card">
        <h2>Calculator</h2>
        <p>Enter ship HP and see every weapon's damage per hit, hits needed, and total sulfur cost. Good for quick lookups.</p>
        <a class="card-btn" href="/calculator">Open Calculator →</a>
      </div>
      <div class="card">
        <h2>Planner</h2>
        <p>Pick weapons and quantities to build a raid plan. Shows total damage, HP remaining, and suggests the cheapest weapons to cover any gap.</p>
        <a class="card-btn" href="/planner">Open Planner →</a>
      </div>
    </div>
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
  h1 { font-size: 1.5rem; color: #e8500a; font-weight: 700; }
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
    padding: 3rem 1rem;
  }

  .intro {
    color: #888;
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  @media (max-width: 600px) { .cards { grid-template-columns: 1fr; } }

  .card {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .card h2 { font-size: 1.2rem; color: #e8500a; font-weight: 700; }
  .card p { color: #888; font-size: 0.88rem; line-height: 1.6; flex: 1; }
  .card-btn {
    display: inline-block;
    margin-top: 0.5rem;
    background: #c2440a;
    color: #fff;
    border-radius: 6px;
    padding: 0.55rem 1.2rem;
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s;
    align-self: flex-start;
  }
  .card-btn:hover { background: #e8500a; }
</style>
