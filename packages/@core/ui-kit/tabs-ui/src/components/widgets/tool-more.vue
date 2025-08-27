<script lang="ts" setup>
import type { DropdownMenuProps } from '@igourd-core/shadcn-ui';

import { ChevronDown } from '@igourd-core/icons';
import { IgourdDropdownMenu } from '@igourd-core/shadcn-ui';

defineProps<DropdownMenuProps>();
</script>

<template>
  <IgourdDropdownMenu :menus="menus" :modal="false">
    <div
      class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
    >
      <ChevronDown class="size-4" />
    </div>
  </IgourdDropdownMenu>
</template>
