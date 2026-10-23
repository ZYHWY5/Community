import { defineStore } from 'pinia'
import { DialogModeEnum, RegisterStepEnum, CarctorEnum, UserLoginEnum } from '~/types/login'
import type { FileData } from '~/types/file'
import { useToast } from '~/composables/useToast'
import { register as registerWithApi, login as loginWithApi } from '~/api/player-user'

const toast = useToast()

export const useLogin = defineStore('loginDialog', () => {
    const { $i18n } = useNuxtApp()
    const $t = (key: string, params?: Record<string, unknown>) => $i18n.t(key, params) as string

    /** 弹窗是否打开 */
    const isDialogOpen = ref(false)
    /** 当前弹窗类型(默认为登录) */
    const currentDialog = ref<DialogModeEnum>(DialogModeEnum.LOGIN)
    /** 当前注册步骤 */
    const currentStep = ref<RegisterStepEnum>(RegisterStepEnum.ACCOUNT)
    /** 当前注册步骤索引 */
    const currentStepIndex = ref(0)

    /** 注册步骤配置 */
    const statusList = ref([
        {
            label: RegisterStepEnum.ACCOUNT,
            isActive: true,
        },
        {
            label: RegisterStepEnum.PROFILE,
            isActive: false,
        },
    ])

    /** 身份配置 */
    const carctorList = ref([
        {
            label: $t('playerCommunity.playerLoginStore.carctor.student'),
            value: CarctorEnum.STUDENT,
        },
        {
            label: $t('playerCommunity.playerLoginStore.carctor.worker'),
            value: CarctorEnum.WORKER,
        },
        {
            label: $t('playerCommunity.playerLoginStore.carctor.player'),
            value: CarctorEnum.PLAYER,
        },
    ])

    /** 注册表单数据 */
    const registerFormData = ref({
        /** Account */
        emailInput: '',
        passwordInput: '',
        confirmPasswordInput: '',

        /** Profile */
        carctor: CarctorEnum.STUDENT,

        /** File */
        resourceList: [] as FileData[],
    })

    /** 登录表单数据 */
    const loginFormData = ref({
        /** 登录类型(默认为邮箱登录) */
        loginType: UserLoginEnum.email,

        emailInput: '',
        passwordInput: '',
    })

    /** 是否允许点击登录按钮 */
    const isAllowLogin = computed(() => {
        return loginFormData.value.emailInput.trim() !== '' && loginFormData.value.passwordInput.trim() !== ''
    })

    /** 是否允许进入下一步 */
    const isAllowNext = computed(() => {
        if (currentStep.value === RegisterStepEnum.ACCOUNT) {
            return (
                registerFormData.value.emailInput.trim() !== ''
                && registerFormData.value.passwordInput.trim() !== ''
                && registerFormData.value.confirmPasswordInput.trim() !== ''
            )
        }
        if (currentStep.value === RegisterStepEnum.PROFILE) {
            return (
                registerFormData.value.carctor.trim() !== ''
                && registerFormData.value.resourceList.length > 0
            )
        }
        return false
    })

    /** 打开弹窗 */
    const openDialog = () => {
        isDialogOpen.value = true
    }

    /** 关闭弹窗 */
    const closeDialog = () => {
        isDialogOpen.value = false
    }

    /** 切换弹窗类型(内部使用) */
    const switchDialogType = (mode: DialogModeEnum) => {
        currentDialog.value = mode
    }

    /** 切换到登录弹窗 */
    const toLogin = () => {
        switchDialogType(DialogModeEnum.LOGIN)
    }

    /** 切换到注册弹窗 */
    const toRegister = () => {
        switchDialogType(DialogModeEnum.REGISTER)
    }

    /** 返回上一步 */
    const back = () => {
        if (currentStep.value === statusList.value[0].label) {
            toLogin()
            return
        }
        if (currentStep.value === statusList.value[1].label) {
            currentStepIndex.value -= 1
            currentStep.value = statusList.value[currentStepIndex.value].label
            statusList.value[currentStepIndex.value + 1].isActive = false
            return
        }
        return
    }

    /** 校验当前步骤数据 */
    const check = () => {
        /** Account Step */
        if (currentStep.value === RegisterStepEnum.ACCOUNT) {
            /** 校验邮箱格式 */
            const emailRegex = /.+@.+/
            if (!emailRegex.test(registerFormData.value.emailInput)) {
                toast.error($t('playerCommunity.playerLoginStore.toast.invalidEmail'))
                return false
            }
            /** 校验密码长度 */
            if (registerFormData.value.passwordInput.length < 6) {
                toast.error($t('playerCommunity.playerLoginStore.toast.passwordTooShort'))
                return false
            }
            /** 校验两次密码是否一致 */
            if (registerFormData.value.passwordInput !== registerFormData.value.confirmPasswordInput) {
                toast.error($t('playerCommunity.playerLoginStore.toast.passwordMismatch'))
                return false
            }
        }
        /** Profile Step */
        if (currentStep.value === RegisterStepEnum.PROFILE) {
            /** 校验是否选择身份 */
            if (!registerFormData.value.carctor) {
                toast.error($t('playerCommunity.playerLoginStore.toast.selectIdentity'))
                return false
            }
            /** 校验是否上传资源 */
            if (registerFormData.value.resourceList.length === 0) {
                toast.error($t('playerCommunity.playerLoginStore.toast.uploadAtLeastOne'))
                return false
            }
        }

        return true
    }

    /** 进入下一步 */
    const next = async () => {
        /** 先校验 */
        const isValid = check()
        if (!isValid) {
            return
        }
        /** Account Step */
        if (currentStep.value === statusList.value[0].label) {
            currentStepIndex.value += 1
            currentStep.value = statusList.value[currentStepIndex.value].label
            statusList.value[currentStepIndex.value].isActive = true
            return
        }
        /** Profile Step */
        if (currentStep.value === statusList.value[1].label) {
            try {
                await registerWithApi({
                    email: registerFormData.value.emailInput,
                    password: registerFormData.value.passwordInput,
                    fileData: registerFormData.value.resourceList,
                })
                toast.success($t('playerCommunity.playerLoginStore.toast.registerSuccess'))
            }
            catch (error) {
                toast.error($t('playerCommunity.playerLoginStore.toast.registerFailed', { error }))
            }
            return
        }
        return
    }

    /** 校验邮箱密码 */
    const loginCheck = () => {
        /** 校验邮箱格式 */
        const emailRegex = /.+@.+/
        if (!emailRegex.test(loginFormData.value.emailInput)) {
            toast.error($t('playerCommunity.playerLoginStore.toast.invalidEmail'))
            return false
        }
        /** 校验密码长度 */
        if (loginFormData.value.passwordInput.length < 6) {
            toast.error($t('playerCommunity.playerLoginStore.toast.passwordTooShort'))
            return false
        }
        return true
    }

    /** 执行登录 */
    const login = async () => {
        const isValid = loginCheck()
        if (!isValid) {
            return
        }
        try {
            const response = await loginWithApi({
                email: loginFormData.value.emailInput,
                password: loginFormData.value.passwordInput,
                loginType: loginFormData.value.loginType,
            })
            toast.success($t('playerCommunity.playerLoginStore.toast.loginSuccess'))

            /** 存储token到cookie */
            const cookie = useCookie('token', {
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
                sameSite: 'lax',
            })
            cookie.value = response.token

            /** 更新用户信息 */
            if (response) {
                const playerUserStore = usePlayerUserStore()
                playerUserStore.updateUserInfo(response)
            }

            /** 关闭弹窗 */
            closeDialog()

            /** 清空表单数据 */
            loginFormData.value.emailInput = ''
            loginFormData.value.passwordInput = ''
        }
        catch (error) {
            toast.error($t('playerCommunity.playerLoginStore.toast.loginFailed', { error }))
        }
    }

    /** 退出登录 */
    const logout = () => {
        /** 清除token cookie */
        const cookie = useCookie('token')
        cookie.value = ''

        /** 清除用户信息 */
        const playerUserStore = usePlayerUserStore()
        playerUserStore.updateUserInfo({
            uid: '',
            nickName: '',
            face: '',
            email: '',
            phone: '',
            token: '',
            userRole: -1,
        })
    }

    return {
        isDialogOpen,
        currentDialog,
        currentStep,
        statusList,
        carctorList,
        registerFormData,
        loginFormData,
        isAllowNext,
        isAllowLogin,
        openDialog,
        closeDialog,
        toLogin,
        toRegister,
        back,
        next,
        login,
        logout,
    }
})
