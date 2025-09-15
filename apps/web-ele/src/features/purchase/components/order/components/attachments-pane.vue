<template>
  <div class="content-output">
    <p class="content-textarea-remark-title">{{ t('common.Attachment') }}</p>
    <UploadFiles
      ref="uploadFilesRef"
      :limit="1"
      :disabled="disabled"
      @handle-upload-files="onUpload"
    />
    <div class="drawer-content-table-attachment">
      <div v-if="form.attachment_name" class="download-files">
        <span class="download-file-item">
          <i class="iconfont icon-icon_details icon-icon_details-red" />
          {{ form.attachment_name }}
        </span>
        <el-link type="primary" @click="$emit('download', form)">
          <i class="iconfont icon-import icon-icon_details-import" />
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadFiles } from '#/components';
import { ElLink } from "@igourd/common-ui"
import type { PurchaseOrderForm } from '../../../types';
import { useI18n } from '@igourd/locales';

const { t } = useI18n();

const props = defineProps<{
  disabled?: boolean;
  form: PurchaseOrderForm;
}>();

const emit = defineEmits<{
  (e: 'uploaded', fileList: any): void;
  (e: 'download'): void;
}>();

function onUpload(fileList: any) {
  emit('uploaded', fileList);
}
</script>

<style scoped>
.content-output {
  width: 600px;
  padding: 3px;
}

.download-files {
  display: flex;
  justify-content: space-between;
  background-color: #f5f7fa;
}

.download-file-item {
  color: skyblue;
}
</style>
