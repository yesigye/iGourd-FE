<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton 
          v-auth="'customer_label_add'"
          type="primary"
          @click="handleAdd"
        >
          {{ t('employee.addButton') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useCustomerLabelList } from '../../hooks/use-customer-label-list';

defineOptions({
  name: 'ICustomerLabel',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = useCustomerLabelList();

// 添加标签
const handleAdd = () => {
  drawerApi.open();
};
</script>

