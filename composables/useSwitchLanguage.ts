export const useSwitchLanguage = () => {
    const toast = useToast()
    const { locale, locales, setLocale } = useNuxtApp().$i18n

    /** 语言列表 */
    const switchLanguageList = computed(() => {
        return locales.value.map(item => {
            return {
                code: item.code,
                name: item.name,
                language: item.language,
            }
        })
    })

    /** 当前语言 */
    const currentLanguage = computed(() => {
        return switchLanguageList.value.find(item => item.code === locale.value)
    })

    /** 语言切换提示映射 */
    const toastMap: Record<typeof locale.value, string> = {
        en: 'Language switched to English',
        zh: '语言已切换为中文',
    }

    /** 语言切换 */
    const switchLanguage = (code: (typeof locales.value)[number]['code']) => {
        setLocale(code)
        toast.success(toastMap[code])
    }

    return {
        locale,
        locales,
        currentLanguage,
        switchLanguageList,
        switchLanguage,
    }
}
