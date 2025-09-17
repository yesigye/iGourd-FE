<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ElButton, ElTooltip } from 'element-plus';

import { useInventoryChangeLogList } from '../../hooks/change-log/list';

defineOptions({
  name: 'IInventoryChangeLog',
});

const { t } = useI18n();
const { Grid } = useInventoryChangeLogList();

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
          <div class="flex items-center gap-4"></div>
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

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
