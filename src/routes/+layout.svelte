<script>
  import { browser } from '$app/environment';
  import { lang } from '$lib/i18n.js';
  $: if (browser) document.documentElement.lang = $lang;
</script>

<slot />

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    background: #111;
    color: #e2e2e2;
    font-family: 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
  }
</style>
