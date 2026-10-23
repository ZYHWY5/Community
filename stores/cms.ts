import User from '~/components/cms/components/user/index.vue'
import Post from '~/components/cms/components/post/index.vue'
import Comment from '~/components/cms/components/comment/index.vue'
import type { SidebarOption } from '~/types/cms'
import { StatusEnum } from '~/types/cms'

const useCmsStore = defineStore('cms', () => {
    const { $i18n } = useNuxtApp()
    const $t = (key: string) => $i18n.t(key) as string
    /** 当前组件 */
    const currentComponent = computed(() => {
        if (currentStatus.value === StatusEnum.USER) {
            return User
        }
        else if (currentStatus.value === StatusEnum.POST) {
            return Post
        }
        else if (currentStatus.value === StatusEnum.COMMENT) {
            return Comment
        }
        return User
    })

    /** 当前状态(用于返回对应组件，连接组件和侧边栏) */
    const currentStatus = ref<StatusEnum>(StatusEnum.USER)

    /** 侧边栏配置 */
    const sidebarOptions = ref<SidebarOption[]>([
        {
            label: $t('playerCommunity.cmsStore.sidebar.user'),
            status: StatusEnum.USER,
        },
        {
            label: $t('playerCommunity.cmsStore.sidebar.post'),
            status: StatusEnum.POST,
        },
        {
            label: $t('playerCommunity.cmsStore.sidebar.comment'),
            status: StatusEnum.COMMENT,
        },
    ])

    /** 设置当前状态 */
    const setStatus = (status: StatusEnum) => {
        if (currentStatus.value === status) return
        currentStatus.value = status
    }

    return {
        currentComponent,
        currentStatus,
        sidebarOptions,
        setStatus,
    }
})

export { useCmsStore }
