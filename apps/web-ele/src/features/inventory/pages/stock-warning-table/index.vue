<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useStockWarningTable } from '@@/inventory/hooks';

defineOptions({
  name: 'IInventory',
});
const { t } = useI18n();
const router = useRouter();
const { Grid, canBatchOperate, checkedKeys } = useStockWarningTable();
const createPurchaseOrder = () => {
  router.push({
    path: '/purchase/order',
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
