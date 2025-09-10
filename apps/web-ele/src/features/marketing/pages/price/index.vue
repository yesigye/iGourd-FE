<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <el-button
          v-auth="'marketing_price_add'"
          type="primary"
          @click="handleAdd"
        >
          <i class="iconfont icon-tianjia-dianpu"></i>
          {{ t('employee.addButton') }}
        </el-button>
        <el-button
          v-auth="'marketing_price_delete'"
          type="danger"
          plain
          :disabled="!selectedRows.length"
          @click="handleDelete"
        >
          <i class="iconfont icon-shanchu2"></i>
          {{ t('employee.deleteButton') }}
        </el-button>
        <el-button @click="showFieldSettings">
          <i class="iconfont icon-liebiaoshezhixianshi"></i>
          {{ t('employee.field') }}
        </el-button>
      </template>
      <template #change_type="{ row }">
        {{ t(`marketing.${row.change_type}`) }}
      </template>
      <template #change_mode="{ row }">
        {{ t(`marketing.${row.change_mode}`) }}
      </template>
      <template #status="{ row }">
        <el-tooltip
          :content="row.status === 'OPEN' ? 'OPEN' : 'CLOSE'"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-switch
            v-auth="'marketing_price_close_switch'"
            v-model="row.status"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            active-value="OPEN"
            inactive-value="CLOSE"
            @change="handleStatusChange(row)"
          />
        </el-tooltip>
      </template>
      <template #action="{ row }">
        <el-tooltip
          content="Edit"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-button
            v-auth="'marketing_price_edit'"
            link
            type="primary"
            size="small"
            @click="handleEdit(row.id)"
          >
            <i class="iconfont icon-icon_Edit"></i>
          </el-button>
        </el-tooltip>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { Page } from '@igourd/common-ui';
import { Check, Close } from '@element-plus/icons-vue';
import { useMarketingPriceList } from '../../hooks/use-marketing-price-list';
import { useMarketingPriceForm } from '../../hooks/use-marketing-price-form';

const { t } = useI18n();

// 使用列表钩子
const { Grid, gridApi, gridEvents } = useMarketingPriceList();

// 使用表单钩子
const { Drawer, drawerApi } = useMarketingPriceForm();

// 选中的行
const selectedRows = ref([]);

// 添加
const handleAdd = () => {
  drawerApi.value?.open({
    title: "{{t('marketing.addPriceLevel')}}",
    formData: {},
  });
};

// 编辑
const handleEdit = (id: string) => {
  drawerApi.value?.open({
    title: "{{t('marketing.editPriceLevel')}}",
    formData: { id },
  });
};

// 删除
const handleDelete = () => {
  const ids = selectedRows.value.map(row => row.id);
  gridEvents.onDelete(ids);
};

// 状态切换
const handleStatusChange = (row: any) => {
  gridEvents.onStatusChange(row);
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

