<script setup lang="ts">
import {

  ElCard
} from '@igourd/common-ui';
import { useAddCustomizedForm } from '#/hooks/use-add-customized';

const { Drawer, Form } = useAddCustomizedForm();
</script>

<template>
  <Drawer>
    <ElCard class="border-0" style="height: 99%;">
    <Form />
    </ElCard>

  </Drawer>
</template>
