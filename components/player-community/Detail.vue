<script lang="ts" setup>
import UserFace from '~/components/common/UserFace.vue'
import Level from '~/components/player-community/components/Level.vue'
import MarkDownRenderer from '~/components/common/MarkDownRenderer.vue'
import Tag from '~/components/player-community/components/Tag.vue'
import Input from '~/components/player-community/components/Detail/Input.vue'
import ImgCarousel from '~/components/player-community/components/image/ImgCarousel.vue'
import Comment from '~/components/player-community/components/comment/index.vue'
import { timeToText } from '~/utils/timeToText'
import { useCommunityStore } from '~/stores/community'

const { toList } = useCommunityStore()
const { detail } = storeToRefs(useCommunityStore())
const { t: $t } = useI18n()
/** 评论 store */
const commentStore = useCommentStore()
const { commentInput } = storeToRefs(commentStore)

const handleBack = () => {
    toList()
}
</script>

<template>
    <div class="w-full h-full bg-white rounded-xl overflow-y-auto animate-fade-up-translate-y-d1">
        <!-- 顶部按钮 -->
        <div class="sticky top-0 z-10 bg-white rounded-t-xl px-4 pt-4 pb-2">
            <Button
                variant="ghost"
                class="w-[70px] h-[28px] bg-gray-100 text-gray-700"
                @click="handleBack"
            >
                <Icon
                    name="cs-icon:arrow-back-ios"
                    size="16"
                />
                <div>{{ $t('playerCommunity.detail.back') }}</div>
            </Button>
        </div>
        <!-- 滚动内容区 -->
        <div class="px-4 pb-4 isolate">
            <!-- img组件（未实现） -->
            <ImgCarousel
                :images="detail?.content.imgUrl || []"
                class="w-full max-h-[392px] rounded-xl overflow-hidden mt-4"
            />
            <!-- 用户信息 -->
            <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <!-- 用户头像 -->
                    <UserFace
                        :is-quick-penal="false"
                        class="w-9 h-9"
                    />
                    <!-- 用户昵称 -->
                    <div class="text-sm font-medium text-gray-900">
                        {{ detail?.userInfo.nickName }}
                    </div>
                    <!-- 用户等级 -->
                    <Level
                        :level="detail?.userInfo.level || 0"
                    />
                </div>
                <!-- 关注 -->
                <div>
                    <Button
                        variant="ghost"
                        class="max-w-[70px] h-[22px] bg-gray-900 text-gray-100 hover:bg-gray-900 hover:text-gray-100 active:bg-gray-900 active:text-gray-100"
                    >
                        <Icon
                            name="cs-icon:plus-bold"
                            size="12"
                        />
                        <div class="font-medium text-xs">
                            {{ $t('playerCommunity.detail.follow') }}
                        </div>
                    </Button>
                </div>
            </div>
            <!-- 标题 -->
            <div class="mt-4">
                <div class="text-xl font-medium text-gray-900">
                    {{ detail?.content.title }}
                </div>
            </div>
            <!-- 内容 -->
            <div class="mt-4">
                <MarkDownRenderer :value="detail?.content.content" />
            </div>
            <!-- tag -->
            <div class="mt-4">
                <Tag
                    v-if="detail?.content.tag"
                    :item="detail?.content.tag"
                    class="w-fit"
                />
            </div>
            <!-- time -->
            <div class="mt-4">
                <div class="text-sm text-gray-500">
                    {{ timeToText(detail?.createTime || '') }}
                </div>
            </div>
            <!-- comment -->
            <div class="mt-4">
                <Comment />
            </div>
        </div>
        <!-- 底部评论 + 点赞、收藏、评论 按钮 -->
        <div class="sticky bottom-0 z-10 bg-white rounded-b-xl px-4 py-2">
            <Input
                v-model="commentInput"
                :like-count="detail?.likeCount || 0"
                :comment-count="detail?.commentCount || 0"
                :is-like="detail?.isLike || false"
                :is-collect="detail?.isCollect || false"
            />
        </div>
    </div>
</template>
