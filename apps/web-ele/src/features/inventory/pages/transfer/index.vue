<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryTransferList } from '../../hooks/transfer/list';
import { ElButton, ElTooltip, ElSelect, ElOption, ElTag } from 'element-plus';
import { ref, computed } from 'vue';

defineOptions({
  name: 'IInventoryTransfer',
});

const { t } = useI18n();
const { 
  Grid, 
  selectedRows,
  handleSelectionChange,
  handleDelete,
  handleEdit,
  handleDetail,
  handlePrint,
  handleStatusChange,
  handleReview,
  handleAdd,
  getStatusOptions,
  reviewOptions,
  getStatusInfo,
  getReceiptPercentage
} = useInventoryTransferList();

// 处理编辑成功回调
const handleEditSuccess = () => {
  console.log('编辑成功，刷新数据');
};

// 判断是否为最终状态
const isStatusFinal = (status: string) => {
  const finalStatuses = ['OUTBOUND', 'INBOUND'];
  return finalStatuses.includes(status);
};

// 判断状态下拉框是否禁用
const isStatusDropdownDisabled = (row: any) => {
  if (row.review_status === 'REJECTED' || row.destination_review_status === 'REJECTED') {
    return true;
  }
  return false;
};

// 判断选项是否禁用
const isOptionDisabled = (row: any, value: string) => {
  // 这里可以根据具体业务逻辑来判断
  return false;
};

// 获取状态字段
const getStatusField = (row: any) => {
  // 这里需要根据调拨类型和当前状态来决定使用哪个字段
  return 'status';
};

// 获取审核状态字段
const getReviewStatusField = (row: any) => {
  // 这里需要根据调拨类型来决定使用哪个审核字段
  return 'review_status';
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-4">
            <ElButton
              v-if="selectedRows.length > 0"
              v-auth="'inventory_transfer_delete'"
              type="danger"
              @click="handleDelete"
            >
              {{ t('employee.deleteButton') }}
            </ElButton>
          </div>
          <div class="flex items-center gap-2">
            <ElButton
              v-auth="'inventory_transfer_add'"
              type="primary"
              @click="handleAdd"
            >
              <i class="iconfont icon-tianjia-dianpu mr-1"></i>
              {{ t('employee.addButton') }}
            </ElButton>
          </div>
        </div>
      </template>
      
      <template #status="{ row }">
        <div class="flex items-center justify-center">
          <ElSelect
            v-if="!isStatusFinal(row.status)"
            v-model="row[getStatusField(row)]"
            size="small"
            :disabled="isStatusDropdownDisabled(row)"
            @change="(value) => handleStatusChange(row, value)"
          >
            <ElOption
              v-for="item in getStatusOptions(row)"
              :key="item.value"
              :label="t(`inventory.${item.key}`)"
              :value="item.value"
              :disabled="isOptionDisabled(row, item.value)"
            />
          </ElSelect>
          <ElTag v-else type="success">
            {{ t(`inventory.${row.status?.toLowerCase()}`) }}
          </ElTag>
        </div>
      </template>
      
      <template #reviewStatus="{ row }">
        <div class="flex items-center justify-center">
          <ElSelect
            v-if="row.review_status === 'PENDING'"
            v-model="row.review_status"
            size="small"
            @change="(value) => handleReview(row, value)"
          >
            <ElOption
              v-for="item in reviewOptions"
              :key="item.value"
              :label="t(`inventory.${item.key}`)"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ElSelect>
          <ElTag
            v-else
            :type="row.review_status === 'REJECTED' ? 'danger' : 'success'"
          >
            {{ t(`inventory.${row.review_status}`) }}
          </ElTag>
        </div>
      </template>
      
      <template #destinationReviewStatus="{ row }">
        <div class="flex items-center justify-center">
          <ElSelect
            v-if="row.destination_review_status === 'PENDING'"
            v-model="row.destination_review_status"
            size="small"
            @change="(value) => handleReview(row, value)"
          >
            <ElOption
              v-for="item in reviewOptions"
              :key="item.value"
              :label="t(`inventory.${item.key}`)"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ElSelect>
          <ElTag
            v-else
            :type="row.destination_review_status === 'REJECTED' ? 'danger' : 'success'"
          >
            {{ t(`inventory.${row.destination_review_status}`) }}
          </ElTag>
        </div>
      </template>
      
      <template #operation="{ row }">
        <div class="flex items-center gap-1">
          <ElTooltip
            class="box-item"
            effect="customized"
            :content="t('common.edit')"
            placement="top"
            :show-after="600"
            :enterable="false"
          >
            <ElButton
              v-auth="'inventory_transfer_edit'"
              link
              type="primary"
              size="small"
              :disabled="
                ((row.review_status === 'APPROVED' ||
                  row.review_status === 'REJECTED' ||
                  row.status === 'OUTBOUND' ||
                  row.status === 'REFUSED_OUTBOUND') &&
                  row.transfer_type !== 'TRANSFER_IN_ONLY') ||
                (row.transfer_type === 'TRANSFER_IN_ONLY' && row.destination_status !== 'CREATED')
              "
              @click="handleEdit(row)"
            >
              <i class="iconfont icon-icon_Edit"></i>
            </ElButton>
          </ElTooltip>
          
          <ElTooltip
            class="box-item"
            effect="customized"
            :content="t('common.print')"
            placement="top"
            :show-after="600"
            :enterable="false"
          >
            <ElButton
              v-auth="'inventory_transfer_print'"
              link
              type="primary"
              size="small"
              @click="handlePrint(row)"
            >
              <i class="iconfont icon-icon_printer"></i>
            </ElButton>
          </ElTooltip>
          
          <ElTooltip
            class="box-item"
            effect="customized"
            :content="t('common.detail')"
            placement="top"
            :show-after="600"
            :enterable="false"
          >
            <ElButton
              v-auth="'inventory_transfer_detail'"
              link
              type="primary"
              size="small"
              @click="handleDetail(row)"
            >
              <i class="iconfont icon-icon_details"></i>
            </ElButton>
          </ElTooltip>
        </div>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="scss">
.box-item {
  margin-right: 8px;
}

// 状态样式
@mixin status-style($class, $color, $bgColor) {
  .#{$class} {
    :deep(.el-select__selected-item) {
      color: $color !important;
    }

    :deep(.el-select__icon) {
      color: $color !important;
    }

    :deep(.el-select--small .el-select__wrapper) {
      background-color: $bgColor !important;
      box-shadow: 0 0 0 1px rgba($color, 0.2) inset !important;
      color: $color !important;
    }
  }
}

// 状态颜色
$status-colors: (
  'PENDING': (
    #faad14,
    #fff3e6
  ),
  'select-blue': (
    #1890ff,
    #e6f4ff
  ),
  'APPROVED': (
    #52c41a,
    #e6ffe6
  ),
  'select-red': (
    #ff4d4f,
    #ffe6e6
  )
);

// 遍历状态
@each $status, $colors in $status-colors {
  @include status-style($status, nth($colors, 1), nth($colors, 2));
}
</style>
