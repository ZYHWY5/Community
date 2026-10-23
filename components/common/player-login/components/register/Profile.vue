<script lang="ts" setup>
import Selector from '~/components/common/Selector.vue'
import { useLogin } from '../../useLogin'
import { storeToRefs } from 'pinia'
import FileUpload from '~/components/common/fileInput/Main.vue'

const { registerFormData, carctorList } = storeToRefs(useLogin())
</script>

<template>
    <div>
        <div class="p-6">
            <!-- Carctor -->
            <Selector
                v-model="registerFormData.carctor"
                :options="carctorList"
            />
            <!-- 文件上传 -->
            <FileUpload
                v-model="registerFormData.resourceList"
            />
        </div>
    </div>
</template>
