<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('purchase.addReturned') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { usePurchaseReturnedList } from '../../hooks/use-purchase-returned-list';

defineOptions({
  name: 'IPurchaseReturned',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = usePurchaseReturnedList();
</script>