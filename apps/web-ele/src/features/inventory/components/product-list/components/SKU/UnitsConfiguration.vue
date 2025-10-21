<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineProps,
  nextTick,
  onMounted,
  ref,
  unref,
  watch,
} from 'vue';

import {
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTooltip,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { debounce, isEqual } from '@igourd/utils';

import { getUnitListApi, preCheckRemoveUsingPOST } from '@@/inventory/apis';
import { storeToRefs } from 'pinia';

import FormSection from '../FormSection.vue';
import { createUnitsTableConfig } from './sku.config';

const props = defineProps({
  externalConfig: {
    type: Object,
    default: () => ({}),
  },

  costPrice: {
    type: [String, Number],
    default: '',
  },
  sellingPrice: {
    type: [String, Number],
    default: '',
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit', 'view'].includes(value),
  },
  specsBundleGenerated: {
    type: Boolean,
    default: false,
  },
  is_update_config: {
    type: Boolean,
    default: false,
  },
  unitCountExceeded: {
    type: Boolean,
    default: false,
  },
  multiSpecs: {
    type: Boolean,
    default: false,
  },
  unitLists: {
    type: Array,
    default: [],
  },
});
const emit = defineEmits([
  'update:unitsConfig',
  'reset-form-mode',
  'add-unit',
  'unit-count-change',
  'unit-selected',
  'unit-deleted',
  'ratio-changed',
  'multi-units-changed',
  // 主单位删除事件
  'unit-delete-main-unit',
  'unit-delete-main-unit-success',
  // 主单位变更
  'unit-update-main-unit',
  // 删除单位
  'unit-delete-unit',
  // 重置配置
  'update-config',
]);
const { t } = useI18n();
const unitsTableConfig = createUnitsTableConfig(t);

const userStore = useUserStore();
const { owner_id: merchantId } = storeToRefs(userStore);

const isTogglingMultiUnits = ref(false);

const mainUnit = computed(() => {
  const mainUnitItem = units.value.find((unit) => unit.is_basic_unit === 1);
  if (mainUnitItem) {
    return {
      id: mainUnitItem.secondary_unit_id || '',
      name: mainUnitItem.secondary_unit_name || '',
      selling_price: mainUnitItem.selling_price || '',
      cost_price: mainUnitItem.cost_price || '',
    };
  }
  return {
    id: '',
    name: '',
  };
});
// 创建本地配置对象，而不是直接修改外部传入的配置
const localConfig = ref({
  multiUnits: false,
  units: [
    {
      id: '',
      type: t('inventory.major-unit-name'),
      is_basic_unit: 1,
      selling_price: props.sellingPrice,
      cost_price: props.costPrice,
      merchant_id: merchantId.value,
      basic_unit_id: '',
      basic_unit_name: '',
      basic_unit_radio: '1:1',
      package_barcode: '',
      product_profile_id: '',
      secondary_unit_id: '',
      secondary_unit_name: '',
      is_update_config: props.is_update_config,
    },
  ],
  purchaseUnit: {
    purchase_unit_id: '',
    purchase_unit_name: '',
  },
  salesUnit: {
    sale_unit_id: '',
    sale_unit_name: '',
  },
});

// 使用localConfig来生成UI所需的
const multiUnits = computed({
  get: () => localConfig.value.multiUnits,
  set: (val) => {
    localConfig.value.multiUnits = val;
    emitChange();
  },
});

const units = computed({
  get: () => localConfig.value.units,
  set: (val) => {
    localConfig.value.units = val;
  },
});

const purchaseUnit = computed({
  get: () => ({
    id: localConfig.value.purchaseUnit.purchase_unit_id,
    name: localConfig.value.purchaseUnit.purchase_unit_name,
  }),
  set: (val) => {
    localConfig.value.purchaseUnit = {
      purchase_unit_id: val.id,
      purchase_unit_name: val.name,
    };
    emitChange();
  },
});

const salesUnit = computed({
  get: () => ({
    id: localConfig.value.salesUnit.sale_unit_id,
    name: localConfig.value.salesUnit.sale_unit_name,
  }),
  set: (val) => {
    localConfig.value.salesUnit = {
      sale_unit_id: val.id,
      sale_unit_name: val.name,
    };
    emitChange();
  },
});

const availableUnits = computed(() => {
  return units.value
    .map((unit) => ({
      id: unit.secondary_unit_id,
      name: unit.secondary_unit_name,
    }))
    .filter((unit) => unit.id && unit.name);
});

// 添加一个更新所有单位价格的辅助函数
const updateAllUnitsPrices = (mainPrice, priceType) => {
  const newUnits = [...units.value];
  newUnits.forEach((unit, index) => {
    if (index === 0) {
      // 主单位直接使用新价格，如果为空则使用0
      unit[priceType] = mainPrice || '0';
    } else {
      // 从属单位根据比例计算
      const ratio = Number.parseFloat(unit.basic_unit_radio.split(':')[1]) || 1;
      const basePrice = Number.parseFloat(mainPrice) || 0;
      unit[priceType] = (basePrice * ratio).toFixed(2);
    }
  });
  localConfig.value.units = newUnits;
  emitChange();
};

// 修改 watch 部分
watch(
  () => props.sellingPrice,
  (newValue) => {
    if (units.value.length > 0) {
      updateAllUnitsPrices(newValue, 'selling_price');
    }
  },
);

watch(
  () => props.costPrice,
  (newValue) => {
    if (units.value.length > 0) {
      updateAllUnitsPrices(newValue, 'cost_price');
    }
  },
);

// 修改处理函数以使用计算属性
const handleMultiUnitsToggle = (val) => {
  isTogglingMultiUnits.value = true;

  multiUnits.value = val;

  // 关闭清空除主单位外的所有单位
  if (!val && units.value.length > 0) {
    // 保留第一个单位（主单位）
    const mainUnit = { ...units.value[0] };
    mainUnit.package_barcode = '';

    if (!(props.mode === 'edit' && props.is_update_config)) {
      mainUnit.secondary_unit_id = '';
      mainUnit.secondary_unit_name = '';
    }

    localConfig.value.units = [
      {
        id: '',
        type: t('inventory.major-unit-name'),
        is_basic_unit: 1,
        selling_price: props.sellingPrice,
        cost_price: props.costPrice,
        basic_unit_id: '',
        basic_unit_name: '',
        basic_unit_radio: '1:1',
        merchant_id: merchantId.value,
        package_barcode: '',
        product_profile_id: '',
        secondary_unit_id: '',
        secondary_unit_name: '',
        is_update_config: false,
      },
    ];

    // 重置采购单位和销售单位为基础单位
    localConfig.value.purchaseUnit = {
      purchase_unit_id: '',
      purchase_unit_name: '',
    };

    localConfig.value.salesUnit = {
      sale_unit_id: '',
      sale_unit_name: '',
    };

    emitChange();
  } else {
    units.value[0].selling_price = props.sellingPrice;
    units.value[0].cost_price = props.costPrice;
  }

  setTimeout(() => {
    isTogglingMultiUnits.value = false;
    emit('multi-units-changed', val);
  }, 300);
};

// 修改 handleUnitChange 函数
const handleUnitChange = (row, field, value, index) => {
  switch (field) {
    case 'basic_unit_radio': {
      if (!value.startsWith('1:')) {
        value = `1:${value.replace(/^1:/, '')}`;
      }

      const ratioText = value.slice(2);
      const ratio = ratioText ? Number.parseFloat(ratioText) : 0;

      row[field] = value;

      const mainSellingPrice = Number.parseFloat(
        String(mainUnit.value.selling_price || '0'),
      );
      const mainCostPrice = Number.parseFloat(
        String(mainUnit.value.cost_price || '0'),
      );
      row.selling_price = (mainSellingPrice * ratio).toFixed(2);
      row.cost_price = (mainCostPrice * ratio).toFixed(2);

      emit('ratio-changed', {
        unit: row,
        index,
        ratio,
        basic_unit_radio: value,
      });

      break;
    }
    case 'cost_price':
    case 'selling_price': {
      // 价格校验：只允许数字和小数点
      value = value.toString().replaceAll(/[^\d.]/g, '');

      // 确保只有一个小数点
      const parts = value.split('.');
      if (parts.length > 2) {
        value = `${parts[0]}.${parts.slice(1).join('')}`;
      }

      // 限制小数点后只有两位
      if (parts.length === 2 && parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }

      // 限制最大15位数字，超出自动截取
      if (value.replace('.', '').length > 15) {
        // 如果有小数点，需要考虑小数点的位置进行截取
        if (value.includes('.')) {
          const intPart = parts[0];
          const decPart = parts[1] || '';
          const totalDigits = intPart.length + decPart.length;

          if (totalDigits > 15) {
            if (intPart.length >= 15) {
              value = intPart.slice(0, 15);
            } else {
              // 否则保留整数部分，截取小数部分
              const remainingDigits = 15 - intPart.length;
              value = `${intPart}.${decPart.slice(0, Math.max(0, remainingDigits))}`;
            }
          }
        } else {
          value = value.slice(0, 15);
        }
      }

      const numValue = Number.parseFloat(value);
      value = isNaN(numValue) ? '0' : numValue.toString();

      row[field] = value;

      break;
    }
    case 'package_barcode': {
      row[field] = value;
      const ratio = row.basic_unit_radio
        ? Number.parseFloat(row.basic_unit_radio.split(':')[1]) || 1
        : 1;

      emit('ratio-changed', {
        unit: row,
        index,
        ratio,
        basic_unit_radio: row.basic_unit_radio,
      });

      break;
    }
    // No default
  }

  if (field !== 'basic_unit_radio' && field !== 'package_barcode') {
    row[field] = value;
  }

  emitChange();
};

// 添加新的单位
const quickAddUnit = () => {
  emit('add-unit');
};

// 修改 handleAddUnit 函数
const handleAddUnit = () => {
  //   if (units.value.length >= 4 && !props.unitCountExceeded) {
  //       ElMessage.warning(t('inventory.max-units-limit', { value: 4 }));
  //   return;
  // } else if (units.value.length >= 50) {
  //   ElMessage.warning(t('inventory.max-units-limit', { value: 50 }));
  //       return;
  //   }

  const newUnits = [...units.value];
  const getMainUnit = newUnits[0] || {};
  const basicUnitId = getMainUnit.secondary_unit_id || mainUnit.value.id;
  const basicUnitName = getMainUnit.secondary_unit_name || mainUnit.value.name;

  newUnits.push({
    id: '',
    type: t('inventory.minor-unit-name'),
    is_basic_unit: 0,
    selling_price: '',
    cost_price: '',
    basic_unit_id: basicUnitId,
    basic_unit_name: basicUnitName,
    basic_unit_radio: '1:',
    merchant_id: merchantId.value,
    package_barcode: '',
    product_profile_id: '',
    secondary_unit_id: '',
    secondary_unit_name: '',
    is_update_config: false,
  });
  localConfig.value.units = newUnits;
  emitChange();

  // 通知单位数量变化
  emit('unit-count-change', newUnits.length);
  //  添加双向同步
  if (newUnits.length > 0) {
    const newUnit = newUnits[newUnits.length - 1];
    emit('unit-selected', { unitId: newUnit.secondary_unit_id, unit: newUnit });
  }
};
const isDeleteMainUnit = ref(false);
// 重置函数
const resetData = () => {
  emit('update-config', { is_update_config: false });
  units.value = [
    {
      id: '',
      type: t('inventory.major-unit-name'),
      is_basic_unit: 1,
      selling_price: props.sellingPrice,
      cost_price: props.costPrice,
      basic_unit_id: '',
      basic_unit_name: '',
      basic_unit_radio: '1:1',
      merchant_id: merchantId.value,
      package_barcode: '',
      product_profile_id: '',
      secondary_unit_id: '',
      secondary_unit_name: '',
      is_update_config: false,
    },
  ];
  isDeleteMainUnit.value = true;
  multiUnits.value = false;
  purchaseUnit.value = {
    purchase_unit_id: '',
    purchase_unit_name: '',
  };
  salesUnit.value = {
    sale_unit_id: '',
    sale_unit_name: '',
  };
};
// 生成对话框html
const createMessageBox = (isMainUnit: boolean, unit: string) => {
  return `<div class="message-box">
    <div class="message-box-title">${isMainUnit ? t('inventory.major-main-unit-delete-tips') : t('inventory.major_unit_delete_tips')}</div>
    <div class="message-box-content mt-2"><spn class="text-slate-gray">${t('inventory.unit')}:</span><span class="text-watermelon pl-2">${unit}</span></div>
    `;
};
// 生成提示词HTML
const getTipHtml = (tip, good) => {
  let goodName = '';
  let skuBarcode = '';
  good.forEach((item) => {
    goodName += goodName == '' ? item.major_name : `、${item.major_name}`;
    skuBarcode += skuBarcode == '' ? item.sku_barcode : `、${item.sku_barcode}`;
  });
  return `<div>
    <p style="fonst-size:16px;">${tip}</p>
    <div class="tip-box" style="margin-top:16px;">
      <p> <span style="color:#606266;">${t('inventory.product-name')} :</span> <span style="color:#FC5C65;">${
        goodName
      }</span> </p>
      <p> <span style="color:#606266;">${t('inventory.sku_list.sku_barcode')} :</span> <span style="color:#FC5C65;">${
        skuBarcode
      }</span> </p>
    </div>
    </div>`;
};
// 删除提示词
const deleteTip = (good) => {
  let goodName = '';
  let skuBarcode = '';
  good.forEach((item) => {
    goodName += goodName == '' ? item.major_name : `、${item.major_name}`;
    skuBarcode += skuBarcode == '' ? item.sku_barcode : `、${item.sku_barcode}`;
  });
  const createGoodsHtml = () => {
    return `<div class="tip-box" style="margin-top:16px;">
      <p> <span style="color:#606266;">${t('inventory.product-name')} :</span> <span style="color:#FC5C65;">${
        goodName
      }</span> </p>
      <p> <span style="color:#606266;">${t('inventory.sku_list.sku_barcode')} :</span> <span style="color:#FC5C65;">${
        skuBarcode
      }</span> </p>
    </div>`;
  };
  return {
    RECENT_SALES_RECORD: `
    ${t('inventory.delete-tips-recent-sales-recorder')}
    ${createGoodsHtml()}
    `,
    PROMOTION_ACTIVITY: `
     <div style="display:flex;gap:8px"></div>
    ${t('inventory.delete-tips-recent-sales-recorder')}
       ${createGoodsHtml()}
    `,
    ASSOCIATED_BOM: `
    <div style="display:flex;gap:8px"></div>
    ${t('inventory.delete-tips-associated-bom')}
      ${createGoodsHtml()}
    `,
    WARRANTY_INFO: `${t('inventory.delete-tips-warranty-info')}
        ${createGoodsHtml()}
    `,
  };
};

// 修改 handleDeleteUnit 函数
const handleDeleteUnit = async (item, index) => {
  ElMessageBox.confirm(
    createMessageBox(item.is_basic_unit === 1, item.secondary_unit_name),
    t('common.system-message'),
    {
      confirmButtonText: t('set.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      confirmButtonClass: 'message-box-error-confirm-button',
      dangerouslyUseHTMLString: true,
    },
  )
    .then(async () => {
      // 如果是主单位 怎清空所有已生成的商品数据
      if (item.is_basic_unit === 1) {
        if (item.basic_unit_id == '') return;
        // 重置多单位
        emit('unit-delete-main-unit', item, async (event) => {
          const { code, data, message, tableData } = event;
          // 判断是否可以删除
          if (code === 'SUCCESS') {
            // 柔性校验
            if (data?.remove_check_enum) {
              const productList = [];
              if (data && data.product_info_id_list.length > 0) {
                // 需要提示的商品
                data.product_info_id_list.forEach((goodItem) => {
                  const product = tableData.find(
                    (items) => items.id == goodItem,
                  );
                  if (!product) return;
                  productList.push(product);
                });
              }
              ElMessageBox.confirm(
                deleteTip(productList)[data?.remove_check_enum],
                t('common.system-message'),
                {
                  dangerouslyUseHTMLString: true,
                  type: 'warning',
                },
              ).then(() => {
                emit('unit-delete-main-unit-success', item);
              });
            } else {
              // 如果当前删除的单位与采购单位或销售单位一致则自动设置成主单位
              emit('unit-delete-main-unit-success', item);
            }
          } else {
            const productList = [];
            if (data && data.length > 0) {
              // 需要提示的商品
              data.forEach((item) => {
                const product = tableData.find(
                  (items) => items.product_profile_id == item,
                );
                if (!product) return;
                productList.push(product);
              });
            }
            ElMessageBox.confirm(
              getTipHtml(message, productList),
              t('common.system-message'),
              {
                dangerouslyUseHTMLString: true,
                type: 'warning',
                showCancelButton: false,
              },
            ).then(() => {});
          }
        });
      } else {
        // 删除非主单位 通知父组件，对话框确认后 这边在执行后续操作
        emit('unit-delete-unit', item, async (event) => {
          const tableData = event;
          // 根据product_unit_id 获取相同单位的商品
          const sameUnits = tableData.filter(
            (unit) => unit.product_unit_id == item.secondary_unit_id,
          );
          const productIds = sameUnits.map((unit) => unit.id).filter(Boolean);
          const deleteUnit = () => {
            if (item.secondary_unit_id === purchaseUnit.value.id) {
              purchaseUnit.value.id = item.basic_unit_id;
              purchaseUnit.value.name = item.basic_unit_name;
              localConfig.value.purchaseUnit = {
                purchase_unit_id: purchaseUnit.value.id,
                purchase_unit_name: purchaseUnit.value.name,
              };
            }
            if (item.secondary_unit_id === salesUnit.value.id) {
              salesUnit.value.id = item.basic_unit_id;
              salesUnit.value.name = item.basic_unit_name;
              localConfig.value.salesUnit = {
                sale_unit_id: salesUnit.value.id,
                sale_unit_name: salesUnit.value.name,
              };
            }

            const newUnits = [...units.value];
            const deletedUnit = newUnits[index];
            newUnits.splice(index, 1);
            localConfig.value.units = newUnits;
            ElMessage.success(t('inventory.unit-detele'));
            emitChange();

            // 通知单位数量变化
            emit('unit-count-change', newUnits.length);

            // 删除双向同步
            if (deletedUnit && deletedUnit.secondary_unit_id) {
              emit('unit-deleted', {
                unitId: deletedUnit.secondary_unit_id,
                unit: deletedUnit,
              });
            }
          };
          if (productIds.length === 0) {
            deleteUnit();
          } else {
            const { code, data, message } = await preCheckRemoveUsingPOST({
              product_info_ids: productIds,
            });
            // 判断是否可以删除
            if (code === 'SUCCESS') {
              // 柔性校验
              if (data?.remove_check_enum) {
                const productList = [];
                if (
                  data.product_info_id_list &&
                  data.product_info_id_list.length > 0
                ) {
                  // 需要提示的商品
                  data.product_info_id_list.forEach((item) => {
                    const product = tableData.find((items) => items.id == item);
                    if (!product) return;
                    productList.push(product);
                  });
                }
                ElMessageBox.confirm(
                  deleteTip(productList)[data?.remove_check_enum],
                  t('common.system-message'),
                  {
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                  },
                ).then(() => {
                  deleteUnit();
                });
              } else {
                deleteUnit();
                // 如果当前删除的单位与采购单位或销售单位一致则自动设置成主单位
              }
            } else {
              const productList = [];
              if (data && data.length > 0) {
                // 需要提示的商品
                data.forEach((item) => {
                  const product = tableData.find(
                    (items) => items.product_profile_id == item,
                  );
                  if (!product) return;
                  productList.push(product);
                });
              }
              ElMessageBox.confirm(
                getTipHtml(message, productList),
                t('common.system-message'),
                {
                  dangerouslyUseHTMLString: true,
                  type: 'warning',
                  showCancelButton: false,
                },
              ).then(() => {});
            }
          }
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

const handleUnitTypeSelect = (type, unitId) => {
  const selectedUnit = availableUnits.value.find((unit) => unit.id === unitId);
  if (selectedUnit) {
    if (type === 'purchase') {
      purchaseUnit.value = {
        id: selectedUnit.id,
        name: selectedUnit.name,
      };
    } else if (type === 'sale') {
      salesUnit.value = {
        id: selectedUnit.id,
        name: selectedUnit.name,
      };
    }
  }
};

const handleUnitSelect = async (row, unitId) => {
  const prevUnitId = row.secondary_unit_id;

  // 保存旧的单位信息，用于后续更新
  const oldMainUnitInfo = {
    id: row.basic_unit_id,
    name: row.basic_unit_name,
  };
  // 检查是否为主单位更换
  const isMainUnit = row.is_basic_unit == 1;
  const unitSelect = () => {
    if (isMainUnit) {
      row.basic_unit_id = unitId;
    }

    row.secondary_unit_id = unitId;
    const selectedUnit = [...unitSearchList.value].find(
      (unit) => unit.id === unitId,
    );

    if (selectedUnit) {
      // 更新采购单位和销售单位
      row.secondary_unit_name = selectedUnit.name;
      // 如果是主单位，更新主单位名称
      if (isMainUnit) {
        row.basic_unit_name = selectedUnit.name;

        // 更新所有从属单位的基本单位信息
        if (units.value && units.value.length > 1) {
          const updatedUnits = [...units.value];

          for (let i = 1; i < updatedUnits.length; i++) {
            updatedUnits[i].basic_unit_id = unitId;
            updatedUnits[i].basic_unit_name = selectedUnit.name;
          }

          units.value = updatedUnits;
        }
        nextTick(() => {
          purchaseUnit.value = {
            id: unitId,
            name: selectedUnit.name,
          };

          salesUnit.value = {
            id: unitId,
            name: selectedUnit.name,
          };
        });
      }
    }
    emitChange();

    // 修改这里以通知单位选择变更
    emit('unit-selected', {
      unitId,
      prevUnitId,
      unit: row,
      isMainUnit,
      oldMainUnitInfo,
    });
  };

  // 主单位变更
  emit('unit-update-main-unit', prevUnitId, async (tableGoodsData) => {
    // 根据product_unit_id 获取相同单位的商品
    const tableData = tableGoodsData.tableData;
    let productIds = [];
    const sameUnits = tableData.filter(
      (unit) => unit.product_unit_id == oldMainUnitInfo.id,
    );
    productIds = sameUnits.map((unit) => unit.id).filter(Boolean);
    if (productIds.length === 0) {
      unitSelect();
    } else {
      const { code, data, message } = await preCheckRemoveUsingPOST({
        merchant_id: merchantId.value,
        product_info_ids: productIds,
      });
      // 判断是否可以删除
      if (code === 'SUCCESS') {
        // 柔性校验
        if (data?.remove_check_enum) {
          const productList = [];
          if (
            data.product_info_id_list &&
            data.product_info_id_list.length > 0
          ) {
            // 需要提示的商品
            data.product_info_id_list.forEach((item) => {
              const product = tableData.find((items) => items.id == item);
              if (!product) return;
              productList.push(product);
            });
          }
          ElMessageBox.confirm(
            deleteTip(productList)[data?.remove_check_enum],
            t('common.system-message'),
            {
              dangerouslyUseHTMLString: true,
              type: 'warning',
            },
          )
            .then(() => {
              unitSelect();
            })
            .catch(() => {});
        } else {
          unitSelect();

          // 如果当前删除的单位与采购单位或销售单位一致则自动设置成主单位
        }
      } else {
        const productList = [];
        if (data && data.length > 0) {
          // 需要提示的商品
          data.forEach((item) => {
            const product = tableData.find(
              (items) => items.product_profile_id == item,
            );
            if (!product) return;
            productList.push(product);
          });
        }
        ElMessageBox.confirm(
          getTipHtml(message, productList),
          t('common.system-message'),
          {
            dangerouslyUseHTMLString: true,
            type: 'warning',
            showCancelButton: false,
          },
        ).then(() => {});
      }
    }
  });
};

const unitSearchList = ref([]);
const getUnitList = async (keywords = '') => {
  try {
    const res = await getUnitListApi(
      {
        page_num: 1,
        keywords,
        page_size: 500,
      },
      { hideLoading: true },
    );

    if (res && res.list) {
      unitSearchList.value = res.list;
      return res.list;
    }
    return [];
  } catch (error) {
    console.error('Failed to get unit list:', error);
    return [];
  }
};
watch(
  () => props.unitLists,
  (val) => {
    // unitSearchList.value = props.unitLists
  },
  { immediate: true },
);

const handleUnitSearch = debounce((query) => {
  // if (
  //   !query.trim() &&
  //   unitSearchList.value.length != 0 &&
  //   unitSearchList.value.length != units.value.length
  // )
  //   return
  getUnitList(query);
}, 300);

const extractUnitsFromConfig = () => {
  if (
    !localConfig.value ||
    !localConfig.value.units ||
    localConfig.value.units.length === 0
  )
    return;

  const uniqueUnits = new Map();

  localConfig.value.units.forEach((unit) => {
    if (unit.secondary_unit_id && unit.secondary_unit_name) {
      uniqueUnits.set(unit.secondary_unit_id, {
        id: unit.secondary_unit_id,
        name: unit.secondary_unit_name,
      });
    }
  });

  if (uniqueUnits.size > 0) {
    const unitsArray = [...uniqueUnits.values()];
    const newUnits = unitsArray.filter(
      (unit) =>
        !unitSearchList.value.some(
          (existingUnit) => existingUnit.id === unit.id,
        ),
    );

    if (newUnits.length > 0) {
      unitSearchList.value = [...unitSearchList.value, ...newUnits];
    }
  }
};

// 添加清空 unitSearchList 的方法
const clearUnitSearchList = () => {
  unitSearchList.value = [];
};

// 仅当本地配置发生变化时才发送事件
const emitChange = debounce(() => {
  const configToEmit = {
    id: localConfig.value.id,
    multiUnits: localConfig.value.multiUnits,
    units: localConfig.value.units,
    purchaseUnit: localConfig.value.purchaseUnit,
    salesUnit: localConfig.value.salesUnit,
  };

  // 如果与外部配置相同，则不触发更新
  if (!isEqual(configToEmit, props.externalConfig)) {
    emit('update:unitsConfig', configToEmit);
  }
}, 300);

// 当外部配置更新时，只有当它与本地状态不同时才更新本地状态
watch(
  () => props.externalConfig,
  (newConfig) => {
    // 如果正在切换多单位模式，则不执行更新
    if (isTogglingMultiUnits.value) {
      return;
    }

    if (
      newConfig &&
      Object.keys(newConfig).length > 0 &&
      (props.mode === 'edit' ||
        props.mode === 'copy' ||
        props.mode === 'view' ||
        (props.mode == 'add' && newConfig.multiUnits)) &&
      !isEqual(newConfig, localConfig.value)
    ) {
      // 如果没有设置采购或销售单位，则默认使用基础单位
      const purchaseUnit =
        newConfig.purchaseUnit?.purchase_unit_id && props.mode !== 'add'
          ? newConfig.purchaseUnit
          : {
              purchase_unit_id: mainUnit.value.id,
              purchase_unit_name: mainUnit.value.name,
            };

      const salesUnit =
        newConfig.salesUnit?.sale_unit_id && props.mode !== 'add'
          ? newConfig.salesUnit
          : {
              sale_unit_id: mainUnit.value.id,
              sale_unit_name: mainUnit.value.name,
            };

      localConfig.value = {
        id: newConfig.id,
        multiUnits:
          newConfig.multiUnits ||
          (props.mode === 'view' && newConfig.units?.length > 1),
        units: newConfig.units ? [...newConfig.units] : localConfig.value.units,
        purchaseUnit,
        salesUnit,
      };

      // 确保至少有一个主单位
      if (localConfig.value.units.length === 0) {
        localConfig.value.units = [
          {
            id: '',
            type: t('inventory.major-unit-name'),
            is_basic_unit: 1,
            selling_price: props.sellingPrice,
            cost_price: props.costPrice,
            basic_unit_id: mainUnit.value.id,
            basic_unit_name: mainUnit.value.name,
            basic_unit_radio: '1:1',
            merchant_id: merchantId.value,
            package_barcode: '',
            product_profile_id: '',
            secondary_unit_id: mainUnit.value.id,
            secondary_unit_name: mainUnit.value.name,
            is_update_config: props.is_update_config && props.mode == 'edit',
          },
        ];
      }

      if (props.mode == 'copy') {
        emit('reset-form-mode');
      }

      setTimeout(() => extractUnitsFromConfig(), 0);
    }
  },
  { deep: true },
);

onMounted(() => {
  // getUnitList();

  // 确保始终至少有一个主单位
  if (!units.value || units.value.length === 0) {
    localConfig.value.units = [
      {
        id: '',
        type: t('inventory.major-unit-name'),
        is_basic_unit: 1,
        selling_price: props.sellingPrice,
        cost_price: props.costPrice,
        basic_unit_id: mainUnit.value.id,
        basic_unit_name: mainUnit.value.name,
        basic_unit_radio: '1:1',
        merchant_id: merchantId.value,
        package_barcode: '',
        product_profile_id: '',
        secondary_unit_id: mainUnit.value.id,
        secondary_unit_name: mainUnit.value.name,
        is_update_config: props.is_update_config && props.mode == 'edit',
      },
    ];
    emitChange();
  }

  if (units.value && units.value.length > 0) {
    emit('unit-count-change', units.value.length);

    extractUnitsFromConfig();
  }
});

const renderCell = (column, scope) => {
  const { row, $index } = scope;
  if (typeof column.render === 'function') {
    return column.render({
      row,
      $index,
      t,
      unitList: [...unitSearchList.value],
      handleUnitSelect,
      handleUnitChange,
      handleAddUnit,
      quickAddUnit,
      handleDeleteUnit,
      handleUnitSearch,
      mode: props.mode,
      units: units.value,
      showUnit: props.multiSpecs,
      multiUnits: multiUnits.value,
    });
  }

  return row[column.prop];
};
const handGetTableData = () => {
  return unref(units.value);
};

defineExpose({
  handleMultiUnitsToggle,
  quickAddUnit,
  clearUnitSearchList,
  handGetTableData,
  resetData,
});
</script>

<template>
  <div class="units-configuration">
    <FormSection :title="$t('inventory.units-configuration')">
      <template #header-right>
        <ElTooltip
          class="box-item"
          effect="customized"
          :content="$t(`inventory.openUnitsPrompt`)"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <ElSwitch
            v-model="multiUnits"
            v-auth="'inventory_product-list_product-add_units'"
            :active-text="t('inventory.multi-units')"
            :disabled="
              (mode === 'view' || (is_update_config && mode == 'edit')) &&
              !isDeleteMainUnit
            "
            @change="handleMultiUnitsToggle"
          />
        </ElTooltip>

        <span class="hint-text">{{
          $t('inventory.unit-purchase-and-sales-units')
        }}</span>
      </template>
      <div>
        <ElTable :data="units" class="w-full">
          <ElTableColumn
            prop="index"
            label="#"
            width="60"
            align="center"
            fixed="left"
          >
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            v-for="column in unitsTableConfig"
            :key="column.prop"
            :label="t(`${column.label ? `inventory.${column.label}` : ''}`)"
            :width="column.width"
            :prop="column.prop"
          >
            <template #default="scope">
              <component :is="renderCell(column, scope)" />
            </template>
          </ElTableColumn>
        </ElTable>
        <div v-if="multiUnits" class="unit-selectors">
          <div class="unit-selector">
            <span>{{ $t('inventory.purchase-unit') }}:</span>
            <ElSelect
              :key="`purchase-${purchaseUnit.id}-${Date.now()}`"
              v-model="purchaseUnit.id"
              :placeholder="$t('common.select')"
              :disabled="mode === 'view'"
              @change="(value) => handleUnitTypeSelect('purchase', value)"
            >
              <ElOption
                v-for="unit in availableUnits"
                :key="unit.id"
                :label="unit.name"
                :value="unit.id"
              />
            </ElSelect>
          </div>

          <div class="unit-selector">
            <span>{{ $t('inventory.sales-unit') }}:</span>
            <ElSelect
              :key="`salesUnit-${purchaseUnit.id}-${Date.now()}`"
              v-model="salesUnit.id"
              :placeholder="$t('common.select')"
              :disabled="mode === 'view'"
              @change="(value) => handleUnitTypeSelect('sale', value)"
            >
              <ElOption
                v-for="unit in availableUnits"
                :key="unit.id"
                :label="unit.name"
                :value="unit.id"
              />
            </ElSelect>
          </div>
        </div>
      </div>
    </FormSection>
  </div>
</template>

<style scoped>
.units-configuration {
  margin-bottom: 20px;
}

.hint-text {
  margin-left: 10px;
  font-size: 11px;
  color: #f56c6c;
}

.unit-selectors {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.unit-selector {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 200px;
  white-space: nowrap;
}
</style>
