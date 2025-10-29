<script setup lang="ts">
import { defineEmits } from 'vue';

import { ArrowDown } from '@element-plus/icons-vue';
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
} from 'element-plus';

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['change']);
</script>
<template>
  <ElDropdown size="small">
    <span class="el-dropdown-link">
      <slot></slot>
      <ElIcon class="el-icon--right">
        <ArrowDown />
      </ElIcon>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="item of props.options"
          :key="item.label"
          @click="emit('change', item)"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
