<script setup lang="ts">
import { ElTooltip, Page } from '@igourd/common-ui';

import { useStorePayment } from '@@/store/hooks';

import StatusTemplate from '#/components/status/index.vue';

defineOptions({
  name: 'IStoreList',
});

const { Grid } = useStorePayment();

const ENROLL_STATUS_CONFIG = [
  {
    name: 'store-payment-list.enroll-status-pending',
    value: 'PENDING',
    iconColor: '#FFA000',
    textColor: '#CD8415',
  },
  {
    name: 'store-payment-list.enroll-status-approved',
    value: 'APPROVED',
    iconColor: '#13BA67',
  },
  {
    name: 'store-payment-list.enroll-status-rejected',
    value: 'REJECTED',
    iconColor: '#FFBBBB',
    textColor: '#FF0000',
    underline: true,
  },
];
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <StatusTemplate
          :value="row.merchant_enroll_model?.enroll_status"
          :status-list="ENROLL_STATUS_CONFIG"
        />
        <ElTooltip
          v-if="row.merchant_enroll_model?.enroll_status === 'REJECTED'"
          :content="row.merchant_enroll_model?.review_opinion"
        >
          <StatusTemplate
            :value="row.merchant_enroll_model?.enroll_status"
            :status-list="ENROLL_STATUS_CONFIG"
          />
        </ElTooltip>
      </template>
    </Grid>
  </Page>
</template>
