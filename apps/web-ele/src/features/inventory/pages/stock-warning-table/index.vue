<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { ElButton } from '@igourd/common-ui';
import { useStockWarningTable } from '@@/inventory/hooks';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
import { useRouter } from 'vue-router';
defineOptions({
  name: 'IInventory',
});
const router = useRouter();
const { Grid, canBatchOperate,checkedKeys } = useStockWarningTable();
const createPurchaseOrder = () => {
  console.log(checkedKeys,'checkedKeys')

  let idList = canBatchOperate.value.map((item) => item.id);
  router.push({
    path: '/purchase/order',
    query: {  id_list: idList.join(',') },
  });
};
</script>

<template>
  <Page auto-content-height>
    <template #title>
      <div class="flex justify-end">
        <ElButton
          type="primary"
          @click="createPurchaseOrder"
          v-if="canBatchOperate"
        >
          {{ t('stock-warning-table.create-pruchase-order') }}</ElButton
        >
      </div>
    </template>
    <Grid> </Grid>
  </Page>
</template>
