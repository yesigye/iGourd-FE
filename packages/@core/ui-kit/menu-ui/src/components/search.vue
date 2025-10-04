<script lang="ts" setup>
import { useSimpleLocale } from '@igourd-core/composables';

defineOptions({ name: 'MenuSearch' });
const { $t } = useSimpleLocale();
// @ts-ignore
// const { $t } = getCurrentInstance()!.ctx!;
</script>
<template>
  <li class="h-9 px-2" role="menuitem">
    <input
      class="h-full w-full border-0 bg-transparent pl-1 text-base text-white caret-white hover:bg-transparent focus-visible:outline-none"
      :placeholder="$t('search')"
    />
  </li>
</template>
