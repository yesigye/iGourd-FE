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

function handleUpdateTitle() {
  modalApi.setState({ title: '外部动态标题' }).open();
}
</script>

<template>
  <div>
    <Modal />

    <IgourdButton @click="openModal">Open</IgourdButton>
    <IgourdButton class="ml-2" type="primary" @click="handleUpdateTitle">
      从外部修改标题并打开
    </IgourdButton>
  </div>
</template>
