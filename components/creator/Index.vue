<script lang="ts" setup>
import CreatorNav from '../common/CreatorNav.vue'
import Content from './Content.vue'
import MobileNav from '../common/MobileNav.vue'

useI18n(useLang('playerCommunity'))
</script>

<template>
    <!-- nav(顶部nav,中大屏展示) -->
    <div>
        <CreatorNav />
    </div>
    <!-- content -->
    <div>
        <Content />
    </div>
    <!-- nav(底部nav,小屏展示) -->
    <div>
        <MobileNav />
    </div>
</template>
