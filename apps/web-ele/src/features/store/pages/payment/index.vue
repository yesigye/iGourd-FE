<script setup lang="ts">
// // import { QuestionFilled, CirclePlus } from '@element-plus/icons-vue';
// import { onMounted } from 'vue';

// import { Page } from '@igourd/common-ui';
// import { useI18n } from '@igourd/locales';

// import payment from '@/assets/svg/payment.svg';
// // import { themeVariables } from '@/styles/variables';
// import {
//   ElButton,
//   ElCheckbox,
//   ElCheckboxGroup,
//   ElDialog,
//   ElForm,
//   ElFormItem,
//   ElIcon,
//   ElOption,
//   ElSelect,
//   ElTooltip,
// } from 'element-plus';
// import draggable from 'vuedraggable';

// import { useStorePaymentList } from '../../hooks/payment/list';

// defineOptions({
//   name: 'IStorePayment',
// });

// const { t } = useI18n();
// const {
//   payMethodList,
//   payMethodMarkList,
//   payMethodMarkListOption,
//   addPaymentDialogVisible,
//   addSceneDialogVisible,
//   selectedPayMethod,
//   payScene,
//   payment_mark,
//   sceneList,
//   isShowDel,
//   sceneDesc,
//   handAddPaymentDialogVisible,
//   createPayMenthod,
//   delPayMenthod,
//   selectPaymet,
//   editPayMenthod,
//   getPayMenthodList,
//   getPayMenthodMarkList,
//   handleClose,
// } = useStorePaymentList();

// onMounted(async () => {
//   await getPayMenthodList();
//   await getPayMenthodMarkList();
// });
</script>

<template>
  <Page auto-content-height>
    <!-- <div class="setting-container">
      <div class="top flex items-center gap-1 pb-2.5 pt-2.5">
        <div class="bg-primary h-2.5 w-1 rounded-sm"></div>
        <div class="top-title flex items-center gap-2">
          <span>{{ t('set.payment_set') }}</span>
          <ElTooltip
            class="box-item"
            effect="dark"
            :content="t('settings.payment_method_question')"
            placement="top-start"
            style="width: 300px"
          >
            <ElIcon><QuestionFilled /></ElIcon>
          </ElTooltip>
        </div>
      </div>

      <div class="payment-list mt-1 flex flex-wrap gap-5 overflow-auto">
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
                    :color="themeVariables['primary-100']"
                    class="border-primary border"
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
              class="payment-item payment-item-no-drag border-primary h-40 border-t-[2px] border-solid bg-white"
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
                  <ElIcon
                    :color="
                      payMethodMarkListOption.length === 0
                        ? themeVariables['text-disabled']
                        : themeVariables.primary
                    "
                  >
                    <CirclePlus />
                  </ElIcon>
                  <p
                    :class="
                      payMethodMarkListOption.length === 0
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
            <ElButton @click="addPaymentDialogVisible = false">
              {{ t('common.cancel') }}
            </ElButton>

            <ElButton type="primary" @click="createPayMenthod">
              {{ t('common.confirm') }}
            </ElButton>
          </div>
        </template>
      </ElDialog>

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
                        {{ t(`settings.${item.label.toLocaleLowerCase()}`) }}
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
            <ElButton @click="addSceneDialogVisible = false">
              {{ t('common.cancel') }}
            </ElButton>

            <ElButton type="primary" @click="editPayMenthod">
              {{ t('common.confirm') }}
            </ElButton>
          </div>
        </template>
      </ElDialog>
    </div> -->
  </Page>
</template>
