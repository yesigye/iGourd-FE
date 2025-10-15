<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCollectionVoucher } from '@@/account/hooks';

defineOptions({
  name: 'ICollectionVoucher',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useCollectionVoucher();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton
          type="text"
          :disabled="row.review_status !== 'PENDING'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <!-- <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton> -->
        <ElButton type="text">
          {{ t('account.print') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
  </Page>
</template>
