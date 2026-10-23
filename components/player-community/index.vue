<script lang="ts" setup>
import CommunityNav from '../common/CommunityNav.vue'
import HomeContent from './HomeContent.vue'
import MobileNav from '../common/MobileNav.vue'

useI18n(useLang('playerCommunity'))
</script>

<template>
    <!-- nav(顶部nav,中大屏展示) -->
    <div>
        <CommunityNav />
    </div>
    <!-- content -->
    <div>
        <HomeContent />
    </div>
    <!-- nav(底部nav,小屏展示) -->
    <div>
        <MobileNav />
    </div>
</template>
