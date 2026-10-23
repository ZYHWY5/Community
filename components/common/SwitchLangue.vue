<script lang="ts" setup>
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '~/components/ui/select'

const { currentLanguage, switchLanguageList, switchLanguage } = useSwitchLanguage()

/** 切换语言 */
const handleSwitchLanguage = (code: (typeof switchLanguageList.value)[number]['code'] | undefined) => {
    if (!code) return
    if (code === currentLanguage?.value?.code) return
    switchLanguage(code)
}
</script>

<template>
    <ClientOnly>
        <Select class="shrink-0">
            <SelectTrigger class="max-w-[100px] h-[32px] text-xs rounded-xl">
                <span class="truncate">
                    {{ currentLanguage?.name }}
                </span>
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    v-for="item in switchLanguageList"
                    :key="item.code"
                    :value="item.code"
                    @click="handleSwitchLanguage(item.code)"
                >
                    {{ item.name }}
                </SelectItem>
            </SelectContent>
        </Select>
    </ClientOnly>
</template>