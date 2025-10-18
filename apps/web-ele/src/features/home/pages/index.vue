<script setup lang="ts">
import type { EchartsUIType } from '@igourd/plugins/echarts';

import { onMounted, ref } from 'vue';

import {
  Card,
  ElButton,
  ElButtonGroup,
  ElCol,
  ElDatePicker,
  ElPagination,
  ElRow,
  ElSelect,
  Page,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { EchartsUI, useEcharts } from '@igourd/plugins/echarts';

import {
  getFirstHomeNewsApi,
  getFirstHomeOverviewApi,
  getFirstHomeStatisticsApi,
} from '@@/home/apis';
import { dayjs } from 'element-plus';

defineOptions({
  name: 'IHome',
});
// 默认问最近一个月 开始00：00：00 结束23：59：59
const time = ref([
  dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
  dayjs().format('YYYY-MM-DD 23:59:59'),
]);
const chartSaleAmountRef = ref<EchartsUIType>();
const chartNumberoSellsRef = ref<EchartsUIType>();
const chartSalesOrderNumberRef = ref<EchartsUIType>();

const { renderEcharts: renderEchartsSaleAmount } =
  useEcharts(chartSaleAmountRef);
const { renderEcharts: renderEchartsNumberoSells } =
  useEcharts(chartNumberoSellsRef);
const { renderEcharts: renderEchartsSalesOrderNumber } = useEcharts(
  chartSalesOrderNumberRef,
);

const { t } = useI18n();

const saleAmountTimeRange = ref('DAY');
const saleQtyTimeRange = ref('DAY');

// 获取统计信息
const getFirstHomeStatisticsRload = async (range) => {
  const res = await getFirstHomeStatisticsApi({
    end_date: time.value[1],
    report_statistics: 'ORDER_PRODUCT_NUMBER',
    start_date: time.value[0],
    time_range: range,
  });
  saleAmountTimeRange.value = range;
  handlSaleAmountEchartInit(res);
  // handlNumberoSellsEchartInit(res);
  // handlSalesOrderNumberEchartInit(res);
};
// 排名
const saleAmounTrankListData = ref([]);
const saleQtyTrankListData = ref([]);
const getFirstHomeStatisticsOrderNumberRload = async (range: string) => {
  const res = await getFirstHomeStatisticsApi({
    end_date: time.value[1],
    report_statistics: 'ORDER_NUMBER',
    start_date: time.value[0],
    time_range: range,
  });
  saleQtyTimeRange.value = range;
  handlSalesOrderNumberEchartInit(res);
};
// 排名
const handlSaleAmountEchartInit = (event) => {
  const xAxisData = event?.trend_statistics?.map(
    (item: any) => item.report_date,
  );

  const seriesData = event?.trend_statistics?.map(
    (item: any) => item.order_product_count || 0,
  );
  saleAmounTrankListData.value = event?.ranking_statistics || [];
  renderEchartsSaleAmount({
    xAxis: {
      type: 'category',
      data: xAxisData || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: seriesData || [],
        type: 'bar',
      },
    ],
  });
};
const handlNumberoSellsEchartInit = (event) => {
  renderEchartsNumberoSells({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  });
};
const handlSalesOrderNumberEchartInit = (event) => {
  const xAxisData = event?.trend_statistics?.map(
    (item: any) => item.report_date,
  );

  const seriesData = event?.trend_statistics?.map(
    (item: any) => item.order_count || 0,
  );
  saleQtyTrankListData.value = event?.ranking_statistics || [];

  renderEchartsSalesOrderNumber({
    xAxis: {
      type: 'category',
      data: xAxisData || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: seriesData || [],
        type: 'bar',
      },
    ],
  });
};
const merchantOverviewData = ref({});
const getFirstHomeOverview = async () => {
  try {
    const res = await getFirstHomeOverviewApi({
      end_date: '2025-10-18 23:59:59',
      start_date: '2025-09-18 00:00:00',
    });
    merchantOverviewData.value = res;
  } catch (error) {
    console.error(error);
  }
};
// 消息列表
const newsListData = ref({
  list: [],
  total: 0,
  pageNum: 1,
});
const newListOption = ref([
  {
    label: 'Unread',
    value: 'UNREAD',
  },
  {
    label: 'Read',
    value: 'READ',
  },
]);
const newsStatus = ref('UNREAD');
const getFirstHomeNews = async () => {
  try {
    const res = await getFirstHomeNewsApi({
      page_num: newsListData.value.pageNum,
      page_size: 2,
      status: newsStatus.value,
    });
    newsListData.value.list = res?.list || [];
    newsListData.value.total = Number(res?.total) || 0;
  } catch (error) {
    console.error(error);
  }
};
const handleCurrentChange = (val: number) => {
  newsListData.value.pageNum = val;
  getFirstHomeNews();
};
// 将开始时间改为00:00:00 将结束时间改为23:59:59
const handleDateChange = (val: string[]) => {
  if (val.length === 2) {
    val[0] = `${val[0]} 00:00:00`;
    val[1] = `${val[1]} 23:59:59`;
  }
};
const handleSearch = () => {
  getFirstHomeStatisticsRload(saleAmountTimeRange.value);
  getFirstHomeStatisticsOrderNumberRload(saleQtyTimeRange.value);
};
onMounted(() => {
  getFirstHomeOverview();
  getFirstHomeNews();
  getFirstHomeStatisticsRload('DAY');
  getFirstHomeStatisticsOrderNumberRload('DAY');
});
</script>

<template>
  <Page auto-content-height>
    <section class="px-2.5 py-2">
      <ElDatePicker
        v-model="time"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleDateChange"
      />
      <ElButton type="primary" class="ml-2" size="small" @click="handleSearch">
        查询
      </ElButton>
    </section>
    <section class="bg-card break-words rounded-md px-2.5 pt-2.5">
      <ElRow :gutter="10">
        <ElCol :lg="12" :xs="24">
          <div
            class="sale-order-statistics min-h-[118px] rounded-md p-2.5 px-3"
          >
            <p>Sales Order Quantity (Total of all stores)</p>
            <p class="mt-1.5 font-bold">
              {{ merchantOverviewData?.sales_order_total_quantity ?? 0 }}
            </p>
            <p class="mt-5"><span>than yesterday</span> <span>24</span></p>
          </div>
        </ElCol>
        <ElCol :lg="12" :xs="24">
          <div
            class="sale-product-statistics min-h-[118px] rounded-md px-3 py-[14px]"
          >
            <p>Sales Product Quantity (Total of all stores)</p>
            <p class="mt-1.5 font-bold">
              {{
                merchantOverviewData?.actual_sales_product_total_quantity ?? 0
              }}
            </p>
            <p class="mt-5"><span>than yesterday</span> <span>24</span></p>
          </div>
        </ElCol>
      </ElRow>
    </section>
    <section class="mt-2.5">
      <ElRow :gutter="10">
        <!-- <ElCol :lg="12" :xs="24">
          <div class="bg-card px-2.5 py-4">
            <div class="font-bold">pending list</div>
            <div class="mt-8">
              <div
                class="mb-2.5 flex h-[64px] flex-col justify-center rounded-md border-l border-solid border-[#FF7878] bg-[#FFF6F6] p-2.5"
              >
                <p class="text-xl">
                  You still have a renewal order that has not been paid, please
                  check！
                </p>
                <p class="mt-1 text-xs text-[#999999]">2022-09-21 15:30:09</p>
                <p class="text-right text-[#FF7878]">View Details</p>
              </div>
              <div
                class="flex h-[64px] flex-col justify-center border-l border-solid border-[#FF7878] bg-[#FFF6F6] p-2.5"
              >
                <p class="text-xl">
                  You still have a renewal order that has not been paid, please
                  check！
                </p>
                <p class="mt-1 text-xs text-[#999999]">2022-09-21 15:30:09</p>
                <p class="text-right text-[#FF7878]">View Details</p>
              </div>
            </div>
            <div class="mt-2.5 flex justify-end">
              <ElPagination
                background
                layout="prev, pager, next"
                :total="1000"
              />
            </div>
          </div>
        </ElCol> -->
        <ElCol :lg="24" :xs="24">
          <div class="bg-card h-full px-2.5 py-4">
            <div class="font-bold">
              <div class="flex items-center gap-2.5">
                <span>My News</span>
                <ElSelect
                  v-model="newsStatus"
                  :options="newListOption"
                  class="w-40"
                  @change="getFirstHomeNews"
                />
              </div>
            </div>
            <div class="mt-8">
              <div
                class="mb-2.5 flex h-[64px] flex-col justify-center rounded-md p-2.5"
                v-for="item in newsListData.list"
                :key="item.id"
              >
                <p class="text-xl">
                  {{ item?.message }}
                </p>
                <p class="mt-1 text-xs text-[#999999]">
                  {{ item.create_time }}
                </p>
              </div>
            </div>
            <div class="mt-2.5 flex justify-end">
              <ElPagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="2"
                :default-page-size="2"
                :total="newsListData.total"
              />
            </div>
          </div>
        </ElCol>
      </ElRow>
    </section>
    <section>
      <Card header="">
        <template #header>
          <div class="flex w-full items-center justify-between">
            <div class="font-bold">Sales Amount</div>
            <ElButtonGroup class="ml-4">
              <ElButton
                :type="saleAmountTimeRange === 'DAY' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsRload('DAY')"
              >
                {{ t('home.daily') }}
              </ElButton>
              <ElButton
                :type="saleAmountTimeRange === 'WEEK' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsRload('WEEK')"
              >
                {{ t('home.weekly') }}
              </ElButton>
              <ElButton
                :type="saleAmountTimeRange === 'MONTH' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsRload('MONTH')"
              >
                {{ t('home.monthly') }}
              </ElButton>
            </ElButtonGroup>
          </div>
        </template>
        <div>
          <ElRow :gutter="10">
            <ElCol :lg="16" :xs="24">
              <div>
                <EchartsUI
                  height="296px"
                  width="100%"
                  ref="chartSaleAmountRef"
                />
              </div>
            </ElCol>
            <ElCol :lg="8" :xs="24">
              <div class="flex h-full items-center gap-[54px]">
                <div class="h-full border border-solid border-[#E5E5E5]"></div>
                <div class="h-full w-full">
                  <div
                    class="bg-red mb-2.5 flex min-w-0 flex-1 justify-between"
                    v-for="(item, index) in saleAmounTrankListData"
                    :key="item.store_id"
                  >
                    <div class="flex gap-3">
                      <div
                        class="flex h-5 w-5 items-center justify-center rounded-[50%] bg-[#FF7878] text-white"
                      >
                        {{ index + 1 }}
                      </div>
                      <div>{{ item.merchant_name }}</div>
                    </div>
                    <div>{{ item.order_product_count }}</div>
                  </div>
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </Card>
      <Card header="">
        <template #header>
          <div class="flex w-full items-center justify-between">
            <div class="font-bold">Qty Of Sells</div>
            <ElButtonGroup class="ml-4">
              <ElButton
                :type="saleQtyTimeRange === 'DAY' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsOrderNumberRload('DAY')"
              >
                {{ t('home.daily') }}
              </ElButton>
              <ElButton
                :type="saleQtyTimeRange === 'WEEK' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsOrderNumberRload('WEEK')"
              >
                {{ t('home.weekly') }}
              </ElButton>
              <ElButton
                :type="saleQtyTimeRange === 'MONTH' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsOrderNumberRload('MONTH')"
              >
                {{ t('home.monthly') }}
              </ElButton>
            </ElButtonGroup>
          </div>
        </template>
        <div>
          <ElRow :gutter="10">
            <ElCol :lg="16" :xs="24">
              <div>
                <EchartsUI
                  height="296px"
                  width="100%"
                  ref="chartNumberoSellsRef"
                />
              </div>
            </ElCol>
            <ElCol :lg="8" :xs="24">
              <div class="flex h-full items-center gap-[54px]">
                <div class="h-full border border-solid border-[#E5E5E5]"></div>
                <div class="bg-red flex h-full min-w-0 flex-1 justify-between">
                  <div class="flex gap-3">
                    <div
                      class="flex h-5 w-5 items-center justify-center rounded-[50%] bg-[#FF7878] text-white"
                    >
                      1
                    </div>
                    <div>Store1</div>
                  </div>
                  <div>$300,988,777</div>
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </Card>
      <Card header="">
        <template #header>
          <div class="flex w-full items-center justify-between">
            <div class="font-bold">Sales Order Qty</div>
            <ElButtonGroup class="ml-4">
              <ElButton
                :type="saleQtyTimeRange === 'DAY' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsOrderNumberRload('DAY')"
              >
                {{ t('home.daily') }}
              </ElButton>
              <ElButton
                :type="saleQtyTimeRange === 'WEEK' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsOrderNumberRload('WEEK')"
              >
                {{ t('home.weekly') }}
              </ElButton>
              <ElButton
                :type="saleQtyTimeRange === 'MONTH' ? 'primary' : 'default'"
                @click="getFirstHomeStatisticsOrderNumberRload('MONTH')"
              >
                {{ t('home.monthly') }}
              </ElButton>
            </ElButtonGroup>
          </div>
        </template>
        <div>
          <ElRow :gutter="10">
            <ElCol :lg="16" :xs="24">
              <div>
                <EchartsUI
                  height="296px"
                  width="100%"
                  ref="chartSalesOrderNumberRef"
                />
              </div>
            </ElCol>
            <ElCol :lg="8" :xs="24">
              <div class="flex h-full items-center gap-[54px]">
                <div class="h-full border border-solid border-[#E5E5E5]"></div>
                <div class="h-full w-full">
                  <div
                    class="bg-red mb-2.5 flex w-full min-w-0 flex-1 justify-between"
                    v-for="(item, index) in saleQtyTrankListData"
                    :key="item.store_id"
                  >
                    <div class="flex gap-3">
                      <div
                        class="flex h-5 w-5 items-center justify-center rounded-[50%] bg-[#FF7878] text-white"
                      >
                        {{ index + 1 }}
                      </div>
                      <div>{{ item.merchant_name }}</div>
                    </div>
                    <div>{{ item.order_count }}</div>
                  </div>
                </div>
              </div>
            </ElCol>
          </ElRow>
        </div>
      </Card>
    </section>
  </Page>
</template>
<style>
.sale-order-statistics {
  background: linear-gradient(0deg, rgb(255 255 255 / 20%) 0%, #d1edc4 100%);
}

.sale-product-statistics {
  background: linear-gradient(0deg, rgb(255 255 255 / 20%) 0%, #c6e2ff 100%);
}
</style>
