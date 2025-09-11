<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('common.create') }}
        </IgourdButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseNewOrderHistoryList } from '../../hooks/use-purchase-new-order-history-list';

defineOptions({
  name: 'IPurchaseNewOrderHistory',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseNewOrderHistoryList();
</script>
