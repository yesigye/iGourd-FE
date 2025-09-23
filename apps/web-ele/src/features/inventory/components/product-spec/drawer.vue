<script setup lang="ts">
import { defineEmits } from 'vue';

import { useProductSpecForm } from '../../hooks/product-spec/form';

const emit = defineEmits(['refresh-tree']);

const { Drawer, Form } = useProductSpecForm(emit);
</script>

<template>
  <Drawer>
    <Form />
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
