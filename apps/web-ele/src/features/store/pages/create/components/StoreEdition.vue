<script lang="ts" setup>
import type { Ref } from 'vue';

import type { StoreParamsType } from '../types';

import { inject } from 'vue';

import { ElCol, ElRow } from '@igourd/common-ui';

import StandardCard from './StandardCard.vue';

interface PropsType {
  merchantModel: any;
  merchantEnrollModel: any;
  priceEdition: any;
}

// 定义子组件传递参数，设置默认值
withDefaults(defineProps<PropsType>(), {
  merchantModel: () => ({}),
  merchantEnrollModel: () => ({}),
  priceEdition: () => ({}),
});

// 主动派发事件
const emits = defineEmits<{
  (e: 'selectPackages', packages: any): void; // 动态绑定父组件变量
}>();

inject<Ref<StoreParamsType>>('storeParams');

function sendSelectPackages(id: string) {
  emits('selectPackages', id);
}
</script>

<template>
  <div class="SEd">
    <div class="SEd-container">
      <ElRow justify="center">
        <ElCol v-for="item in priceEdition?.packages" :key="item" class="combo">
          <StandardCard
            :standard-info="item"
            :status="item.id"
            @click-event="() => sendSelectPackages(item.id)"
          >
            <!-- <template #footer>
              <div class="SEd-purchase">
                <el-button class="SEd-purchase-button" type="primary" @click="sendSelectPackages(item)">
                  {{ $t('storePackage.purchaseBtn') }}
                </el-button>
              </div>
            </template> -->
          </StandardCard>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.combo {
  flex: none;
  margin: 5px 20px;
}

.SEd {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  overflow-y: auto;

  &-container {
    box-sizing: border-box;
    width: 100%;
    padding: 0 10px 32px;
    border-radius: 4px;
  }

  &-border {
    box-sizing: border-box;
    border-bottom: 1px dashed rgb(207 207 207 / 100%);
  }

  &-purchase {
    padding: 28px;
    text-align: center;

    &-button {
      width: 160px;
      height: 50px;
      font-size: 16px;
    }
  }
}
</style>
