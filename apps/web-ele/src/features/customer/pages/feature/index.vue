<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton
          v-auth="'customer_customized_feature_add'"
          type="primary"
          :disabled="isMaxItems"
          @click="handleAdd"
        >
          {{ t('common.create') }}
        </IgourdButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useCustomerFeatureList } from '../../hooks/use-customer-feature-list';

defineOptions({
  name: 'ICustomerFeature',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi, isMaxItems } = useCustomerFeatureList();

// 添加特性
const handleAdd = () => {
  if (isMaxItems.value) {
    // 显示限制提示
    return;
  }
  drawerApi.open();
};
</script>
