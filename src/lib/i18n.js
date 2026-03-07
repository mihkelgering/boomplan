// src/lib/i18n.js
import { writable, derived } from 'svelte/store';
import en from './translations/en.json';
import ru from './translations/ru.json';
import et from './translations/et.json';
import uk from './translations/uk.json';

const TRANSLATIONS = { en, ru, et, uk };
const LOCALES = ['en', 'ru', 'et', 'uk'];

export const lang = writable('en');

function get(obj, path) {
  return path.split('.').reduce((acc, k) => acc?.[k], obj);
}

export const t = derived(lang, ($lang) => {
  const dict = TRANSLATIONS[$lang] || TRANSLATIONS.en;
  return (key) => {
    const val = get(dict, key) ?? get(TRANSLATIONS.en, key);
    return typeof val === 'string' ? val : key;
  };
});

export function setLang(locale) {
  if (!LOCALES.includes(locale)) return;
  lang.set(locale);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('boomplan_lang', locale);
  }
}

export function initLang() {
  if (typeof localStorage === 'undefined') return;
  const saved = localStorage.getItem('boomplan_lang');
  if (saved && LOCALES.includes(saved)) lang.set(saved);
}
