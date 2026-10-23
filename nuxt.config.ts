import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'
import nuxtConfigScripts from './build/nuxt.config.script/index'
import { chunkSplitPlugin } from './build/vite-plugin-chunk-split'
import type { NuxtConfig } from 'nuxt/schema'

// 创建一个过滤 Vite 警告的插件
function suppressWarningsPlugin(): NonNullable<NonNullable<NuxtConfig['vite']>['plugins']>[number] {
    return {
        name: 'suppress-warnings',
        enforce: 'post' as const,
        configResolved(config) {
            const originalWarn = config.logger.warn
            config.logger.warn = (msg, options?) => {
                // 过滤 @tailwindcss/vite 的 sourcemap 警告
                if (
                    typeof msg === 'string'
                    && msg.includes('@tailwindcss/vite:generate:build')
                    && msg.includes('Sourcemap')
                ) {
                    return
                }
                originalWarn(msg, options)
            }
        },
    }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'shadcn-nuxt',
        '@nuxtjs/i18n',
        '@vueuse/motion/nuxt',
        '@nuxt/eslint',
        '@nuxt/icon',
        '@nuxtjs/color-mode',
        '@nuxtjs/mdc',
        '@nuxtjs/robots',
        '@nuxtjs/sitemap',
        '@nuxt/image',
        'nuxt-jsonld',
        '~/modules/lottie-preloader/module',
        '~/modules/i18n-dynamic-imports/module',
    ],
    // plugins: [
    //     {
    //         src: '~/plugins/sensor.ts',
    //         mode: 'client',
    //     },
    // ],
    ssr: true,
    components: [
        {
            path: '~/components/common',
            prefix: 'Cs',
        },
        {
            path: '~/components/ui',
        },
        {
            path: '~/components/business',
            prefix: 'Bus',
        },
        {
            path: '~/components/prose',
            prefix: 'Md',
            global: true, // 推荐加 global: true，确保全局注册
        },
    ],
    imports: {
        dirs: ['composables', 'stores'],
    },
    app: {
        head: {
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
                },
                {
                    name: 'description',
                    content: 'ImaStudio is ai tool for you to create your own content',
                },
                {
                    property: 'og:title',
                    content: 'ImaStudio',
                },
                {
                    property: 'og:description',
                    content: 'ImaStudio is ai tool for you to create your own content',
                },
            ],
            link: [{ rel: 'icon', href: '/favicon.ico' }],
            title: 'ImaStudio',
            script: nuxtConfigScripts,
        },
    },

    css: ['~/assets/tailwind.css'],
    site: {
        // 根据环境变量控制是否允许索引
        // 测试环境禁用索引，生产环境允许索引
        indexable: import.meta.env.VITE_APP_ENV === 'prod',
        url: 'https://www.imastudio.com',
        name: 'ImaStudio',
        defaultLocale: 'en',
    },
    colorMode: {
        preference: 'light',
        fallback: 'light',
        classSuffix: '',
        storageKey: 'nuxt-theme-mode',
    },
    mdc: {
        highlight: {
            theme: {
                light: 'vitesse-light',
                dark: 'vitesse-dark',
            },
        },
        headings: {
            anchorLinks: false,
        },
        components: {
            map: {
                pre: 'MdProsePre',
                a: 'MdProseA',
            },
        },
    },
    runtimeConfig: {
        public: {
            appAlias: import.meta.env.VITE_APP_ALIAS,
            appNodeEnv: import.meta.env.VITE_APP_NODE_ENV,
            appEnv: import.meta.env.VITE_APP_ENV || 'test',
            appApiUrl: import.meta.env.VITE_APP_API_URL,
            // motion: {
            //     directives: {
            //         'fade-in-up': {
            //             initial: {
            //                 y: 20,
            //                 opacity: 0,
            //             },
            //             enter: {
            //                 y: 0,
            //                 opacity: 1,
            //                 transition: {
            //                     duration: 500,
            //                     ease: [0.1, 0.8, 0.4, 1],
            //                 },
            //             },
            //         },
            //     },
            // },
        },
    },
    ignore: ['.eslintcache'],
    build: {
        transpile: ['jsencrypt'],
    },
    sourcemap: import.meta.env.VITE_APP_ENV === 'test',
    devServer: {
        host: '0.0.0.0',
        port: 3000, // 如需自定义端口可取消注释
    },
    experimental: {
        asyncContext: true,
    },
    compatibilityDate: '2024-11-01',
    nitro: {
        // routeRules: {
        //     // blog by 产品 王宏伟
        //     '/blog/**': {
        //         proxy: 'https://blog.imastudio.com/**',
        //     },
        // },
    },
    vite: {
        plugins: [tailwindcss(), suppressWarningsPlugin(), chunkSplitPlugin()],
        build: {
            cssTarget: 'chrome61', // 指定旧版浏览器以避免使用#RGBA格式
            target: ['es2016', 'chrome58', 'safari11'], // 降级到ES2016以兼容iOS 15.6的正则表达式特性
            rollupOptions: {
                onwarn(warning, warn) {
                    // 忽略 @tailwindcss/vite 的 sourcemap 警告
                    if (warning.code === 'SOURCEMAP_ERROR' && warning.plugin === '@tailwindcss/vite:generate:build') {
                        return
                    }
                    // 忽略 lottie-web 的 eval 警告
                    if (warning.code === 'EVAL' && warning.id?.includes('lottie-web')) {
                        return
                    }
                    warn(warning)
                },
                output: {
                    // manualChunks 已迁移到 build/chunk-split.config.ts
                    // 通过 chunkSplitPlugin 统一管理
                },
            },
        },

        // 解决 出现在 Vite 的 dev 模式的formdata错误，因为 vite-node 是用 native ESM + dynamic import 实时运行源码，不像 build 模式那样打包重写依赖。
        resolve: {
            alias: {
                'form-data/lib/browser': 'form-data/lib/form_data.js',
            },
        },
        // 强制 Vite 不外部化指定模块，而是走 Vite 内部解析（包括 alias）：
        ssr: {
            noExternal: ['form-data'],
        },
    },
    eslint: {
        checker: true,
        config: {
            stylistic: true,
        },
    },
    i18n: {
        locales: [
            { code: 'en', name: 'English', language: 'en-US', files: ['en/common.json'] },
            { code: 'zh', name: '简体中文', language: 'zh-CN', files: ['zh/common.json'] },
        ],
        defaultLocale: 'en',
        lazy: true,
        langDir: 'locales/',
        baseUrl: 'https://www.imastudio.com', // 必需：用于生成完整的 alternate URLs
        bundle: {
            optimizeTranslationDirective: false,
        },
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root', // recommended
        },
    },
    icon: {
        customCollections: [
            {
                prefix: 'cs-icon',
                dir: './assets/cs-icons',
            },
        ],
        serverBundle: {
            collections: ['uil', 'mdi'],
            // 外部化图标JSON数据，显著加速构建（30-50%）
            // 注意：需要 Node.js 22+ 或支持 JSON 模块导入的环境
            externalizeIconsJson: true,
        },
        clientBundle: {
            // 自动扫描并预加载组件中使用的图标
            scan: true,
            // 将所有自定义图标集合包含在客户端bundle中，新增图标无需重启
            includeCustomCollections: true,
            sizeLimitKb: 500,
        },
    },
    lottie: {
        cachePaths: [
            '/assets/lottie/logo-small.json',
            '/assets/lottie/logo-small-v2.json',
            '/assets/lottie/full-loading.json',
            '/assets/lottie/msg-thinking.json',
            '/assets/lottie/msg-end.json',
            '/assets/lottie/msg-failed.json',
            '/assets/lottie/home-director.json',
            '/assets/lottie/home-copywriter.json',
            '/assets/lottie/home-designer.json',
            '/assets/lottie/home-flow.json',
            '/assets/lottie/img-loading.json',
        ],
    },
    motion: {
        directives: {
            'fade-in-up': {
                initial: {
                    y: 20,
                    opacity: 0,
                },
                enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                        duration: 500,
                        ease: [0.1, 0.8, 0.4, 1],
                    },
                },
            },
        },
    },
    piniaPluginPersistedstate: {
        storage: 'localStorage',
    },
    robots: {
        allow: ['/', '/**'],
        disallow: ['/demo/**', '/auth-page/**', '/simple-login-test/**'],
        sitemap: ['/sitemap.xml'],
    },
    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
    sitemap: {
        urls: [
            { loc: '/protocol/terms.html', lastmod: new Date().toISOString() },
            { loc: '/protocol/privacy.html', lastmod: new Date().toISOString() },
            { loc: '/news/ima-studio-intelligent-media-agent-studio/', lastmod: new Date().toISOString() },
            { loc: '/news/ima-studio-intelligent-media-agent-studio/index.html', lastmod: new Date().toISOString() },
        ],
        autoLastmod: true,
    },
})
