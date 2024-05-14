import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import react from '@astrojs/react'
import storyblok from '@storyblok/astro'
import tailwind from '@astrojs/tailwind'
import mkcert from 'vite-plugin-mkcert'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    vue(),
    react(),
    storyblok({
      bridge: true,
      accessToken: 'OsvNv534kS2nivAAj1EPVgtt',
      apiOptions: {
        cache: {
          clear: 'auto',
          type: 'memory',
        },
      },
      enableFallbackComponent: true,
      components: {
        page: 'storyblok/Page',
        feature: 'storyblok/Feature',
        grid: 'storyblok/Grid',
        teaser: 'storyblok/Teaser',
        vue_counter: 'storyblok/VueCounter',
        svelte_counter: 'storyblok/SvelteCounter',
        react_counter: 'storyblok/ReactCounter',
        'new-component': 'storyblok/NewComponent',
        'featured-articles': 'storyblok/FeaturedArticles',
        article: 'storyblok/Article',
      },
    }),
    tailwind(),
  ],
  vite: {
    plugins: [mkcert()],
    server: {
      https: true,
    },
  },
  output: 'server',
  adapter: vercel(),
})
