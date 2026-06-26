// @ts-check
import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { loadBlogConfig } from './src/lib/blog-config.ts'

const blogConfig = loadBlogConfig()

// https://astro.build/config
export default defineConfig({
  site: blogConfig.stellux.url,
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        rehypeHighlight,
        rehypeKatex,
      ],
    }),
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 700,
    },
  },
})
