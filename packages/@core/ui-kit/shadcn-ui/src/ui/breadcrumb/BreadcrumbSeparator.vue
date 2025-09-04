<script lang="ts" setup>
import { cn } from '@igourd-core/shared/utils';

import { ChevronRight } from '@igourd-core/icons';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <li
    :class="cn('[&>svg]:size-3.5', props.class)"
    aria-hidden="true"
    role="presentation"
  >
    <slot>
      <ChevronRight />
    </slot>
  </li>
</template>
