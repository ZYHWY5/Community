<script lang="ts" setup>
import Level from '../Level.vue'
import Tag from '../Tag.vue'
import ImgList from '../image/ImgList.vue'
import type { CommunityItem } from '~/types/community'
import { useCommunityStore } from '~/stores/community'
import { useCommentStore } from '~/stores/comment'

const { toDetail } = useCommunityStore()
const { reset } = useCommentStore()

const props = defineProps<{
    item: CommunityItem
}>()

const handleClick = () => {
    toDetail(props.item.id)
    /** 初始化评论列表 */
    reset(props.item.id)
}
</script>

<template>
    <div
        class="bg-white cursor-pointer"
        @click="handleClick"
    >
        <div class="px-4 py-2">
            <!-- 用户信息 and 额外操作按钮 -->
            <div class="flex items-center justify-between">
                <!-- 用户信息 -->
                <div class="flex items-center gap-2">
                    <!-- 头像 -->
                    <img
                        v-if="props.item.userInfo.face"
                        :src="props.item.userInfo.face"
                        class="w-[18px] h-[18px] rounded-full object-fill"
                    >
                    <Icon
                        v-else
                        name="cs-icon:user-bold"
                        class="w-[18px] h-[18px] rounded-full text-gray-300"
                    />
                    <!-- 昵称 -->
                    <span class="text-xs font-normal text-gray-600">
                        {{ props.item.userInfo.nickName }}
                    </span>
                    <!-- 等级 -->
                    <Level
                        :level="props.item.userInfo.level"
                    />
                </div>
                <!-- 额外操作 -->
            </div>
            <!-- 内容区域 -->
            <div class="mt-2">
                <!-- 标题 -->
                <h3 class="font-semibold">
                    {{ props.item.content.title }}
                </h3>
                <!-- 描述 -->
                <span class="block text-[15px] line-clamp-3">
                    {{ props.item.content.desc }}
                </span>
                <!-- 图片列表 -->
                <div class="mt-2">
                    <ImgList
                        :images="props.item.content.imgUrl"
                    />
                </div>
            </div>
            <!-- 底部信息 -->
            <div class="flex items-center justify-between mt-2">
                <!-- Tag -->
                <div>
                    <Tag
                        :item="props.item.content.tag"
                    />
                </div>
                <!-- 评论数 and 点赞数 -->
                <div class="flex items-center gap-2">
                    <!-- 评论数 -->
                    <div class="flex items-center gap-1 text-[13px] leading-4 text-gray-400">
                        <Icon
                            name="cs-icon:comment"
                            class="w-4 h-4 text-gray-300"
                        />
                        {{ props.item.commentCount }}
                    </div>
                    <!-- 点赞数 -->
                    <div class="flex items-center gap-1 text-[13px] leading-4 text-gray-400">
                        <Icon
                            name="cs-icon:like-blod"
                            class="w-4 h-4 text-gray-300"
                        />
                        {{ props.item.likeCount }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
