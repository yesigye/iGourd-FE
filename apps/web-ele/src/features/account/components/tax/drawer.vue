<script setup lang="ts">
import { defineEmits } from 'vue';

import { useTaxForm } from '../../hooks/tax/form';

const emit = defineEmits(['refresh-tree']);

const { Drawer, Form } = useTaxForm(emit);
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
<style lang="scss"></style>
