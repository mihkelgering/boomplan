import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';
const isNetlify = process.env.NETLIFY;

const config = {
    kit: {
        adapter: adapter({
            fallback: '404.html'
        }),
        prerender: {
            entries: ['*']
        },
        paths: {
            base: isNetlify ? '' : '/boomplan'
        }
    }
};

export default config;
