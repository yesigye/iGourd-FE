<script lang="ts" setup>
import { ElCard } from '@igourd/common-ui';
import { useUnitForm } from '@@/inventory/hooks/unit/form';

const { Drawer, Form } = useUnitForm();
</script>
<template>
  <Drawer>
    <ElCard class="border-0" style="height: 99%">
      <Form />
    </ElCard>
  </Drawer>
</template>
