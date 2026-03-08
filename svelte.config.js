import adapter from '@sveltejs/adapter-static';

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
        },
        trailingSlash: 'always'
    }
};

export default config;
