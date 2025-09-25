<template>
  <section
    class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
  >
    <div class="w-[230px] font-bold">{{ info.title }}</div>
    <div class="flex gap-10">
      <!-- 插槽label -->
      <div class="flex w-[173px] gap-2">
        <p v-if="info.isText" v-for="itemKey in info.key">
          {{ settingInfo[itemKey] }}
        </p>
        <template v-for="(itemType, itemIndex) in info.type" v-else>
          <ElInput
            v-model="settingInfo[info.key[itemIndex]]"
            v-if="itemType === 'ElInput'"
          ></ElInput>
          <ElSelect
            v-model="settingInfo[info.key[itemIndex]]"
            v-if="itemType === 'ElSelect'"
          >
            <ElOption
              v-for="itemOption in info.options[itemIndex]"
              :key="itemOption.value"
              :label="itemOption.label"
              :value="itemOption.value"
            >
              {{ itemOption.label }}</ElOption
            >
          </ElSelect>
          <ElUpload
            v-model="settingInfo[info.key[itemIndex]]"
            v-if="itemType === 'ElUpload'"
          ></ElUpload>
        </template>
      </div>
      <div class="w-[500px]">
        <p>{{ info?.label }}</p>
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
const components: Record<string, Component> = {
  ElInput,
  ElSelect,
  ElUpload,
};
const handleEditClick = async () => {
  props.info.isText = !props.info.isText;

  let info = {};
  props.info.key.forEach((item) => {
    info[item] = props.settingInfo[item];
  });
  console.log('props.info.isText', info);
  if (props.info.isText) {
    await props.api({
      ...props.settingInfo,
      ...info,
    });
    ElMessage.success('修改成功');
  }
};
</script>
