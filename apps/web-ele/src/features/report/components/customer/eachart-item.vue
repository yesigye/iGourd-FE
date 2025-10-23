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
          name: t('common.all'),
          data: props.data[0],
          type: 'line',
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
          },
        },
        {
          name: t('common.vip'),
          data: props.data[1],
          type: 'line',
          itemStyle: {
            color: '#fc5c65',
          },
          markPoint: {
            data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }],
          },
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
              [
                {
                  symbol: 'none',
                  x: '100%',
                  yAxis: 'max',
                },
                {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: 'Max',
                  },
                  type: 'max',
                  name: '最高点',
                },
              ],
            ],
          },
        },
      ]
    : [
        {
          name: t('common.vip'),
          data: props.data[0],
          type: 'line',
          itemStyle: {
            color: '#fc5c65',
          },
          markPoint: {
            data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }],
          },
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
              [
                {
                  symbol: 'none',
                  x: '100%',
                  yAxis: 'max',
                },
                {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: 'Max',
                  },
                  type: 'max',
                  name: '最高点',
                },
              ],
            ],
          },
        },
      ];
});
const handleEchartInit = () => {
  renderEcharts({
    grid: {
      top: '40px',
      bottom: '10px',
      left: '40px',
      right: '40px',
      containLabel: true,
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,

      data: props.timeRange as string[],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    legend: {},
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
              {{ t('home.daily') }}
            </ElButton>
            <ElButton
              :type="timeRange === 'WEEK' ? 'primary' : 'default'"
              @click="handleTimeRange('WEEK')"
            >
              {{ t('home.weekly') }}
            </ElButton>
            <ElButton
              :type="timeRange === 'MONTH' ? 'primary' : 'default'"
              @click="handleTimeRange('MONTH')"
            >
              {{ t('home.monthly') }}
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
            <span class="text-success">{{ t('common.vip') }}</span>
            <span>{{ 222 }}</span>
          </div>
          <div
            class="w-full border border-dashed border-gray-500"
            v-if="props.isAll"
          ></div>
          <div class="flex w-full gap-7 text-lg font-bold" v-if="props.isAll">
            <span class="text-primary">{{ t('common.all') }}</span>
            <span>{{ 222 }}</span>
          </div>
        </div>
      </div>
      <div class="w-full px-6">
        <EchartsUI height="196px" ref="chartRef" />
      </div>
    </section>
  </Card>
</template>
