// 工程覆盖
const alias: string = import.meta.env.VITE_APP_ALIAS
const Config = {
    online: {
        baseUrl: import.meta.env.VITE_APP_API_URL,
        appEnv: import.meta.env.VITE_APP_ENV,
        alias,
        agentAppID: alias,
        agentAppKey: 'webAgent_e29c4b8a1f3d0765a82e4f9b0c5d6a31',
        imBaseUrl: 'https://imapi.liveme.com',
        imServers: [
            {
                host: 'webim1.fusionv.com',
                port: '80',
            },
            {
                host: 'webim2.fusionv.com',
                port: '80',
            },
        ],
        loginConfig: {
            baseUrl: 'https://lvapi.imastudio.com',
            thirdHost: 'iptlogin.imastudio.com',
            oldThirdHost: 'iptlogin.imastudio.com',
            clientId: '298896542',
            client_secret: '0882C07F47EAFBE1EF4BA0DBAFB080D6',
            business: alias,
            redirect_uri: 'https://www.imastudio.com',
        },
        stripePublicKey: 'pk_live_lThIFVAqnKzBnDkrwNf9Efxi0092cZeVVi',
        signKey: 'ZGQ0NmRiYjQ0MmI2ZTRiYTgxN2Q2MzQ3ZDJkZGY0OTM=',
        supportEmail: 'support@imastudio.com',
        supportX: '//x.com/ImaStudio_ai',
        supportDiscordAd: '//discord.gg/zPznX8EN3w',
        supportDiscord: '//discord.com/invite/97UmaDqbgk',
        imaProUrl: 'https://story.imastudio.com',
        thirdAuthDomain: [
            'story.imastudio.com',
        ],
    },
    test: {
        baseUrl: import.meta.env.VITE_APP_API_URL,
        appEnv: import.meta.env.VITE_APP_ENV,
        alias,
        agentAppID: alias,
        agentAppKey: 'webAgent_e29c4b8a1f3d0765a82e4f9b0c5d6a31',
        imBaseUrl: 'https://imapi-qa.liveme.com',
        imServers: [
            {
                host: 'imapi-webim-qa.liveme.com',
                port: '80',
            },
        ],
        loginConfig: {
            baseUrl: 'https://lvapi.imastudio.com',
            thirdHost: 'qaiptlogin.imastudio.com',
            oldThirdHost: 'qaiptlogin.imastudio.com',
            clientId: '298896542',
            client_secret: '0882C07F47EAFBE1EF4BA0DBAFB080D6',
            business: alias,
            redirect_uri: 'https://qa.imastudio.com',
        },
        stripePublicKey: 'pk_test_vm8c5i0tEUHiYJyNTjSvj7Zm00GMJSQBSK',
        signKey: 'MDFhMTNiMWU1MzZhNWJjYTc4ZTVhNDIxMjI1ZDA2Y2U=',
        supportEmail: 'support@imastudio.com',
        supportX: '//x.com/ImaStudio_ai',
        supportDiscordAd: '//discord.gg/zPznX8EN3w',
        supportDiscord: '//discord.com/invite/97UmaDqbgk',
        imaProUrl: 'https://qa-story.imastudio.com',
        thirdAuthDomain: [
            'qa-story.imastudio.com',
        ],
    },
    beta: {
        baseUrl: import.meta.env.VITE_APP_API_URL,
        appEnv: import.meta.env.VITE_APP_ENV,
        alias,
        agentAppID: alias,
        agentAppKey: 'webAgent_e29c4b8a1f3d0765a82e4f9b0c5d6a31',
        imBaseUrl: 'https://imapi-beta.liveme.com',
        imServers: [
            {
                host: 'imapi-webim-beta.liveme.com',
                port: '80',
            },
        ],
        loginConfig: {
            baseUrl: 'https://lvapi.imastudio.com',
            thirdHost: 'qaiptlogin.imastudio.com',
            oldThirdHost: 'qaiptlogin.imastudio.com',
            clientId: '298896542',
            client_secret: '0882C07F47EAFBE1EF4BA0DBAFB080D6',
            business: alias,
            redirect_uri: 'https://beta.imastudio.com',
        },
        stripePublicKey: 'pk_test_vm8c5i0tEUHiYJyNTjSvj7Zm00GMJSQBSK',
        signKey: 'MDFhMTNiMWU1MzZhNWJjYTc4ZTVhNDIxMjI1ZDA2Y2U=',
        supportEmail: 'support@imastudio.com',
        supportX: '//x.com/ImaStudio_ai',
        supportDiscordAd: '//discord.gg/zPznX8EN3w',
        supportDiscord: '//discord.com/invite/97UmaDqbgk',
        imaProUrl: 'https://qa-story.imastudio.com',
        thirdAuthDomain: [
            'qa-story.imastudio.com',
        ],
    },
}
export default () => {
    let _env = ''
    if (import.meta.env.VITE_APP_ENV) {
        _env = import.meta.env.VITE_APP_ENV
        return Config[_env === 'prod' ? 'online' : _env === 'beta' ? 'beta' : 'test']
    }
    else {
        const runtimeConfig = useRuntimeConfig()
        _env = runtimeConfig.public.appEnv
        // 工程覆盖
        const alias: string = runtimeConfig.public.appAlias
        const currentConfig = Config[_env === 'prod' ? 'online' : _env === 'beta' ? 'beta' : 'test']
        currentConfig.baseUrl = runtimeConfig.public.appApiUrl
        currentConfig.appEnv = _env
        currentConfig.alias = alias
        currentConfig.agentAppID = alias
        currentConfig.loginConfig.business = alias
        return currentConfig
    }
}
