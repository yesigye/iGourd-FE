<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addBills') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseBillsList } from '../../hooks/use-purchase-bills-list';

defineOptions({
  name: 'IPurchaseBills',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseBillsList();
</script>