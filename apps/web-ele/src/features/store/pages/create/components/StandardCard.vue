<script lang="ts" setup>
import type { StoreParamsType } from '../types';

import { inject } from 'vue';

interface PropsType {
  status: number | string;
  showPurchaseBtn?: boolean;
  // 有功能模块
  standardInfo: any;
}

// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  status: 1,
  showPurchaseBtn: true,
  standardInfo: () => ({
    package_module_models: [],
  }),
});

const emits = defineEmits(['clickEvent']);

const storeParams = inject<StoreParamsType>('storeParams');

function handleClickEvent() {
  emits('clickEvent', props.standardInfo);
}
</script>

<template>
  <div
    class="SEd-info"
    :class="[`SEd-info__${status}`, { showhover: showPurchaseBtn }]"
  >
    <h3 class="SEd-info-title SEd-border SEd-radius">
      {{ standardInfo.name }}
    </h3>
    <div class="SEd-info-money SEd-border">
      <div class="SEd-info-money__price" @click="handleClickEvent">
        {{ storeParams?.currencySymbol }} {{ standardInfo.amount }}/{{
          $t('standard-card.month-amount-unit')
        }}
      </div>
      <div class="SEd-info-money__describe">{{ standardInfo.remark }}</div>
    </div>
    <div class="SEd-info-function SEd-info-module SEd-border">
      <h3 class="SEd-info-module-title">
        {{ $t('standard-card.module-title') }}
      </h3>
      <ul class="SEd-info-module-list">
        <li
          v-for="item in standardInfo.package_module_models"
          :key="item"
          class="SEd-info-module-li"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="SEd-info-module">
      <h3 class="SEd-info-module-title">
        {{ $t('standard-card.employee-title') }}
      </h3>
      <ul class="SEd-info-module-list">
        <li class="SEd-info-module-li">
          {{ standardInfo.support_salesman_limit }}
        </li>
      </ul>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<style lang="scss" scoped>
.SEd-border {
  box-sizing: border-box;
  border-bottom: 1px dashed rgb(207 207 207 / 100%);
}

.SEd-info {
  min-width: 300px;
  margin: 0 auto;
  cursor: pointer;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  box-shadow: 2px 4px 5.5px 0 #edf3ff;

  // &__1 {
  //   background-color: #f6f9ff;
  // }
  // &__2 {
  //   background-color: #f4fcf5;
  // }
  // &__3 {
  //   background-color: #fef9f6;
  // }

  &.showhover:hover {
    background-color: #ecf5ff;
    border-color: #0d99ff;
    // .SEd-info-title {
    //   color: #ffffff;
    //   background-color: #0d99ff;
    // }
    .SEd-info-money__price {
      color: #fff;
      background-color: #0d99ff;
    }
  }

  &-title {
    box-sizing: border-box;
    padding: 0 10px;
    font-size: 16px;
    font-weight: 500;
    line-height: 60px;
    text-align: center;
  }

  &-money {
    padding: 32px 34px;

    &__price {
      width: 160px;
      margin: 0 auto;
      font-size: 16px;
      line-height: 50px;
      color: #0d99ff;
      text-align: center;
      background-color: #eff4ff;
      border-radius: 4px;
    }

    &__describe {
      width: 240px;
      // height: 140px;
      min-height: 90px;
      padding-top: 8px;
      margin: 0 auto;
      overflow: hidden;
      font-size: 12px;
      line-height: 18px;
      color: #999;
    }
  }

  &-function {
    width: 100%;
    height: 280px;
  }

  &-module {
    box-sizing: border-box;
    padding: 12px 34px;
    overflow: hidden;

    &-title {
      font-size: 12px;
      font-weight: 500;
      color: #999;
    }

    &-list {
      padding-top: 5px;
    }

    &-li {
      box-sizing: border-box;
      margin-left: 13px;
      font-size: 14px;
      line-height: 22px;
      color: #323232;
      list-style: initial;
    }
  }
}
</style>
