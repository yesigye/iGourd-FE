<script lang="ts" setup>
import { IgourdButton, Page } from '@igourd/common-ui';
import { useAccountClassificationList } from '../../hooks';

defineOptions({
  name: 'IAccountClassificationList',
});

// 使用列表逻辑
const { Grid, Drawer } = useAccountClassificationList();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton>新增</IgourdButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>