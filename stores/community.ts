import View from '~/components/player-community/View.vue' /* 列表 */
import Detail from '~/components/player-community/Detail.vue' /* 详情 */
import { CommunityStatusEnum } from '~/types/community'
import type { CommunityItem, Paginator, GetCommunityDetailResponse } from '~/types/community'
import { getCommunityList as getCommunityListApi, getCommunityDetail as getCommunityDetailApi } from '~/api/player-community'

const useCommunityStore = defineStore(
    'community',
    () => {
        const toast = useToast()

        /** 当前状态 */
        const currentStatus = ref<CommunityStatusEnum>(CommunityStatusEnum.LIST)

        /** 加载状态 */
        const isLoading = ref(false)

        /** 列表数据 */
        const itemList = ref<CommunityItem[]>([])

        /** 分页信息 */
        const paginator = ref<Paginator>({
            total: 0,
            page: 0,
            pageSize: 10,
        })

        /** 详情数据 */
        const detail = ref<GetCommunityDetailResponse | null>(null)

        /** 评论输入框内容 */
        const commentInput = ref<string>('')

        /** 是否显示移动端导航 */
        const isShowMobileNav = computed(() => {
            if (currentStatus.value === CommunityStatusEnum.LIST) {
                return true
            }
            return false
        })

        /** 是否还有更多数据 */
        const hasMore = computed(() => {
            if (paginator.value.page === 0) return true
            return paginator.value.page * paginator.value.pageSize < paginator.value.total
        })

        /** 当前组件(根据当前状态返回对应的组件) */
        const currentComponents = computed(() => {
            if (currentStatus.value === CommunityStatusEnum.LIST) {
                return View
            }
            else if (currentStatus.value === CommunityStatusEnum.DETAIL) {
                return Detail
            }
            return View
        })

        /** 设置当前状态(内部方法) */
        const setCurrentStatus = (status: CommunityStatusEnum) => {
            if (currentStatus.value === status) return
            currentStatus.value = status
        }

        /** 获取社区帖子列表 */
        const getCommunityList = async () => {
            try {
                isLoading.value = true
                paginator.value.page += 1
                const response = await getCommunityListApi({
                    page: paginator.value.page,
                    pageSize: paginator.value.pageSize,
                })
                itemList.value.push(...response.list)
                paginator.value = response.paginator
            }
            catch (error) {
                toast.error(`list request failed ${error}`)
            }
            finally {
                isLoading.value = false
            }
        }

        /** 获取社区帖子详情 */
        const getCommunityDetail = async (id: string) => {
            try {
                isLoading.value = true
                const response = await getCommunityDetailApi({
                    id,
                })
                detail.value = response
            }
            catch (error) {
                toast.error(`detail request failed ${error}`)
            }
            finally {
                isLoading.value = false
            }
        }

        /** 跳转至详情页 */
        const toDetail = async (id: string) => {
            setCurrentStatus(CommunityStatusEnum.DETAIL)
            if (detail.value?.id === id) return
            detail.value = null
            await getCommunityDetail(id)
        }

        /** 返回列表页 */
        const toList = () => {
            setCurrentStatus(CommunityStatusEnum.LIST)
        }

        return {
            currentStatus,
            isLoading,
            itemList,
            isShowMobileNav,
            hasMore,
            detail,
            paginator,
            currentComponents,
            commentInput,
            getCommunityList,
            getCommunityDetail,
            toDetail,
            toList,
        }
    },
)

export { useCommunityStore }
