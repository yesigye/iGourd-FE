<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
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
    <template #table-actions>
        <h2>{{ t('inventory.priceChangeLog') }}</h2>
      </template>
    </Grid>
  </Page>
</template>
