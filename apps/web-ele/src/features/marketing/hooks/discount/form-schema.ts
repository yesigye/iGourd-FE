import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: [2, 2, 2],
        minColumns: [1, 1, 1],
        columnGap: 16,
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
          type: 'boolean',
          title: "{{t('discount.form.applyVip')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },

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

        status: {
          type: 'string',
          title: "{{t('discount.form.status')}}",
          default: 'OPEN',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {
            activeValue: 'OPEN',
            inactiveValue: 'CLOSE',
          },
        },
        effective_time: {
          type: 'string',
          title: "{{t('discount.form.effectiveTime')}}",
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'date',
            valueFormat: 'YYYY-MM-DD',
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
            valueFormat: 'YYYY-MM-DD',
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
          type: 'array',
          title: "{{t('discount.form.productGroups')}}",
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTable',
          'x-reactions': {
            dependencies: ['relation_type'],
            fulfill: { state: { visible: "{{$deps[0]==='PRODUCT_GROUP'}}" } },
          },
          items: {
            type: 'object',
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
                'x-component-props': { width: 60, title: '#' },
              },
              id: {
                type: 'number',
                title: "{{t('discount.table.columns.group')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  filterable: true,
                  placeholder: "{{t('discount.placeholder.productGroup')}}",
                },
                enum: [],
              },
              remove: {
                type: 'void',
                title: "{{t('discount.table.columns.ops')}}",
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: "{{t('discount.form.add')}}",
              'x-component': 'ArrayTable.Addition',
            },
          },
        },

        relation_product_label_id_list: {
          type: 'array',
          title: "{{t('discount.form.productLabels')}}",
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTable',
          'x-reactions': {
            dependencies: ['relation_type'],
            fulfill: { state: { visible: "{{$deps[0]==='PRODUCT_LABEL'}}" } },
          },
          items: {
            type: 'object',
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
                'x-component-props': { width: 60, title: '#' },
              },
              id: {
                type: 'number',
                title: "{{t('discount.table.columns.label')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  filterable: true,
                  placeholder: "{{t('discount.placeholder.productLabel')}}",
                },
                enum: [],
              },
              remove: {
                type: 'void',
                title: "{{t('discount.table.columns.ops')}}",
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: "{{t('discount.form.add')}}",
              'x-component': 'ArrayTable.Addition',
            },
          },
        },

        relation_product_id_list: {
          type: 'array',
          title: "{{t('discount.form.products')}}",
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTable',
          'x-reactions': {
            dependencies: ['relation_type'],
            fulfill: { state: { visible: "{{$deps[0]==='PRODUCT'}}" } },
          },
          items: {
            type: 'object',
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
                'x-component-props': { width: 60, title: '#' },
              },
              id: {
                type: 'number',
                title: "{{t('discount.table.columns.product')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  filterable: true,
                  placeholder: "{{t('discount.placeholder.product')}}",
                },
                enum: [],
              },
              remove: {
                type: 'void',
                title: "{{t('discount.table.columns.ops')}}",
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: "{{t('discount.form.add')}}",
              'x-component': 'ArrayTable.Addition',
            },
          },
        },

        active_day_hours: {
          type: 'array',
          title: "{{t('discount.form.activeHours')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox.Group',
          enum: [
            { label: '00:00', value: 0 },
            { label: '01:00', value: 1 },
            { label: '02:00', value: 2 },
            { label: '03:00', value: 3 },
            { label: '04:00', value: 4 },
            { label: '05:00', value: 5 },
            { label: '06:00', value: 6 },
            { label: '07:00', value: 7 },
            { label: '08:00', value: 8 },
            { label: '09:00', value: 9 },
            { label: '10:00', value: 10 },
            { label: '11:00', value: 11 },
            { label: '12:00', value: 12 },
            { label: '13:00', value: 13 },
            { label: '14:00', value: 14 },
            { label: '15:00', value: 15 },
            { label: '16:00', value: 16 },
            { label: '17:00', value: 17 },
            { label: '18:00', value: 18 },
            { label: '19:00', value: 19 },
            { label: '20:00', value: 20 },
            { label: '21:00', value: 21 },
            { label: '22:00', value: 22 },
            { label: '23:00', value: 23 },
          ],
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
          enum: [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4', value: 4 },
            { label: '5', value: 5 },
            { label: '6', value: 6 },
            { label: '7', value: 7 },
            { label: '8', value: 8 },
            { label: '9', value: 9 },
            { label: '10', value: 10 },
            { label: '11', value: 11 },
            { label: '12', value: 12 },
            { label: '13', value: 13 },
            { label: '14', value: 14 },
            { label: '15', value: 15 },
            { label: '16', value: 16 },
            { label: '17', value: 17 },
            { label: '18', value: 18 },
            { label: '19', value: 19 },
            { label: '20', value: 20 },
            { label: '21', value: 21 },
            { label: '22', value: 22 },
            { label: '23', value: 23 },
            { label: '24', value: 24 },
            { label: '25', value: 25 },
            { label: '26', value: 26 },
            { label: '27', value: 27 },
            { label: '28', value: 28 },
            { label: '29', value: 29 },
            { label: '30', value: 30 },
            { label: '31', value: 31 },
          ],
        },
        exclude_dates: {
          type: 'array',
          title: "{{t('discount.form.excludeDates')}}",
          'x-decorator': 'FormItem',
          'x-component': 'ArrayTable',
          items: {
            type: 'object',
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
                'x-component-props': { width: 60, title: '#' },
              },
              date: {
                type: 'string',
                title: "{{t('discount.table.columns.date')}}",
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-component-props': {
                  type: 'date',
                  valueFormat: 'YYYY-MM-DD',
                },
              },
              remove: {
                type: 'void',
                title: "{{t('discount.table.columns.ops')}}",
                'x-component': 'ArrayTable.Remove',
              },
            },
          },
          properties: {
            addition: {
              type: 'void',
              title: "{{t('discount.form.addDate')}}",
              'x-component': 'ArrayTable.Addition',
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

        merchant_id: { type: 'number', 'x-visible': false },
        creator_id: { type: 'number', default: 0, 'x-visible': false },
      },
    },
  },
} as ISchema;
