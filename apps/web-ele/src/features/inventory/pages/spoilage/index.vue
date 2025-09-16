<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventorySpoilageList } from '../../hooks/spoilage/list';
import { ElButton, ElTooltip } from 'element-plus';
import { ref } from 'vue';

defineOptions({
  name: 'IInventorySpoilage',
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
  handleAudit,
  handleAdd,
  getStatusInfo
} = useInventorySpoilageList();

// 处理编辑成功回调
const handleEditSuccess = () => {
  console.log('编辑成功，刷新数据');
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
              v-auth="'inventory_consumption_delete'"
              type="danger"
              @click="handleDelete"
            >
              {{ t('employee.deleteButton') }}
            </ElButton>
          </div>
          <div class="flex items-center gap-2">
            <ElButton
              v-auth="'inventory_consumption_add'"
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
        <ElTooltip
          class="box-item"
          effect="customized"
          :content="row.status || 'PENDING'"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <i
            v-auth="'inventory_consumption_status_approved'"
            :class="['iconfont', getStatusInfo(row.status).icon]"
            :style="{
              cursor: row.status === 'APPROVED' || row.status === 'REJECTED' ? 'not-allowed' : 'pointer',
              color: getStatusInfo(row.status).color
            }"
            @click="row.status === 'PENDING' ? handleAudit(row) : null"
          ></i>
        </ElTooltip>
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
              v-auth="'inventory_consumption_edit'"
              link
              type="primary"
              size="small"
              :disabled="row.status === 'APPROVED' || row.status === 'REJECTED'"
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
              v-auth="'inventory_consumption_print'"
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
              v-auth="'inventory_consumption_detail'"
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

.icon-daishenhe {
  color: #7D90B2;
}

.icon-SURE {
  color: #13BA67;
}

.icon-fILED {
  color: #FF0000;
}
</style>
