import MarkdownIt from 'markdown-it'
import shikiPlugin from '@shikijs/markdown-it'
import DOMPurify from 'dompurify'

export type MarkdownTheme = 'vitesse-light' | 'vitesse-dark'

let mdPromise: Promise<MarkdownIt> | null = null
let lastTheme: MarkdownTheme | null = null

function safeTheme(theme: string): MarkdownTheme {
    return theme === 'vitesse-dark' ? 'vitesse-dark' : 'vitesse-light'
}

async function createMarkdownIt(theme: string) {
    const safe = safeTheme(theme)
    const md = MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
    })
    // 仅加载常见的编程语言以减少体积
    // 移除 typescript、jsx、tsx 等大型语言高亮器的默认加载
    const plugin = await shikiPlugin({
        themes: {
            'vitesse-light': 'vitesse-light',
            'vitesse-dark': 'vitesse-dark',
        },
        defaultColor: safe,
        langs: [
            'javascript',
            'typescript',
            'html',
            'css',
            'python',
            'json',
            'yaml',
            'markdown',
            'bash',
        ],
    })
    md.use(plugin)
    return md
}

async function getMarkdownIt(theme: string) {
    const safe = safeTheme(theme)
    if (!mdPromise || lastTheme !== safe) {
        lastTheme = safe
        mdPromise = createMarkdownIt(safe)
    }
    return mdPromise
}

export async function renderMarkdown(
    markdown: string,
    theme: string = 'vitesse-light',
) {
    const md = await getMarkdownIt(theme)
    const dirty = md.render(markdown)
    if (import.meta.client) {
        return DOMPurify.sanitize(dirty)
    }
    return dirty
}
