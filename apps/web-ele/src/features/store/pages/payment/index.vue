<script setup lang="ts">
import { Page } from '@/components/Page';
import { useI18n } from 'vue-i18n';
import { useStorePaymentList } from '../../hooks/payment/list';
import { ElButton, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElCheckboxGroup, ElCheckbox, ElTooltip, ElIcon } from 'element-plus';
import { QuestionFilled, CirclePlus } from '@element-plus/icons-vue';
import { ref, onMounted, computed, watch } from 'vue';
import { themeVariables } from '@/styles/variables';
import draggable from 'vuedraggable';
import payment from '@/assets/svg/payment.svg';

defineOptions({
  name: 'IStorePayment',
});

const { t } = useI18n();
const {
  payMethodList,
  payMethodMarkList,
  payMethodMarkListOption,
  addPaymentDialogVisible,
  addSceneDialogVisible,
  selectedPayMethod,
  payScene,
  payment_mark,
  sceneList,
  isShowDel,
  sceneDesc,
  handAddPaymentDialogVisible,
  createPayMenthod,
  delPayMenthod,
  selectPaymet,
  editPayMenthod,
  getPayMenthodList,
  getPayMenthodMarkList,
  handleClose
} = useStorePaymentList();

onMounted(async () => {
  await getPayMenthodList();
  await getPayMenthodMarkList();
});
</script>

<template>
  <Page auto-content-height>
    <div class="setting-container">
      <!-- 页面标题 -->
      <div class="top flex gap-1 items-center pt-2.5 pb-2.5">
        <div class="w-1 h-2.5 rounded-sm bg-primary"></div>
        <div class="top-title flex gap-2 items-center">
          <span>{{ t('set.payment_set') }}</span>
          <ElTooltip
            class="box-item"
            effect="dark"
            :content="t('settings.payment_method_question')"
            placement="top-start"
            style="width: 300px;"
          >
            <ElIcon><QuestionFilled /></ElIcon>
          </ElTooltip>
        </div>
      </div>
      
      <!-- 支付方式列表 -->
      <div class="payment-list mt-1 flex gap-5 flex-wrap overflow-auto">
        <draggable
          :list="payMethodList"
          ghost-class="ghost"
          chosen-class="chosenClass"
          animation="300"
          filter=".payment-item-no-drag"
          class="flex gap-5 flex-wrap w-full"
        >
          <template #item="{ element, index }">
            <div v-if="element.isDraggable">
              <div
                class="payment-item bg-white border-t-[2px] border-solid border-primary h-40 flex items-center gap-2.5 relative pl-4 pr-4 cursor-pointer"
              >
                <div
                  class="payment-item-left flex items-center justify-center bg-primary-50 flex-shrink-0"
                >
                  <img :src="payment" alt="" />
                </div>

                <div>
                  <p class="font-bold text-sm">
                    {{ index + 1 > 10 ? index + 1 : '0' + (index + 1) }}
                    {{ element.payment_method_name }}
                  </p>

                  <p class="word-break-all text-xs mt-2.5">
                    {{ sceneDesc(element.scenes) }}
                  </p>
                </div>
                <div class="absolute bottom-3 right-4">
                  <i
                    class="icon iconfont icon-tuodongbingdianzhentuodongpaixu"
                  ></i>
                </div>
                <div class="absolute top-3 right-3 payment-option">
                  <ElButton
                    :color="themeVariables['primary-100']"
                    class="border border-primary"
                    @click.stop="selectPaymet(element)"
                  >
                    <span class="text-primary">{{ t('common.edit') }}</span>
                  </ElButton>
                  <ElButton
                    v-if="!isShowDel(element).is_default"
                    :color="themeVariables['error-200']"
                    @click.stop="delPayMenthod(element)"
                  >
                    <span class="text-error">{{ t('common.del') }}</span>
                  </ElButton>
                </div>
              </div>
            </div>
            <div
              v-else
              class="payment-item payment-item-no-drag bg-white border-t-[2px] border-solid border-primary h-40"
              @click="handAddPaymentDialogVisible"
            >
              <div
                class="w-full h-full flex items-center justify-center gap-2.5"
                :class="
                  payMethodMarkListOption.length == 0
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
              >
                <div class="flex items-center justify-center gap-2.5">
                  <ElIcon
                    :color="
                      payMethodMarkListOption.length == 0
                        ? themeVariables['text-disabled']
                        : themeVariables['primary']
                    "
                  ><CirclePlus /></ElIcon>
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
      <ElDialog
        v-model="addPaymentDialogVisible"
        :title="t('settings.add_payment_method')"
        width="500"
        :before-close="handleClose"
      >
        <div>
          <ElForm>
            <div class="flex items-center justify-center">
              <div class="w-[70%]">
                <ElFormItem
                  :label="t('settings.payment_method')"
                  prop="payment_mode"
                  class="w-full"
                >
                  <div class="w-full">
                    <ElSelect
                      v-model="payment_mark"
                      :placeholder="t('settings.please_select_payment_method')"
                    >
                      <ElOption
                        v-for="(item, index) in payMethodMarkListOption"
                        :key="index"
                        :label="item.name"
                        :value="item.mark"
                      />
                    </ElSelect>
                  </div>
                </ElFormItem>
              </div>
            </div>
            <p class="text-warning text-center">
              {{ t('settings.payment_method_tips') }}
            </p>
          </ElForm>
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
      </ElDialog>
      
      <!-- 添加场景 -->
      <ElDialog
        v-model="addSceneDialogVisible"
        :title="t('settings.payment_scenario_add')"
        width="500"
        :before-close="handleClose"
      >
        <div>
          <ElForm>
            <div class="">
              <ElCheckboxGroup v-model="payScene">
                <div class="flex items-center justify-center gap-5">
                  <div>
                    <div v-for="item in sceneList" :key="item.value">
                      <ElCheckbox
                        :value="item.value"
                        :disabled="isShowDel(selectedPayMethod).is_default"
                      >
                        {{ t('settings.' + item.label.toLocaleLowerCase()) }}
                      </ElCheckbox>
                    </div>
                  </div>
                </div>
              </ElCheckboxGroup>
            </div>
          </ElForm>
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
      </ElDialog>
    </div>
  </Page>
</template>

<style lang="scss" scoped>
.payment-item {
  width: 360px;
  &:hover {
    box-shadow: 0px 8px 20px 0px #00000014;
    box-shadow: 0px 12px 32px 4px #0000000a;

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

.box-item {
  margin-right: 8px;
}
</style>