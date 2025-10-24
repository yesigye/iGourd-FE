<script setup lang="ts">
import { defineEmits } from 'vue';

import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['change']);
</script>
<template>
  <ElDropdown>
    <span class="el-dropdown-link">
      <slot></slot>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
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
