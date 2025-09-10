<template>
  <Page auto-content-height>
    <Drawer />
    <Grid>
      <template #table-title>
        <IgourdButton @click="handleAdd">{{ t('account.add') }}</IgourdButton>
      </template>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { IgourdButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useAccountSubsidiaryLedgerList } from '../../hooks';

defineOptions({
  name: 'IAccountSubsidiaryLedgerList',
});

const { t } = useI18n();

// 使用列表逻辑
const { Grid, Drawer, drawerApi } = useAccountSubsidiaryLedgerList();

// 处理添加
const handleAdd = () => {
  drawerApi.setData({}).open();
};
</script>