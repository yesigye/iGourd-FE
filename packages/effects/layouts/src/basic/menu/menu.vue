<script lang="ts" setup>
import type { MenuRecordRaw } from '@igourd/types';

import type { MenuProps } from '@igourd-core/menu-ui';

import { Menu } from '@igourd-core/menu-ui';
import { useAccessStore } from '@igourd/stores';

interface Props extends MenuProps {
  menus?: MenuRecordRaw[];
}
const { toggleCollect } = useAccessStore();
const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  menus: () => [],
});

const emit = defineEmits<{
  open: [string, string[]];
  select: [string, string?];
}>();

function handleMenuSelect(key: string) {
  emit('select', key, props.mode);
}

function handleMenuOpen(key: string, path: string[]) {
  emit('open', key, path);
}
</script>

<template>
  <Menu
    :accordion="accordion"
    :collapse="collapse"
    :popover="popover"
    :collapse-show-title="collapseShowTitle"
    :default-active="defaultActive"
    :menus="menus"
    :mode="mode"
    :rounded="rounded"
    scroll-to-active
    :theme="theme"
    :onToggleCollect="toggleCollect"
    @open="handleMenuOpen"
    @select="handleMenuSelect"
  />
</template>
