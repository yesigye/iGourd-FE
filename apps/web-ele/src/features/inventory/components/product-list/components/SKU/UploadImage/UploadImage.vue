<script lang="ts" setup>
import type { UploadInstance } from 'element-plus';

import { ref, watchEffect } from 'vue';

import { ElIcon, ElMessage, ElUpload } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { Plus } from '@element-plus/icons-vue';

import { upload } from '#/api/upload';

const props = defineProps({
  imgUrl: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['file-uploaded']);
const imageUrl = ref('');
const { t } = useI18n();
const uploadRef = ref<UploadInstance>();
const acceptedFormats = '.png, .jpg, .jpeg, .gif';

const beforeUpload = (file: File) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error(t('inventory.file_size_error'));
    return false;
  }

  return true;
};

const handleUpload = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const result = await upload(formData);
    imageUrl.value = result.url;
    emit('file-uploaded', result.data);

    ElMessage.success(t('inventory.upload_success'));
  } catch (error) {
    console.error('Upload failed:', error);
    ElMessage.error(t('product-list.upload-failed'));
  }
};
// 默认选中值
watchEffect(() => {
  if (props.imgUrl) {
    imageUrl.value = props.imgUrl;
  }
});
</script>

<template>
  <ElUpload
    ref="uploadRef"
    :show-file-list="false"
    drag
    :limit="1"
    :accept="acceptedFormats"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="avatar text-primary-text"
      style="width: 36px"
    />
    <ElIcon
      v-else
      color="hsl(var(--primary-500))"
      class="text-28 avatar-uploader-icon"
    >
      <Plus />
    </ElIcon>
  </ElUpload>
</template>

<style scoped>
.avatar-uploader .avatar {
  display: block;
  width: 36px;
  height: 36px;
}
</style>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 36px;
  height: 36px;
  font-size: 28px;
  text-align: center;
}
</style>
