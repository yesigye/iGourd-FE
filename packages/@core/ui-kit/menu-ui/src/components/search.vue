<script lang="ts" setup>
import { useSimpleLocale } from '@igourd-core/composables';

defineOptions({ name: 'MenuSearch' });
const { $t } = useSimpleLocale();
// @ts-ignore
// const { $t } = getCurrentInstance()!.ctx!;
</script>
<template>
  <li class="igourd-menu-item h-9 hover:text-white hover:bg-transparent is-search" role="menuitem">
    <div class="igourd-menu-item__content ">
      <input
        class="h-full w-full border-0 bg-transparent text-base text-white caret-white hover:bg-transparent focus-visible:outline-none"
        :placeholder="$t('search')"
      />
    </div>
  </li>
</template>
