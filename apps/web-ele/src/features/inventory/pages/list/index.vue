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
  ElSpace
} from '@igourd/common-ui';
import { Warning,ArrowRight } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { removeInventoryStock, clearInventoryStock } from '@@/inventory/apis';
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

const [clearModal, clearModalApi] = useIgourdModal({
  fullscreenButton: false,
  isOpen: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {},
  onOpenChange() {},
  title: t('inventory.message_tip'),
});
const {
  Grid,
  gridApi,
  checkedKeys,
  Drawer,
  handleEdit,
  handleView,
  canBatchOperate,
} = useInventory();
// 错误数据
const errorList = ref<ErrorItem[]>();
// 错误总数
const errorCount = ref<number>(0);
// 成功总数
const successCount = ref<number>(0);
// 清理前
const clearBeforeList = ref();
const deleteGoodListTable = ref(null);
const selectList = ref([])
// 删除库存
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
const handDelGoodList = val => {
  selectList.value = val
}
// 清空
const handleClear = (row) => {
    const params = {
      stock_product_remove_volist: [],
    };
    clearBeforeList.value.forEach((element) => {
      params.stock_product_remove_volist.push({
        merchant_id: currentLoginUserApp.owner_id,
        product_code: element.product_code,
        product_id: element.product_id,
        product_name: element.major_name,
        stock_id: element.id,
        warehouse_id: element.warehouse_id,
        warehouse_location_id: element.warehouse_location_id,
      });
    });
    confirm({
      title: t('common.delete-confirm-title'),
      content: t('common.delete-confirm-text'),
    })
    .then(() => {
        clearInventoryStock(params).then(()=>{
          clearModalApi.close();
          modalApi.close();
        })
    })

}
// 显示清空dialog
const openDialogSingle =(row)=> {
  clearBeforeList.value = [row]
  clearModalApi.open()
}
// 显示清空dialog
const openDialogMultiple = () => {
  clearBeforeList.value = deleteGoodListTable.value.getSelectionRows()
  clearModalApi.open()
}
const  tableHeaderStyle = {
  background: '#F6F8FC',
  color: '#323232',
  height: '30px',
}

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
        <ElButton type="text" @click="handleView(row)">
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
        <div class="text-12 mb-4">{{ t('list.delete-failed-message') }}</div>
        <ElTable :data="errorList" :header-cell-style="tableHeaderStyle" ref="deleteGoodListTable" @selection-change="handDelGoodList">
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
              <a @click="openDialogSingle(scope.row)"> {{ t('inventory.clear') }}</a>
            </template>
          </ElTableColumn>
        </ElTable>

      </div>
      <template #footer>
         <ElButton @click="modalApi.close()">
          {{ t('inventory.cancel') }}
        </ElButton>
         <ElButton v-if="selectList.length > 0" type="primary" @click="openDialogMultiple()">
          {{ t('list.go-clear') }}
        </ElButton>
      </template>
    </Modal>
    <!--清空提示 -->
    <clearModal>
      <div class="mb-4">{{t('list.confirm-stock-clearance')}}</div>
      <ElSpace>
      <ElTable :data="clearBeforeList" :header-cell-style="tableHeaderStyle">
          <ElTableColumn
            property="product_name"
            :label="t('inventory.productName')"
          ></ElTableColumn>
          <ElTableColumn
            property="stock_origin_quantity"
            :label="t('inventory.stock')"
          >
            <template #default="scope">
                <span>{{ scope.row.stock_origin_quantity || 0 }}</span>
                {{ scope.row.product_unit_name }}
            </template>
          </ElTableColumn>
        </ElTable>
        <ElIcon class="ml-4"><ArrowRight /></ElIcon>
        <ElTable :data="clearBeforeList" :header-cell-style="tableHeaderStyle">
          <ElTableColumn
            property="product_name"
            :label="t('inventory.productName')"
          ></ElTableColumn>
          <ElTableColumn
            property="stock_origin_quantity"
            :label="t('inventory.stock')"
          >
            <template #default="scope">
              <span>0</span> {{ scope.row.product_unit_name }}
            </template>
        </ElTableColumn>
        </ElTable>
      </ElSpace>
      <template #footer>
         <ElButton @click="clearModalApi.close()">
          {{ t('inventory.cancel') }}
        </ElButton>
         <ElButton type="primary" @click="handleClear()">
          {{ t('inventory.clear') }}
        </ElButton>
      </template>
    </clearModal>
  </Page>
</template>
