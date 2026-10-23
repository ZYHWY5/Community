<script lang="ts" setup>
import { Skeleton } from '~/components/ui/skeleton'
</script>

<template>
    <div class="h-full flex flex-col rounded-xl overflow-y-auto">
        <!-- Partition 骨架屏 -->
        <div class="bg-white rounded-t-xl mb-2">
            <div class="p-4">
                <div class="flex gap-4">
                    <div
                        v-for="i in 4"
                        :key="i"
                        class="flex flex-col items-center gap-2"
                    >
                        <Skeleton class="w-[46px] h-[46px] rounded-xl" />
                        <Skeleton class="w-[46px] h-3 rounded" />
                    </div>
                </div>
            </div>
        </div>

        <!-- ItemList 骨架屏 -->
        <div class="space-y-2">
            <div
                v-for="i in 5"
                :key="i"
                class="bg-white px-4 py-2"
            >
                <!-- 用户信息行 -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Skeleton class="w-[18px] h-[18px] rounded-full shrink-0" />
                        <Skeleton class="w-20 h-3 rounded" />
                        <Skeleton class="w-8 h-3 rounded" />
                    </div>
                </div>
                <!-- 内容区域 -->
                <div class="mt-2 space-y-2">
                    <Skeleton class="w-3/5 h-4 rounded" />
                    <Skeleton class="w-full h-3 rounded" />
                    <Skeleton class="w-4/5 h-3 rounded" />
                    <!-- 图片占位 -->
                    <div class="flex gap-1 mt-2">
                        <Skeleton
                            v-for="j in 3"
                            :key="j"
                            class="w-[190px] h-[190px] rounded-xl shrink-0"
                        />
                    </div>
                </div>
                <!-- 底部信息行 -->
                <div class="flex items-center justify-between mt-2">
                    <Skeleton class="w-16 h-4 rounded-full" />
                    <div class="flex items-center gap-2">
                        <Skeleton class="w-10 h-3 rounded" />
                        <Skeleton class="w-10 h-3 rounded" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
