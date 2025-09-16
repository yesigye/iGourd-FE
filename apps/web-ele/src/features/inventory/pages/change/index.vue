<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryChangeList } from '../../hooks/change/list';

defineOptions({
  name: 'IInventoryChange',
});

const { t } = useI18n();
const { Grid } = useInventoryChangeList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <h2>{{ t('inventory.inventoryChangeLog') }}</h2>
      </template>
    </Grid>
  </Page>
</template>
