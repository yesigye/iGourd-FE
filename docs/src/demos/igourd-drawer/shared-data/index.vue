<script lang="ts" setup>
import { useIgourdDrawer, IgourdButton } from '@igourd/common-ui';

import ExtraDrawer from './drawer.vue';

const [Drawer, drawerApi] = useIgourdDrawer({
  // 连接抽离的组件
  connectedComponent: ExtraDrawer,
});

function open() {
  drawerApi
    .setData({
      content: '外部传递的数据 content',
      payload: '外部传递的数据 payload',
    })
    .open();
}
</script>

<template>
  <div>
    <Drawer />

    <IgourdButton @click="open">Open</IgourdButton>
  </div>
</template>
