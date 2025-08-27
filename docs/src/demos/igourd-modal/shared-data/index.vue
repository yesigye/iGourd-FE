<script lang="ts" setup>
import { useIgourdModal, IgourdButton } from '@igourd/common-ui';

import ExtraModal from './modal.vue';

const [Modal, modalApi] = useIgourdModal({
  // 连接抽离的组件
  connectedComponent: ExtraModal,
});

function openModal() {
  modalApi
    .setData({
      content: '外部传递的数据 content',
      payload: '外部传递的数据 payload',
    })
    .open();
}
</script>

<template>
  <div>
    <Modal />

    <IgourdButton @click="openModal">Open</IgourdButton>
  </div>
</template>
