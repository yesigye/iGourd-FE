import type { ISchema } from '@igourd/common-ui';

// form-schema.ts（不使用 FormGrid，仅 FormLayout）
import { productGroupSelect } from '#/components/product-group';
import { productLabelSelect } from '#/components/product-label';
import { productSelect } from '#/components/product-select';

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      // Element Plus 推荐直接用 labelWidth/size 控制整体布局
      'x-component-props': {
        labelWidth: 200,
        size: 'default',
      },
      properties: {
        type: {
          type: 'string',
          title: "{{t('discount.form.type')}}",
          default: 'DISCOUNT',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            {
              label: "{{t('discount.enum.type.discount')}}",
              value: 'DISCOUNT',
            },
            {
              label: "{{t('discount.enum.type.reduction')}}",
              value: 'REDUCTION',
            },
          ],
          required: true,
        },

        channel: {
          type: 'string',
          title: "{{t('discount.form.channel')}}",
          default: 'ONLINE_SHOP',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            { label: "{{t('discount.enum.channel.store')}}", value: 'STORE' },
            {
              label: "{{t('discount.enum.channel.online')}}",
              value: 'ONLINE_SHOP',
            },
          ],
          required: true,
        },

        name: {
          type: 'string',
          title: "{{t('discount.form.name')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            maxLength: 40,
            placeholder: "{{t('discount.placeholder.name')}}",
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.name.required')}}",
            },
            {
              format: 'regex',
              pattern: '^[^`~!@#$^&*()=+\\[\\]{};:\'\\",<>/?\\\\|]+$',
              message: "{{t('discount.validate.name.noSpecial')}}",
            },
          ],
        },

        apply_vip: {
          type: 'number',
          title: "{{t('discount.form.applyVip')}}",
          default: 1,
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {
            'active-value': 1,
            'inactive-value': 0,
          },
        },

        // —— 满减 —— //
        minimum_amount: {
          type: 'number',
          title: "{{t('discount.form.minimumAmount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            min: 0,
            placeholder: "{{t('discount.placeholder.minimumAmount')}}",
          },
          'x-reactions': {
            dependencies: ['type'],
            fulfill: { state: { visible: "{{$deps[0]==='REDUCTION'}}" } },
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.minimumAmount.required')}}",
              triggerType: 'onBlur',
            },
            {
              minimum: 0,
              message: "{{t('discount.validate.number.nonNegative')}}",
            },
          ],
        },

        reduce_amount: {
          type: 'number',
          title: "{{t('discount.form.reduceAmount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            min: 0,
            placeholder: "{{t('discount.placeholder.reduceAmount')}}",
          },
          'x-reactions': {
            dependencies: ['type'],
            fulfill: { state: { visible: "{{$deps[0]==='REDUCTION'}}" } },
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.reduceAmount.required')}}",
              triggerType: 'onBlur',
            },
            {
              minimum: 0,
              message: "{{t('discount.validate.number.nonNegative')}}",
            },
          ],
        },

        // —— 折扣 —— //
        discount_percentage: {
          type: 'number',
          title: "{{t('discount.form.discountPercentage')}}",
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {
            min: 0,
            max: 100,
            step: 0.1,
            placeholder: "{{t('discount.placeholder.discountPercentage')}}",
          },
          'x-reactions': {
            dependencies: ['type'],
            fulfill: { state: { visible: "{{$deps[0]==='DISCOUNT'}}" } },
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.discountPercentage.required')}}",
              triggerType: 'onBlur',
            },
            {
              maximum: 100,
              message: "{{t('discount.validate.discountPercentage.max')}}",
            },
            {
              minimum: 0,
              message: "{{t('discount.validate.number.nonNegative')}}",
            },
          ],
        },

        rounding_off: {
          type: 'string',
          title: "{{t('discount.form.roundingOff')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: "{{t('discount.placeholder.roundingOff')}}",
          },
          enum: [
            { label: "{{t('discount.enum.rounding.high')}}", value: 'HIGH' },
            {
              label: "{{t('discount.enum.rounding.middle')}}",
              value: 'MIDDLE',
            },
            { label: "{{t('discount.enum.rounding.low')}}", value: 'LOW' },
          ],
          'x-reactions': {
            dependencies: ['type'],
            fulfill: { state: { visible: "{{$deps[0]==='DISCOUNT'}}" } },
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.roundingOff.required')}}",
            },
          ],
        },

        rounding_amount: {
          type: 'number',
          title: "{{t('discount.form.roundingAmount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: "{{t('discount.placeholder.roundingAmount')}}",
          },
          enum: [
            { label: '0.001', value: 0.001 },
            { label: '0.01', value: 0.01 },
            { label: '0.1', value: 0.1 },
            { label: '1', value: 1 },
            { label: '10', value: 10 },
            { label: '100', value: 100 },
            { label: '1000', value: 1000 },
          ],
          'x-reactions': {
            dependencies: ['type'],
            fulfill: { state: { visible: "{{$deps[0]==='DISCOUNT'}}" } },
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.roundingAmount.required')}}",
            },
          ],
        },
        effective_time: {
          type: 'string',
          title: "{{t('discount.form.effectiveTime')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'date',
            valueFormat: 'YYYY-MM-DD 00:00:00',
            placeholder: "{{t('discount.placeholder.effectiveTime')}}",
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.effectiveTime.required')}}",
            },
          ],
        },

        expiration_time: {
          type: 'string',
          title: "{{t('discount.form.expirationTime')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'date',
            valueFormat: 'YYYY-MM-DD 23:59:59',
            placeholder: "{{t('discount.placeholder.expirationTime')}}",
          },
          'x-validator': [
            {
              required: true,
              message: "{{t('discount.validate.expirationTime.required')}}",
            },
            // {
            //   validator:
            //     "{{$self.value && $form.values.effective_time && new Date($self.value) < new Date($form.values.effective_time) ? t('discount.validate.expirationTime.gteEffective') : ''}}",
            // },
          ],
        },

        // —— 关联范围选择 —— //
        relation_type: {
          type: 'string',
          title: "{{t('discount.form.relationType')}}",
          default: 'ALL',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            { label: "{{t('discount.enum.relation.all')}}", value: 'ALL' },
            {
              label: "{{t('discount.enum.relation.group')}}",
              value: 'PRODUCT_GROUP',
            },
            {
              label: "{{t('discount.enum.relation.label')}}",
              value: 'PRODUCT_LABEL',
            },
            {
              label: "{{t('discount.enum.relation.product')}}",
              value: 'PRODUCT',
            },
          ],
        },
        relation_product_group_id_list: {
          ...productLabelSelect,
          'x-reactions': [
            {
              dependencies: ['relation_type'],
              fulfill: {
                state: {
                  display:
                    "{{$deps[0]==='PRODUCT_GROUP' ? 'visible' : 'none'}}",
                },
              },
            },
          ],
        },

        relation_product_label_id_list: {
          ...productGroupSelect,
          'x-reactions': [
            {
              dependencies: ['relation_type'],
              fulfill: {
                state: {
                  display:
                    "{{$deps[0]==='PRODUCT_LABEL' ? 'visible' : 'none'}}",
                },
              },
            },
          ],
        },

        relation_product_id_list: {
          ...productSelect,
          'x-reactions': [
            {
              dependencies: ['relation_type'],
              fulfill: {
                state: {
                  display: "{{$deps[0]==='PRODUCT' ? 'visible' : 'none'}}",
                },
              },
            },
          ],
        },

        schedule_panel: {
          type: 'void',
          'x-decorator': 'FormItem',
          title: '{{t("discount.form.activeSetting")}}',
          'x-component': 'FormCollapse',
          'x-component-props': {
            defaultActiveKey: [],
            accordion: false, // 允许多面板同时展开；如需手风琴，改为 true
          },
          properties: {
            tab1: {
              type: 'void',
              'x-component': 'FormCollapse.Item',
              'x-component-props': {
                title: '更多有效日期和时间设置 >>',
              },
              properties: {
                // —— 有效时段 / 星期 / 日期 —— //
                active_day_hours: {
                  type: 'array',
                  title: "{{t('discount.form.activeHours')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox.Group',
                  enum: Array.from({ length: 24 }, (_, h) => ({
                    label: `${h < 10 ? `0${h}` : `${h}`}:00`,
                    value: h,
                  })),
                },
                active_week_days: {
                  type: 'array',
                  title: "{{t('discount.form.activeWeekDays')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox.Group',
                  enum: [
                    { label: "{{t('discount.enum.week.mon')}}", value: 1 },
                    { label: "{{t('discount.enum.week.tue')}}", value: 2 },
                    { label: "{{t('discount.enum.week.wed')}}", value: 3 },
                    { label: "{{t('discount.enum.week.thu')}}", value: 4 },
                    { label: "{{t('discount.enum.week.fri')}}", value: 5 },
                    { label: "{{t('discount.enum.week.sat')}}", value: 6 },
                    { label: "{{t('discount.enum.week.sun')}}", value: 7 },
                  ],
                },

                active_month_days: {
                  type: 'array',
                  title: "{{t('discount.form.activeMonthDays')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox.Group',
                  enum: Array.from({ length: 31 }, (_, i) => ({
                    label: String(i + 1),
                    value: i + 1,
                  })),
                },
                exclude_dates: {
                  type: 'array',
                  title: "{{t('discount.form.excludeDates')}}",
                  default: [], // ✅ 必须是数组
                  'x-decorator': 'FormItem',
                  'x-component': 'DatePicker',
                  'x-component-props': {
                    type: 'dates', // ✅ 多选单日
                    valueFormat: 'YYYY-MM-DD', // 提交为 'YYYY-MM-DD' 字符串数组
                    clearable: true,
                    // placeholder: "{{t('discount.placeholder.excludeDates')}}", // 如你词典里有就放开
                  },
                },
              },
            },
          },
        },

        remark: {
          type: 'string',
          title: "{{t('discount.form.remark')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': { rows: 3 },
        },

        // 隐藏字段
        merchant_id: { type: 'number', 'x-visible': false },
        creator_id: { type: 'number', default: 0, 'x-visible': false },
      },
    },
  },
};

export default schema;
