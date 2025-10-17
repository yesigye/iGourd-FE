<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Card, ElScrollbar, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  getCustomerSalesReport,
  getCustomerStatisticsApi,
} from '@@/report/apis';
import { EachartItem } from '@@/report/components';

const { t } = useI18n();
const useStore = useUserStore();
const { currency_symbol } = useStore?.merchantInfo;
const chartData = ref({
  totalTransactionVolume: {
    data: [],
    timeRange: [],
    info: {},
  },
  saleOrder: {
    data: [],
    timeRange: [],
    info: {},
  },
  topUpAmount: {
    data: [],
    timeRange: [],
    info: {},
  },
  vipQty: {
    data: [],
    timeRange: [],
    info: {},
  },
});

/** 数据分配*/
const handleDataDistribution = (
  data: any,
  info: {
    key: keyof typeof chartData.value;
    resultAllKey: string;
    resultKey: string;
  },
) => {
  if (Object.keys(data).length === 0) {
    return false;
  }
  chartData.value[info.key].timeRange = data.report_merchant_model_list
    ?.map((item: any) => item.report_date)
    ?.sort(
      (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
    );
  chartData.value[info.key].data[0] = data.report_merchant_model_list
    ?.map((item: any) => item[info.resultKey])
    ?.sort(
      (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
    );
  if (info.resultAllKey) {
    chartData.value[info.key].data[1] = data.report_merchant_model_list
      ?.map((item: any) => item[info.resultAllKey])
      ?.sort(
        (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
      );
  }
};
/**
 *  获取客户统计数据
 *  因为各个报表的数据在一个接口里，只是字段不同，避免首次加载时请求多遍这接口，所以首次加载的逻辑都在这个方法里
 *  只服务于首次加载
 */
const getCustomerStatistics = async () => {
  const res = await getCustomerStatisticsApi({
    end_date: '2025-10-17 13:39:57',
    start_date: '2025-09-17 00:00:00',
    time_range: 'WEEK',
  });
  handleDataDistribution(res, {
    key: 'totalTransactionVolume',
    resultKey: 'vip_order_amount',
    resultAllKey: 'customer_order_amount',
  });
  handleDataDistribution(res, {
    key: 'saleOrder',
    resultKey: 'vip_order_count',
    resultAllKey: 'customer_order_count',
  });
  handleDataDistribution(res, {
    key: 'topUpAmount',
    resultKey: 'vip_recharge_amount',
  });
  handleDataDistribution(res, {
    key: 'vipQty',
    resultKey: 'vip_new_count',
    resultAllKey: 'vip_count',
  });
};
// 切换时间范围
const handleTimeRange = async (event: {
  timeRange: string;
  type: keyof typeof chartData.value;
}) => {
  const res = await getCustomerStatisticsApi({
    end_date: '2025-10-17 13:39:57',
    start_date: '2025-09-17 00:00:00',
    time_range: event.timeRange,
  });
  let parms = {};
  switch (event.type) {
    case 'saleOrder': {
      parms = {
        resultKey: 'customer_order_count',
        resultAllKey: 'customer_order_count',
      };
      break;
    }
    case 'topUpAmount': {
      parms = {
        resultKey: 'vip_recharge_amount',
      };
      break;
    }
    case 'totalTransactionVolume': {
      parms = {
        resultKey: 'customer_order_amount',
        resultAllKey: 'customer_order_amount',
      };
      break;
    }
    case 'vipQty': {
      parms = {
        resultKey: 'vip_count',
        resultAllKey: 'vip_count',
      };
      break;
    }
    default: {
      break;
    }
  }
  handleDataDistribution(res, {
    key: event.type,
    ...parms,
  });
  // getCustomerStatistics();
};
const customerValue = ref({});
// 获取客户报表
const getCustomerReport = async () => {
  try {
    const res = await getCustomerSalesReport({});
    customerValue.value = res;
    // console.log(res.data.vip_count_by_level);
  } catch (error: any) {
    console.error(error);
  }
};
onMounted(() => {
  getCustomerStatistics();
  getCustomerReport();
});
</script>

<template>
  <Page :auto-content-height="true" class="overflow-auto">
    <Card :header="t('customer.customers')">
      <section class="flex flex-col gap-2.5">
        <section class="flex items-center gap-2.5 text-center">
          <div
            class="flex h-[102px] w-full flex-col items-center justify-center rounded-md bg-[#F0F9EB] p-2"
          >
            <div>
              <p class="text-2xl">{{ customerValue?.vip_balance_amount }}</p>
              <p>
                {{ t('customer.total-member-balance') }} ({{ currency_symbol }})
              </p>
            </div>
          </div>
          <div
            class="flex h-[102px] w-full flex-col items-center justify-center rounded-md bg-[#FCF6EC] p-2"
          >
            <div>
              <p class="text-2xl">{{ customerValue?.vip_count }}</p>
              <p>
                {{ t('customer.total-membership') }} ({{ currency_symbol }})
              </p>
            </div>
          </div>
          <div
            class="flex h-[102px] w-full flex-col items-center justify-center rounded-md bg-[#FEF0F0] p-2"
          >
            <div>
              <p class="text-2xl">{{ customerValue?.customer_count }}</p>
              <p>
                {{ t('customer.total-number-of-customers') }} ({{
                  currency_symbol
                }})
              </p>
            </div>
          </div>
        </section>
        <section>
          <ElScrollbar>
            <div class="flex gap-2.5">
              <div
                v-for="item in 10"
                :key="item"
                class="flex h-[60px] min-w-[127px] flex-shrink-0 flex-col items-center justify-center rounded-md bg-[#D9ECFF] text-center"
              >
                <div class="flex flex-col gap-1">
                  <p class="text-primary text-2xl">VIP {{ item }}</p>
                  <p>
                    {{ customerValue?.vip_count_by_level?.[level] || 0 }} ({{
                      currency_symbol
                    }})
                  </p>
                </div>
              </div>
            </div>
          </ElScrollbar>
        </section>
      </section>
    </Card>
    <EachartItem
      :title="`${t('customer.gmv')} (${currency_symbol})`"
      :time-range="chartData.totalTransactionVolume.timeRange"
      :data="chartData.totalTransactionVolume.data"
      type="totalTransactionVolume"
      @time-range-change="handleTimeRange"
    />
    <EachartItem
      :title="`${t('customer.sales-order')} `"
      :time-range="chartData.saleOrder.timeRange"
      :data="chartData.saleOrder.data"
      type="saleOrder"
      @time-range-change="handleTimeRange"
    />

    <EachartItem
      :title="`${t('customer.recharge-amount')}`"
      :time-range="chartData.topUpAmount.timeRange"
      :data="chartData.topUpAmount.data"
      type="topUpAmount"
      :is-all="false"
      @time-range-change="handleTimeRange"
    />
    <EachartItem
      :title="`${t('customer.vip-qty')}`"
      :time-range="chartData.vipQty.timeRange"
      :data="chartData.vipQty.data"
      type="vipQty"
      @time-range-change="handleTimeRange"
    />
  </Page>
</template>
