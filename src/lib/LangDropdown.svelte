<script>
  import { lang, setLang } from '$lib/i18n.js';

  const LANGS = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' },
    { code: 'et', flag: '🇪🇪', label: 'Eesti' },
    { code: 'uk', flag: '🇺🇦', label: 'Українська' },
  ];

  let open = false;

  function toggle() { open = !open; }

  function select(code) {
    setLang(code);
    open = false;
  }

  function handleWindowClick() { open = false; }

  function handleKeydown(e) {
    if (e.key === 'Escape' && open) open = false;
  }

  $: current = LANGS.find(l => l.code === $lang) || LANGS[0];
</script>

<svelte:window on:click={handleWindowClick} on:keydown={handleKeydown} />

<div class="lang-dropdown" on:click|stopPropagation>
  <button class="lang-trigger" on:click={toggle} aria-haspopup="listbox" aria-expanded={open} aria-label="Select language: {current.label}">
    {current.flag} {current.code.toUpperCase()} {open ? '▲' : '▼'}
  </button>
  {#if open}
    <div class="lang-panel" role="listbox">
      {#each LANGS as l (l.code)}
        <button
          class="lang-option {l.code === $lang ? 'active' : ''}"
          role="option"
          aria-selected={l.code === $lang}
          on:click={() => select(l.code)}
        >
          {l.flag} {l.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .lang-dropdown { position: relative; }
  .lang-trigger {
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    color: #aaa;
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .lang-trigger:hover { border-color: #555; color: #ccc; }
  .lang-panel {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    min-width: 150px;
    z-index: 100;
    overflow: hidden;
  }
  .lang-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.4rem 0.75rem;
    background: none;
    border: none;
    color: #aaa;
    font-size: 0.85rem;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }
  .lang-option:hover { background: #2a2a2a; color: #ccc; }
  .lang-option.active { color: #e8500a; background: #2d1a10; }
</style>
