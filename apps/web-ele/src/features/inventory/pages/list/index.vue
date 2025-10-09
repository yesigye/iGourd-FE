<script setup lang="ts">
import { ref } from 'vue';
import {
  confirm,
  ElButton,
  ElIcon,
  ElTooltip,
  Page,
  useIgourdModal,
  ElTable,
  ElTableColumn,
} from '@igourd/common-ui';
import { Warning } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { removeInventoryStock } from '@@/inventory/apis';
import { useInventory } from '@@/inventory/hooks';
// 错误数据
interface ErrorItem {
  product_code: string;
  product_id: string;
  product_name: string;
  sku_barcode: string;
  stock_id: string;
  warehouse_id: string;
  warehouse_name: string;
  warehouse_location_id: string;
}
defineOptions({
  name: 'IInventory',
});

const { currentLoginUserApp } = useUserStore();

const { t } = useI18n();
const [Modal, modalApi] = useIgourdModal({
  fullscreenButton: false,
  isOpen: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {},
  onOpenChange() {},
  title: t('inventory.message_tip'),
});

const [clearModal, clearModalApi2] = useIgourdModal({
  fullscreenButton: false,
  isOpen: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {},
  onOpenChange() {},
  title: t('inventory.message_tip'),
});
const { Grid, gridApi, checkedKeys, Drawer, handleEdit, canBatchOperate } =
  useInventory();
// 错误数据
const errorList = ref<ErrorItem[]>();
// 错误总数
const errorCount = ref<number>(0);
// 成功总数
const successCount = ref<number>(0);

const handleBatchDelete = () => {
  confirm({
    title: t('common.delete-confirm-title'),
    content: t('common.delete-confirm-text'),
  })
    .then(() => {
      const params = {
        stock_product_remove_volist: [],
      };
      const fullData = gridApi.grid.getTableData().fullData;
      fullData.forEach((element) => {
        if (checkedKeys.value.indexOf(element.id) >= 0) {
          params.stock_product_remove_volist.push({
            merchant_id: currentLoginUserApp.owner_id,
            product_code: element.product_code,
            product_id: element.product_id,
            product_name: element.major_name,
            stock_id: element.id,
            warehouse_id: element.warehouse_id,
            warehouse_location_id: element.warehouse_location_id,
          });
        }
      });

      // 获取选中数据
      removeInventoryStock(params).then((res) => {
        errorList.value = res.error_list;
        errorCount.value = res.error_count;
        successCount.value = res.success_count;
        modalApi.open();
      });
    })
    .then(() => {
      // 重新加载表格数据
      gridApi.reload();
    })
    .finally(() => {
      // 无论成功失败，都取消加载状态并重新加载数据
      gridApi.setLoading(false);
      gridApi.reload();
    });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary" @click="handleEdit()">
          {{ t('common.add') }}
        </ElButton>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #tooltip="{ row }">
        <span>{{ row.major_unit_name }}</span>
        <ElTooltip class="box-item" effect="light" placement="top">
          <template #content>
            <div v-for="item in row.stock_quantity_message" :key="item">
              {{ item.symbol + item.numerical_value + item.unit }}
            </div>
          </template>
          <ElIcon class="ml-4"><Warning /></ElIcon>
        </ElTooltip>
      </template>
      <template #tooltipNum="{ cellValue, row }">
        <span>{{ cellValue }}</span>
        <ElTooltip class="box-item" effect="light" placement="top">
          <template #content>
            <div v-for="item in row.stock_quantity_message" :key="item">
              {{ item.symbol + item.numerical_value + item.unit }}
            </div>
          </template>
          <ElIcon class="ml-4"><Warning /></ElIcon>
        </ElTooltip>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.edit') }}
        </ElButton>
        <ElButton type="text" @click="handleEdit(row,'detail')">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
    <!--删除提示 -->
    <Modal>
      <div>
        <div>
          {{ t('list.successfully-deleted')
          }}<span class="text-emerald">{{ successCount }}</span
          >{{ t('list.strip') }}, {{ t('list.delete-failed')
          }}<span class="text-orange-medium">{{ errorCount }}</span
          >{{ t('list.strip') }}
        </div>
        <div class="text-16 mt-4">{{ t('list.list-detele-message') }}</div>
        <div class="text-12">{{ t('list.delete-failed-message') }}</div>
        <ElTable :data="errorList">
          <ElTableColumn type="selection"></ElTableColumn>
          <ElTableColumn
            property="product_name"
            :label="t('inventory.productName')"
          ></ElTableColumn>
          <ElTableColumn
            property="product_code"
            :label="t('inventory.productCode')"
          ></ElTableColumn>
          <ElTableColumn
            property="sku_barcode"
            :label="t('inventory.sku_barcode')"
          ></ElTableColumn>
          <ElTableColumn
            property="warehouse_name"
            :label="t('inventory.warehouse_name')"
          ></ElTableColumn>
          <ElTableColumn property="" :label="t('common.action')">
            <template #default="scope">
              <a> {{ t('inventory.clear') }}</a>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </Modal>
    <!--清空提示 -->
    <clearModal>
      <div>ddd</div>
    </clearModal>
  </Page>
</template>
