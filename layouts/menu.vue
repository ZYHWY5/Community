<script setup lang="ts">
import MenuPageBox from '~/components/business/menu-page-box/Index.vue'

const route = useRoute()

// 从 route.meta 中读取 menuPageBox 配置
// 使用 computed 确保路由变化时能响应式更新
const menuPageBoxProps = computed(() => {
    return route.meta.menuPageBox || {}
})
</script>

<template>
    <MenuPageBox v-bind="menuPageBoxProps">
        <slot />
    </MenuPageBox>
</template>
