import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { storePaymentApi } from '../../apis/payment';
import { useUserStore } from '@igourd/stores/modules/useUserStore';
import { storeToRefs } from 'pinia';

export function useStorePaymentList() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { merchantId } = storeToRefs(userStore);

  const addPaymentDialogVisible = ref(false);
  const addSceneDialogVisible = ref(false);
  const isSort = ref(false);
  const selectedPayMethod = ref({});
  const payScene = ref([]);
  const payMethodList = ref([]);
  const payMethodMarkList = ref([]);
  const payment_mark = ref('');

  const isShowDel = (event: any) => {
    let payData = {};
    payMethodMarkList.value.forEach((item: any) => {
      if (item.mark == event.payment_method_mark) {
        payData = item;
      }
    });
    return payData;
  };

  const payMethodMarkListOption = computed(() => {
    // 根据payMethodList 过滤出还未添加过的支付方式
    let markList = payMethodList.value.map((item: any) => item.payment_method_mark);
    let option = payMethodMarkList.value.filter(
      (item: any) => !markList.includes(item.mark),
    );
    return option;
  });

  const getPayMenthodList = async () => {
    let res = await storePaymentApi.getPaymentMethodList({
      merchant_id: merchantId.value,
    });
    if (res.code === 'SUCCESS') {
      // data按sort重新排序
      res.data.sort((a: any, b: any) => {
        return a.sort - b.sort;
      });
      res.data.forEach((item: any) => {
        item.isDraggable = true;
      });
      payMethodList.value = res.data;
    }
    payMethodList.value.push({
      isDraggable: false,
    });
  };

  /**
   * 场景描述
   * @returns 用于采购&收款&还款&充值
   */
  const sceneDesc = (scene: any[]) => {
    let desc = t('settings.pour');
    scene.forEach((item, index) => {
      if (item.is_enabled) {
        if (index >= scene.length - 1) {
          desc += t('settings.' + item.payment_scene_type.toLocaleLowerCase());
        } else {
          desc +=
            t('settings.' + item.payment_scene_type.toLocaleLowerCase()) + ' & ';
        }
      }
    });
    return desc;
  };

  const getPayMenthodMarkList = async () => {
    let { data, err } = await storePaymentApi.getPaymentMethodMarkList({
      merchant_id: merchantId.value,
    });
    if (!err) {
      payMethodMarkList.value = data;
    }
  };

  const handAddPaymentDialogVisible = () => {
    if (payMethodMarkListOption.value.length == 0) {
      return false;
    } else {
      addPaymentDialogVisible.value = true;
    }
  };

  const createPayMenthod = async () => {
    if (payment_mark.value == '') {
      ElMessage.error(t('settings.please_select_payment_method'));
      return;
    }
    let res = await storePaymentApi.createPaymentMethod({
      merchant_id: merchantId.value,
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

  const delPayMenthod = async (event: any) => {
    if (event.payment_method_mark === 'CASH') {
      ElMessage.error(t('settings.cash_payment_method_tips'));
      return;
    }
    ElMessageBox.confirm(
      t('settings.delete_payment_method_tips'),
      t('common.prompt_message'),
      {
        confirmButtonText: t('common.confirmBtn'),
        cancelButtonText: t('common.cancelBtn'),
        type: 'warning',
      },
    ).then(async () => {
      let res = await storePaymentApi.deletePaymentMethod({
        merchant_id: merchantId.value,
        payment_method_mark: event.payment_method_mark,
      });
      if (res.code == 'SUCCESS') {
        getPayMenthodList();
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  const sceneList = ref([
    {
      label: t('settings.purchase'),
      value: 'PURCHASE',
    },
    {
      label: t('settings.recharge'),
      value: 'RECHARGE',
    },
    {
      label: t('settings.retailSales'),
      value: 'RETAIL_SALES',
    },
  ]);

  const selectPaymet = async (item: any) => {
    selectedPayMethod.value = item;
    payScene.value = [];

    // 可用的场景
    let availableScene = payMethodMarkList.value.filter(
      (availableItem: any) =>
        availableItem.mark == selectedPayMethod.value.payment_method_mark,
    )[0].scenes;
    sceneList.value = availableScene.map((itemMap: any) => {
      return {
        label: itemMap,
        value: itemMap,
      };
    });
    item.scenes.forEach((item: any) => {
      if (item.is_enabled) {
        payScene.value.push(item.payment_scene_type);
      }
    });
    addSceneDialogVisible.value = true;
  };

  const editPayMenthod = async () => {
    let operate: any = {};
    let data = isShowDel(selectedPayMethod.value);
    if (data.is_default) {
      if (payScene.value.length === 0) {
        ElMessage.error(t('settings.please_select_payment_method_scene'));
        return;
      }
    }

    sceneList.value.forEach((item: any) => {
      if (payScene.value.includes(item.value)) {
        operate[item.value] = true;
      } else {
        operate[item.value] = false;
      }
    });

    let res = await storePaymentApi.editPaymentMethod({
      merchant_id: merchantId.value,
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

  const sortPayMethod = async (event: any) => {
    let res = await storePaymentApi.sortPaymentMethod({
      merchant_id: merchantId.value,
      payment_method_sort_map: event,
    });
  };

  const handleClose = () => {
    addPaymentDialogVisible.value = false;
    addSceneDialogVisible.value = false;
  };

  // 拖拽排序
  watch(
    () => payMethodList.value,
    async (newVal) => {
      if (isSort.value) {
        let newSortObj: any = {};
        newVal.forEach((item: any, index: number) => {
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

  return {
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
  };
}
