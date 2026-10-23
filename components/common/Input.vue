<script lang="ts" setup>
import { cn } from '~/lib/utils'
import eyeClose from '~/assets/images/login/icon-eye-close.png'
import eyeOpen from '~/assets/images/login/icon-eye-open.png'

const props = defineProps<{
    /** v-model 的值 */
    modelValue?: string
    /** 输入框类型 */
    type?: string
    /** 占位符 */
    placeholder?: string
    /** 额外类名 */
    class?: string
    /** 输入框额外类名 */
    inputClass?: string
    /** 眼睛图标类名 */
    eyeClass?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
    blur: [event: FocusEvent]
    focus: [event: FocusEvent]
}>()

const inputType = ref(props.type || 'text')

const eyeUrl = computed(() => {
    return inputType.value === 'password' ? eyeClose : eyeOpen
})

const handleTypeChange = () => {
    if (inputType.value === 'password') {
        inputType.value = 'text'
    }
    else {
        inputType.value = 'password'
    }
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
    emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
    emit('focus', event)
}
</script>

<template>
    <div>
        <slot>
            <div>
                <div :class="cn('flex items-center w-full h-14 border border-gray-300 rounded-xl focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all', props.class)">
                    <input
                        :value="props.modelValue || ''"
                        :type="inputType"
                        :placeholder="props.placeholder || ''"
                        :class="cn('flex-1 h-full py-3 px-4 outline-none bg-transparent', props.inputClass)"
                        @input="handleInput"
                        @blur="handleBlur"
                        @focus="handleFocus"
                    >
                    <img
                        v-if="props.type === 'password'"
                        :src="eyeUrl"
                        :class="cn('w-4 h-4 mr-4 object-fill cursor-pointer', props.eyeClass)"
                        @click="handleTypeChange"
                    >
                </div>
            </div>
        </slot>
    </div>
</template>
