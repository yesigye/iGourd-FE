<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ElButton, ElButtonGroup, ElDatePicker, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import dayjs from 'dayjs';

import { merchantOverviewApi } from '#/api';
import { quickSwitchTime } from '#/utils';

import HomeNotice from './components/home-notice.vue';
import ProductEchartData from './components/product-echart.data.vue';
import SalesOrderStatistics from './components/sales-order-statistics.vue';

const useStore = useUserStore();

const { merchantInfo } = useStore;
const currencySymbol = merchantInfo?.currency_symbol || '';
const { t } = useI18n();
const merchantOverviewData = ref({});
// 默认问最近一个月 开始00：00：00 结束23：59：59
const time = ref<string[]>([
  dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
  dayjs().format('YYYY-MM-DD 23:59:59'),
]);
const selectQuickTime = ref('last-month');
const handleQuickSwitchTime = (
  val: 'last-month' | 'last-week' | 'today' | 'yesterday',
) => {
  selectQuickTime.value = val;
  time.value = quickSwitchTime(val);
};
// 将开始时间改为00:00:00 将结束时间改为23:59:59
const handleDateChange = (val: string[]) => {
  if (val.length === 2) {
    val[0] = `${val[0]} 00:00:00`;
    val[1] = `${val[1]} 23:59:59`;
  }
};
const getMerchantOverview = async () => {
  try {
    const res = await merchantOverviewApi({
      end_date: time.value[1],
      start_date: time.value[0],
    });
    merchantOverviewData.value = res;
  } catch (error) {
    console.error(error);
  }
};
const eachartTime = ref<string[]>([]);
const handleSearch = () => {
  eachartTime.value = time.value;
  getMerchantOverview();
};
onMounted(() => {
  getMerchantOverview();
});
</script>
<template>
  <Page class="p-2.5">
    <section class="pb-2.5">
      <ElDatePicker
        v-model="time"
        type="daterange"
        :range-separator="t('common.range-separator')"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleDateChange"
      />
      <ElButton type="primary" class="ml-2" @click="handleSearch">
        {{ t('common.search') }}
      </ElButton>
      <ElButtonGroup>
        <ElButton
          :type="selectQuickTime === 'yesterday' ? 'primary' : 'default'"
          class="ml-2"
          @click="handleQuickSwitchTime('yesterday')"
        >
          {{ t('common.yesterday') }}
        </ElButton>
        <ElButton
          :type="selectQuickTime === 'today' ? 'primary' : 'default'"
          class="ml-2"
          @click="handleQuickSwitchTime('today')"
        >
          {{ t('common.today') }}
        </ElButton>
        <ElButton
          :type="selectQuickTime === 'last-week' ? 'primary' : 'default'"
          class="ml-2"
          @click="handleQuickSwitchTime('last-week')"
        >
          {{ t('common.last-week') }}
        </ElButton>
        <ElButton
          :type="selectQuickTime === 'last-month' ? 'primary' : 'default'"
          class="ml-2"
          @click="handleQuickSwitchTime('last-month')"
        >
          {{ t('common.last-month') }}
        </ElButton>
      </ElButtonGroup>
    </section>
    <!-- 警示部分 -->
    <section class="bg-card break-words rounded-md px-2.5 pt-2.5">
      <HomeNotice
        :currency-symbol="currencySymbol"
        :data="merchantOverviewData"
      />
    </section>
    <section class="mt-2.5 break-words rounded-md">
      <SalesOrderStatistics
        :currency-symbol="currencySymbol"
        :data="merchantOverviewData"
      />
    </section>
    <section>
      <ProductEchartData
        :currency-symbol="currencySymbol"
        :data="merchantOverviewData"
        :time="eachartTime"
      />
    </section>
  </Page>
</template>
<style>
.card-px-0 {
  .el-card__body {
    padding-right: 0;
    padding-left: 0;
  }
}

.card-no-header-before {
  .formily-element-plus-card-header::before {
    display: none;
  }

  .el-card__body {
    height: 100%;
  }
}
</style>
