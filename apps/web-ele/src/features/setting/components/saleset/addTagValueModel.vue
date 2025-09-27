<template>
  <Modal :title="title">
    <p class="mb-2">标签值</p>
    <ElInput v-model="orderHoldingTagName" placeholder="请输入标签值" />
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from '@igourd/locales';

import { useIgourdModal, ElInput } from '@igourd/common-ui';
import {
  createQuickTagsValueApi,
  editQuickTagsValueApi,
} from '@@/setting/apis/saleset';
const { t } = useI18n();
const orderHoldingTagName = ref('');
const QuickTagsId = ref('');
const QuickTagsValueId = ref('');
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
      if (parms.tagValueId) {
        // 编辑
        QuickTagsId.value = parms.tagId;
        QuickTagsValueId.value = parms.tagValueId;
        orderHoldingTagName.value = parms.value;
        title.value = t('saleset.edit-quick-tag');
      } else {
        // 添加
        QuickTagsId.value = parms.tagId;
        orderHoldingTagName.value = '';

        title.value = t('saleset.add-quick-tag');
      }
    }
  },
});
// 判断添加还是编辑
const addQuickTags = async () => {
  if (!orderHoldingTagName.value) return;
  // 判断添加还是编辑
  if (QuickTagsValueId.value) {
    // 编辑
    const result = await editQuickTagsValueApi({
      order_holding_tag_value: orderHoldingTagName.value,
      id: QuickTagsValueId.value,
    });
  } else {
    // 添加
    const result = await createQuickTagsValueApi({
      order_holding_tag_id: QuickTagsId.value,
      order_holding_tag_value: orderHoldingTagName.value,
    });
  }
  emit('confirm');
};
</script>
