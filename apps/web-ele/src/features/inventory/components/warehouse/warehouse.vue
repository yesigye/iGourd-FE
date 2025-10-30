<script lang="ts" setup>
import { ElCard } from '@igourd/common-ui';
import { useWarehouseForm } from '@@/inventory/hooks/warehouse/form';

const { Drawer, Form } = useWarehouseForm();
</script>
<template>
  <Drawer>
    <ElCard class="border-0" style="height: 99%">
      <Form />
    </ElCard>
  </Drawer>
</template>
