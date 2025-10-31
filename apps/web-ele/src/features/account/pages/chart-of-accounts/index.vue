<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, Page, useIgourdModal } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { trialBalanceCheck } from '@@/account/apis';
import BalanceItem from '@@/account/components/chart-of-accounts/BalanceItem/index.vue';
import { useChartOfAccounts } from '@@/account/hooks';

import trialIcon from '#/assets/account/trial-icon.svg';

defineOptions({
  name: 'IChartOfAccounts',
});

const { t } = useI18n();

const { Grid, handleEdit, handleBatchDelete, categories, typeRef, Drawer } =
  useChartOfAccounts();
const [model, modelApi] = useIgourdModal({
  title: t('chart-of-accounts.trial-balancing'),
  class: 'w-2/3',
  footer: false,
});
const trialBalancingData = ref({});
const handleTrialBalancing = async () => {
  const result = await trialBalanceCheck({});
  trialBalancingData.value = result;
  modelApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid :tabs="categories">
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit(undefined, 'ledger')">
          {{ t('account.add-sub-ledger') }}
        </ElButton>
        <ElButton type="primary" @click="handleEdit(undefined, 'subLedger')">
          {{ t('chart-of-accounts.add-account-ledger') }}
        </ElButton>
        <ElButton type="success" @click="handleTrialBalancing()">
          <img :src="trialIcon" class="mr-1 w-3" alt="" />
          {{ t('chart-of-accounts.trial-balancing') }}
        </ElButton>
      </template>

      <template #actions="{ row }">
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleEdit(row)"
        >
          {{ t('common.edit') }}
        </ElButton>
        <ElButton
          type="text"
          :disabled="row.source_type === 'SYSTEM'"
          @click="handleBatchDelete()"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #balance_direction="{ row }">
        {{ t(`enum.account-trial-balancing.${row.balance_direction}`) }}
      </template>
    </Grid>
    <Drawer :type="typeRef" />
    <model>
      <section class="flex h-full items-center justify-between">
        <BalanceItem :data="trialBalancingData?.opening_balance" />
        <div
          class="border border-dashed border-[#606266]"
          style="height: -webkit-fill-available"
        ></div>
        <BalanceItem :data="trialBalancingData?.cumulative_occurrence" />
        <div
          class="border border-dashed border-[#606266]"
          style="height: -webkit-fill-available"
        ></div>

        <BalanceItem :data="trialBalancingData?.opening_balance_sheet" />
      </section>
    </model>
  </Page>
</template>
