<script lang="ts" setup>
import CommunityItem from './CommunityItem.vue'

const { t: $t } = useI18n()

const itemList = [
    {
        url: 'https://cdn.max-c.com/mobile/app/icon/ccb3c23e275bef48aa7863ac5609ce8b.png',
        name: $t('playerCommunity.recommend.items.steam'),
    },
    {
        url: 'https://cdn.max-c.com/heybox/dailynews/img/fa8928d8fa5a73dde6fab2a4e0056b0f.png',
        name: $t('playerCommunity.recommend.items.communityTwo'),
    },
    {
        url: 'https://cdn.max-c.com/heybox/dailynews/img/f0991e9069a26269aa41340a7ed7d613.png',
        name: $t('playerCommunity.recommend.items.communityThree'),
    },
]
</script>

<template>
    <div class="w-full bg-white rounded-xl">
        <div class="p-4 py-3">
            <!-- title -->
            <p class="text-[16px] font-semibold">
                {{ $t('playerCommunity.recommend.title') }}
            </p>
            <!-- list -->
            <div>
                <CommunityItem 
                    v-for="item in itemList"
                    :key="item.name"
                    :item="item"
                />
            </div>
        </div>
    </div>
</template>
