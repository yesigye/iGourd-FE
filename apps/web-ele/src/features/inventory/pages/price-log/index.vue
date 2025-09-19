<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ElButton, ElTooltip } from 'element-plus';

import { useInventoryPriceLogList } from '../../hooks/price-log/list';

defineOptions({
  name: 'IInventoryPriceLog',
});

const { t } = useI18n();
const { Grid, handleExport, getStatistics, priceTypeOptions } =
  useInventoryPriceLogList();

// 统计信息
const statistics = ref(null);

// 获取统计信息
const loadStatistics = async () => {
  statistics.value = await getStatistics();
};

onMounted(() => {
  loadStatistics();
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-4">
            <ElButton
              v-auth="'inventory_price-log_export'"
              type="primary"
              @click="handleExport"
            >
              <i class="iconfont icon-export mr-1"></i>
              {{ t('inventory.export') }}
            </ElButton>
          </div>
          <div class="flex items-center gap-2">
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
    </Grid>

    <!-- 统计信息卡片 -->
    <div v-if="statistics" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-lg bg-white p-4 shadow">
        <h3 class="mb-2 text-lg font-semibold">
          {{ t('inventory.totalChanges') }}
        </h3>
        <p class="text-2xl font-bold text-blue-600">
          {{ statistics.total_changes }}
        </p>
      </div>
      <div class="rounded-lg bg-white p-4 shadow">
        <h3 class="mb-2 text-lg font-semibold">
          {{ t('inventory.totalPriceChanged') }}
        </h3>
        <p class="text-2xl font-bold text-green-600">
          {{ statistics.total_price_changed }}
        </p>
      </div>
      <div class="rounded-lg bg-white p-4 shadow">
        <h3 class="mb-2 text-lg font-semibold">
          {{ t('inventory.averageChangeAmount') }}
        </h3>
        <p class="text-2xl font-bold text-purple-600">
          {{ statistics.average_change_amount }}
        </p>
      </div>
      <div class="rounded-lg bg-white p-4 shadow">
        <h3 class="mb-2 text-lg font-semibold">
          {{ t('inventory.priceTypes') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(count, type) in statistics.price_type_counts"
            :key="type"
            class="rounded bg-gray-100 px-2 py-1 text-sm"
          >
            {{ priceTypeOptions.find((opt) => opt.value === type)?.label }}:
            {{ count }}
          </span>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped lang="scss">
.box-item {
  margin-right: 8px;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.bg-white {
  background-color: #fff;
}

.p-4 {
  padding: 1rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow {
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 10%),
    0 1px 2px 0 rgb(0 0 0 / 6%);
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-semibold {
  font-weight: 600;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-bold {
  font-weight: 700;
}

.text-blue-600 {
  color: #2563eb;
}

.text-green-600 {
  color: #16a34a;
}

.text-purple-600 {
  color: #9333ea;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.px-2 {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.rounded {
  border-radius: 0.25rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
