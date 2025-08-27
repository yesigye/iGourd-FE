<script setup lang="ts">
import type { CustomRenderType } from '../types';

import {
  FormLabel,
  IgourdHelpTooltip,
  IgourdRenderContent,
} from '@igourd-core/shadcn-ui';
import { cn } from '@igourd-core/shared/utils';

interface Props {
  class?: string;
  colon?: boolean;
  help?: CustomRenderType;
  label?: CustomRenderType;
  required?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormLabel :class="cn('flex items-center', props.class)">
    <span v-if="required" class="text-destructive mr-[2px]">*</span>
    <slot></slot>
    <IgourdHelpTooltip v-if="help" trigger-class="size-3.5 ml-1">
      <IgourdRenderContent :content="help" />
    </IgourdHelpTooltip>
    <span v-if="colon && label" class="ml-[2px]">:</span>
  </FormLabel>
</template>
