<script setup lang="ts">
import { ElCard } from '@igourd/common-ui';
import { defineEmits } from 'vue';

import { useProductLabelForm } from '../../hooks/product-label/form';

const emit = defineEmits(['refresh-tree']);

const { Drawer, Form } = useProductLabelForm(emit);
</script>

<template>
  <Drawer>
    <ElCard class="border-0" style="height: 99%">
      <Form />
    </ElCard>
  </Drawer>
</template>
<style lang="scss">
.code-rules-array-cards {
  .el-card {
    width: 100%;
  }

  .formily-element-plus-array-cards {
    display: flex;
    gap: 10px;

    .formily-element-plus-array-cards-item {
      flex: 1 1 0;
      width: 100%;
    }
  }
}
</style>
