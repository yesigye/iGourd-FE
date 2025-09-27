<template>
  <section
    class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
  >
    <div class="w-[230px] font-bold">version</div>
    <div class="flex gap-10">
      <!-- 插槽label -->
      <div class="flex w-[173px] gap-2">
        <ElInput></ElInput>
      </div>
      <div class="w-[500px]">
        <p>test</p>
      </div>
    </div>

    <div class="flex min-w-[120px] justify-end">
      <ElButton
        type="primary"
        :plain="info.isText"
        v-if="info.isEdit"
        @click="handleEditClick"
        >{{ info.isText ? t('common.edit') : t('common.save') }}</ElButton
      >
    </div>
  </section>
</template>
<script setup lang="ts">
import {
  ElButton,
  ElInput,
  ElSelect,
  ElUpload,
  ElMessage,
  ElOption,
} from '@igourd/common-ui';
import type { Component } from 'vue';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
const props = defineProps({
  info: {
    type: Object,
    default: () => ({
      title: '',
      value: '',
      isEdit: false,
      isText: true,
      type: [],
      key: [],
    }),
  },
  settingInfo: {
    type: Object,
    default: () => ({}),
  },
  api: {
    type: Function,
    default: () => {},
  },
});
const handleEditClick = async () => {
  props.info.isText = !props.info.isText;
  let info = {};
  props.info.key.forEach((item) => {
    info[item] = props.settingInfo[item];
  });
  if (props.info.isText) {
    await props.api({
      ...props.settingInfo,
      ...info,
    });
    ElMessage.success('修改成功');
  }
};
</script>
