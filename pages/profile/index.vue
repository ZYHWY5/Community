<script lang="ts" setup>
import MobileNav from '~/components/common/MobileNav.vue'
import Profile from '~/components/common/userSettingDialog/components/Profile.vue'

definePageMeta({
    layout: 'default',
    name: 'profile',
})
</script>

<template>
    <div>
        <Profile class="p-4" />
        <MobileNav />
    </div>
</template>
