<script lang="ts" setup>
import { cn } from '~/lib/utils'

const props = defineProps<{
    /** 外层样式（boder、圆角等） */
    class?: string
    /** 输入框样式（padding、字体等） */
    inputClass?: string
    /** 最外层容器样式（控制宽度） */
    outClass?: string
    /** 输入框占位文本 */
    placeholder?: string
}>()

/** 搜索框内容 */
const searchInput = ref('')

/** 清空搜索框 */
const clear = () => {
    searchInput.value = ''
}
</script>

<template>
    <div
        :class="cn('w-full', props.outClass)"
    >
        <!-- 使用插槽支持整体自定义 -->
        <slot>
            <!-- input外层 -->
            <div
                :class="cn('flex items-center w-full border border-gray-200 rounded-md', props.class)"
            >
                <!-- input内层 input + icon -->
                <input
                    v-model="searchInput"
                    type="text"
                    :class="cn('py-1 px-2', props.inputClass)"
                    :placeholder="props.placeholder || 'Search...'"
                >
                <Icon
                    v-if="!searchInput"
                    name="cs-icon:search-regular"
                    size="16"
                    class="text-gray-400 mr-2"
                />
                <div
                    v-else
                    class="flex w-4 h-4 bg-gray-200 rounded-full items-center justify-center mr-2 cursor-pointer"
                    @click="clear"
                >
                    <Icon
                        name="cs-icon:close-bold"
                        size="10"
                        class="text-gray-400"
                    />
                </div>
            </div>
        </slot>
    </div>
</template>
