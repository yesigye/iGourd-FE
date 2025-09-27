<template>
  <Modal :title="title">
    <p class="mb-2">标签名称</p>
    <ElInput v-model="orderHoldingTagName" placeholder="请输入快捷标签名称" />
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from '@igourd/locales';

import { useIgourdModal, ElInput } from '@igourd/common-ui';
import { createQuickTagsApi, editQuickTagsApi } from '@@/setting/apis/saleset';
const { t } = useI18n();
const orderHoldingTagName = ref('');
const QuickTagsId = ref('');
const title = ref('');
const emit = defineEmits(['confirm']);
const [Modal, modalApi] = useIgourdModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    addQuickTags();
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      let parms = modalApi.getData();
      if (parms.id) {
        // 编辑
        QuickTagsId.value = parms.id;
        orderHoldingTagName.value = parms.value;
        title.value = t('saleset.edit-quick-tag');
      } else {
        // 添加
        title.value = t('saleset.add-quick-tag');
        orderHoldingTagName.value = '';
      }
    }
  },
});
// 判断添加还是编辑
const addQuickTags = async () => {
  if (!orderHoldingTagName.value) return;
  // 判断添加还是编辑
  if (QuickTagsId.value) {
    // 编辑
    const result = await editQuickTagsApi({
      order_holding_tag_name: orderHoldingTagName.value,
      id: QuickTagsId.value,
    });
  } else {
    // 添加
    const result = await createQuickTagsApi({
      order_holding_tag_name: orderHoldingTagName.value,
    });
  }
  emit('confirm');
};
</script>
