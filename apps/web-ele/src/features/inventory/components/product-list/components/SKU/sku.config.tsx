import type {
  InputSyncProps,
  SkuTableRenderProps,
  TableColumn,
  TranslationFunction,
  UnitsTableRenderProps,
} from './type';

import { h } from 'vue';

import {
  ElButton,
  ElInput,
  ElOption,
  ElSelect,
  ElSwitch,
} from '@igourd/common-ui';

import { limitMoney } from '#/utils/addProduct';

import profitRate from './profitRate/profitRate.vue';
import unitRatio from './unitRatio/unitRatio.vue';
import UploadImage from './UploadImage/UploadImage.vue';
import warehouse from './warehouse/warehouse.vue';

export function createUnitsTableConfig(t: TranslationFunction): TableColumn[] {
  return [
    {
      label: '',
      prop: 'type',
      width: 140,
      render: ({ row, $index }: UnitsTableRenderProps) => {
        return h(
          'span',
          {},
          $index === 0 ? t('inventory.major_unit') : t('inventory.minor_unit'),
        );
      },
    },
    {
      label: 'unit',
      prop: 'secondary_unit_name',
      render: ({
        row,
        $index,
        unitList = [],
        handleUnitSelect,
        mode,
        units = [],
        handleAddUnit,
        quickAddUnit,
        handleUnitSearch,
      }: UnitsTableRenderProps) => {
        return h(
          ElSelect,
          {
            modelValue: row.secondary_unit_id,
            placeholder: t('common.select'),
            filterable: true,
            clearable: false,
            'filter-method': (query: string) => handleUnitSearch?.(query),
            disabled: mode === 'view' || row?.is_update_config,
            onChange: (value: string) => handleUnitSelect?.(row, value),
            style: 'width: 100%',
          },
          {
            default: () =>
              unitList.map((option) => {
                // 检查该单位是否已被其他行选择
                const isSelected = units.some(
                  (unit, index) =>
                    unit.secondary_unit_id === option.id && index !== $index,
                );
                return h(
                  ElOption,
                  {
                    key: option.id,
                    label: option.name,
                    value: option.id,
                    disabled: isSelected,
                  },
                  () => option.name,
                );
              }),
            footer: () =>
              h(
                'div',
                {
                  style:
                    'padding: 8px; text-align: center; cursor: pointer; border-top: 1px solid #EBEEF5;',
                  onClick: () => quickAddUnit(),
                },
                [
                  h('i', { class: 'iconfont icon-tianjia-dianpu' }),
                  h(
                    'span',
                    { style: 'margin-left: 5px;' },
                    t('inventory.addUnit'),
                  ),
                ],
              ),
          },
        );
      },
    },
    {
      label: 'unit_rate',
      prop: 'basic_unit_radio',
      render: ({ row, $index, mode, handleUnitChange, unitList }) => {
        if ($index === 0) {
          return h(
            'span',
            {},
            row.basic_unit_name ? `1${row.basic_unit_name}` : '',
          );
        } else {
          const unitName = () => {
            const unit = unitList.find(
              (item) => item.id === row.secondary_unit_id,
            );
            return unit?.name || '';
          };
          return h(unitRatio, {
            modelValue: row.basic_unit_radio,
            min: 1,
            ratioValue: row.basic_unit_radio,
            unitList: [row.basic_unit_name, unitName()],
            disabled: mode === 'view',
            onInputChange: (val) => {
              if (val != '') {
                const value = `1:${val}`;
                handleUnitChange(row, 'basic_unit_radio', value, $index);
                row.basic_unit_radio = value;
              }
            },
          });
        }
      },
    },
    // {
    //   label: 'package_barcode',
    //   width: 160,
    //   prop: 'package_barcode',
    //   render: ({ row, $index, handleUnitChange, mode, units }) => {
    //     if (mode === 'view') {
    //       return h('span', {}, row.package_barcode);
    //     }

    //     const isDisabled = mode === 'view' || (units && units.length < 2);

    //     return h(ElInput, {
    //       modelValue: row.package_barcode,
    //       style: 'width: 100px',
    //       disabled: isDisabled,
    //       type: 'number',
    //       onChange: val => handleUnitChange(row, 'package_barcode', val, $index),
    //       'onUpdate:modelValue': value => {
    //         if (value && value.toString().length > 23) {
    //           row.package_barcode = value.toString().slice(0, 23);
    //         } else {
    //           row.package_barcode = value;
    //         }
    //       }
    //     });
    //   }
    // },
    {
      label: 'unit_conversion',
      prop: 'basic_unit_name',
      render: ({ row }) => {
        return h('span', {}, row.basic_unit_name);
      },
    },
    {
      label: 'action',
      width: 140,
      prop: 'action',
      fixed: 'right',
      render: ({
        row,
        $index,
        handleAddUnit,
        handleDeleteUnit,
        t,
        mode,
        units = [],
        showUnit,
        multiUnits,
      }: UnitsTableRenderProps) => {
        if (mode === 'view') {
          return h('span', {});
        }

        const canAddUnit = (): boolean => {
          // 首先检查是否启用了多单位功能
          if (!multiUnits && $index === 0) {
            return false;
          }

          if (
            (units && units.length >= 4 && showUnit) ||
            (!showUnit && units.length >= 50)
          ) {
            return false;
          }

          if ($index > 0) {
            if (!row.secondary_unit_id) {
              return false;
            }

            // 检查单位比例是否已填写，并且有效
            const ratio = row.basic_unit_radio.split(':')[1];
            if (
              !ratio ||
              isNaN(Number.parseFloat(ratio)) ||
              Number.parseFloat(ratio) <= 0
            ) {
              return false;
            }
          }

          return true;
        };

        const isLastRow = $index === units.length - 1;
        const isFirstRow = $index === 0;

        return h('div', [
          // 添加按钮只在启用多单位时显示，或者只有在第一行时显示
          isLastRow &&
            multiUnits &&
            h(
              ElButton,
              {
                type: 'text',
                size: 'small',
                plain: true,
                onClick: handleAddUnit,
                style: 'padding-left: 0 !important;',
                disabled: !canAddUnit(),
              },
              () => t?.('common.add'),
            ),
          // 删除按钮从不显示在第一行，因为主单位始终保留
          h(
            ElButton,
            {
              type: 'text',
              size: 'small',
              plain: true,
              style: {
                color: '#f56c6c',
                marginLeft: '0px',
                paddingLeft: '0',
                backgroundColor: 'none !important',
              },
              onClick: () => handleDeleteUnit?.(row, $index),
            },
            () => t?.('common.delete'),
          ),
        ]);
      },
    },
  ];
}
/** sku 表格列 */
export function createSkuSpecTableConfig(
  t: TranslationFunction,
  isUpdateDisabled: boolean,
): TableColumn[] {
  return [
    {
      type: 'index',
      fixed: 'left',
      label: '#',
      width: 50,
      align: 'center',
      render: ({ row, $index }: SkuTableRenderProps) => {
        return $index + 1;
      },
    },
    {
      prop: 'status',
      fixed: 'left',
      label: 'inventory.status',
      width: 80,
      align: 'center',
      render: ({ row, mode, handleStatusChange }: SkuTableRenderProps) => {
        if (mode === 'view') {
          return h(
            'span',
            {},
            row.status === 'ON_SALE'
              ? t('inventory.onSale')
              : t('inventory.offSale'),
          );
        }
        return h(ElSwitch, {
          modelValue: row.status,
          'onUpdate:modelValue': (value: string) => {
            row.status = value as 'OFF_SALE' | 'ON_SALE';
            if (handleStatusChange) {
              handleStatusChange(row, value);
            }
          },
          disabled: mode === 'view',
          inlinePrompt: true,
          activeText: 'Y',
          inactiveText: 'N',
          activeValue: 'ON_SALE',
          inactiveValue: 'OFF_SALE',
        });
      },
    },
    {
      label: 'inventory.image',
      prop: 'profile_photo',
      fixed: 'left',
      align: 'center',
      width: 80,
      render: ({ row, mode, handRowUpload }) => {
        return h('div', { class: 'product-image-container' }, [
          h(UploadImage, {
            imgUrl: row.profile_photo,
            disabled: mode === 'view',
            'onFile-uploaded': (file) => {
              if (handRowUpload) {
                handRowUpload(row, file);
              }
            },
          }),
        ]);
      },
    },
    {
      prop: 'skuBarcode',
      label: 'inventory.sku_barcode',
      maxWidth: 140,
      align: 'center',
      render: ({ row, mode, handChangeValue }) => {
        if (mode === 'view') {
          return h('span', {}, row.sku_barcode);
        }
        return h(ElInput, {
          modelValue: row.sku_barcode,
          size: 'small',
          maxlength: 23,
          disabled: mode === 'view',
          'onUpdate:modelValue': (value) => {
            // 只允许写入英文与数字
            if (value) {
              // 过滤非英文字母和数字的字符
              const filteredValue = value
                .toString()
                .replaceAll(/[^a-z0-9]/gi, '');

              // 限制长度为23位
              row.sku_barcode =
                filteredValue.length > 23
                  ? filteredValue.slice(0, 23)
                  : filteredValue;
            } else {
              row.sku_barcode = value;
            }
            handChangeValue(row, value);
          },
          onChange: (value) => {
            console.log(value);
          },
        });
      },
    },
    {
      prop: 'specCode',
      label: 'inventory.spec_code',
      width: 120,
      align: 'center',
      render: ({ row, mode, handleInputChange }) => {
        if (mode === 'view') {
          return h('span', {}, row.spec_code);
        }
        return h(ElInput, {
          modelValue: row.spec_code,
          size: 'small',
          maxlength: 10,
          type: 'number',
          disabled: mode === 'view',
          'onUpdate:modelValue': (value) => {
            const oldSpecCode = row.spec_code;
            row.spec_code =
              value && value.toString().length > 10
                ? value.toString().slice(0, 10)
                : value;

            handleInputChange({
              newVal: row.spec_code,
              rowType: 'spec_code',
              row,
              oldVal: oldSpecCode,
            } as InputSyncProps);
          },
        });
      },
    },
    {
      prop: 'initialStock',
      label: 'inventory.initial_stock',
      align: 'center',
      render: ({
        row,
        $index,
        warehouseListContent,
        handleStockQuantityChange,
        handleWarehouseChange,
        mode,
        handleAddWarehouse,
      }) => {
        if (mode === 'view') {
          const warehouseName =
            warehouseListContent.find(
              (w) => w.id === row.initial_stock_warehouse_id,
            )?.name || '';
          return h('div', {}, [
            h('span', {}, `${warehouseName} `),
            h('span', {}, row.initial_stock_quantity || '0'),
          ]);
        }

        return h(
          ElInput,
          {
            modelValue: row.initial_stock_quantity,
            min: 0,
            size: 'small',
            type: 'number',
            disabled: mode === 'view',
            'onUpdate:modelValue': (value) => {
              row.initial_stock_quantity = value;
              // handleStockQuantityChange(row, $index, value, 'initial_stock_quantity');
            },
            onChange: (value) => {
              handleStockQuantityChange(
                row,
                $index,
                value,
                'initial_stock_quantity',
              );
            },
          },
          {
            prepend: () =>
              h(warehouse, {
                placeholder: t('inventory.warehouse'),
                modelValue: row.initial_stock_warehouse_id,
                warehouseList: warehouseListContent,
                style: 'width: 120px',
                disabled: mode === 'view',
                warehouseValue: row,
                'onUpdate:modelValue': (value) => {
                  row.initial_stock_warehouse_id = value;
                },
                onChange: (value) => {
                  row.initial_stock_warehouse_id = value;
                  handleStockQuantityChange(
                    row,
                    $index,
                    value,
                    'initial_stock_warehouse_id',
                  );
                },
                onAddWarehouse: () => {
                  handleAddWarehouse && handleAddWarehouse();
                },
              }),
          },
        );
      },
    },
    {
      prop: 'costPrice',
      label: 'inventory.cost_price',
      maxWidth: 100,
      align: 'center',
      render: ({
        row,
        handleInputChangeCalcul,
        $index,
        mode,
        handleStockQuantityChange,
      }) => {
        if (mode === 'view') {
          return h('span', {}, row.cost_price);
        }
        return h(ElInput, {
          modelValue: row.cost_price,
          min: 0,
          size: 'small',
          type: 'number',
          disabled: mode === 'view',
          'onUpdate:modelValue': (value) => {
            row.cost_price = value ? limitMoney(value) : value;
          },
          onChange: (value) => {
            handleInputChangeCalcul(
              row,
              $index,
              value ? limitMoney(value) : value,
              'cost_price',
            );

            handleStockQuantityChange(
              row,
              $index,
              value ? limitMoney(value) : value,
              'cost_price',
            );
          },
        });
      },
    },
    {
      prop: 'profitRate',
      label: 'inventory.SalesProfitMargin',
      maxWidth: 100,
      align: 'center',
      render: ({
        row,
        mode,
        $index,
        handleInputChangeCalcul,
        handleStockQuantityChange,
      }) => {
        if (mode === 'view') {
          return h('span', {}, row.profit_rate);
        }
        return h(profitRate, {
          modelValue: row.profit_rate,
          size: 'small',
          type: 'number',
          row,
          disabled: mode === 'view',
          'onUpdate:modelValue': (value) => {
            // 限制输入长度为15位

            row.profit_rate = value;
          },
          onChange: (value) => {
            handleInputChangeCalcul(row, $index, value, 'profit_rate');

            handleStockQuantityChange(row, $index, value, 'profit_rate');
          },
        });
      },
    },
    {
      prop: 'sellingPrice',
      label: 'inventory.selling_price',
      maxWidth: 100,
      align: 'center',
      render: ({
        row,
        mode,
        $index,
        handleInputChangeCalcul,
        handleStockQuantityChange,
      }) => {
        if (mode === 'view') {
          return h('span', {}, row.selling_price);
        }
        return h(ElInput, {
          modelValue: row.selling_price,
          min: 0,
          size: 'small',
          type: 'number',
          disabled: mode === 'view',
          'onUpdate:modelValue': (value) => {
            row.selling_price = limitMoney(value);
          },
          onChange: (value) => {
            handleInputChangeCalcul(
              row,
              $index,
              limitMoney(value),
              'selling_price',
            );

            handleStockQuantityChange(
              row,
              $index,
              limitMoney(value),
              'selling_price',
            );
          },
        });
      },
    },

    {
      prop: 'remark',
      label: 'inventory.remarks',
      maxWidth: 120,
      align: 'center',
      render: ({ row, mode }) => {
        if (mode === 'view') {
          return h('span', {}, row.remark);
        }
        return h(ElInput, {
          modelValue: row.remark,
          placeholder: t('inventory.pleaseEnterRemark'),
          size: 'small',
          disabled: mode === 'view',
          'onUpdate:modelValue': (value) => {
            row.remark = value;
          },
        });
      },
    },
    {
      fixed: 'right',
      label: 'inventory.action',
      width: 80,
      align: 'center',
      render: ({ row, $index, handleDeleteRow, mode, unitsConfig }) => {
        if (mode === 'view') {
          return null;
        }
        const isProtectedUnit = () => {
          if (!unitsConfig || !unitsConfig.multiUnits || !row.product_unit_id)
            return false;

          if (
            unitsConfig.units &&
            unitsConfig.units.length > 0 &&
            unitsConfig.units[0].secondary_unit_id === row.product_unit_id
          ) {
            return true;
          }

          return false;
        };

        return h(
          ElButton,
          {
            type: 'text',
            size: 'small',
            style: 'color: #f56c6c;background-color:none !important;',
            // disabled: row?.is_update_config || isUpdateDisabled || isProtectedUnit(),
            onClick: () => handleDeleteRow(row, $index),
          },
          {
            default: () => t('inventory.del'),
          },
        );
      },
    },
  ];
}
export const deleteUnitTableConfig = [
  {
    prop: 'major_name',
    label: 'inventory.productName',
    width: 140,
    align: 'center',
  },
  {
    prop: 'spec_code',
    label: 'inventory.spec',
    width: 140,
    align: 'center',
  },
  {
    prop: 'sku_barcode',
    label: 'inventory.sku_barcode',
    width: 140,
    align: 'center',
  },
  {
    prop: 'unit',
    label: 'inventory.unit',
    width: 140,
    align: 'center',
  },
];
