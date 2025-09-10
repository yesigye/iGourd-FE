<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addOrder') }}
        </IgourdButton>
      </template>
      <template #action>
        <IgourdButton @click="drawerApi.open()">
          {{ t('common.edit') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseOrderList } from '../../hooks/use-purchase-order-list';

defineOptions({
  name: 'IPurchaseOrder',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseOrderList();
</script>
