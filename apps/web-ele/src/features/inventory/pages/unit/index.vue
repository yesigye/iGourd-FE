<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useInventoryUnitList } from '../../hooks/unit/list';
import { ElButton, ElTooltip, ElSwitch } from 'element-plus';
import { ref } from 'vue';

defineOptions({
  name: 'IInventoryUnit',
});

const { t } = useI18n();
const { 
  Grid, 
  selectedRows,
  handleSelectionChange,
  handleDelete,
  handleEdit,
  handleAdd,
  handleStatusChange,
  isEditable,
  isSelectable,
  Check,
  Close
} = useInventoryUnitList();

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
              v-auth="'inventory_unit_delete'"
              type="danger"
              @click="handleDelete"
            >
              {{ t('employee.deleteButton') }}
            </ElButton>
          </div>
          <div class="flex items-center gap-2">
            <ElButton
              v-auth="'inventory_unit_add'"
              type="primary"
              @click="handleAdd"
            >
              <i class="iconfont icon-tianjia-dianpu mr-1"></i>
              {{ t('employee.addButton') }}
            </ElButton>
          </div>
        </div>
      </template>
      
      <template #isBasicUnit="{ row }">
        <el-tag :type="row.is_basic_unit ? 'success' : 'info'">
          {{ row.is_basic_unit ? t('inventory.yes') : t('inventory.no') }}
        </el-tag>
      </template>
      
      <template #status="{ row }">
        <ElSwitch
          :model-value="row.status === 'ACTIVE' || row.status === 'INIT'"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          :disabled="row.source_type === 'SYSTEM'"
          @change="handleStatusChange(row)"
        />
      </template>
      
      <template #operation="{ row }">
        <ElTooltip
          class="box-item"
          effect="dark"
          :content="t('employee.editButton')"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <ElButton
            link
            type="primary"
            size="small"
            :class="{ 'light-transparent': !isEditable(row) }"
            :disabled="!isEditable(row)"
            @click="handleEdit(row)"
          >
            <i
              class="iconfont icon-icon_Edit"
              :class="{
                'disabled-icon': !isEditable(row)
              }"
            />
          </ElButton>
        </ElTooltip>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="scss">
.box-item {
  margin-right: 8px;
}

.light-transparent {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabled-icon {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
