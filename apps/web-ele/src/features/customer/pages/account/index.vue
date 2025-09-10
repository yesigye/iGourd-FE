<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex gap-2">
          <IgourdButton 
            v-auth="'customer_account_add_revenue'"
            type="primary"
            @click="handleAddRevenue"
          >
            {{ t('customers.addRevenue') }}
          </IgourdButton>
          <IgourdButton 
            v-auth="'customer_account_add_expenditures'"
            type="danger"
            @click="handleAddExpenditures"
          >
            {{ t('customers.addExpenditures') }}
          </IgourdButton>
        </div>
      </template>
    </Grid>
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { Page, IgourdButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useCustomerAccountList } from '../../hooks/use-customer-account-list';

defineOptions({
  name: 'ICustomerAccount',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = useCustomerAccountList();

// 添加收入
const handleAddRevenue = () => {
  drawerApi.open({ type: 'revenue' });
};

// 添加支出
const handleAddExpenditures = () => {
  drawerApi.open({ type: 'expenditures' });
};
</script>

