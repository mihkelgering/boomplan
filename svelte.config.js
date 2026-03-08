import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),
    prerender: {
      entries: ['*']
    },
    paths: {
      base: '/boomplan'
    }
  }
};

export default config;
