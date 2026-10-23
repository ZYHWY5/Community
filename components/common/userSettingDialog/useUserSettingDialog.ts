import { defineStore } from 'pinia'
import { useUserSettingDialog as useUserSettingDialogComposables } from '~/composables/usePlayerUserSettingDialog'
import { UserSettingTab } from '~/types/player-user'
import Profile from './components/Profile.vue'
import CommonSetting from './components/CommonSetting.vue'

const { open, close } = useUserSettingDialogComposables()

export const useUserSettingDialog = defineStore('userSettingDialog', () => {
    /** 当前激活的设置选项卡 */
    const activeTab = ref<UserSettingTab>(UserSettingTab.Profile)
    const currentComponent = computed(() => {
        if (activeTab.value === UserSettingTab.Profile) {
            return Profile
        }
        if (activeTab.value === UserSettingTab.GeneralSetting) {
            return CommonSetting
        }
        return Profile
    })

    /** 切换设置选项卡 */
    const changeTab = (tab: UserSettingTab) => {
        if (activeTab.value === tab) {
            return
        }
        activeTab.value = tab
    }

    /** 打开用户设置弹窗 */
    const openDialog = () => {
        open()
    }

    /** 关闭用户设置弹窗 */
    const closeDialog = () => {
        close()
    }

    return {
        activeTab,
        currentComponent,
        openDialog,
        closeDialog,
        changeTab,
    }
})
