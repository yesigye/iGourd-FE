<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addReceipt') }}
        </IgourdButton>
      </template>
    </Grid>
  <Drawer />
</Page>
</template>
<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseReceiptList } from '../../hooks/use-purchase-receipt-list';

defineOptions({
  name: 'IPurchaseReceipt',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseReceiptList();
</script>
