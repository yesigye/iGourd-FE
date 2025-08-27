<script lang="ts" setup>
import { useIgourdModal, IgourdButton } from '@igourd/common-ui';

const [Modal, modalApi] = useIgourdModal();
</script>
<template>
  <div>
    <IgourdButton @click="() => modalApi.open()">Open</IgourdButton>
    <Modal class="w-[600px]" title="基础示例"> modal content </Modal>
  </div>
</template>
