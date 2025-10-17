<script lang="ts" setup>
import type { EchartsUIType } from '@igourd/plugins/echarts';

import { computed, ref, watch } from 'vue';

import { Card, ElButton, ElButtonGroup } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { EchartsUI, useEcharts } from '@igourd/plugins/echarts';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  isAll: {
    type: Boolean,
    default: true,
  },
  timeRange: {
    type: Array,
    default: () => [] as string[],
  },
  data: {
    type: Array,
    default: () => [] as number[],
  },
  type: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['timeRangeChange']);
const { t } = useI18n();
const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);
// 筛选的时间范围
const timeRange = ref('WEEK');

const handleTimeRange = (range: string) => {
  timeRange.value = range;

  emits('timeRangeChange', { timeRange: range, type: props.type });
};

const seriesData = computed(() => {
  return props.isAll
    ? [
        {
          data: props.data[0],
          type: 'line',
        },
        {
          data: props.data[1],
          type: 'line',
        },
      ]
    : [
        {
          data: props.data[0],
          type: 'line',
        },
      ];
});
const handleEchartInit = () => {
  renderEcharts({
    grid: {
      top: '10px',
      bottom: '10px',
      left: '10px',
      right: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.timeRange as string[],
    },
    yAxis: {
      type: 'value',
    },
    series: seriesData.value,
  });
};
watch(
  () => props.timeRange,
  (newVal) => {
    handleEchartInit();
  },
);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex w-full items-center justify-between">
        <span class="pb-1">{{ props.title }}</span>
        <div>
          <ElButtonGroup class="ml-4">
            <ElButton
              :type="timeRange === 'DAY' ? 'primary' : 'default'"
              @click="handleTimeRange('DAY')"
            >
              Daily
            </ElButton>
            <ElButton
              :type="timeRange === 'WEEK' ? 'primary' : 'default'"
              @click="handleTimeRange('WEEK')"
            >
              Weekly
            </ElButton>
            <ElButton
              :type="timeRange === 'MONTH' ? 'primary' : 'default'"
              @click="handleTimeRange('MONTH')"
            >
              Monthly
            </ElButton>
          </ElButtonGroup>
        </div>
      </div>
    </template>
    <section class="flex gap-2.5">
      <div
        class="box-border flex h-[196px] w-[196px] flex-shrink-0 items-center justify-center rounded-md p-6 shadow-md"
      >
        <div
          class="flex w-full flex-col items-center justify-center gap-7 text-2xl"
        >
          <div class="flex w-full gap-7 text-lg font-bold">
            <span class="text-success">VIP</span> <span>222</span>
          </div>
          <div
            class="w-full border border-dashed border-gray-500"
            v-if="props.isAll"
          ></div>
          <div class="flex w-full gap-7 text-lg font-bold" v-if="props.isAll">
            <span class="text-primary">ALL</span> <span>2222</span>
          </div>
        </div>
      </div>
      <div class="w-full">
        <EchartsUI height="196px" width="100%" ref="chartRef" />
      </div>
    </section>
  </Card>
</template>
