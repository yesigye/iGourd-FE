<script lang="ts" setup>
import type { CustomerInfo } from '@@/customer/hooks/use-customer-list';

import type { VxeGridListeners } from '#/adapter/vxe-table';

import {
  confirm,
  IgourdButton,
  // moneyFormat,
  // numberFormat,
  Page,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomerList } from '@@/customer/hooks/use-customer-list';
import { ElMessage } from 'element-plus';

defineOptions({
  name: 'ICustomerList',
});

const { t } = useI18n();

// 使用新的组件
const {
  Grid,
  gridRef,
  CustomerDrawer,
  DebtModal,
  BalanceDrawer,
  ConversionDrawer,
} = useCustomerList();

function handlerCreate() {
  // 新增客户
  console.log('新增客户');
}

async function handleEdit(row: CustomerInfo) {
  try {
    // 编辑客户
    console.log('编辑客户:', row);
  } catch (error) {
    ElMessage.error(t('customer.editError'));
    console.error('编辑失败:', error);
  }
}

async function handleView(row: CustomerInfo) {
  try {
    // 查看客户
    console.log('查看客户:', row);
  } catch (error) {
    ElMessage.error(t('customer.viewError'));
    console.error('查看失败:', error);
  }
}

async function handleDelete(row: CustomerInfo) {
  try {
    const confirmed = await confirm(
      t('customer.deleteConfirm', { name: row.name || row.id }),
      t('customer.deleteTitle'),
    );

    if (confirmed) {
      // 执行删除操作
      await deleteRowData(row.id);
      ElMessage.success(t('customer.deleteSuccess'));

      // 刷新表格
      refreshGrid();
    }
  } catch (error) {
    ElMessage.error(t('customer.deleteError'));
    console.error('删除失败:', error);
  }
}

// 获取行数据的函数
async function getRowData(id: string) {
  const { getCustomerDetailApi } = await import('@@/customer/apis');
  return await getCustomerDetailApi(id);
}

// 删除数据的函数
async function deleteRowData(id: string) {
  const { deleteCustomerApi } = await import('@@/customer/apis');
  await deleteCustomerApi(id);
}

// 余额详情处理
function handleOpenBalanceDetail(row: CustomerInfo) {
  // 打开余额详情弹窗
  console.log('打开余额详情:', row);
}

// 积分兑换处理
function openConvertGift(row: CustomerInfo) {
  // 打开积分兑换弹窗
  console.log('打开积分兑换:', row);
}

// 欠款详情处理
function openDebtDetail(row: CustomerInfo) {
  // 打开欠款详情弹窗
  console.log('打开欠款详情:', row);
}

const gridEvents: VxeGridListeners<CustomerInfo> = {
  cellClick: ({ row }) => {
    // 点击行查看详情
    console.log('点击行:', row);
  },
  filterChange({ $grid, filterList }) {
    const query: Record<string, any> = {};
    filterList.forEach((item) => {
      query[item.field] = item.values;
    });
    $grid!.commitProxy('reload', query);
  },
};

// 刷新表格的函数
function refreshGrid() {
  if (gridRef.value) {
    gridRef.value.commitProxy('reload');
  }
}
</script>

<template>
  <Page auto-content-height>
    <CustomerDrawer />
    <DebtModal />
    <BalanceDrawer />
    <ConversionDrawer />
    <Grid>
      <template #table-title>
        <IgourdButton @click="handlerCreate">
          {{ t('customer.add') }}
        </IgourdButton>
      </template>

      <!-- 余额列插槽 -->
      <template #balance="{ row }">
        <div class="flex-y-center cursor-pointer place-content-between">
          <span>{{ moneyFormat(row.balance || 0) }}</span>
          <i
            class="iconfont icon-icon_details"
            @click="handleOpenBalanceDetail(row)"
          ></i>
        </div>
      </template>

      <!-- 积分列插槽 -->
      <template #points="{ row }">
        <div class="flex-y-center cursor-pointer place-content-between">
          <span>{{ numberFormat(row.points || 0) }}</span>
          <i
            class="iconfont icon-giveaway text-text-yellow"
            @click="openConvertGift(row)"
          ></i>
        </div>
      </template>

      <!-- 欠款列插槽 -->
      <template #debt="{ row }">
        <div class="text-error-03 flex-y-center place-content-between">
          <span>{{ moneyFormat(row.debt_amount || 0) }}</span>
          <div class="flex-y-center">
            <i
              class="iconfont icon-icon_details"
              @click="openDebtDetail(row)"
            ></i>
          </div>
        </div>
      </template>

      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <IgourdButton type="primary" size="small" @click="handleEdit(row)">
          {{ t('customer.edit') }}
        </IgourdButton>
        <IgourdButton type="info" size="small" @click="handleView(row)">
          {{ t('customer.view') }}
        </IgourdButton>
        <IgourdButton type="danger" size="small" @click="handleDelete(row)">
          {{ t('customer.delete') }}
        </IgourdButton>
      </template>
    </Grid>
  </Page>
</template>
