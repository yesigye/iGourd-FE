<script setup lang="ts">
import { IgourdButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
// import { useInventoryProductLabelList } from '../../hooks/use-inventory-product-label-list';

defineOptions({
  name: 'IInventoryProductLabelList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = {};
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('inventory.addProductLabel') }}
        </IgourdButton>
      </template>
      <template #table-field> </template>
    </Grid>
    <Drawer />
  </Page>
</template>
