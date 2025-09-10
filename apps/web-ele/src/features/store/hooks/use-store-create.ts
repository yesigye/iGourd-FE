import { ref, reactive, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useRouter } from 'vue-router';
import { storeApi } from '../apis/store';
import { ElMessage } from 'element-plus';

export function useStoreCreate() {
  const { t } = useI18n();
  const router = useRouter();

  // 当前步骤
  const currentStep = ref(0);
  const totalSteps = 5;

  // 表单数据
  const formData = reactive({
    // 步骤1: 基本信息
    storeName: '',
    storeType: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    
    // 步骤2: 版本选择
    selectedEdition: '',
    selectedPackages: [],
    
    // 步骤3: 套餐选择
    packageInfo: {},
    
    // 步骤4: 支付信息
    paymentMethod: '',
    paymentInfo: {},
    
    // 步骤5: 完成
    isCompleted: false,
  });

  // 步骤配置
  const steps = [
    {
      title: "{{t('store.createStore')}}",
      description: "{{t('store.basicInfo')}}",
    },
    {
      title: "{{t('store.selectEdition')}}",
      description: "{{t('store.chooseVersion')}}",
    },
    {
      title: "{{t('store.selectPackage')}}",
      description: "{{t('store.choosePackage')}}",
    },
    {
      title: "{{t('store.payment')}}",
      description: "{{t('store.paymentInfo')}}",
    },
    {
      title: "{{t('store.complete')}}",
      description: "{{t('store.createComplete')}}",
    },
  ];

  // 下一步
  const nextStep = () => {
    if (currentStep.value < totalSteps - 1) {
      currentStep.value++;
    }
  };

  // 上一步
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  // 跳转到指定步骤
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      currentStep.value = step;
    }
  };

  // 提交表单
  const submitForm = async () => {
    try {
      const result = await storeApi.createStore(formData);
      ElMessage.success(t('store.createSuccess'));
      formData.isCompleted = true;
      nextStep();
      return result;
    } catch (error) {
      ElMessage.error(t('store.createFailed'));
      throw error;
    }
  };

  // 重置表单
  const resetForm = () => {
    Object.assign(formData, {
      storeName: '',
      storeType: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      address: '',
      selectedEdition: '',
      selectedPackages: [],
      packageInfo: {},
      paymentMethod: '',
      paymentInfo: {},
      isCompleted: false,
    });
    currentStep.value = 0;
  };

  // 完成创建
  const completeCreate = () => {
    router.push('/store/list');
  };

  return {
    currentStep,
    totalSteps,
    steps,
    formData,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm,
    completeCreate,
  };
}

