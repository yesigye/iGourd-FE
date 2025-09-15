<template>
  <div class="download-files">
    <div
      v-for="(file, index) in props.uploadedFiles"
      :key="index"
      class="download-file-item"
    >
      <span><i class="iconfont icon-icon_details"></i>{{ file.name }}</span>
      <el-link type="primary" @click="handleDownload(file)"
        ><i class="iconfont icon-import"></i
      ></el-link>
      <!-- <el-link type="success" @click="handlePreview(file)">预览</el-link> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElLink } from '@igourd/common-ui';
import { handleGlobalDownload } from '#/utils/global';
interface Props {
  uploadedFiles?: any;
}
const props = defineProps<Props>();
const handleDownload = async (file) => {
  handleGlobalDownload(file);
};
</script>
<style lang="scss" scoped>
.download-files {
  .download-file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #acaeb3;

    .icon-icon_details,
    .icon-import {
      font-size: 12px;
      color: #acaeb3;
      cursor: pointer;
    }
  }
}
</style>
