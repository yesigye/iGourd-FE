<script lang="ts" setup>
import { useIgourdModal } from '@igourd/common-ui';

const [Modal] = useIgourdModal({
  draggable: true,
});
</script>
<template>
  <Modal title="拖拽示例"> modal content </Modal>
</template>
