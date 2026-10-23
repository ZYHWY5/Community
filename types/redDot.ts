// import Tab from "~/components/profile/components/Tab.vue";

/**
 * 红点 Key 字符串常量配置
 *
 * 集中管理所有红点 key，便于维护和使用
 *
 * @example
 * ```typescript
 * import { RED_DOT_KEYS } from '~/types/redDot'
 *
 * // 使用方式
 * redDotManager.setRedDot(RED_DOT_KEYS.demo.reddot.hover, true)
 * redDotManager.setRedDot(RED_DOT_KEYS.app.hub.change, true)
 * ```
 */
export const RED_DOT_KEYS = {
    menu: {
        eventCenter: 'main.event_center',
    },
    demo: {
        reddot: {
            hover: 'demo.reddot.hover',
            click: 'demo.reddot.click',
            none: 'demo.reddot.none',
            handler: 'demo.reddot.handler',
            position: {
                top: 'demo.reddot.position.top',
                bottom: 'demo.reddot.position.bottom',
                left: 'demo.reddot.position.left',
                right: 'demo.reddot.position.right',
                topLeft: 'demo.reddot.position.topLeft',
                topRight: 'demo.reddot.position.topRight',
                bottomLeft: 'demo.reddot.position.bottomLeft',
                bottomRight: 'demo.reddot.position.bottomRight',
            },
            size: {
                small: 'demo.reddot.size.small',
                middle: 'demo.reddot.size.middle',
                default: 'demo.reddot.size.default',
            },
            offset: 'demo.reddot.offset',
            aschild: 'demo.reddot.aschild',
            customslot: 'demo.reddot.customslot',
            directive: {
                string: 'demo.reddot.directive.string',
                object: 'demo.reddot.directive.object',
            },
            function: {
                remove: 'demo.reddot.function.remove',
                set: 'demo.reddot.function.set',
                prefix: {
                    one: 'demo.reddot.function.prefix.one',
                    two: 'demo.reddot.function.prefix.two',
                    three: 'demo.reddot.function.prefix.three',
                },
            },
        },
    },
    app: {
        hub: {
            change: 'app.hub.change',
        },
    },
    eventCenter: {
        tabCampaign: 'eventCenter.tabCampaign',
        tabTask: 'eventCenter.tabTask',
        campaignFilter1: 'eventCenter.campaignFilter1',
    },
    notify: {
        tab: {
            system: 'notify.tab.system',
            interaction: 'notify.tab.interaction',
        },
    },
} as const

const enum ShowWay {
    RED_DOT = 1,
    ICON = 2,
    NUMBER = 3,
}

export type GetGlobalRedDotResponse = {
    list: Array<{
        funcCode: string
        showWay: ShowWay
        iconRoute: string | null
        number: number
    }>
}
export interface GetGlobalRedDotRequest {
    funcCodes: string[]
}
