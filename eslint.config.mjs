// @ts-nocheck
// import pluginVue from 'eslint-plugin-vue'
// import prettier from 'eslint-plugin-prettier'
// import tailwindcss from 'eslint-plugin-tailwindcss' // 暂时禁用等待v4兼容
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    ignores: [
        '.output/**',
        '.nuxt/**',
        'public/**',
        'node_modules/**',
        '.eslintcache',
    ],
    // plugins: {
    //     vue: pluginVue,
    //     // tailwindcss, // 暂时禁用等待v4兼容
    // },
    rules: {
        'comma-dangle': ['error', 'always-multiline'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        '@stylistic/arrow-parens': ['error', 'as-needed'],
        'object-shorthand': ['error', 'always'],
        '@stylistic/indent': ['error', 4],
        '@stylistic/quote-props': ['error', 'as-needed'],
        'vue/html-indent': ['error', 4],
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'no-async-promise-executor': 'off',
        // Tailwind CSS 规则暂时禁用，等待官方Tailwind v4兼容支持
        // 'tailwindcss/classnames-order': 'warn',
        // 'tailwindcss/enforces-negative-arbitrary-values': 'warn',
        // 'tailwindcss/enforces-shorthand': 'warn',
        // 'tailwindcss/no-contradicting-classname': 'error',
    },
// }).prepend(...pluginVue.configs['flat/recommended'])
})
