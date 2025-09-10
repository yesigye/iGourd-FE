<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <el-button
          v-auth="'store_payment_add'"
          type="primary"
          @click="handleAdd"
        >
          <i class="iconfont icon-tianjia-dianpu"></i>
          {{ t('common.add') }}
        </el-button>
        <el-button
          v-auth="'store_payment_delete'"
          type="danger"
          plain
          :disabled="!selectedRows.length"
          @click="handleDelete"
        >
          <i class="iconfont icon-shanchu2"></i>
          {{ t('common.delete') }}
        </el-button>
        <el-button @click="showFieldSettings">
          <i class="iconfont icon-liebiaoshezhixianshi"></i>
          {{ t('employee.field') }}
        </el-button>
      </template>
      <template #payment_method="{ row }">
        <el-tag :type="getPaymentMethodColor(row.payment_method)">
          {{ t(`storePayment.${row.payment_method}`) }}
        </el-tag>
      </template>
      <template #amount="{ row }">
        {{ formatCurrency(row.amount) }}
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ t(`storePayment.${row.status}`) }}
        </el-tag>
      </template>
      <template #action="{ row }">
        <el-tooltip
          content="Edit"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-button
            link
            type="primary"
            size="small"
            @click="handleEdit(row.id)"
          >
            <i class="iconfont icon-icon_Edit"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip
          content="Detail"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDetail(row.id)"
          >
            <i class="iconfont icon-chakan"></i>
          </el-button>
        </el-tooltip>
      </template>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { Page } from '@igourd/common-ui';
import { useStorePaymentList } from '../../hooks/use-store-payment-list';

const { t } = useI18n();

// 使用列表钩子
const { Grid, gridApi, gridEvents } = useStorePaymentList();

// 选中的行
const selectedRows = ref([]);

// 获取支付方式颜色
const getPaymentMethodColor = (method: string) => {
  const methodMap = {
    'ALIPAY': 'primary',
    'WECHAT': 'success',
    'BANK': 'warning',
    'CASH': 'info',
  };
  return methodMap[method] || 'default';
};

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap = {
    'SUCCESS': 'success',
    'PENDING': 'warning',
    'FAILED': 'danger',
    'CANCELLED': 'info',
  };
  return statusMap[status] || 'default';
};

// 格式化货币
const formatCurrency = (value: number) => {
  if (!value) return '0.00';
  return `¥${Number(value).toFixed(2)}`;
};

// 添加
const handleAdd = () => {
  // TODO: 实现添加功能
  console.log('添加支付记录');
};

// 编辑
const handleEdit = (id: string) => {
  // TODO: 实现编辑功能
  console.log('编辑支付记录:', id);
};

// 详情
const handleDetail = (id: string) => {
  // TODO: 实现详情功能
  console.log('查看详情:', id);
};

// 删除
const handleDelete = () => {
  const ids = selectedRows.value.map(row => row.id);
  gridEvents.onDelete(ids);
};

// 显示字段设置
const showFieldSettings = () => {
  // TODO: 实现字段设置功能
  console.log('显示字段设置');
};

// 监听表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};
</script>

<style lang="scss" scoped>
// 可以添加自定义样式
</style>

