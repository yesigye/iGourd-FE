<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('inventory.addProductGroup') }}
        </IgourdButton>
      </template>
      <template #table-field>

      </template>
    </Grid>
  <Drawer />
</Page>
</template>
<script setup lang="ts">
import { useI18n } from '@igourd/locales';
import { Page, IgourdButton } from '@igourd/common-ui';
import { useInventoryProductGroupList } from '../../hooks/use-inventory-product-group-list';

defineOptions({
  name: 'IInventoryProductGroupList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = useInventoryProductGroupList();
</script>
