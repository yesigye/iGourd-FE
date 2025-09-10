<template>
  <Page auto-content-height>
    <Drawer />
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addPurchase') }}
        </IgourdButton>
      </template>
      <template #profile_photo> 123 头像 </template>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseList } from '../../hooks/use-purchase-list';

defineOptions({
  name: 'IPurchaseList',
});

const { t } = useI18n();

const { Grid, Drawer, drawerApi } = usePurchaseList();
</script>
