import type { CommentItem, Paginator, PostCommentParams, ReplyInfo } from '~/types/community'
import { LikeStatusEnum, CommentLevelEnum } from '~/types/community'
import {
    getCommentList as getCommentListApi,
    getSubCommentList as getSubCommentListApi,
    postComment as postCommentApi,
    likeComment as likeCommentApi,
    cancelLikeComment as cancelLikeCommentApi,
    deleteComment as deleteCommentApi,
} from '~/api/player-community'

const useCommentStore = defineStore(
    'comment',
    () => {
        const toast = useToast()
        const { $i18n } = useNuxtApp()
        const $t = (key: string, params?: Record<string, unknown>) => $i18n.t(key, params) as string

        /** 当前归属帖子 id */
        const currentPid = ref<string>('')

        /** 是否初始化评论 */
        const isInitComment = ref<boolean>(true)

        /** 一级评论加载状态 */
        const isLoading = ref(false)

        /** 发布评论加载状态 */
        const isPosting = ref(false)

        /** 一级评论列表（每项携带前 3 条二级评论） */
        const commentList = ref<CommentItem[]>([])

        /** 一级评论分页信息 */
        const paginator = ref<Paginator>({
            total: 0,
            page: 0,
            pageSize: 10,
        })

        /** 是否还有更多一级评论 */
        const hasMore = computed(() => {
            if (paginator.value.page === 0) return true
            return paginator.value.page * paginator.value.pageSize < paginator.value.total
        })

        /** 当前正在展开二级评论的一级评论 id（用于控制加载更多状态） */
        const expandingRootId = ref<string>('')

        /** 二级评论分页信息 Map（key: 一级评论 id） */
        const subPaginatorMap = ref<Record<string, Paginator>>({})

        /** 评论输入框内容 */
        const commentInput = ref<string>('')

        /** 是否聚焦（控制 Input 展开/收起样式） */
        const isFocus = ref<boolean>(false)

        /** 底部输入框 textarea 实例（由 Input.vue 注册） */
        const textareaRef = ref<{ $el: HTMLTextAreaElement } | null>(null)

        /** 当前回复目标（null 表示回复帖子，即发布一级评论） */
        const replyTarget = ref<ReplyInfo | null>(null)

        /** 重置评论列表（切换帖子时调用） */
        const reset = (pid: string) => {
            if (currentPid.value === pid) {
                isInitComment.value = false
                return
            }
            isInitComment.value = true
            currentPid.value = pid
            commentList.value = []
            paginator.value = { total: 0, page: 0, pageSize: 10 }
            subPaginatorMap.value = {}
            commentInput.value = ''
            replyTarget.value = null
        }

        /** 获取一级评论列表（分页追加） */
        const getCommentList = async () => {
            if (!isInitComment.value) return
            if (!currentPid.value) return
            if (isLoading.value) return
            if (!hasMore.value) return
            try {
                isLoading.value = true
                paginator.value.page += 1
                const response = await getCommentListApi({
                    pid: currentPid.value,
                    page: paginator.value.page,
                    pageSize: paginator.value.pageSize,
                })
                commentList.value.push(...response.list)
                paginator.value = response.paginator
            }
            catch (error) {
                paginator.value.page -= 1
                toast.error($t('playerCommunity.commentStore.toast.getCommentListFailed', { error }))
            }
            finally {
                isLoading.value = false
            }
        }

        /** 加载更多二级评论（追加到对应一级评论的 secondComments） */
        const getSubCommentList = async (root: string, page: number, pageSize: number) => {
            try {
                const response = await getSubCommentListApi({
                    root,
                    page,
                    pageSize,
                })
                return response
            }
            catch (error) {
                toast.error($t('playerCommunity.commentStore.toast.getSubCommentListFailed', { error }))
            }
            finally {
                expandingRootId.value = ''
            }
        }

        /** 发布评论 */
        const postComment = async () => {
            if (!commentInput.value.trim()) {
                toast.error($t('playerCommunity.commentStore.toast.emptyComment'))
                return
            }
            try {
                isPosting.value = true

                const params: PostCommentParams = {
                    pid: currentPid.value,
                    content: commentInput.value.trim(),
                    ...(replyTarget.value
                        ? {
                            root: replyTarget.value.root,
                            replyUid: replyTarget.value.replyUid,
                            level: replyTarget.value.level,
                        }
                        : {}),
                }

                const response = await postCommentApi(params)

                // commentInput.value = ''
                // replyTarget.value = null

                /** 发布成功后构建一级评论结构unshift到commentList */
                if (!replyTarget.value) {
                    commentList.value.unshift({
                        firstComment: {
                            id: response.id,
                            uid: response.uid,
                            pid: response.pid,
                            level: response.level,
                            root: response.root,
                            replyUid: response.replyUid,
                            content: response.content,
                            status: response.status,
                            likeCount: response.likeCount,
                            likeStatus: LikeStatusEnum.NOT_LIKE,
                            replyCount: response.replyCount,
                            createdAt: response.createdAt,
                            userInfo: {
                                id: response.userInfo.id,
                                avatar: response.userInfo.avatar,
                                nickName: response.userInfo.nickName,
                                level: response.userInfo.level,
                            },
                            replyUserInfo: null,
                        },
                        secondComments: [],
                    })
                }
                /** 构建二级评论结构unshift到对应一级评论的 secondComments */
                else {
                    commentList.value.find(item => item.firstComment.id === replyTarget.value?.root)?.secondComments.unshift({
                        id: response.id,
                        uid: response.uid,
                        pid: response.pid,
                        level: response.level,
                        root: response.root,
                        replyUid: response.replyUid,
                        content: response.content,
                        status: response.status,
                        likeCount: response.likeCount,
                        likeStatus: null,
                        replyCount: response.replyCount,
                        createdAt: response.createdAt,
                        userInfo: {
                            id: response.userInfo.id,
                            avatar: response.userInfo.avatar,
                            nickName: response.userInfo.nickName,
                            level: response.userInfo.level,
                        },
                        replyUserInfo: {
                            id: response.replyUserInfo.id,
                            nickName: response.replyUserInfo.nickName,
                        },
                    })
                }

                /** 清空输入框和回复目标 */
                commentInput.value = ''
                replyTarget.value = null
                isFocus.value = false
                toast.success($t('playerCommunity.commentStore.toast.postSuccess'))
            }
            catch (error) {
                toast.error($t('playerCommunity.commentStore.toast.postFailed', { error }))
            }
            finally {
                isPosting.value = false
            }
        }

        /** 点赞评论 */
        const likeComment = async (id: string) => {
            try {
                const response = await likeCommentApi({ id })
                const target = commentList.value.find(item => item.firstComment.id === id)
                if (target) {
                    target.firstComment.likeStatus = response.status
                    target.firstComment.likeCount += 1
                }
                toast.success($t('playerCommunity.commentStore.toast.likeSuccess'))
            }
            catch (error) {
                toast.error($t('playerCommunity.commentStore.toast.likeFailed', { error }))
            }
        }

        /** 取消点赞评论 */
        const cancelLikeComment = async (id: string) => {
            try {
                const response = await cancelLikeCommentApi({ id })
                const target = commentList.value.find(item => item.firstComment.id === id)
                if (target) {
                    target.firstComment.likeStatus = response.status
                    target.firstComment.likeCount -= 1
                }
                toast.success($t('playerCommunity.commentStore.toast.cancelLikeSuccess'))
            }
            catch (error) {
                toast.error($t('playerCommunity.commentStore.toast.cancelLikeFailed', { error }))
            }
        }

        /** 删除评论 */
        const deleteComment = async (id: string, level: CommentLevelEnum = CommentLevelEnum.FIRST) => {
            try {
                const response = await deleteCommentApi({ id })
                if (level === CommentLevelEnum.FIRST) {
                    const target = commentList.value.find(item => item.firstComment.id === id)
                    if (target) {
                        target.firstComment.status = response.status
                    }
                }
                else {
                    // toast.success('删除成功')
                    return response
                }
                toast.success($t('playerCommunity.commentStore.toast.deleteSuccess'))
            }
            catch (error) {
                toast.error($t('playerCommunity.commentStore.toast.deleteFailed', { error }))
            }
        }

        /** 确认删除评论 */
        const confirmDeleteComment = (id: string, level: CommentLevelEnum = CommentLevelEnum.FIRST) => {
            useConfirmDialog().open({
                title: $t('playerCommunity.commentStore.confirmDelete.title'),
                message: $t('playerCommunity.commentStore.confirmDelete.message'),
                okText: $t('playerCommunity.commentStore.confirmDelete.okText'),
                cancelText: $t('playerCommunity.commentStore.confirmDelete.cancelText'),
                onOk: () => {
                    deleteComment(id, level)
                },
            })
        }

        /** 清除回复目标（回到回复帖子状态） */
        const clearReplyTarget = () => {
            replyTarget.value = null
            commentInput.value = ''
        }

        /** 展开输入框并聚焦 textarea（等待展开动画 300ms 后执行） */
        const focusInput = () => {
            isFocus.value = true
            setTimeout(() => {
                textareaRef.value?.$el?.focus()
            }, 300)
        }

        /** 回复评论 */
        const replyComment = (level: CommentLevelEnum, target: ReplyInfo) => {
            if (replyTarget.value?.root === target.root) {
                return
            }
            replyTarget.value = {
                root: target.root,
                replyUid: target.replyUid,
                nickName: target.nickName,
                level,
            }
        }

        return {
            currentPid,
            isLoading,
            isPosting,
            commentList,
            paginator,
            hasMore,
            expandingRootId,
            subPaginatorMap,
            commentInput,
            isFocus,
            textareaRef,
            replyTarget,
            reset,
            focusInput,
            getCommentList,
            getSubCommentList,
            postComment,
            likeComment,
            cancelLikeComment,
            deleteComment,
            confirmDeleteComment,
            // setReplyTarget,
            clearReplyTarget,
            replyComment,
        }
    },
)

export { useCommentStore }
