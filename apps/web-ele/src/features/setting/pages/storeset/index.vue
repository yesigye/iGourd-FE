<template>
  <Page auto-content-height>
    <!-- 店铺基本信息 -->
    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4">{{ t('setting.basicInformation') }}</h3>
      <div class="bg-white p-4 rounded-lg border">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center justify-between py-3 border-b">
            <div class="font-medium">{{ t('setting.version') }}</div>
            <div class="text-gray-600">{{ storeBasicInfo.package_name }}</div>
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div class="font-medium">{{ t('setting.businessType') }}</div>
            <div class="text-gray-600">{{ storeBasicInfo.merchant_business_type }}</div>
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div class="font-medium">{{ t('setting.validity') }}</div>
            <div class="text-gray-600">
              {{ storeBasicInfo.package_start_time }} - {{ storeBasicInfo.package_expiration_time }}
            </div>
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div class="font-medium">{{ t('setting.registrationTime') }}</div>
            <div class="text-gray-600">{{ storeBasicInfo.create_time }}</div>
          </div>
          
          <div class="flex items-center justify-between py-3 border-b">
            <div class="font-medium">{{ t('setting.cashier') }}</div>
            <div class="text-gray-600">{{ t('setting.pcWindowsPos') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 店铺设置 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">{{ t('setting.storeSettings') }}</h3>
        <ElButton type="primary" @click="handleAdd">
          {{ t('setting.addSetting') }}
        </ElButton>
      </div>
      
      <Grid>
        <template #operation="{ row }">
          <ElButton type="text" @click="handleDetail(row)">
            {{ t('common.detail') }}
          </ElButton>
          <ElButton 
            type="text"
            @click="handleEditStoreset(row)"
          >
            {{ t('common.edit') }}
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
    
    <StoresetDrawer @success="refresh" />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { onMounted } from 'vue';

import { useSettingStoreset } from '@@/setting/hooks';

defineOptions({
  name: 'ISettingStoreset',
});

const { t } = useI18n();

const {
  Grid,
  StoresetDrawer,
  storeBasicInfo,
  handleAdd,
  handleEditStoreset,
  handleDetail,
  handleToggleStatus,
  handleDelete,
  loadStoreBasicInfo,
  refresh,
} = useSettingStoreset();

// 组件挂载时加载店铺基本信息
onMounted(() => {
  loadStoreBasicInfo();
});
</script>
