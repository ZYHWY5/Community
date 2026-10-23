/**
 * Chunk 分离配置
 * 用于指定哪些组件/目录/库需要独立打包为 chunkSplitConfig
*/
export interface ChunkSplitRule {
    /** Chunk 名称（会生成 chunk-{name}.[hash].js） */
    name: string

    /** 匹配规则（支持字符串、正则或函数） */
    test: string | RegExp | ((id: string) => boolean)

    /** 优先级（数字越大优先级越高，默认 0） */
    priority?: number

    /** 是否启用（默认 true） */
    enabled?: boolean

    /** 描述（可选，用于文档） */
    description?: string
}

export const chunkSplitConfig: ChunkSplitRule[] = [
    // ============ Vendor 库分离（优先级 40-30）============
    // 这些规则从 nuxt.config.ts 的 manualChunks 迁移过来
    // 不干预 Vue/Nuxt 核心，由 nuxt/kit 自动管理

    {
        name: 'icons',
        test: id => {
            // nuxt-icon-client-bundle 是虚拟模块，不会包含 node_modules 路径
            // 需要匹配虚拟模块路径或 @iconify 相关的所有内容
            return (
                id.includes('nuxt-icon-client-bundle')
                || id.includes('@iconify/vue')
                || id.includes('@iconify/collections')
                || id.includes('cs-icons') // 自定义图标集合
            )
        },
        description: '图标库（完全独立，不进入主 bundle）',
        priority: 50, // 提高优先级，确保优先匹配
    },
    {
        name: 'sensors',
        test: id => id.includes('node_modules') && id.includes('@joyme/sensors-data'),
        description: '神策数据分析 SDK',
        priority: 35,
    },
    {
        name: 'core',
        test: id => {
            if (!id.includes('node_modules')) return false
            const coreLibs = ['lottie-web', 'axios', 'dayjs', 'pinia', 'dompurify', 'jsencrypt']
            return coreLibs.some(lib => id.includes(`/node_modules/${lib}/`))
        },
        description: '核心库：HTTP、状态管理、工具',
        priority: 30,
    },
    {
        name: 'ui',
        test: id => {
            if (!id.includes('node_modules')) return false
            const uiLibs = ['reka-ui', 'vaul-vue', 'shadcn-nuxt', 'lucide-vue-next']
            return uiLibs.some(lib => id.includes(`/node_modules/${lib}/`))
        },
        description: 'UI 组件库',
        priority: 30,
    },
    {
        name: 'functional',
        test: id => {
            if (!id.includes('node_modules')) return false
            const functionalLibs = ['swiper', 'dexie', 'nanoid']
            return functionalLibs.some(lib => id.includes(`/node_modules/${lib}/`))
        },
        description: '功能库：轮播、数据处理',
        priority: 30,
    },
    {
        name: 'media',
        test: id => {
            if (!id.includes('node_modules')) return false
            const mediaLibs = ['browser-image-compression', 'wcs-js-sdk']
            return mediaLibs.some(lib => id.includes(`/node_modules/${lib}/`))
        },
        description: '媒体处理库（延迟加载）',
        priority: 30,
    },
    {
        name: 'utils',
        test: id => {
            if (!id.includes('node_modules')) return false
            const utilLibs = ['js-base64', 'js-sha1', 'clipboard']
            return utilLibs.some(lib => id.includes(`/node_modules/${lib}/`))
        },
        description: '工具库',
        priority: 30,
    },
]
