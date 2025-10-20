<script setup lang="ts">
import type { EchartsUIType } from '@igourd/plugins/echarts';

import { computed, onMounted, ref, watch } from 'vue';

import { Card, ElButton, ElButtonGroup, ElCol, ElRow } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { EchartsUI, useEcharts } from '@igourd/plugins/echarts';

import {
  getAccountingStatisticsApi,
  getStatisticsApi,
} from '#/api/common/system';
import employeeManagementIcon from '#/assets/home/employee-management.svg';
import menusIcon from '#/assets/home/menus.svg';
import merchantListIcon from '#/assets/home/merchant-list.svg';
// 图标
import purchaseOrderIcon from '#/assets/home/purchase-order.svg';
import roleManagementIcon from '#/assets/home/role-management.svg';
import upgradeTaskIcon from '#/assets/home/upgrade-task.svg';
import versionMonitoringIcon from '#/assets/home/version-monitoring.svg';
import versionIcon from '#/assets/home/version.svg';
import { thousandSeparator } from '#/utils/sale';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  time: {
    type: Array,
    default: () => [],
  },
  currencySymbol: {
    type: String,
    default: '',
  },
});
const { t } = useI18n();
const shortcutList = [
  {
    name: t('home.purchase-order'),
    icon: purchaseOrderIcon,
    bgColor: 'bg-[#D9ECFF]',
    page: '/purchase/order',
  },
  {
    name: t('home.merchant-list'),
    icon: merchantListIcon,
    bgColor: 'bg-[#E1F3D8]',
    page: '/merchant/list',
  },
  {
    name: t('home.role-management'),
    icon: roleManagementIcon,
    bgColor: 'bg-[#E3E2FF]',
    page: '/employee/role',
  },
  {
    name: t('home.upgrade-task'),
    icon: upgradeTaskIcon,
    bgColor: 'bg-[#FDE2E2]',
  },
  {
    name: t('home.menus'),
    icon: menusIcon,
    bgColor: 'bg-[#D9ECFF]',
  },
  {
    name: t('home.employee-management'),
    icon: employeeManagementIcon,
    bgColor: 'bg-[#FAECD8]',
  },
  {
    name: t('home.version-monitoring'),
    icon: versionMonitoringIcon,
    bgColor: 'bg-[#FFEBDC]',
  },
  {
    name: t('home.version'),
    icon: versionIcon,
    bgColor: 'bg-[#FFD1E7BA]',
  },
];
const chartLineRef = ref<EchartsUIType>();
const chartLineQtyRef = ref<EchartsUIType>();
const chartLineBarRef = ref<EchartsUIType>();

const { renderEcharts: renderEchartsLine } = useEcharts(chartLineRef);
const { renderEcharts: renderEchartsLineQty } = useEcharts(chartLineQtyRef);
const { renderEcharts: renderEchartsBar } = useEcharts(chartLineBarRef);

const timeRange = ref('DAY');
const timeRanges = ref('DAY');
const handleTimeRange = async (value: string) => {
  timeRange.value = value;
  const res = await getStatisticsApi({
    end_date: props.time[1],
    start_date: props.time[0],
    time_range: value,
  });
  handleEchartInit(res);
};
const handleTimeRanges = async (value: string) => {
  timeRanges.value = value;
  const res = await getStatisticsApi({
    end_date: props.time[1],
    start_date: props.time[0],
    time_range: value,
  });
  handleEchartQtyInit(res);
};
const getStatistics = async (range: string) => {
  const res = await getStatisticsApi({
    end_date: props.time[1],
    start_date: props.time[0],
    time_range: range,
  });
  handleEchartInit(res);
  handleEchartQtyInit(res);
};
const accountingStatistics = ref({});
const getAccountingStatistics = async () => {
  const res = await getAccountingStatisticsApi({
    end_date: props.time[1],
    start_date: props.time[0],
    time_range: timeRange.value,
  });
  accountingStatistics.value = res;
  handleEchartBarInit(res);
};
const handleEchartInit = (event: any) => {
  const xAxisData = event?.report_merchant_model_list
    ?.map((item: any) => item.report_date)
    .sort(
      (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
    );
  const seriesData = event?.report_merchant_model_list?.map(
    (item: any) => item.customer_order_amount || 0,
  );
  renderEchartsLine({
    grid: {
      top: '10px',
      bottom: '10px',
      left: '10px',
      right: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: seriesData,
        type: 'line',
      },
    ],
  });
};
const handleEchartQtyInit = (event: any) => {
  const xAxisData = event?.report_merchant_model_list
    ?.map((item: any) => item.report_date)
    .sort(
      (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
    );
  const seriesData = event?.report_merchant_model_list?.map(
    (item: any) => item.order_product_count || 0,
  );
  renderEchartsLineQty({
    grid: {
      top: '10px',
      bottom: '10px',
      left: '10px',
      right: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: seriesData,
        type: 'line',
      },
    ],
  });
};
const barEchartData = ref<any[]>([]);
const handleEchartBarInit = (event: any) => {
  barEchartData.value = [];
  const data = event?.fund_account_list?.map((item: any) => {
    // 生成随机色
    const randomColor = `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;
    barEchartData.value.push({
      color: randomColor,
      ...item,
    });
    return {
      value: 1048,
      name: randomColor,
      itemStyle: { color: randomColor },
    };
  });
  renderEchartsBar({
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  });
};
const detailsOfFunds = computed(() => {
  const funds = barEchartData.value.reduce((acc, cur) => {
    return acc + Number(cur.current_balance);
  }, 0);
  return funds;
});
watch(
  () => props.time,
  async () => {
    await getStatistics('DAY');
    await getAccountingStatistics();
  },
);
onMounted(() => {
  getStatistics('DAY');
  getAccountingStatistics();
});
</script>
<template>
  <ElRow :gutter="10">
    <ElCol :lg="14" :xs="24">
      <div class="flex h-full flex-col gap-2.5">
        <div class="bg-card px-4">
          <section class="flex gap-5">
            <Card
              :header="t('home.purchase-situation')"
              class="card-px-0 flex-1 border-0"
            >
              <div
                class="flex flex-wrap justify-between rounded-sm bg-[#ECF5FF] p-2.5"
              >
                <span>{{ t('home.purchase-product-per') }} 2</span>
                <span>{{ props?.currencySymbol }}
                  {{
                    thousandSeparator(props.data?.purchase_total_amount ?? 0)
                  }}</span>
              </div>
            </Card>
            <Card
              :header="t('home.cost-situation')"
              class="card-px-0 flex-1 border-0"
            >
              <div
                class="flex flex-wrap justify-between rounded-sm bg-[#ECF5FF] p-2.5"
              >
                <span>{{ t('home.expense-expenditure-per') }} 2</span>
                <span>{{ props?.currencySymbol }}
                  {{
                    thousandSeparator(props.data?.expenditure_total_amount ?? 0)
                  }}</span>
              </div>
            </Card>
          </section>
        </div>
        <div class="bg-card min-h-0 flex-1">
          <Card class="card-no-header-before mb-0 h-full border-0">
            <template #header>
              <div class="flex w-full items-center justify-between">
                <span>{{ t('home.sales-amount') }}</span>
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
            </template>
            <div class="flex h-full flex-col justify-end">
              <EchartsUI height="100%" width="100%" ref="chartLineRef" />
            </div>
          </Card>
        </div>
        <div class="bg-card min-h-0 flex-1">
          <Card class="card-no-header-before mb-0 h-full border-0">
            <template #header>
              <div class="flex w-full items-center justify-between">
                <span>{{ t('home.sales-product-qty') }}</span>
                <ElButtonGroup class="ml-4">
                  <ElButton
                    :type="timeRanges === 'DAY' ? 'primary' : 'default'"
                    @click="handleTimeRanges('DAY')"
                  >
                    {{ t('home.daily') }}
                  </ElButton>
                  <ElButton
                    :type="timeRanges === 'WEEK' ? 'primary' : 'default'"
                    @click="handleTimeRanges('WEEK')"
                  >
                    {{ t('home.weekly') }}
                  </ElButton>
                  <ElButton
                    :type="timeRanges === 'MONTH' ? 'primary' : 'default'"
                    @click="handleTimeRanges('MONTH')"
                  >
                    {{ t('home.monthly') }}
                  </ElButton>
                </ElButtonGroup>
              </div>
            </template>
            <div class="flex h-full flex-col justify-end">
              <EchartsUI height="100%" width="100%" ref="chartLineQtyRef" />
            </div>
          </Card>
        </div>
      </div>
    </ElCol>
    <ElCol :lg="10" :xs="24">
      <div class="bg-card mb-2.5 px-4">
        <Card
          :header="t('home.details-of-funds')"
          class="card-px-0 mb-0 border-0"
        >
          <div class="mb-2.5 flex items-center gap-5 bg-[#ECF5FF] p-3">
            <div class="min-w-0 flex-1">
              <EchartsUI height="156px" width="100%" ref="chartLineBarRef" />
              <p class="text-center">
                {{ t('home.details-of-funds') }} ({{ props?.currencySymbol }}):
                {{
                  thousandSeparator(
                    accountingStatistics?.total_balance_amount ?? 0,
                  )
                }}
              </p>
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-8">
              <div
                class="flex items-center gap-2 text-sm"
                v-for="item in barEchartData"
                :key="item.id"
              >
                <div
                  class="h-3 w-3 rounded-[50%]"
                  :class="`bg-[${item.color}]`"
                ></div>
                <div>
                  {{
                    t('home.bank-deposit', { currency: props?.currencySymbol })
                  }}- {{ item.code }}
                </div>
                <div>
                  {{ item.currency_code }}
                  {{ thousandSeparator(item.current_balance) }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2.5 flex flex-col gap-2.5 bg-[#ECF5FF] p-3">
            <p>
              {{ t('home.cash-on-hand', { currency: props?.currencySymbol }) }}
            </p>
            <p>
              {{
                thousandSeparator(
                  accountingStatistics?.cash_statistics
                    ?.cash_on_hand_balance_amount ?? 0,
                )
              }}
            </p>
          </div>
          <div class="mb-2.5 flex items-center gap-7 bg-[#ECF5FF] p-3">
            <div class="mb-2.5 flex min-w-0 flex-1 flex-col gap-2.5">
              <p>
                {{ t('home.accounts-receivable') }} ({{
                  props?.currencySymbol
                }})
              </p>
              <p>
                {{
                  thousandSeparator(
                    accountingStatistics?.receivable_statistics
                      ?.receivable_balance_amount ?? 0,
                  )
                }}
              </p>
            </div>
            <div
              class="h-7 w-auto flex-shrink-0 border border-dashed border-[#9FCEFF]"
            ></div>
            <div
              class="mb-2.5 flex min-w-0 flex-1 flex-col gap-2.5 bg-[#ECF5FF] p-3"
            >
              <p>{{ t('home.customer-number') }}</p>
              <p>
                {{
                  accountingStatistics?.receivable_statistics?.customer_count ??
                  0
                }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-7 bg-[#ECF5FF] p-3">
            <div class="mb-2.5 flex min-w-0 flex-1 flex-col gap-2.5">
              <p>
                {{ t('home.accounts-payable') }} ({{ props?.currencySymbol }})
              </p>
              <p>
                {{
                  thousandSeparator(
                    accountingStatistics?.receivable_statistics
                      ?.payable_balance_amount ?? 0,
                  )
                }}
              </p>
            </div>
            <div
              class="h-7 w-auto flex-shrink-0 border border-dashed border-[#9FCEFF]"
            ></div>
            <div
              class="mb-2.5 flex min-w-0 flex-1 flex-col gap-2.5 bg-[#ECF5FF] p-3"
            >
              <p>{{ t('home.vendor-number') }}</p>
              <p>
                {{
                  accountingStatistics?.receivable_statistics?.vendor_count ?? 0
                }}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div class="bg-card px-4">
        <Card :header="t('home.shortcut')" class="card-px-0 mb-0 border-0">
          <div class="flex flex-wrap gap-8">
            <div
              class="flex w-[77px] flex-col items-center justify-center"
              v-for="item in shortcutList"
              :key="item.name"
            >
              <div
                :class="item.bgColor"
                class="flex h-[58px] w-[58px] items-center justify-center"
              >
                <img :src="item.icon" class="w-[26px]" alt="" />
              </div>
              <p class="mt-2 h-[36px] text-center text-sm">{{ item.name }}</p>
            </div>
          </div>
        </Card>
      </div>
    </ElCol>
  </ElRow>
</template>
