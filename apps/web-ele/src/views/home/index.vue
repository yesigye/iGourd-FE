<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@igourd/common-ui';

import { merchantOverviewApi } from '#/api';

import HomeNotice from './components/home-notice.vue';
import ProductEchartData from './components/product-echart.data.vue';
import SalesOrderStatistics from './components/sales-order-statistics.vue';

const merchantOverviewData = ref({});
const getMerchantOverview = () => {
  try {
    const res = merchantOverviewApi({});
    merchantOverviewData.value = res;
  } catch (error) {
    console.error(error);
  }
};
onMounted(() => {
  getMerchantOverview();
});
</script>
<template>
  <Page class="p-2.5">
    <!-- 警示部分 -->
    <section class="bg-card break-words rounded-md px-2.5 pt-2.5">
      <HomeNotice :data="merchantOverviewData" />
    </section>
    <section class="mt-2.5 break-words rounded-md">
      <SalesOrderStatistics :data="merchantOverviewData" />
    </section>
    <section>
      <ProductEchartData :data="merchantOverviewData" />
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
