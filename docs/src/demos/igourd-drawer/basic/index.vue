<script lang="ts" setup>
import { useIgourdDrawer, IgourdButton } from '@igourd/common-ui';

const [Drawer, drawerApi] = useIgourdDrawer();
</script>
<template>
  <div>
    <IgourdButton @click="() => drawerApi.open()">Open</IgourdButton>
    <Drawer class="w-[600px]" title="基础示例"> drawer content </Drawer>
  </div>
</template>
