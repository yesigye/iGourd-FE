<script setup lang="ts">
import { ElCard } from '@igourd/common-ui';
import { defineEmits } from 'vue';

import { useTaxForm } from '../../hooks/tax/form';

const emit = defineEmits(['refresh-tree']);

const { Drawer, Form } = useTaxForm(emit);
</script>

<template>
  <Drawer>
    <ElCard class="border-0" style="height: 99%">
      <Form />
    </ElCard>
  </Drawer>
</template>
<style lang="scss"></style>
