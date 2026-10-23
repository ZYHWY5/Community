import type { GetPostDetailResponse } from '~/types/cms'
import type { ManageResponseParams } from '~/types/creator'
import { ReviewStatusEnum } from '~/types/creator'
import type { Paginator } from '~/types/community'
import {
    getPostList as getPostListApi,
    getPostDetail as getPostDetailApi,
    reviewPost as reviewPostApi,
} from '~/api/cms'

const toast = useToast()

const useCmsPostStore = defineStore('cmsPost', () => {
    const { $i18n } = useNuxtApp()
    const $t = (key: string) => $i18n.t(key) as string
    /** 筛选：标题搜索、审核状态 */
    const filterForm = ref({
        search: '',
        status: undefined as ReviewStatusEnum | undefined,
    })

    /** 上次筛选（用于避免重复请求） */
    const lastFilterForm = ref({
        search: '',
        status: undefined as ReviewStatusEnum | undefined,
    })

    const postList = ref<ManageResponseParams[]>([])

    const paginator = ref<Paginator>({
        total: 0,
        page: 1,
        pageSize: 10,
    })

    const postDetail = ref<GetPostDetailResponse | null>(null)

    /** 审核状态选项（与创作者管理一致） */
    const manageStatusOptions = ref([
        { label: $t('playerCommunity.cmsPostStore.reviewStatus.pending'), value: ReviewStatusEnum.PENDING },
        { label: $t('playerCommunity.cmsPostStore.reviewStatus.approved'), value: ReviewStatusEnum.APPROVED },
        { label: $t('playerCommunity.cmsPostStore.reviewStatus.rejected'), value: ReviewStatusEnum.REJECTED },
    ])

    const reviewStatusEnumToLabel = (status: ReviewStatusEnum | undefined) => {
        if (status === undefined || status === null) {
            return undefined
        }
        return manageStatusOptions.value.find(option => String(option.value) === String(status))?.label
    }

    const assignLastFilterForm = () => {
        lastFilterForm.value = {
            search: filterForm.value.search,
            status: filterForm.value.status,
        }
    }

    const resetFilterForm = () => {
        if (filterForm.value.search === '' && filterForm.value.status === undefined) {
            return
        }
        filterForm.value = {
            search: '',
            status: undefined,
        }
        void getPostList()
    }

    const getPostList = async () => {
        try {
            const res = await getPostListApi({
                search: filterForm.value.search?.trim() || undefined,
                status: filterForm.value.status,
                page: paginator.value.page,
                pageSize: paginator.value.pageSize,
            })
            postList.value = res.list
            paginator.value = res.paginator
        }
        catch {
            toast.error($t('playerCommunity.cmsPostStore.toast.getPostListFailed'))
        }
    }

    const getPostDetail = async (id: string) => {
        try {
            const res = await getPostDetailApi({ id })
            postDetail.value = res
        }
        catch {
            toast.error($t('playerCommunity.cmsPostStore.toast.getPostDetailFailed'))
        }
    }

    /** 审核帖子（通过） */
    const approvePost = async (id: string) => {
        try {
            await reviewPostApi({ id, reviewStatus: ReviewStatusEnum.APPROVED })
            /** 同步更新详情和列表对应帖子信息 */
            if (postDetail.value) {
                postDetail.value.reviewStatus = ReviewStatusEnum.APPROVED
            }
            postList.value = postList.value.map(post => {
                if (post.id === id) {
                    return { ...post, reviewStatus: ReviewStatusEnum.APPROVED }
                }
                return post
            })
            toast.success($t('playerCommunity.cmsPostStore.toast.reviewSuccess'))
        }
        catch {
            toast.error($t('playerCommunity.cmsPostStore.toast.reviewFailed'))
        }
    }

    /** 审核帖子（拒绝） */
    const rejectPost = async (id: string) => {
        try {
            await reviewPostApi({ id, reviewStatus: ReviewStatusEnum.REJECTED })
            /** 同步更新详情和列表对应帖子信息 */
            if (postDetail.value) {
                postDetail.value.reviewStatus = ReviewStatusEnum.REJECTED
            }
            postList.value = postList.value.map(post => {
                if (post.id === id) {
                    return { ...post, reviewStatus: ReviewStatusEnum.REJECTED }
                }
                return post
            })
            toast.success($t('playerCommunity.cmsPostStore.toast.reviewSuccess'))
        }
        catch {
            toast.error($t('playerCommunity.cmsPostStore.toast.reviewFailed'))
        }
    }

    const openPostDetailDialog = () => {
        useCmsPostDetailDialog().open()
    }

    return {
        filterForm,
        lastFilterForm,
        postList,
        paginator,
        postDetail,
        manageStatusOptions,
        reviewStatusEnumToLabel,
        assignLastFilterForm,
        resetFilterForm,
        getPostList,
        getPostDetail,
        approvePost,
        rejectPost,
        openPostDetailDialog,
    }
})

export { useCmsPostStore }
