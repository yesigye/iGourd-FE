<script setup lang="ts">
import type { PrimitiveProps } from 'radix-vue';

import { Dot } from '@igourd-core/icons';
import { Primitive, useForwardProps } from 'radix-vue';

const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive v-bind="forwardedProps">
    <slot>
      <Dot />
    </slot>
  </Primitive>
</template>
