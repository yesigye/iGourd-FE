<script setup lang="ts">
import { useProductGroupForm } from '../../hooks/product-group/form';

const { Drawer, Form } = useProductGroupForm();
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
