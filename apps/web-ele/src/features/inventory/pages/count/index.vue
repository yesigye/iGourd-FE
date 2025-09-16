<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryCountList } from '../../hooks/count/list';
import { ElButton, ElTooltip } from 'element-plus';
import AuditOpinionDialog from '@/components/Audit/AuditOpinionDialog.vue';
import InventoryCountAdd from '../../components/count/InventoryCountAdd.vue';
import InventoryProductsDetail from '../../components/count/InventoryProductsDetail.vue';
import PrintIndex from '@/components/Print/Index.vue';

defineOptions({
  name: 'IInventoryCount',
});

const { t } = useI18n();
const {
  Grid,
  canBatchOperate,
  handleBatchDelete,
  selectedRows,
  countAddDrawer,
  countDetailDialog,
  printDrawer,
  handleAdd,
  handleEdit,
  handleDetail,
  handlePrint,
  auditDialogRef,
  handleAuditConfirm,
  query,
  getStatusInfo
} = useInventoryCountList();

const confirmAddClose = () => {
  countAddDrawer.value.visible = false;
  query();
};

const confirmDetailClose = () => {
  countDetailDialog.value.visible = false;
};

const confirmPrintClose = () => {
  printDrawer.value.visible = false;
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-4">
            <ElButton
              v-if="canBatchOperate && selectedRows.length > 0"
              v-auth="'inventory_physical_delete'"
              type="danger"
              @click="handleBatchDelete"
            >
              {{ t('employee.deleteButton') }}
            </ElButton>
          </div>
          <div class="flex items-center gap-2">
            <ElButton
              v-auth="'inventory_physical_add'"
              type="primary"
              @click="handleAdd"
            >
              <i class="iconfont icon-tianjia-dianpu mr-1"></i>
              {{ t('employee.addButton') }}
            </ElButton>
            <ElTooltip
              class="box-item"
              effect="customized"
              :content="t('inventory.fieldSettings')"
              placement="top"
              :show-after="600"
              :enterable="false"
            >
              <ElButton @click="() => {}">
                <i class="iconfont icon-liebiaoshezhixianshi mr-1"></i>
                {{ t('employee.field') }}
              </ElButton>
            </ElTooltip>
          </div>
        </div>
      </template>
      
      <template #review_status="{ row }">
        <ElTooltip
          class="box-item"
          effect="customized"
          :content="getStatusInfo(row.review_status).text"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <i
            :class="[
              'iconfont',
              getStatusInfo(row.review_status).icon
            ]"
            :style="{
              cursor: row.review_status === 'PENDING' ? 'pointer' : 'not-allowed',
              color: getStatusInfo(row.review_status).color
            }"
            @click="row.review_status === 'PENDING' ? auditDialogRef?.open({ ...row, review_status: 'PENDING' }) : null"
          />
        </ElTooltip>
      </template>
      
      <template #operation="{ row }">
        <ElTooltip
          class="box-item"
          effect="customized"
          :content="t('common.edit')"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <ElButton
            v-auth="'inventory_physical_edit'"
            link
            type="primary"
            size="small"
            :disabled="row.review_status === 'APPROVED' || row.review_status === 'REJECTED'"
            @click="handleEdit(row.id)"
          >
            <i class="iconfont icon-icon_Edit icon-hover"></i>
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
            v-auth="'inventory_physical_print'"
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
            v-auth="'inventory_physical_detail'"
            link
            type="primary"
            size="small"
            @click="handleDetail(row.id)"
          >
            <i class="iconfont icon-icon_details"></i>
          </ElButton>
        </ElTooltip>
      </template>
    </Grid>

    <!-- Add/Edit/Detail Drawer -->
    <InventoryCountAdd
      v-if="countAddDrawer.visible"
      :inventory-add-title="countAddDrawer.title"
      :inventory-add-show="countAddDrawer.visible"
      :current-id="countAddDrawer.currentId"
      :is-disabled="countAddDrawer.isDisabled"
      @close-tkr="confirmAddClose"
      @saved="confirmAddClose"
    />

    <!-- Audit Dialog -->
    <AuditOpinionDialog ref="auditDialogRef" @success="handleAuditConfirm" />

    <!-- Print Dialog -->
    <PrintIndex
      v-if="printDrawer.visible"
      v-model:show-print-prop="printDrawer.visible"
      :title="t('inventory.printInventoryCount')"
      :document-number="printDrawer.documentNumber"
      :dynamic-fields-list="printDrawer.dynamicFieldsList"
      :product-details="printDrawer.productDetails"
      :product-columns-list="printDrawer.productColumnsList"
      :additional-details-title="t('set.goodsReceiptNoteDetails')"
      :show-product-details="true"
      :show-additional-details="false"
      @close-tkr="confirmPrintClose"
    />

    <!-- Inventory Products Detail -->
    <InventoryProductsDetail
      :return-title="countDetailDialog.title"
      :drawer-return-show="countDetailDialog.visible"
      :count-id="countDetailDialog.countId"
      tag="count"
      @close-tkr="confirmDetailClose"
    />
  </Page>
</template>

<style scoped lang="scss">
.box-item {
  margin-right: 8px;
}

.icon-hover {
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>