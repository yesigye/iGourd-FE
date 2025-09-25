<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  ElButton,
  ElTabPane,
  ElTabs,
  Page,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useChartOfAccounts } from '@@/account/hooks';

import { useLanguage } from '#/hooks';

import drawerSubject from '../../components/chart-of-accounts/drawer-subject.vue';
import drawer from '../../components/chart-of-accounts/drawer.vue';

defineOptions({
  name: 'IChartOfAccounts',
});

const { t } = useI18n();

const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});
const [DrawerSubject, drawerSubjectApi] = useIgourdDrawer({
  connectedComponent: drawerSubject,
  appendToMain: true,
});

const { Grid, handleEdit, handleBatchDelete, handleQueryTable } =
  useChartOfAccounts();

// 页签数据
const tabsData = ref([]);
// 当前页签
const activeName = ref('');
// 当前分类
const currentCategoryEnum = ref();
const isLoadGrid = ref(false);
// 获取分类数据及设置默认tab
const accountLedgerCategoryEnum = async () => {
  const enumData = await useLanguage(
    'basics.accounting.account-ledger-category-enum',
  );
  tabsData.value = enumData;
  activeName.value = enumData[0].value;
  currentCategoryEnum.value = enumData[0];
  isLoadGrid.value = true;
  handleQueryTable({
    category: currentCategoryEnum.value.value,
  });
};
const handleTabClick = (tab) => {
  currentCategoryEnum.value = tabsData.value[tab.index];
  handleQueryTable({
    category: currentCategoryEnum.value.value,
  });
};
const handleAddAccount = () => {
  drawerApi.setData(null).open();
};
const handleAddSubject = () => {
  drawerSubjectApi.setData(null).open();
};
onMounted(async () => {
  accountLedgerCategoryEnum();
});
</script>

<template>
  <Page auto-content-height>
    <ElTabs v-model="activeName" class="ml-4" @tab-click="handleTabClick">
      <ElTabPane
        v-for="item in tabsData"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      />
    </ElTabs>
    <Grid v-if="isLoadGrid">
      <template #table-title>
        <ElButton type="primary" @click="handleAddAccount()">
          {{ t('account.add_sub_ledger') }}
        </ElButton>
        <ElButton type="primary" @click="handleAddSubject()">
          {{ t('chart-of-accounts.add-account-ledger') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
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
          @click="handleBatchDelete(row)"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
    <DrawerSubject />
  </Page>
</template>
