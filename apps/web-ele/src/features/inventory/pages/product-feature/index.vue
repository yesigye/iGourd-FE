<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()" :disabled="isMaxItems">
          {{ t('common.create') }}
        </IgourdButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
<script setup lang="ts">
import { useI18n } from '@igourd/locales';
import { Page, IgourdButton } from '@igourd/common-ui';
import { useInventoryProductFeatureList } from '../../hooks/use-inventory-product-feature-list';

defineOptions({
  name: 'IInventoryProductFeatureList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi, isMaxItems } =
  useInventoryProductFeatureList();
</script>
