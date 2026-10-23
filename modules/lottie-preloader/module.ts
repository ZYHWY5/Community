import { resolve } from 'path'
import { promises as fs } from 'fs'
import { defineNuxtModule, resolveAlias } from 'nuxt/kit'
import type { LottiePreloaderOptions, LottieAnimationData } from './types'

export default defineNuxtModule<LottiePreloaderOptions>({
    meta: {
        name: 'nuxt-lottie-preloader',
        configKey: 'lottie',
        compatibility: {
            nuxt: '^3.0.0',
        },
    },
    defaults: {
        cachePaths: [],
    },
    async setup(options, nuxt) {
        const { cachePaths } = options

        // 检查路径是否重复
        const uniquePaths = Array.from(new Set(cachePaths))
        if (uniquePaths.length !== cachePaths.length) {
            console.warn('Warning: Duplicate animation paths found in lottie.cachePaths')
        }

        // 在构建时读取所有动画文件
        const animationData: LottieAnimationData = {}

        for (const path of uniquePaths) {
            try {
                // 处理路径：支持 @、~ 和绝对路径
                let normalizedPath = path
                if (path.startsWith('@') || path.startsWith('~')) {
                    // 使用 Nuxt 的路径解析
                    normalizedPath = resolveAlias(path)
                }
                else if (path.startsWith('/')) {
                    // 如果是绝对路径，从 public 目录读取
                    normalizedPath = resolve(nuxt.options.srcDir, 'public', path.slice(1))
                }
                else {
                    // 相对路径，从 public 目录读取
                    normalizedPath = resolve(nuxt.options.srcDir, 'public', path)
                }

                const content = await fs.readFile(normalizedPath, 'utf-8')
                // 使用原始路径作为键，这样在运行时可以直接匹配
                animationData[path] = JSON.parse(content)
            }
            catch (error) {
                console.error(`Failed to load animation from path: ${path}`, error)
            }
        }

        // 添加到运行时配置
        nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
        nuxt.options.runtimeConfig.public.lottie = {
            preloadedAnimations: animationData,
        }
    },
})
