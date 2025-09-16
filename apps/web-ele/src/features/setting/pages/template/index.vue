<template>
  <Page auto-content-height>
    <!-- 模板类型选择 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">{{ t('setting.templateSettings') }}</h3>
      <div class="bg-white p-4 rounded-lg border">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="templateType in templateTypes"
            :key="templateType.value"
            class="border rounded-lg p-4 cursor-pointer transition-all"
            :class="{
              'border-blue-500 bg-blue-50': currentView === templateType.value,
              'border-gray-200 hover:border-gray-300': currentView !== templateType.value
            }"
            @click="currentView = templateType.value"
          >
            <div class="text-center">
              <div class="text-2xl mb-2">{{ templateType.icon }}</div>
              <div class="font-medium">{{ templateType.label }}</div>
              <div class="text-sm text-gray-500">{{ templateType.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板列表 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">{{ t('setting.templateList') }}</h3>
        <ElButton type="primary" @click="handleAdd">
          {{ t('setting.addTemplate') }}
        </ElButton>
      </div>
      
      <Grid>
        <template #operation="{ row }">
          <ElButton type="text" @click="handleDetail(row)">
            {{ t('common.detail') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handleEditTemplate(row)"
          >
            {{ t('common.edit') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handlePreview(row)"
          >
            {{ t('setting.preview') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handleCopy(row)"
          >
            {{ t('setting.copy') }}
          </ElButton>
          <ElButton 
            v-if="!row.is_default"
            type="text"
            @click="handleSetDefault(row)"
          >
            {{ t('setting.setDefault') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'ACTIVE' ? t('setting.deactivate') : t('setting.activate') }}
          </ElButton>
          <ElButton 
            v-if="row.status !== 'ACTIVE'"
            type="text"
            @click="handleDelete(row)"
          >
            {{ t('common.delete') }}
          </ElButton>
        </template>
      </Grid>
    </div>
    
    <TemplateDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { computed } from 'vue';

import { useSettingTemplate } from '@@/setting/hooks';

defineOptions({
  name: 'ISettingTemplate',
});

const { t } = useI18n();

const {
  Grid,
  TemplateDrawer,
  currentView,
  handleAdd,
  handleEditTemplate,
  handleDetail,
  handlePreview,
  handleCopy,
  handleSetDefault,
  handleToggleStatus,
  handleDelete,
  refresh,
} = useSettingTemplate();

// 模板类型选项
const templateTypes = computed(() => [
  {
    value: 'RECEIPT',
    label: t('setting.templateType.receipt'),
    description: t('setting.templateType.receiptDesc'),
    icon: '🧾',
  },
  {
    value: 'BARCODE_LABEL',
    label: t('setting.templateType.barcodeLabel'),
    description: t('setting.templateType.barcodeLabelDesc'),
    icon: '🏷️',
  },
  {
    value: 'SCAN_LABEL',
    label: t('setting.templateType.scanLabel'),
    description: t('setting.templateType.scanLabelDesc'),
    icon: '📱',
  },
  {
    value: 'SCAN_RECEIPT',
    label: t('setting.templateType.scanReceipt'),
    description: t('setting.templateType.scanReceiptDesc'),
    icon: '📄',
  },
  {
    value: 'SCAN_TAG',
    label: t('setting.templateType.scanTag'),
    description: t('setting.templateType.scanTagDesc'),
    icon: '🏷️',
  },
]);
</script>
