<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addNewOrder') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseNewOrderList } from '../../hooks/use-purchase-new-order-list';

defineOptions({
  name: 'IPurchaseNewOrder',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseNewOrderList();
</script>