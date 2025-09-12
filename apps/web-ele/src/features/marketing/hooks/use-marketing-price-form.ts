import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import { marketingApi } from '../apis/marketing';
import { inventoryApi } from '../../inventory/apis/inventory';
import { ElMessage } from 'element-plus';
import MarketingPriceDrawer from '../components/marketing-price-drawer.vue';

export function useMarketingPriceForm() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 表单数据
  const formData = ref({});

  // 表单Schema
  const formSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('marketing.priceLevelName')}}",
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseInputPriceLevelName')}}",
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
      },
      change_type: {
        type: 'string',
        title: "{{t('marketing.priceLevelType')}}",
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectPriceLevelType')}}",
          options: [
            { label: "{{t('marketing.typedecrease')}}", value: 'DECREASE' },
            { label: "{{t('marketing.typeincrease')}}", value: 'INCREASE' },
          ],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
      },
      change_mode: {
        type: 'string',
        title: "{{t('marketing.changeMode')}}",
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectPriceLevelMode')}}",
          options: [
            { label: "{{t('marketing.amount')}}", value: 'AMOUNT' },
            { label: "{{t('marketing.percentage')}}", value: 'PERCENTAGE' },
          ],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
      },
      change_value: {
        type: 'number',
        title: "{{t('marketing.priceLevelPrice')}}",
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseInputAmount')}}",
          min: 0,
          precision: 2,
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
        'x-reactions': [
          {
            dependencies: ['change_mode'],
            fulfill: {
              state: {
                'component[1].placeholder': '{{ $deps[0] === "AMOUNT" ? t("marketing.pleaseInputAmount") : t("marketing.pleaseInputPercentage") }}',
                'component[1].suffix': '{{ $deps[0] === "AMOUNT" ? "￥" : "%" }}',
              },
            },
          },
        ],
      },
      rounding_off: {
        type: 'string',
        title: "{{t('marketing.roundingOff')}}",
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectRoundingOff')}}",
          options: [
            { label: "{{t('marketing.roundhigh')}}", value: 'HIGH' },
            { label: "{{t('marketing.roundmiddle')}}", value: 'MIDDLE' },
            { label: "{{t('marketing.roundlow')}}", value: 'LOW' },
          ],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        'x-reactions': [
          {
            dependencies: ['change_mode'],
            fulfill: {
              state: {
                visible: '{{ $deps[0] === "PERCENTAGE" }}',
                required: '{{ $deps[0] === "PERCENTAGE" }}',
              },
            },
          },
        ],
      },
      rounding_amount: {
        type: 'string',
        title: "{{t('marketing.roundingAmount')}}",
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectRoundingAmount')}}",
          options: [
            { label: '0.001', value: '0.001' },
            { label: '0.01', value: '0.01' },
            { label: '0.1', value: '0.1' },
            { label: '1', value: '1' },
            { label: '10', value: '10' },
            { label: '100', value: '100' },
            { label: '1000', value: '1000' },
          ],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        'x-reactions': [
          {
            dependencies: ['change_mode'],
            fulfill: {
              state: {
                visible: '{{ $deps[0] === "PERCENTAGE" }}',
                required: '{{ $deps[0] === "PERCENTAGE" }}',
              },
            },
          },
        ],
      },
      effective_time: {
        type: 'string',
        title: "{{t('marketing.effectiveTime')}}",
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectEffectiveTime')}}",
          valueFormat: 'YYYY-MM-DD',
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
      },
      expiration_time: {
        type: 'string',
        title: "{{t('marketing.expirationTime')}}",
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectExpirationTime')}}",
          valueFormat: 'YYYY-MM-DD',
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        required: true,
        'x-reactions': [
          {
            dependencies: ['effective_time'],
            fulfill: {
              state: {
                'component[1].disabledDate': '{{ (time) => time < new Date($deps[0]) }}',
              },
            },
          },
        ],
      },
      relation_type: {
        type: 'string',
        title: "{{t('marketing.selectormode')}}",
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('marketing.allproduct')}}", value: 'ALL' },
            { label: "{{t('marketing.productgroup')}}", value: 'PRODUCT_GROUP' },
            { label: "{{t('marketing.productlabel')}}", value: 'PRODUCT_LABEL' },
            { label: "{{t('marketing.productName')}}", value: 'PRODUCT' },
          ],
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
        default: 'ALL',
      },
      remark: {
        type: 'string',
        title: "{{t('marketing.remark')}}",
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseInputRemark')}}",
          rows: 2,
        },
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          labelCol: 6,
          wrapperCol: 18,
        },
      },
    },
  };

  // 使用抽屉
  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: MarketingPriceDrawer,
    title: "{{t('marketing.addPriceLevel')}}",
    width: '86%',
    formSchema,
    formData,
    onSubmit: async (data) => {
      try {
        const params = {
          ...data,
          merchant_id: merchantId,
          effective_time: `${data.effective_time} 00:00:00`,
          expiration_time: `${data.expiration_time} 23:59:59`,
        };
        if (data.id) {
          await marketingApi.updatePrice(data.id, params);
          ElMessage.success(t('marketing.priceLevelUpdatedSuccessfully'));
        } else {
          await marketingApi.createPrice(params);
          ElMessage.success(t('marketing.priceLevelCreateSuccessfully'));
        }
        drawerApi.value?.close();
        return true;
      } catch (error) {
        ElMessage.error(t('marketing.priceLevelAddedFailure'));
        return false;
      }
    },
  });

  return {
    Drawer,
    drawerApi,
    formSchema,
    formData,
  };
}

