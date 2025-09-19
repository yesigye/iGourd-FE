<script setup lang="ts">
import { ColPage } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useInventoryProductSpec } from '@@/inventory/hooks';

defineOptions({
  name: 'IInventoryProductSpec',
});
const { t } = useI18n();

const { Grid } = useInventoryProductSpec();
</script>

<template>
  <ColPage auto-content-height>
    <template #left="{ isCollapsed, expand }">
      <section class="bg-card mb-5 h-full rounded p-2.5">
        <p class="text-sm font-medium">
          {{ t('product-group.product_category') }}
        </p>
      </section>
    </template>
    <Grid />
  </ColPage>
</template>
