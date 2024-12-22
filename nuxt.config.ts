// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
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
            ]
        }
    },
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    css: [
        '@/assets/css/main.css',
    ],
    modules: [
        '@nuxt/fonts',
    ]
})