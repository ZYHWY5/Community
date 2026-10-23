import type { ViteConfig } from 'nuxt/schema'
import { chunkSplitConfig } from './chunk-split.config'

/**
 * Vite 插件：自动 Chunk 分离
 *
 * 核心功能：
 * 1. 基于 chunk-split.config.ts 的显式规则进行精确匹配
 * 2. 运行时自动识别 components/ 目录，按约定生成 chunk
 * 3. 支持三种匹配模式：字符串、正则、函数
 *
 * 优先级（从高到低）：
 * - 显式配置规则（priority >= 20）
 * - 自动拆分规则（priority 18）
 * - 原有 manualChunks 配置
 *
 * 📌 Pages 路由由 Nuxt 自动拆分，不需要配置
 */
export function chunkSplitPlugin(): NonNullable<ViteConfig['plugins']>[number] {
    // 过滤启用的规则并按优先级降序排列
    const enabledRules = chunkSplitConfig
        .filter(rule => rule.enabled !== false)
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

    // 编译测试函数（统一为函数形式）
    const compiledRules = enabledRules.map(rule => ({
        name: rule.name,
        test: compileTest(rule.test),
        priority: rule.priority ?? 0,
        description: rule.description,
    }))

    return {
        name: 'vite-plugin-chunk-split',
        enforce: 'post',

        config(viteConfig) {
            // 确保存在必需的配置对象
            viteConfig.build = viteConfig.build || {}
            viteConfig.build.rollupOptions = viteConfig.build.rollupOptions || {}
            viteConfig.build.rollupOptions.output = viteConfig.build.rollupOptions.output || {}

            const rollupOutput = viteConfig.build.rollupOptions.output

            // 保存原有的 manualChunks 配置
            const originalManualChunks
                = typeof rollupOutput === 'object' && !Array.isArray(rollupOutput)
                    ? rollupOutput.manualChunks
                    : undefined

            // 注入新的 manualChunks 逻辑
            const newManualChunks = (id: string, meta: any): string | undefined => {
                // 1. 优先执行显式规则（按优先级顺序）
                for (const rule of compiledRules) {
                    if (rule.test(id)) {
                        // console.log(`[manualChunks] chunk-${rule.name} ← ${id}`)
                        return `chunk-${rule.name}`
                    }
                }

                // 3. 执行原有的 manualChunks 逻辑
                if (typeof originalManualChunks === 'function') {
                    const result = originalManualChunks(id, meta)
                    return result ?? undefined
                }
                if (typeof originalManualChunks === 'object' && originalManualChunks) {
                    // 处理对象形式的 manualChunks
                    for (const [chunkName, modules] of Object.entries(originalManualChunks)) {
                        if (Array.isArray(modules) && modules.some(m => typeof m === 'string' && id.includes(m))) {
                            return chunkName
                        }
                    }
                }

                return undefined
            }

            // 更新 rollupOptions 配置
            if (typeof rollupOutput === 'object' && !Array.isArray(rollupOutput)) {
                rollupOutput.manualChunks = newManualChunks
            }
            else if (Array.isArray(rollupOutput)) {
                // 如果是数组，对每个输出配置应用规则
                rollupOutput.forEach(output => {
                    output.manualChunks = newManualChunks
                })
            }
        },
    }
}

/**
 * 将各种类型的测试规则编译为统一的函数形式
 */
function compileTest(test: string | RegExp | ((id: string) => boolean)): (id: string) => boolean {
    if (typeof test === 'string') {
        // 字符串：使用 includes 匹配
        return (id: string) => id.includes(test)
    }

    if (test instanceof RegExp) {
        // 正则：直接使用 test 方法
        return (id: string) => test.test(id)
    }

    if (typeof test === 'function') {
        // 函数：直接使用
        return test
    }

    throw new Error(`[chunk-split] Invalid test type: ${typeof test}. Expected string, RegExp, or function`)
}
