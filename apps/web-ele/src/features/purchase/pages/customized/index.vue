<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addPurchase') }}
        </IgourdButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseCustomizedList } from '../../hooks/use-purchase-customized-list';

defineOptions({
  name: 'IPurchaseCustomized',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseCustomizedList();
</script>
