<template>
  <div class="setting-container">
    <!-- 页面标题 -->
    <div class="top flex items-center gap-1 pb-2.5 pt-2.5">
      <div class="bg-primary h-2.5 w-1 rounded-sm"></div>
      <div class="top-title">
        <span>{{ t('set.payment_set') }}</span>
      </div>
    </div>
    <!-- 支付方式列表 -->
    <div class="payment-list mt-1 flex flex-wrap gap-5">
      <draggable
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
              class="payment-item border-primary relative flex h-40 cursor-pointer items-center gap-2.5 border-t-[2px] border-solid bg-white pl-4 pr-4"
            >
              <div
                class="payment-item-left bg-primary-50 flex flex-shrink-0 items-center justify-center"
              >
                <img :src="payment" alt="" />
              </div>

              <div>
                <p class="text-sm font-bold">
                  {{ index + 1 > 10 ? index + 1 : '0' + (index + 1) }}
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
                >
                  <span class="text-error">{{ t('common.del') }}</span>
                </ElButton>
              </div>
            </div>
          </div>
          <div
            v-else
            class="payment-item payment-item-no-drag border-primary h-40 border-t-[2px] border-solid bg-white"
            @click="handAddPaymentDialogVisible"
          >
            <div
              class="flex h-full w-full items-center justify-center gap-2.5"
              :class="
                payMethodMarkListOption.length == 0
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              "
            >
              <div class="flex items-center justify-center gap-2.5">
                <el-icon><CirclePlus /></el-icon>
                <p
                  :class="
                    payMethodMarkListOption.length == 0
                      ? 'text-textColor-disabled'
                      : 'text-primary'
                  "
                >
                  {{ t('settings.add_payment') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <!-- 添加支付方式弹窗 -->
    <el-dialog
      v-model="addPaymentDialogVisible"
      :title="t('settings.add_payment_method')"
      width="500"
      :before-close="handleClose"
    >
      <div>
        <el-form>
          <div class="flex items-center justify-center">
            <div class="w-[70%]">
              <el-form-item
                :label="t('settings.payment_method')"
                prop="payment_mode"
                class="w-full"
              >
                <div class="w-full">
                  <el-select
                    v-model="payment_mark"
                    :placeholder="t('settings.please_select_payment_method')"
                  >
                    <el-option
                      v-for="(item, index) in payMethodMarkListOption"
                      :key="index"
                      :label="item.name"
                      :value="item.mark"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </div>
          </div>
          <p class="text-warning text-center">
            {{ t('settings.payment_method_tips') }}
          </p>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="addPaymentDialogVisible = false">{{
            t('common.cancel')
          }}</ElButton>

          <ElButton type="primary" @click="createPayMenthod">
            {{ t('common.confirm') }}
          </ElButton>
        </div>
      </template>
    </el-dialog>
    <!-- 添加场景 -->
    <el-dialog
      v-model="addSceneDialogVisible"
      :title="t('settings.payment_scenario_add')"
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
                    <el-checkbox
                      :value="item.value"
                      :disabled="isShowDel(selectedPayMethod).is_default"
                    >
                      {{ t('settings.' + item.label.toLocaleLowerCase()) }}
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="addSceneDialogVisible = false">{{
            t('common.cancel')
          }}</ElButton>

          <ElButton type="primary" @click="editPayMenthod">
            {{ t('common.confirm') }}
          </ElButton>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { ElButton, Page, ElMessage, vuedraggable } from '@igourd/common-ui';
const { draggable } = vuedraggable;
defineOptions({
  name: 'ISettingPayment',
});
import {
  paymentMethodListUsingPOST,
  merchantPaymentMethodCreate,
  merchantPaymentMethodDel,
  merchantPaymentMethodEdit,
  merchantPaymentMethodList,
  merchantPaymentMethodSort,
} from '@@/setting/apis';
// import draggable from 'vuedraggable';
// import payment from '@/assets/svg/payment.svg'
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
  let markList = payMethodList.value.map((item) => item.payment_method_mark);
  let option = payMethodMarkList.value.filter(
    (item) => !markList.includes(item.mark),
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
  let result = await paymentMethodListUsingPOST({});
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
  let desc = t('settings.pour');
  scene.forEach((item, index) => {
    if (item.is_enabled) {
      if (index >= scene.length - 1) {
        desc += t('settings.' + item.payment_scene_type.toLocaleLowerCase());
      } else {
        desc +=
          t('settings.' + item.payment_scene_type.toLocaleLowerCase()) + '&';
      }
    }
  });
  return desc;
};
const getPayMenthodMarkList = async () => {
  let result= await merchantPaymentMethodList({});
    payMethodMarkList.value = result;
};
const handAddPaymentDialogVisible = () => {
  if (payMethodMarkListOption.value.length == 0) {
    return false;
  } else {
    addPaymentDialogVisible.value = true;
  }
  // if (payMethodList.value.length <= 7) {
  //   addPaymentDialogVisible.value = true
  //   getPayMenthodMarkList()
  // } else {
  //   ElMessage.error(t('settings.max_payment_method_tips'))
  // }
};

const createPayMenthod = async () => {
  let res = await merchantPaymentMethodCreate({
    payment_method_mark: payment_mark.value,
    sort: 1,
  });
  if (res.code == 'SUCCESS') {
    addPaymentDialogVisible.value = false;
    payment_mark.value = '';
    getPayMenthodList();
  } else {
    ElMessage.error(res.message);
  }
};
const delPayMenthod = async (event) => {
  if (event.payment_method_mark === 'CASH') {
    ElMessage.error(t('settings.cash_payment_method_tips'));
    return;
  }

  let res = await merchantPaymentMethodDel({
    payment_method_mark: event.payment_method_mark,
  });
  if (res.code == 'SUCCESS') {
    getPayMenthodList();
  } else {
    ElMessage.error(res.message);
  }
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
  // {
  //   label: 'WHOLESALE_SALES',
  //   value: 'WHOLESALE_SALES',
  // },
  // {
  //   label: 'RESTAURANT_SALES',
  //   value: 'RESTAURANT_SALES',
  // },
]);
const selectPaymet = async (item) => {
  selectedPayMethod.value = item;
  payScene.value = [];

  // 可用的场景
  let availableScene = payMethodMarkList.value.filter(
    (availableItem) =>
      availableItem.mark == selectedPayMethod.value.payment_method_mark,
  )[0].scenes;
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
  let operate = {};
  let data = isShowDel(selectedPayMethod.value);
  if (data.is_default) {
    if (payScene.value.length === 0) {
      ElMessage.error(t('settings.please_select_payment_method_scene'));
      return;
    }
  }

  sceneList.value.forEach((item) => {
    if (payScene.value.includes(item.value)) {
      operate[item.value] = true;
    } else {
      operate[item.value] = false;
    }
  });

  let res = await merchantPaymentMethodEdit({
    payment_method_mark: selectedPayMethod.value.payment_method_mark,
    payment_method_operate: operate,
  });

  if (res.code == 'SUCCESS') {
    getPayMenthodList();
    addSceneDialogVisible.value = false;
  } else {
    ElMessage.error(res.message);
  }
};
const sortPayMethod = async (event) => {
  let res = await merchantPaymentMethodSort({
    payment_method_sort_map: event,
  });
};

// 拖拽排序
watch(
  () => payMethodList.value,
  async (newVal) => {
    if (isSort.value) {
      let newSortObj = {};
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
