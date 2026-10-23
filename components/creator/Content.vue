<script lang="ts" setup>
import RouterNav from '../player-community/components/RouterNav.vue'
import Selection from '../common/Selection.vue'

const creatorStore = useCreatorStore()
const { currentStatus, selections, currentComponent, scrollAreaRef } = storeToRefs(creatorStore)
const { isShowMobileNav } = storeToRefs(useCommunityStore())
</script>

<template>
    <div
        class="flex sm:gap-4 w-full sm:h-[calc(100vh-6.5rem)] sm:mt-6 lg:mt-20 sm:px-12"
        :class="isShowMobileNav ? 'h-[calc(100vh-50px)]' : 'h-screen'"
    >
        <div>
            <RouterNav />
        </div>
        <div class="flex-1 min-w-0">
            <div
                ref="scrollAreaRef"
                class="w-full min-w-0 h-full bg-white rounded-xl px-4 py-0 overflow-x-hidden overflow-y-auto"
            >
                <!-- 选择项 -->
                <Selection
                    v-model="currentStatus"
                    :selections="selections"
                    class="w-full bg-white pt-4 sticky top-0 z-10 pb-1"
                />
                <!-- 当前组件 -->
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <component
                        :is="currentComponent"
                        :key="currentStatus"
                        class="mt-4"
                    />
                </transition>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 组件切换动画 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
