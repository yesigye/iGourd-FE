<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import {
  ElButton,
  ElCheckbox,
  ElDialog,
  ElIcon,
  ElMessage,
  ElOption,
  ElSelect,
  Page,
  vuedraggable,
} from '@igourd/common-ui';
// import { CirclePlus } from '@element-plus/icons-vue';
import { useI18n } from '@igourd/locales';

import {
  merchantPaymentMethodCreate,
  merchantPaymentMethodDel,
  merchantPaymentMethodEdit,
  merchantPaymentMethodList,
  merchantPaymentMethodSort,
  paymentMethodListUsingPOST,
} from '@@/setting/apis';

import paymentIcon from '../../../../assets/setting/payment.svg';

defineOptions({
  name: 'ISettingPayment',
});
const { t } = useI18n();

const addPaymentDialogVisible = ref(false);
const addSceneDialogVisible = ref(false);
const isSort = ref(false);
const isShowDel = (event) => {
  let payData = {};
  payMethodMarkList.value.forEach((item) => {
    if (item.mark == event.payment_method_mark) {
      payData = item;
    }
  });
  return payData;
};
const payMethodMarkListOption = computed(() => {
  // 根据payMethodList 过滤出还未添加过的支付方式
  const markList = new Set(
    payMethodList.value.map((item) => item.payment_method_mark),
  );
  const option = payMethodMarkList.value.filter(
    (item) => !markList.has(item.mark),
  );
  return option;
});

// 选择的支付方式
const selectedPayMethod = ref({});
const payScene = ref([]);
const payMethodList = ref([]);
const payMethodMarkList = ref([]);
const payment_mark = ref('');
const getPayMenthodList = async () => {
  const result = await paymentMethodListUsingPOST({});
  // data按sort重新排序
  result.sort((a, b) => {
    return a.sort - b.sort;
  });
  result.forEach((item) => {
    item.isDraggable = true;
  });
  payMethodList.value = result;
  payMethodList.value.push({
    isDraggable: false,
  });
};
/**
 * 场景描述
 * @returns 用于采购&收款&还款&充值
 */
const sceneDesc = (scene) => {
  let desc = t('payment.pour');
  scene.forEach((item, index) => {
    if (item.is_enabled) {
      desc +=
        index >= scene.length - 1
          ? item.payment_scene_type
          : `${item.payment_scene_type}&`;
    }
  });
  return desc;
};
const getPayMenthodMarkList = async () => {
  const result = await merchantPaymentMethodList({});
  payMethodMarkList.value = result;
};
const handAddPaymentDialogVisible = () => {
  if (payMethodMarkListOption.value.length === 0) {
    return false;
  } else {
    addPaymentDialogVisible.value = true;
  }
};

const createPayMenthod = async () => {
  const result = await merchantPaymentMethodCreate({
    payment_method_mark: payment_mark.value,
    sort: 1,
  });
  addPaymentDialogVisible.value = false;
  payment_mark.value = '';
  getPayMenthodList();
};
const delPayMenthod = async (event) => {
  if (event.payment_method_mark === 'CASH') {
    ElMessage.error(t('payment.cash_payment_method_tips'));
    return;
  }

  const result = await merchantPaymentMethodDel({
    payment_method_mark: event.payment_method_mark,
  });
  getPayMenthodList();
};
const sceneList = ref([
  {
    label: 'PURCHASE',
    value: 'PURCHASE',
  },
  {
    label: 'RECHARGE',
    value: 'RECHARGE',
  },
  {
    label: 'RETAIL_SALES',
    value: 'RETAIL_SALES',
  },
]);
const selectPaymet = async (item) => {
  selectedPayMethod.value = item;
  payScene.value = [];

  // 可用的场景
  const availableScene = payMethodMarkList.value.find(
    (availableItem) =>
      availableItem.mark == selectedPayMethod.value.payment_method_mark,
  ).scenes;
  sceneList.value = availableScene.map((itemMap) => {
    return {
      label: itemMap,
      value: itemMap,
    };
  });
  item.scenes.forEach((item) => {
    if (item.is_enabled) {
      payScene.value.push(item.payment_scene_type);
    }
  });
  addSceneDialogVisible.value = true;
};

const editPayMenthod = async () => {
  const operate = {};
  const data = isShowDel(selectedPayMethod.value);
  if (data.is_default && payScene.value.length === 0) {
    ElMessage.error(t('payment.please_select_payment_method_scene'));
    return;
  }

  sceneList.value.forEach((item) => {
    operate[item.value] = !!payScene.value.includes(item.value);
  });

  const result = await merchantPaymentMethodEdit({
    payment_method_mark: selectedPayMethod.value.payment_method_mark,
    payment_method_operate: operate,
  });

  // if (result) {
  getPayMenthodList();
  addSceneDialogVisible.value = false;
  await getPayMenthodList();

  // } else {
  //   ElMessage.error(result.message);
  // }
};
const sortPayMethod = async (event) => {
  const result = await merchantPaymentMethodSort({
    payment_method_sort_map: event,
  });
};

// 拖拽排序
watch(
  () => payMethodList.value,
  async (newVal) => {
    if (isSort.value) {
      const newSortObj = {};
      newVal.forEach((item, index) => {
        if (item.isDraggable) {
          newSortObj[item.payment_method_mark] = index;
        }
      });
      sortPayMethod(newSortObj);
    }

    isSort.value = true;
  },
  { immediate: true, deep: true },
);

onMounted(async () => {
  await getPayMenthodList();
  await getPayMenthodMarkList();
});
</script>
<template>
  <Page auto-content-height class="p-4">
    <div class="h-full">
      <!-- 页面标题 -->
      <div class="top flex items-center gap-1 pb-2.5">
        <div class="bg-primary h-2.5 w-1 rounded-sm"></div>
        <div class="top-title">
          <span>{{ t('payment.payment-set') }}</span>
        </div>
      </div>
      <!-- 支付方式列表 -->
      <div class="payment-list mt-1 flex flex-wrap gap-5">
        <vuedraggable
          :list="payMethodList"
          ghost-class="ghost"
          chosen-class="chosenClass"
          animation="300"
          filter=".payment-item-no-drag"
          class="flex w-full flex-wrap gap-5"
        >
          <template #item="{ element, index }">
            <div v-if="element.isDraggable">
              <div
                class="payment-item border-primary bg-card relative flex h-40 cursor-pointer items-center gap-2.5 border-t-[2px] border-solid pl-4 pr-4"
              >
                <div
                  class="payment-item-left bg-primary-50 flex flex-shrink-0 items-center justify-center"
                >
                  <img :src="paymentIcon" alt="" />
                </div>

                <div>
                  <p class="text-sm font-bold">
                    {{ index + 1 > 10 ? index + 1 : `0${index + 1}` }}
                    {{ element.payment_method_name }}
                  </p>

                  <p class="word-break-all mt-2.5 text-xs">
                    {{ sceneDesc(element.scenes) }}
                  </p>
                </div>
                <div class="absolute bottom-3 right-4">
                  <i
                    class="icon iconfont icon-tuodongbingdianzhentuodongpaixu"
                  ></i>
                </div>
                <div class="payment-option absolute right-3 top-3">
                  <ElButton
                    class="border-primary border"
                    @click.stop="selectPaymet(element)"
                  >
                    <span class="text-primary">{{ t('common.edit') }}</span>
                  </ElButton>
                  <ElButton
                    v-if="!isShowDel(element).is_default"
                    @click.stop="delPayMenthod(element)"
                    type="danger"
                  >
                    <span class="text-error">{{ t('common.del') }}</span>
                  </ElButton>
                </div>
              </div>
            </div>
            <div
              v-else
              class="payment-item payment-item-no-drag border-primary bg-card h-40 border-t-[2px] border-solid"
              @click="handAddPaymentDialogVisible"
            >
              <div
                class="flex h-full w-full items-center justify-center gap-2.5"
                :class="
                  payMethodMarkListOption.length === 0
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
              >
                <div class="flex items-center justify-center gap-2.5">
                  <ElIcon class="text-primary"><CirclePlus /></ElIcon>
                  <p
                    :class="
                      payMethodMarkListOption.length === 0
                        ? 'text-textColor-disabled'
                        : 'text-primary'
                    "
                  >
                    {{ t('payment.add-payment-method') }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </vuedraggable>
      </div>
      <!-- 添加支付方式弹窗 -->
      <ElDialog
        v-model="addPaymentDialogVisible"
        :title="t('payment.add-payment-method')"
        width="500"
        :before-close="handleClose"
      >
        <div>
          <div class="flex items-center justify-center">
            <div class="w-[70%]">
              <el-form-item
                :label="t('payment.payment_method')"
                prop="payment_mode"
                class="w-full"
              >
                <div class="w-full">
                  <ElSelect
                    v-model="payment_mark"
                    :placeholder="t('payment.please-select-payment-method')"
                  >
                    <ElOption
                      v-for="(item, index) in payMethodMarkListOption"
                      :key="index"
                      :label="item.name"
                      :value="item.mark"
                    />
                  </ElSelect>
                </div>
              </el-form-item>
            </div>
          </div>
          <p class="text-warning mt-2 text-center">
            {{ t('payment.payment-method-tips') }}
          </p>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="addPaymentDialogVisible = false">
              {{ t('common.cancel') }}
            </ElButton>

            <ElButton type="primary" @click="createPayMenthod">
              {{ t('common.confirm') }}
            </ElButton>
          </div>
        </template>
      </ElDialog>
      <!-- 添加场景 -->
      <ElDialog
        v-model="addSceneDialogVisible"
        :title="t('payment.payment-scenario-add')"
        width="500"
        :before-close="handleClose"
      >
        <div>
          <el-form>
            <div class="">
              <el-checkbox-group v-model="payScene">
                <div class="flex items-center justify-center gap-5">
                  <div>
                    <div v-for="item in sceneList" :key="item.value">
                      <ElCheckbox
                        :value="item.value"
                        :disabled="isShowDel(selectedPayMethod).is_default"
                      >
                        {{ t(`payment.${item.label.toLocaleLowerCase()}`) }}
                      </ElCheckbox>
                    </div>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <ElButton @click="addSceneDialogVisible = false">
              {{ t('common.cancel') }}
            </ElButton>

            <ElButton type="primary" @click="editPayMenthod">
              {{ t('common.confirm') }}
            </ElButton>
          </div>
        </template>
      </ElDialog>
    </div>
  </Page>
</template>
<style lang="scss">
.payment-item {
  width: 360px;

  &:hover {
    box-shadow: 0 12px 32px 4px #0000000a;

    .payment-option {
      display: block;
    }
  }

  .payment-option {
    display: none;
  }

  .payment-item-left {
    width: 58px;
    height: 58px;
    border-radius: 50%;
  }
}
</style>
