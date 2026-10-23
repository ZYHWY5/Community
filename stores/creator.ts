import Post from '~/components/creator/components/post/Index.vue'
import Manage from '~/components/creator/components/manage/Index.vue'
import type { Selection, PostRequestParams, ManageFilterForm, ManageResponseParams } from '~/types/creator'
import type { FileData } from '~/types/file'
import type { Paginator } from '~/types/community'
import { StatusEnum, ReviewStatusEnum } from '~/types/creator'
import {
    creatorPost as createPostAPI,
    getManageList as getManageListAPI,
    deletePost as deletePostAPI,
    getPostDetail as getPostDetailAPI,
    updatePost as updatePostAPI,
} from '~/api/creator'

const toast = useToast()

const useCreatorStore = defineStore(
    'creator',
    () => {
        const localePath = useLocalePath()
        const router = useRouter()
        const { $i18n } = useNuxtApp()
        const $t = (key: string, params?: Record<string, unknown>) => $i18n.t(key, params) as string

        /** 当前状态 */
        const currentStatus = ref<StatusEnum>(StatusEnum.POST)

        /** 当前组件 */
        const currentComponent = computed(() => {
            if (currentStatus.value === StatusEnum.POST) {
                return Post
            }
            else if (currentStatus.value === StatusEnum.MANAGE) {
                return Manage
            }
            return Post
        })

        /** 选择项配置 */
        const selections = ref<Selection[]>([
            {
                label: $t('playerCommunity.creatorStore.selections.post'),
                value: StatusEnum.POST,
            },
            {
                label: $t('playerCommunity.creatorStore.selections.manage'),
                value: StatusEnum.MANAGE,
            },
        ])

        /** 表单数据 */
        const formData = ref<PostRequestParams>({
            /** 封面 */
            resourceList: [] as FileData[],
            /** 标题 */
            title: '',
            /** 简介 */
            desc: '',
            /** 正文 */
            content: '',
        })

        /** 编辑的帖子ID */
        const editId = ref<string>('')

        /** 二次编辑表单数据 */
        const editFormData = ref<PostRequestParams>({
            /** 封面 */
            resourceList: [] as FileData[],
            /** 标题 */
            title: '',
            /** 简介 */
            desc: '',
            /** 正文 */
            content: '',
        })

        /** 上次编辑的帖子ID(用于禁用更新按钮) */
        const lastEditFormData = ref<PostRequestParams>({
            /** 封面 */
            resourceList: [] as FileData[],
            /** 标题 */
            title: '',
            /** 简介 */
            desc: '',
            /** 正文 */
            content: '',
        })

        /** 审核状态配置 */
        const manageStatusOptions = ref([
            {
                label: $t('playerCommunity.creatorStore.reviewStatus.pending'),
                value: ReviewStatusEnum.PENDING,
            },
            {
                label: $t('playerCommunity.creatorStore.reviewStatus.approved'),
                value: ReviewStatusEnum.APPROVED,
            },
            {
                label: $t('playerCommunity.creatorStore.reviewStatus.rejected'),
                value: ReviewStatusEnum.REJECTED,
            },
        ])

        /** 审核状态枚举转换为标签 */
        const reviewStatusEnumToLabel = (status: ReviewStatusEnum | undefined) => {
            if (status === undefined || status === null) {
                return undefined
            }
            return manageStatusOptions.value.find(option => String(option.value) === String(status))?.label
        }

        /** 管理表单数据 */
        const manageFormData = ref<ManageFilterForm>({
            /** 搜索 */
            search: '',
            /** 审核状态 */
            status: undefined,
        })

        /** 上次管理表单数据(用于禁用重复请求) */
        const lastManageFormData = ref<ManageFilterForm>({})

        /** 管理列表筛选分页信息 */
        const manageListFilterPaginator = ref<Paginator>({
            total: 0,
            page: 0,
            pageSize: 10,
        })

        /** 管理帖子列表 */
        const manageList = ref<ManageResponseParams[]>([])

        /** 管理帖子列表分页信息 */
        const manageListPaginator = ref<Paginator>({
            total: 0,
            page: 0,
            pageSize: 10,
        })

        /** 管理列表是否正在请求 */
        const isLoadingManageList = ref(false)

        /** 是否在更新请求中 */
        const isUpdateLoading = ref(false)

        /** 是否还有更多可加载 */
        const hasMoreManageList = computed(() => {
            if (isFilter.value) {
                if (manageListFilterPaginator.value.page === 0) return true
                return manageListFilterPaginator.value.page * manageListFilterPaginator.value.pageSize < manageListFilterPaginator.value.total
            }
            else {
                if (manageListPaginator.value.page === 0) return true
                return manageListPaginator.value.page * manageListPaginator.value.pageSize < manageListPaginator.value.total
            }
        })

        /** 是否启用筛选 */
        const isFilter = computed(() => {
            return manageFormData.value.status !== undefined || (manageFormData.value.search?.trim().length ?? 0) > 0
        })

        /** 是否允许发布 */
        const isAllowPost = computed(() => {
            return formData.value.resourceList.length > 0 && formData.value.title.trim().length > 0 && formData.value.desc.trim().length > 0 && formData.value.content.trim().length > 0
        })

        /** 是否允许更新 */
        const isAllowEdit = computed(() => {
            return editFormData.value.resourceList.length > 0 && editFormData.value.title.trim().length > 0 && editFormData.value.desc.trim().length > 0 && editFormData.value.content.trim().length > 0 && JSON.stringify(editFormData.value) !== JSON.stringify(lastEditFormData.value) && !isUpdateLoading.value
        })

        /** 滚动区域 ref */
        const scrollAreaRef = ref<HTMLElement | null>(null)

        /** 重置管理帖子列表分页信息 */
        const resetManageListPaginator = () => {
            manageListPaginator.value.page = 0
            manageListPaginator.value.total = 0
            manageListPaginator.value.pageSize = 10
        }

        /** 重置管理帖子列表筛选分页信息 */
        const resetManageListFilterPaginator = () => {
            manageListFilterPaginator.value.page = 0
            manageListFilterPaginator.value.total = 0
            manageListFilterPaginator.value.pageSize = 10
        }

        /** 重置上次管理表单数据 */
        const resetLastManageFormData = () => {
            lastManageFormData.value.search = ''
            lastManageFormData.value.status = undefined
        }

        /** 滚动区域滚动到顶部 */
        const scrollToTop = () => {
            scrollAreaRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
        }

        /** 设置状态 */
        const setCurrentStatus = (status: StatusEnum) => {
            if (currentStatus.value === status) return
            currentStatus.value = status
        }

        /** 发布帖子 */
        const createPost = async () => {
            try {
                await createPostAPI(formData.value)
                /** 清除草稿 */
                clearDraft()
                /** 清除表单数据 */
                clearFormData()
                /** 切换到管理状态 */
                setCurrentStatus(StatusEnum.MANAGE)
                toast.success($t('playerCommunity.creatorStore.toast.postSuccess'))
            }
            catch {
                toast.error($t('playerCommunity.creatorStore.toast.postFailed'))
            }
        }

        /** 获取管理帖子列表 */
        const getManageList = async (isFirst?: boolean) => {
            if (isLoadingManageList.value) return
            /** 仅筛选搜索时：若表单与上次相同则跳过，避免重复请求；分页加载更多时不做此校验 */
            if (isFirst && JSON.stringify(lastManageFormData.value) === JSON.stringify(manageFormData.value)) return
            /** 首次加载重置分页信息 */
            if (isFirst) {
                // /** 条件筛选重置分页信息 */
                // if (isFilter.value) {
                //     resetManageListFilterPaginator()
                // }
                // /** 自然分页重置分页信息 */
                // else {
                //     resetManageListPaginator()
                // }
                resetManageListPaginator()
                resetManageListFilterPaginator()
            }
            isLoadingManageList.value = true
            try {
                /** 条件筛选 */
                if (isFilter.value) {
                    manageListFilterPaginator.value.page += 1
                    const res = await getManageListAPI({ ...manageFormData.value, page: manageListFilterPaginator.value.page, pageSize: manageListFilterPaginator.value.pageSize })
                    lastManageFormData.value = { ...manageFormData.value }
                    if (isFirst) {
                        manageList.value = res.list
                    }
                    else {
                        manageList.value.push(...res.list)
                    }
                    manageListFilterPaginator.value = res.paginator
                }
                /** 自然分页 */
                else {
                    manageListPaginator.value.page += 1
                    const res = await getManageListAPI({
                        page: manageListPaginator.value.page,
                        pageSize: manageListPaginator.value.pageSize,
                    })
                    if (isFirst) {
                        manageList.value = res.list
                    }
                    else {
                        manageList.value.push(...res.list)
                    }
                    manageListPaginator.value = res.paginator
                    resetLastManageFormData()
                }
            }
            catch {
                toast.error($t('playerCommunity.creatorStore.toast.getManageListFailed'))
                if (isFilter.value) {
                    manageListFilterPaginator.value.page -= 1
                }
                else {
                    manageListPaginator.value.page -= 1
                }
            }
            finally {
                isLoadingManageList.value = false
            }
        }

        /** 删除帖子 */
        const deletePost = async (id: string) => {
            useConfirmDialog().open({
                title: $t('playerCommunity.creatorStore.confirmDelete.title'),
                message: $t('playerCommunity.creatorStore.confirmDelete.message'),
                okText: $t('playerCommunity.creatorStore.confirmDelete.okText'),
                cancelText: $t('playerCommunity.creatorStore.confirmDelete.cancelText'),
                onOk: async () => {
                    try {
                        await deletePostAPI({ id })
                        manageList.value = manageList.value.filter(item => item.id !== id)
                        toast.success($t('playerCommunity.creatorStore.toast.deleteSuccess'))
                    }
                    catch {
                        toast.error($t('playerCommunity.creatorStore.toast.deleteFailed'))
                    }
                },
            })
            // try {
            //     await deletePostAPI({ id })
            //     manageList.value = manageList.value.filter(item => item.id !== id)
            //     toast.success('删除成功')
            // }
            // catch {
            //     toast.error('删除失败')
            // }
        }

        /** 清除formData数据 */
        const clearFormData = () => {
            formData.value.resourceList = []
            formData.value.title = ''
            formData.value.desc = ''
            formData.value.content = ''
        }

        /** 设置编辑的帖子ID */
        const setEditId = (id: string) => {
            if (editId.value === id) return
            editId.value = id
        }

        /** 获取编辑的帖子详情 */
        const getEditDetail = async () => {
            if (!editId.value) {
                const editId = router.currentRoute.value.params.id
                if (typeof editId === 'string' && editId.trim()) {
                    setEditId(editId.trim())
                }
                else {
                    toast.error($t('playerCommunity.creatorStore.toast.invalidPostId'))
                    return
                }
            }
            try {
                const res = await getPostDetailAPI({ id: editId.value })
                editFormData.value.title = res.title
                editFormData.value.desc = res.desc
                editFormData.value.content = res.content
                editFormData.value.resourceList = res.cover.map(url => ({
                    originalName: '',
                    fileUrl: url,
                    fileSize: 0,
                }))
                lastEditFormData.value = JSON.parse(JSON.stringify(editFormData.value))
            }
            catch {
                toast.error($t('playerCommunity.creatorStore.toast.getPostDetailFailed'))
            }
        }

        /** 跳转到编辑页面 */
        const toEdit = (id: string) => {
            setEditId(id)
            navigateTo(localePath(`/creator/edit/${id}`))
        }

        /** 更新帖子 */
        const updatePost = async () => {
            try {
                isUpdateLoading.value = true
                const res = await updatePostAPI({ ...editFormData.value, id: editId.value })
                /** 更新列表数据 */
                manageList.value = manageList.value.map(item => {
                    if (item.id === editId.value) {
                        return {
                            ...item,
                            title: res.title,
                            cover: res.resourceList[0]?.fileUrl ?? '',
                            status: res.reviewStatus,
                        }
                    }
                    return item
                })
                /** 更新成功后跳转回管理页面 */
                navigateTo(localePath('/creator'))
                toast.success($t('playerCommunity.creatorStore.toast.updateSuccess'))
            }
            catch {
                toast.error($t('playerCommunity.creatorStore.toast.updateFailed'))
            }
            finally {
                isUpdateLoading.value = false
            }
        }

        /** formData 是否有数据可以保存为草稿 */
        const isHaveData = computed(() => {
            return formData.value.resourceList.length > 0 || formData.value.title.trim().length > 0 || formData.value.desc.trim().length > 0 || formData.value.content.trim().length > 0
        })

        /** 保存草稿(localStorage) */
        const saveDraft = () => {
            try {
                const draftData = formData.value
                localStorage.setItem('creator_post_draft', JSON.stringify(draftData))
                toast.success($t('playerCommunity.creatorStore.toast.draftSaved'))
            }
            catch {
                toast.error($t('playerCommunity.creatorStore.toast.saveDraftFailed'))
            }
        }

        /** 加载草稿(localStorage) */
        const loadDraft = () => {
            try {
                const draftData = localStorage.getItem('creator_post_draft')
                if (draftData) {
                    formData.value = JSON.parse(draftData)
                    toast.success($t('playerCommunity.creatorStore.toast.draftLoaded'))
                }
                else {
                    toast.info($t('playerCommunity.creatorStore.toast.noDraftFound'))
                }
            }
            catch {
                toast.error($t('playerCommunity.creatorStore.toast.loadDraftFailed'))
            }
        }

        /** 清除草稿 */
        const clearDraft = () => {
            localStorage.removeItem('creator_post_draft')
        }

        return {
            currentStatus,
            selections,
            currentComponent,
            formData,
            editFormData,
            manageFormData,
            manageStatusOptions,
            manageList,
            manageListPaginator,
            isLoadingManageList,
            isUpdateLoading,
            hasMoreManageList,
            isAllowPost,
            isAllowEdit,
            isHaveData,
            createPost,
            getManageList,
            reviewStatusEnumToLabel,
            scrollAreaRef,
            scrollToTop,
            deletePost,
            getEditDetail,
            toEdit,
            updatePost,
            saveDraft,
            loadDraft,
            clearFormData,
        }
    },
)

export { useCreatorStore }
