<script lang="ts" setup>
import { ReviewStatusEnum } from '~/types/creator'

const props = withDefaults(defineProps<{
    status: ReviewStatusEnum
    showApproved?: boolean
}>(), {
    showApproved: true,
})
const { t: $t } = useI18n()
</script>

<template>
    <div>
        <!-- 待审核 -->
        <div v-if="props.status === ReviewStatusEnum.PENDING">
            {{ $t('playerCommunity.creatorReviewStatus.pending') }}
        </div>
        <!-- 审核通过 -->
        <div v-else-if="props.status === ReviewStatusEnum.APPROVED">
            {{ $t('playerCommunity.creatorReviewStatus.approved') }}
        </div>
        <!-- 审核拒绝 -->
        <div v-else-if="props.status === ReviewStatusEnum.REJECTED">
            {{ $t('playerCommunity.creatorReviewStatus.rejected') }}
        </div>
    </div>
</template>
