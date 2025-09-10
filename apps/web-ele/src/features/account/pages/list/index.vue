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
import { useAccountList } from '../../hooks';

defineOptions({
  name: 'IAccountList',
});

const { t } = useI18n();

// 使用列表逻辑
const { Grid, Drawer, drawerApi } = useAccountList();

// 处理添加
const handleAdd = () => {
  drawerApi.setData({}).open();
};
</script>

