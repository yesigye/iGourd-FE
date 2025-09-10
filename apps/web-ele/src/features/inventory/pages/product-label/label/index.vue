<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('inventory.addProductLabel') }}
        </IgourdButton>
      </template>
      <template #table-field>
        
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { useI18n } from '@igourd/locales';
import { Page, IgourdButton } from '@igourd/common-ui';
import { useInventoryProductLabelList } from '../../hooks/use-inventory-product-label-list';

defineOptions({
  name: 'IInventoryProductLabelList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = useInventoryProductLabelList();
</script>
