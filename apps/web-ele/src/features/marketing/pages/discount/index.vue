<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <IgourdButton @click="drawerApi.open()">
          {{ t('marketing.addFullDiscount') }}
        </IgourdButton>
      </template>
      <template #table-field>
        
      </template>
      
      <!-- 类型列插槽 -->
      <template #type="{ row }">
        <span>{{ activityType[row.type] }}</span>
      </template>

      <!-- 渠道列插槽 -->
      <template #channel="{ row }">
        <span v-if="row.channel === 'STORE'">{{ t('marketing.store') }}</span>
        <span v-else>{{ t('marketing.onlineshop') }}</span>
      </template>

      <!-- 状态列插槽 -->
      <template #status="{ row }">
        <el-tooltip
          :content="row.status === 'OPEN' ? 'OPEN' : 'CLOSE'"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-switch
            v-model="row.status"
            :active-icon="Check"
            :inactive-icon="Close"
            active-value="OPEN"
            inactive-value="CLOSE"
            @change="handleStatusChange(row)"
          />
        </el-tooltip>
      </template>

      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <el-tooltip
          content="Edit"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <el-button
            v-auth="'marketing_discount_edit'"
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
  </Page>
  <Drawer />
</template>

<script setup lang="ts">
import { useI18n } from '@igourd/locales';
import { Check, Close } from '@element-plus/icons-vue';
import { Page, IgourdButton } from '@igourd/common-ui';
import { useMarketingDiscountList } from '../../hooks/use-marketing-discount-list';
import { activityType } from '@/utils/enumeration';

defineOptions({
  name: 'IMarketingDiscountList',
});

const { t } = useI18n();
const { Grid, Drawer, drawerApi } = useMarketingDiscountList();

// 编辑
const handleEdit = (id: string) => {
  drawerApi.open({ id });
};

// 状态切换
const handleStatusChange = async (row: { id: string; status: string }) => {
  // 这里可以添加状态切换逻辑
  console.log('状态切换:', row);
};
</script>

