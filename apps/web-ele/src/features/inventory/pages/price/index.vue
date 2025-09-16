<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryPriceList } from '../../hooks/price/list';

defineOptions({
  name: 'IInventoryPrice',
});

const { t } = useI18n();
const { Grid } = useInventoryPriceList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <h2>{{ t('inventory.priceChangeLog') }}</h2>
      </template>
    </Grid>
  </Page>
</template>
