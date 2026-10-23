import type { FilterForm, UserInfo, GetUserDetailResponse, UpdateUserDetailRequestParam, PreviewStatusOptions, UserRoleOptions } from '~/types/cms'
import { PreviewStatusEnum, UserRoleEnum } from '~/types/cms'
import type { Paginator } from '~/types/community'
import {
    getUserList as getUserListApi,
    getUserDetail as getUserDetailApi,
    updateUserDetail as updateUserDetailApi,
} from '~/api/cms'

const toast = useToast()

const useCmsUserStore = defineStore('cmsUser', () => {
    const { $i18n } = useNuxtApp()
    const $t = (key: string) => $i18n.t(key) as string

    /** 筛选表单 */
    const filterForm = ref<FilterForm>({
        uid: '',
        previewStatus: undefined,
        userRole: undefined,
    })

    /** 上次筛选表单 */
    const lastFilterForm = ref<FilterForm>({
        uid: '',
        previewStatus: PreviewStatusEnum.PENDING,
        userRole: UserRoleEnum.TOURIST,
    })

    /** 用户列表 */
    const userList = ref<UserInfo[]>([])

    /** 分页信息 */
    const paginator = ref<Paginator>({
        total: 0,
        page: 1,
        pageSize: 10,
    })

    /** 用户详情 */
    const userDetail = ref<GetUserDetailResponse | null>(null)

    /** 更新用户详情表单 */
    const updateForm = ref<UpdateUserDetailRequestParam>({
        uid: '',
        userRole: undefined,
        reviewStatus: undefined,
    })

    /** 赋值上次筛选表单 */
    const assignLastFilterForm = () => {
        lastFilterForm.value = {
            uid: filterForm.value.uid,
            previewStatus: filterForm.value.previewStatus,
            userRole: filterForm.value.userRole,
        }
    }

    /** 重置筛选表单 */
    const resetFilterForm = () => {
        /** 如果筛选表单没有变化，则不重置 */
        if (filterForm.value.uid === '' && filterForm.value.previewStatus === undefined && filterForm.value.userRole === undefined) {
            return
        }
        filterForm.value = {
            uid: '',
            previewStatus: undefined,
            userRole: undefined,
        }
        getUserList()
    }

    /** 获取用户列表 */
    const getUserList = async () => {
        try {
            const res = await getUserListApi({
                ...filterForm.value,
                page: paginator.value.page,
                pageSize: paginator.value.pageSize,
            })
            userList.value = res.list
            paginator.value = res.paginator
        }
        catch {
            toast.error($t('playerCommunity.cmsUserStore.toast.getUserListFailed'))
        }
    }

    /** 获取用户详情 */
    const getUserDetail = async (uid: string) => {
        try {
            const res = await getUserDetailApi({
                uid,
            })
            userDetail.value = res
            /** 更新用户详情表单 */
            updateForm.value = {
                uid,
                userRole: res.userRole,
                reviewStatus: res.reviewStatus,
            }
        }
        catch {
            toast.error($t('playerCommunity.cmsUserStore.toast.getUserDetailFailed'))
        }
    }

    /** 打开用户详情弹窗 */
    const openUserDetailDialog = () => {
        useUserDetailDialog().open()
    }

    /** 更新用户详情 */
    const updateUserDetail = async (data?: UpdateUserDetailRequestParam) => {
        /** 如果用户角色和审核状态没有变化，则不更新 */
        if (updateForm.value.userRole === userDetail.value?.userRole && updateForm.value.reviewStatus === userDetail.value?.reviewStatus && !data) {
            toast.error($t('playerCommunity.cmsUserStore.toast.noChangesToUpdate'))
            return
        }
        /** 更新用户详情 */
        try {
            await updateUserDetailApi(data ? data : updateForm.value)
            toast.success($t('playerCommunity.cmsUserStore.toast.updateUserDetailSuccess'))
            const detail = userDetail.value
            /** 同步更改详情和列表对应用户信息 */
            if (detail) {
                const { userRole, reviewStatus } = data ? data : updateForm.value
                /** 更新用户详情 */
                userDetail.value = {
                    ...detail,
                    userRole: userRole ?? detail.userRole,
                    reviewStatus: reviewStatus ?? detail.reviewStatus,
                }
                /** 更新用户列表对应用户信息 */
                userList.value = userList.value.map(user => {
                    if (user.uid === detail.uid) {
                        return {
                            ...user,
                            userRole: userRole ?? user.userRole,
                            reviewStatus: reviewStatus ?? user.reviewStatus,
                        }
                    }
                    return user
                })
            }
        }
        catch {
            toast.error($t('playerCommunity.cmsUserStore.toast.updateUserDetailFailed'))
        }
    }

    /** 审核状态配置 */
    const previewStatusOptions = ref<PreviewStatusOptions[]>([
        {
            label: $t('playerCommunity.cmsUserStore.previewStatus.pending'),
            value: PreviewStatusEnum.PENDING,
        },
        {
            label: $t('playerCommunity.cmsUserStore.previewStatus.approved'),
            value: PreviewStatusEnum.APPROVED,
        },
        {
            label: $t('playerCommunity.cmsUserStore.previewStatus.rejected'),
            value: PreviewStatusEnum.REJECTED,
        },
    ])

    /** 审核状态枚举映射 */
    const previewStatusEnumMap = computed(() => {
        if (filterForm.value.previewStatus === undefined) {
            return $t('playerCommunity.cmsUserStore.previewStatus.placeholder')
        }
        return previewStatusOptions.value.find(option => option.value === filterForm.value.previewStatus)?.label
    })

    /** 审核状态枚举映射(用于表格展示) */
    const previewStatusToLabel = (previewStatus: PreviewStatusEnum | undefined) => {
        if (previewStatus === undefined) {
            return $t('playerCommunity.cmsUserStore.previewStatus.placeholder')
        }
        return previewStatusOptions.value.find(option => option.value === previewStatus)?.label
    }

    /** 用户角色(权限)配置 */
    const userRoleOptions = ref<UserRoleOptions[]>([
        {
            label: $t('playerCommunity.cmsUserStore.userRole.tourist'),
            value: UserRoleEnum.TOURIST,
        },
        {
            label: $t('playerCommunity.cmsUserStore.userRole.user'),
            value: UserRoleEnum.USER,
        },
        {
            label: $t('playerCommunity.cmsUserStore.userRole.admin'),
            value: UserRoleEnum.ADMIN,
        },
    ])

    /** 用户角色(权限)枚举映射 */
    const userRoleEnumMap = computed(() => {
        if (filterForm.value.userRole === undefined) {
            return $t('playerCommunity.cmsUserStore.userRole.placeholder')
        }
        return userRoleOptions.value.find(option => option.value === filterForm.value.userRole)?.label
    })

    /** 用户角色(权限)枚举映射(用于表格展示) */
    const userRoleToLabel = (userRole: UserRoleEnum | undefined) => {
        if (userRole === undefined) {
            return $t('playerCommunity.cmsUserStore.userRole.placeholder')
        }
        return userRoleOptions.value.find(option => option.value === userRole)?.label
    }

    return {
        filterForm,
        lastFilterForm,
        userList,
        paginator,
        userDetail,
        updateForm,
        assignLastFilterForm,
        resetFilterForm,
        getUserList,
        getUserDetail,
        openUserDetailDialog,
        updateUserDetail,
        previewStatusOptions,
        previewStatusEnumMap,
        previewStatusToLabel,
        userRoleOptions,
        userRoleEnumMap,
        userRoleToLabel,
    }
})

export { useCmsUserStore }
