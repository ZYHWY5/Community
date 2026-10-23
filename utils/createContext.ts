export function createContext<ContextPayload>(providerKey: string) {
    const injectionKey: InjectionKey<ContextPayload | null> = Symbol(providerKey)
    const injectContext = <T extends ContextPayload | null | undefined = ContextPayload>(
        fallback?: T,
    ): T extends null ? ContextPayload | null : ContextPayload => {
        const context = inject(injectionKey, fallback)
        if (context) return context
        throw new Error(`${providerKey} is not provided`)
    }

    const provideContext = (contextPayload: ContextPayload) => {
        provide(injectionKey, contextPayload)
        return contextPayload
    }

    return [injectContext, provideContext] as const
}
