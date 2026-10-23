export interface LottiePreloaderOptions {
    /**
   * 需要预加载的 Lottie 动画文件路径列表
   * @default []
   */
    cachePaths: string[]
}

export interface LottieAnimationData {
    [key: string]: any
}

export interface LottieRuntimeConfig {
    preloadedAnimations: LottieAnimationData
}

declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        lottie: LottieRuntimeConfig
    }
}

// 确保这个模块可以被 TypeScript 识别
declare module '#app' {
    interface NuxtApp {
        $lottie?: {
            preloadedAnimations: LottieAnimationData
        }
    }
}

export type { LottiePreloaderOptions as default }
