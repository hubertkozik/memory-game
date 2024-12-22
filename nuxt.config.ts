// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        baseURL: process.env.NUXT_PUBLIC_BASE_URL || '',
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Memory Game',
            meta: [
                // Basic SEO
                { name: 'description', content: 'Challenge your memory with our fun and engaging memory card matching game. Perfect for all ages to improve concentration and cognitive skills.' },
                { name: 'keywords', content: 'memory game, card matching, brain training, concentration game, cognitive skills' },
                { name: 'author', content: 'Hubert Kozik' },
                { name: 'robots', content: 'index, follow' },
                { name: 'language', content: 'Polish' },
            ],
            link: [{ rel: 'icon', type: 'image/ico', href: `${process.env.NUXT_PUBLIC_BASE_URL || ''}/favicon.ico` }]
        }
    },
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    css: [
        '@/assets/css/main.css',
    ],
    modules: [
        '@nuxt/fonts',
    ],
    ssr: process.env.GH_ACTIONS ? false : true,
    runtimeConfig: {
        public: {
            baseUrl: ''
        }
    },
})
