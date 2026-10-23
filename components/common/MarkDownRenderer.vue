<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

defineProps<{
    value?: string
}>()
</script>

<template>
    <ClientOnly>
        <MdPreview :model-value="value" />
    </ClientOnly>
</template>
