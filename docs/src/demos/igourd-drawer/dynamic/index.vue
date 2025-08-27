<script lang="ts" setup>
import { useIgourdDrawer, IgourdButton } from '@igourd/common-ui';

import ExtraDrawer from './drawer.vue';

const [Drawer, drawerApi] = useIgourdDrawer({
  // 连接抽离的组件
  connectedComponent: ExtraDrawer,
});

function open() {
  drawerApi.open();
}

function handleUpdateTitle() {
  drawerApi.setState({ title: '外部动态标题' }).open();
}
</script>

<template>
  <div>
    <Drawer />

    <IgourdButton @click="open">Open</IgourdButton>
    <IgourdButton class="ml-2" type="primary" @click="handleUpdateTitle">
      从外部修改标题并打开
    </IgourdButton>
  </div>
</template>
