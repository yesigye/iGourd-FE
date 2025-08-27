<script lang="ts" setup>
import { IGOURD_DOC_URL } from '@igourd/constants';
import { openWindow } from '@igourd/utils';

import { Button } from 'ant-design-vue';

const props = defineProps<{ path: string }>();

function handleClick() {
  // 如果没有.html，打开页面时可能会出现404
  const path =
            IGOURD_DOC_URL +
    (props.path.toLowerCase().endsWith('.html')
      ? props.path
      : `${props.path}.html`);
  openWindow(path);
}
</script>

<template>
  <Button @click="handleClick">查看组件文档</Button>
</template>
