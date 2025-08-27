<script lang="ts" setup>
import { useIgourdModal, IgourdButton } from '@igourd/common-ui';

import ExtraModal from './modal.vue';

const [Modal, modalApi] = useIgourdModal({
  // 连接抽离的组件
  connectedComponent: ExtraModal,
});

function openModal() {
  modalApi.open();
}
</script>

<template>
  <div>
    <Modal />
    <IgourdButton @click="openModal">Open</IgourdButton>
  </div>
</template>
