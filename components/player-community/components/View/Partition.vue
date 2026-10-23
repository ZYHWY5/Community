<script lang="ts" setup>
import PartitionItem from './PartitionItem.vue'
const { t: $t } = useI18n()

const itemLIst = [
    {
        imgUrl: 'https://cdn.max-c.com/heybox/dailynews/img/b3c6f2f9af2eea0d97ca0ef811d9821c.png',
        title: $t('playerCommunity.partition.items.partition1'),
    },
    {
        imgUrl: 'https://cdn.max-c.com/heybox/dailynews/img/fa8928d8fa5a73dde6fab2a4e0056b0f.png',
        title: $t('playerCommunity.partition.items.partition2'),
    },
    {
        imgUrl: 'https://cdn.max-c.com/heybox/dailynews/img/f0991e9069a26269aa41340a7ed7d613.png',
        title: $t('playerCommunity.partition.items.partition3'),
    },
]
</script>

<template>
    <div class="bg-white rounded-t-xl mb-2">
        <div class="p-4">
            <div class="flex gap-4">
                <PartitionItem
                    v-for="item in itemLIst"
                    :key="item.title"
                    :item="item"
                />
            </div>
        </div>
    </div>
</template>
