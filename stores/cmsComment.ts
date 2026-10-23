import type {
    CommentItem,
    GetCommentDetailResponse,
} from '~/types/cms'
import type { Paginator } from '~/types/community'
import { CommentStatusEnum } from '~/types/community'
import {
    getCommentList as getCommentListApi,
    getCommentDetail as getCommentDetailApi,
    reviewComment as reviewCommentApi,
} from '~/api/cms'

const toast = useToast()

const useCmsCommentStore = defineStore('cmsComment', () => {
    const { $i18n } = useNuxtApp()
    const $t = (key: string) => $i18n.t(key) as string
    /** 筛选：评论正文/ID 搜索、评论状态 */
    const filterForm = ref({
        search: '',
        status: undefined as CommentStatusEnum | undefined,
    })

    /** 上次筛选（用于避免重复请求） */
    const lastFilterForm = ref({
        search: '',
        status: undefined as CommentStatusEnum | undefined,
    })

    const commentList = ref<CommentItem[]>([])

    const paginator = ref<Paginator>({
        total: 0,
        page: 1,
        pageSize: 10,
    })

    const commentDetail = ref<GetCommentDetailResponse | null>(null)

    /** 评论状态选项 */
    const commentStatusOptions = ref([
        { label: $t('playerCommunity.cmsCommentStore.reviewStatus.pending'), value: CommentStatusEnum.PENDING },
        { label: $t('playerCommunity.cmsCommentStore.reviewStatus.approved'), value: CommentStatusEnum.NORMAL },
        { label: $t('playerCommunity.cmsCommentStore.reviewStatus.rejected'), value: CommentStatusEnum.DELETED },
    ])

    const commentStatusEnumToLabel = (status: CommentStatusEnum | undefined) => {
        if (status === undefined || status === null) {
            return undefined
        }
        return commentStatusOptions.value.find(option => String(option.value) === String(status))?.label
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
        void getCommentList()
    }

    const getCommentList = async () => {
        try {
            const res = await getCommentListApi({
                search: filterForm.value.search?.trim() || undefined,
                status: filterForm.value.status,
                page: paginator.value.page,
                pageSize: paginator.value.pageSize,
            })
            commentList.value = res.list
            paginator.value = res.paginator
        }
        catch {
            toast.error($t('playerCommunity.cmsCommentStore.toast.getCommentListFailed'))
        }
    }

    const getCommentDetail = async (id: string) => {
        try {
            const res = await getCommentDetailApi({ id })
            commentDetail.value = res
        }
        catch {
            toast.error($t('playerCommunity.cmsCommentStore.toast.getCommentDetailFailed'))
        }
    }

    /** 审核评论（通过） */
    const approveComment = async (id: string) => {
        try {
            await reviewCommentApi({ id, status: CommentStatusEnum.NORMAL })
            if (commentDetail.value) {
                commentDetail.value.status = CommentStatusEnum.NORMAL
            }
            commentList.value = commentList.value.map(comment => {
                if (comment.id === id) {
                    return { ...comment, status: CommentStatusEnum.NORMAL }
                }
                return comment
            })
            toast.success($t('playerCommunity.cmsCommentStore.toast.reviewSuccess'))
        }
        catch {
            toast.error($t('playerCommunity.cmsCommentStore.toast.reviewFailed'))
        }
    }

    /** 审核评论（拒绝） */
    const rejectComment = async (id: string) => {
        try {
            await reviewCommentApi({ id, status: CommentStatusEnum.DELETED })
            if (commentDetail.value) {
                commentDetail.value.status = CommentStatusEnum.DELETED
            }
            commentList.value = commentList.value.map(comment => {
                if (comment.id === id) {
                    return { ...comment, status: CommentStatusEnum.DELETED }
                }
                return comment
            })
            toast.success($t('playerCommunity.cmsCommentStore.toast.reviewSuccess'))
        }
        catch {
            toast.error($t('playerCommunity.cmsCommentStore.toast.reviewFailed'))
        }
    }

    const openCommentDetailDialog = () => {
        useCmsCommentDetailDialog().open()
    }

    return {
        filterForm,
        lastFilterForm,
        commentList,
        paginator,
        commentDetail,
        commentStatusOptions,
        commentStatusEnumToLabel,
        assignLastFilterForm,
        resetFilterForm,
        getCommentList,
        getCommentDetail,
        approveComment,
        rejectComment,
        openCommentDetailDialog,
    }
})

export { useCmsCommentStore }
