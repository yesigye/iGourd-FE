<script setup lang="ts">
import type {
  CalculationResult,
  CalculationStrategies,
  CalculationStrategy,
  InputSyncProps,
  PriceField,
  RequiredFieldCount,
  RowData,
  ScenarioCalculator,
  SpecTableData,
} from './type.ts';

import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onMounted,
  ref,
  toRaw,
  toRefs,
  unref,
  watch,
  watchPostEffect,
} from 'vue';

import {
  ElButton,
  ElCheckbox,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTooltip,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { isEqual } from '@igourd/utils';

import { preCheckRemoveUsingPOST } from '@@/inventory/apis';
import { Plus } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';

import { randomBarcode } from '#/utils/addProduct';

import AddAndEditSpec from '../../components/AddAndModifySpec/AddAndEditSpec.vue';
import { useProductSKU } from '../../useProductSKU';
import FormSection from '../FormSection.vue';
import CheckBoxModal from './CheckBoxModal.vue';
import { createSkuSpecTableConfig } from './sku.config';
import { useSpecsConfiguration } from './useSpecsConfiguration';
import { batchTableData } from './utils/batchSkuSpecData.ts';

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  productSpecValueList: {
    type: Array,
    default: () => [],
  },
  unitsConfig: {
    type: Object,
    default: () => ({
      multiUnits: false,
      units: [],
      purchaseUnit: '',
      salesUnit: '',
    }),
  },
  warehouseListContent: {
    type: Array,
    default: () => [],
  },
  productCode: {
    type: String,
    default: '',
  },
  skuImage: {
    type: String,
    default: '',
  },
  productListContent: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit', 'view'].includes(value),
  },
  is_update_config: {
    type: Boolean,
    default: false,
  },
  limitMultiSpecs: {
    type: Boolean,
    default: false,
  },
  backupSpecRows: {
    type: Array,
    default: () => [],
  },
  backupUnitsConfig: {
    type: Object,
    default: () => null,
  },
  showUnits: {
    type: Boolean,
    default: true,
  },
  unitsRef: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits([
  'update:specsConfig',
  'update:specsValue',
  'reset-form-mode',
  'add-warehouse',
  'update-old-units',
  'bundle-generated',
  'sku-deleted',
  'deleteUnitItem',
]);

const { t } = useI18n();

const {
  dimensionList,
  rowSpanArr,
  specDimensions,
  unitDimension,
  buildDimensionList,
  buildRowSpanArr,
  cartesianProduct,
  createSpanMethod,
  createSpanMethodByData,
  createDynamicSpanMethod,
  createSpanMethodByDataForNoSpanning,
  validateBeforeGenerateBundle,
  createTableColumns,
  handleRemoveSpecValue,
  resetSpecsSelection,
  findSameSpecRows,
  clearBundleData,
  bulkEditEnabled,
  bulkEditSelection,
  getBulkEditOptions,
  reverseDeduction,
  addSkuKeyToSkuList,
  validateSpecsForBundle,
  compareData,
} = useSpecsConfiguration();

const userStore = useUserStore();
const { owner_id: merchantId } = storeToRefs(userStore);

const propsRef = toRefs(props);
const skuSpecTableConfig = createSkuSpecTableConfig(t, props.is_update_config);
const { productSpecList, getProductSpecValueList, getProductSpecList } =
  useProductSKU();

onMounted(async () => {
  await getProductSpecList();
});

// 创建本地配置状态，与外部配置分离
const localConfig = ref({
  multiSpecs: false,
  /** * 选中的多规格ID */
  selectedSpecs: {},
  /** * 多规格 表格内展示的规格行 */
  specRows: [],
  bundleGenerated: false,
  specBundleRows: [],
});

const specTypeDisabled = ref<string[]>([]);
const specItemDisabled = ref<string[]>([]);

watchPostEffect(() => {
  if (props.is_update_config) {
    if (!specTypeDisabled.value?.length) {
      specTypeDisabled.value = Object.keys(
        localConfig.value.selectedSpecs,
      ) as string[];
    }
    if (!specItemDisabled.value?.length) {
      specItemDisabled.value = localConfig.value.specRows.reduce(
        (tmp, nextRow) => {
          return [...tmp, ...nextRow?.selectedValues?.map((item) => item.id)];
        },
        [] as string[],
      );
    }
  } else {
    specTypeDisabled.value = [];
    specItemDisabled.value = [];
  }
  return localConfig.value.specRows;
});

// 使用计算属性将本地状态暴露给模板
const multiSpecs = computed({
  get: () => localConfig.value.multiSpecs,
  set: (val) => {
    localConfig.value.multiSpecs = val;
    emitChange();
  },
});
const selectedSpecs = computed({
  get: () => localConfig.value.selectedSpecs,
  set: (val) => {
    localConfig.value.selectedSpecs = val;
  },
});

const specRows = computed({
  get: () => localConfig.value.specRows,
  set: (val) => {
    localConfig.value.specRows = val;
  },
});

const bundleGenerated = computed({
  get: () => localConfig.value.bundleGenerated,
  set: (val) => {
    localConfig.value.bundleGenerated = val;
  },
});

const specBundleRows = computed({
  get: () => localConfig.value.specBundleRows,
  set: (val) => {
    localConfig.value.specBundleRows = val;
  },
});

const tableData = computed({
  get: () => localConfig.value.specBundleRows as SpecTableData[],
  set: (val) => {
    localConfig.value.specBundleRows = val;
    emitChange();
  },
});
// 开关多规格
const handleMultiSpecsToggle = (val, type) => {
  multiSpecs.value = val;

  if (!val) {
    localConfig.value.selectedSpecs = resetSpecsSelection(
      localConfig.value.selectedSpecs,
    );
    localConfig.value.specRows = [];

    dimensionList.value = [];
    rowSpanArr.value = [];

    localConfig.value.specBundleRows = [];

    //  关闭根据单位生成sku
    if (
      props.unitsConfig &&
      props.unitsConfig.units &&
      props.unitsConfig.units.length > 0
    ) {
      const newSkuRows = [];
      if (type !== 'reset') {
        props.unitsConfig.units.forEach((unit) => {
          if (unit.secondary_unit_id) {
            const newRow = {
              unit: unit.secondary_unit_name,
              id: unit.id || '',
              spec_code: unit.is_basic_unit
                ? ''
                : unit.secondary_unit_id.slice(0, 4),
              sku_barcode: randomBarcode(),
              sku_group_code: '',
              initial_stock_quantity:
                props.productListContent.stock_total_quantity || '',
              initial_stock_warehouse_id:
                props.productListContent.sale_warehouse_id || '',
              initial_stock_warehouse_location_id: 1,
              major_name: props.productListContent.major_name || '',
              merchant_id: merchantId.value,
              remark: '',
              status: props.productListContent.status || 'ON_SALE',
              product_profile_id: '',
              profile_photo: props.skuImage || '',
              basic_unit_radio: unit.basic_unit_radio?.split(':')[1] || '1',
              selling_price:
                unit.selling_price ||
                props.productListContent.selling_price ||
                '',
              cost_price:
                unit.cost_price || props.productListContent.cost_price || '',
              package_barcode: unit.package_barcode || '',
              product_unit_id: unit.secondary_unit_id || '',
              product_unit_name: unit.secondary_unit_name || '',
              basic_unit_id:
                unit.basic_unit_id ||
                props.productListContent.major_unit_id ||
                '',
              is_basic: unit.is_basic_unit || 0,
              product_info_spec_list: [],
              skuKey: `unit-${unit.secondary_unit_id}`,
            };
            newSkuRows.push(newRow);
          }
        });
      }

      if (newSkuRows.length > 0) {
        localConfig.value.specBundleRows = newSkuRows;
        // localConfig.value.bundleGenerated = true;
      } else {
        localConfig.value.bundleGenerated = false;
      }
    } else {
      localConfig.value.bundleGenerated = false;
    }

    emitChange();
  }
};

// 处理规格复选框变化
const handleSpecCheckboxChange = async (spec, checked) => {
  if (checked) {
    // 只创建行，但不自动选择值
    // 找到当前选中项
    const rowIndex = specRows.value.findIndex((row) => row.specId === spec.id);

    if (rowIndex === -1) {
      const newRow = {
        specId: spec.id,
        specName: spec.product_spec_name,
        is_update_config:
          props.mode === 'edit' ? props.is_update_config : false,
        allSelected: false,
        selectedValues: [],
      };
      localConfig.value.specRows = [...localConfig.value.specRows, newRow];

      // setTimeout(() => {
      //   openSpecValueSelector(newRow);
      // }, 100);
    } else {
      // 选中项表格中存在，TODO 确定什么时候会有
      openSpecValueSelector(specRows.value[rowIndex]);
    }
  } else {
    localConfig.value.specRows = specRows.value.filter(
      (row) => row.specId !== spec.id,
    );
  }
  emitChange();
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
const handleRemoveSpecValueLocal = async (row, value) => {
  const deleteProduct = [];
  if (tableData.value.length > 0) {
    tableData.value.forEach((item) => {
      item.product_info_spec_list.forEach((specItem) => {
        if (specItem.product_spec_value_id === value.id && item.id) {
          deleteProduct.push(item);
        }
      });
    });
  }
  const deleteIds = deleteProduct.map((item) => item.id);
  if (deleteIds.length === 0) {
    const result = handleRemoveSpecValue(
      row,
      value,
      specRows.value,
      localConfig.value.selectedSpecs,
    );
    localConfig.value.specRows = result.rows;
    localConfig.value.selectedSpecs = result.selectedSpecs;
    emitChange();
  } else {
    const { code, data, message } = await preCheckRemoveUsingPOST({
      merchant_id: merchantId.value,
      product_info_ids: deleteIds,
    });
    // 判断是否可以删除
    if (code === 'SUCCESS') {
      // 柔性校验
      if (data?.remove_check_enum) {
        const productList = [];
        if (data.product_info_id_list && data.product_info_id_list.length > 0) {
          // 需要提示的商品
          data.product_info_id_list.forEach((item) => {
            const product = tableData.value.find((items) => items.id == item);
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
          // 匹配所有拥有当前选择的规格值的行
          const result = handleRemoveSpecValue(
            row,
            value,
            specRows.value,
            localConfig.value.selectedSpecs,
          );
          localConfig.value.specRows = result.rows;
          localConfig.value.selectedSpecs = result.selectedSpecs;
          emitChange();
        });
      } else {
        // 如果当前删除的单位与采购单位或销售单位一致则自动设置成主单位
        // 匹配所有拥有当前选择的规格值的行
        const result = handleRemoveSpecValue(
          row,
          value,
          specRows.value,
          localConfig.value.selectedSpecs,
        );
        localConfig.value.specRows = result.rows;
        localConfig.value.selectedSpecs = result.selectedSpecs;
        emitChange();
      }
    } else {
      const productList = [];
      if (data && data.length > 0) {
        // 需要提示的商品
        data.forEach((item) => {
          const product = tableData.value.find(
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
};
/**
 * -------------------------------------------------------------
 * 开启多规格后调用重新生成sku
 * -------------------------------------------------------------
 */
// 合并SKU表格数据 - 新数据的规格与旧数据规格一致时使用旧数据，否则使用新数据
function mergeSkuTableData(oldData, newData) {
  if (!oldData || oldData.length === 0) {
    return newData;
  }

  // 找出被删除的数据（在旧数据中存在但在新数据中不存在的项）
  const deletedData = oldData.filter((oldRow) => {
    return !newData.some((newRow) => newRow.skuKey === oldRow.skuKey);
  });

  // 如果有被删除的数据，存储起来
  if (deletedData.length > 0) {
    // 通知父组件有删除的数据
    emit('sku-deleted', { data: deletedData });
  }

  return newData.map((newRow) => {
    // 根据skuKey查找对应的旧数据
    const matchingOldRow = oldData.find((oldRow) => {
      return oldRow.skuKey === newRow.skuKey;
    });

    if (matchingOldRow) {
      // 如果找到匹配的旧数据，保留用户已编辑的字段，使用旧数据
      return {
        ...newRow, // 基础结构使用新数据
        // 保留用户可能已编辑的重要字段
        sku_barcode: matchingOldRow.sku_barcode || newRow.sku_barcode,
        selling_price: matchingOldRow.selling_price || newRow.selling_price,
        cost_price: matchingOldRow.cost_price || newRow.cost_price,
        initial_stock_quantity:
          matchingOldRow.initial_stock_quantity ||
          newRow.initial_stock_quantity,
        remark: matchingOldRow.remark || newRow.remark,
        status:
          matchingOldRow.status === undefined
            ? newRow.status
            : matchingOldRow.status,
        profile_photo: matchingOldRow.profile_photo || newRow.profile_photo,
        package_barcode:
          matchingOldRow.package_barcode || newRow.package_barcode,
        profit_rate: matchingOldRow.profit_rate || newRow.profit_rate,
      };
    } else {
      // 如果没有找到匹配的旧数据，使用新数据
      return newRow;
    }
  });
}
// 备份数据
const oldTableData = ref([]);
const newTableData = ref([]);
const generateBundle = () => {
  // 生成校验
  if (
    !validateBeforeGenerateBundle(
      props.productListContent,
      props.unitsConfig,
      localConfig.value.specRows,
      tableData.value,
    )
  ) {
    return;
  }
  // 0. 备份数据
  oldTableData.value = JSON.parse(JSON.stringify(tableData.value));
  // 1. 构建维度列表
  buildDimensionList(specRows.value, props.unitsConfig);
  // 2. 计算每个维度的跨行数
  buildRowSpanArr();
  // 3. 生成表格数据
  const sku = buildTableData();
  // 4. 更新表格数据 逻辑为 新数据的规格与旧数据规格一致，就使用旧数据,反之使用新数据
  newTableData.value = sku;
  // 5. 比较新旧数据,将最终数据赋值给tableData
  const mergedTableData = mergeSkuTableData(
    oldTableData.value,
    newTableData.value,
  );

  tableData.value = mergedTableData;
  localConfig.value.specBundleRows = mergedTableData;
  localConfig.value.bundleGenerated = true;

  emitChange();

  emit('bundle-generated', {
    specRows: JSON.parse(JSON.stringify(localConfig.value.specRows)),
    specBundleRows: JSON.parse(
      JSON.stringify(localConfig.value.specBundleRows),
    ),
  });
};

const specModalRef = ref<any>(null);

const handleAddSpec = () => {
  specModalRef.value?.openAddSpec();
};

const handleSpecCreated = () => {
  getProductSpecList();
};

// 添加仓库
const handleAddWarehouse = () => {
  emit('add-warehouse');
};

// 更新
const emitChange = () => {
  const configToEmit = {
    multiSpecs: localConfig.value.multiSpecs,
    selectedSpecs: localConfig.value.selectedSpecs,
    specRows: localConfig.value.specRows,
    bundleGenerated: localConfig.value.bundleGenerated,
    specBundleRows: localConfig.value.specBundleRows,
  };

  emit('update:specsConfig', configToEmit);
};

// 生成表格数据
function buildTableData() {
  const arrOfValueArrays = dimensionList.value.map((d) => d.values);
  // 笛卡尔积
  const combos = cartesianProduct(arrOfValueArrays);

  const keys = dimensionList.value.map((d) => d.key);
  const dimIds = dimensionList.value.map((d) => d.id);
  const skuList = combos?.map((combo, comboIndex) => {
    const row: any = {};
    const product_spec_info: any = [];
    const specCodeParts: any = [];
    const keyParts = [];
    combo?.forEach((val, idx) => {
      const key = keys[idx];
      const dimId = dimIds[idx];

      row[key] = val.name;

      if (key === 'unit') {
        keyParts.push(`unit-${val.unitInfo.secondary_unit_id}`);
      } else {
        product_spec_info.push({
          product_spec_id: dimId,
          product_spec_name: key,
          product_spec_value: val.name,
          product_spec_value_id: val.id,
        });
        keyParts.push(`${dimId}-${val.id}`);
        if (val.specInfo && val.specInfo.product_spec_code) {
          specCodeParts.push(val.specInfo.product_spec_code);
        }
      }
    });

    // 保存spec信息
    row.product_info_spec_list = product_spec_info;
    row.initial_stock_quantity = props.productListContent.stock_total_quantity;
    row.initial_stock_warehouse_id = props.productListContent.sale_warehouse_id;
    row.initial_stock_warehouse_location_id = 1;
    row.major_name = props.productListContent.major_name;
    row.merchant_id = merchantId.value;
    row.remark = '';
    row.status = props.productListContent.status;
    row.product_profile_id = '';

    row.profile_photo = props.skuImage;
    row.is_update_config = props.is_update_config;
    const unitIndex = keys.indexOf('unit');
    if (unitIndex !== -1) {
      const unitObj = combo[unitIndex];
      const unitInfo = unitObj.unitInfo;

      if (unitInfo) {
        row.spec_code = specCodeParts.join('');
        row.sku_barcode = props.productCode + row.spec_code + comboIndex;
        row.sku_group_code = '';

        row.basic_unit_radio = unitInfo.basic_unit_radio?.split(':')[1] || 1;
        row.selling_price = unitInfo.selling_price
          ? unitInfo.selling_price
          : '';
        row.cost_price = unitInfo.cost_price ? unitInfo.cost_price : '';
        row.package_barcode = unitInfo.package_barcode;
        row.product_unit_id = unitInfo.secondary_unit_id;
        row.product_unit_name = unitInfo.secondary_unit_name;
        row.basic_unit_id = unitInfo.basic_unit_id;
        row.is_basic = unitInfo.is_basic_unit == 1 ? 1 : 0;
      }
    }
    row.skuKey = keyParts.join('|');
    return row;
  });

  return skuList;
}

// 检查sku的变化
async function onDataChange() {
  const newValue = {
    units: props.unitsConfig?.units,
    specRows: localConfig.value.specRows,
  };
  const oldValue = {
    units: props.backupUnitsConfig?.units,
    specRows: props.backupSpecRows,
  };
  const compare = compareData(newValue, oldValue);

  const res = validateSpecsForBundle(localConfig.value.specRows);
  if (!res) {
    return false;
  }

  if (!compare && localConfig.value.bundleGenerated) {
    try {
      await ElMessageBox.confirm(
        t('common.sku-change-prompt'),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm-btn'),
          cancelButtonText: t('common.cancel-btn'),
          closeOnClickModal: false,
          showCancelButton: false,
          showClose: false,
          type: 'warning',
        },
      ).then(() => {
        generateBundle();
        return true;
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    return true;
  }
}

const spanningColumns = ref(['skuBarcode', 'specCode', 'initialStock']);
const merge = ref(false);
// 历史数据
const historyData = ref([]);
const handleBarcodemerge = () => {
  const data = props.unitsRef.handGetTableData();
  if (tableData.value.length <= 0 || data.length <= 1) return;
  if (merge.value) {
    // 恢复历史数据
    tableData.value = historyData.value;
    merge.value = false;
  } else {
    // 批量条码合并
    historyData.value = JSON.parse(JSON.stringify(tableData.value)); // 深拷贝保存历史数据
    merge.value = true;
    let mainUnit = {};
    if (data.length > 0) {
      mainUnit = data[0];
    }
    let spec_code = '';
    let sku_barcode = '';
    tableData.value.forEach((item) => {
      if (
        item.spec_code !== spec_code &&
        item.product_unit_id === mainUnit.secondary_unit_id
      ) {
        spec_code = item.spec_code;
        sku_barcode = item.sku_barcode;
      }
      if (item.spec_code === spec_code) {
        item.sku_barcode = sku_barcode;
      }
    });
  }
};
const enterStatus = ref(false);
// 监听tableData变化
watch(tableData, () => {
  if (props.mode !== 'add' && !enterStatus.value) {
    enterStatus.value = true;
    let index = 1;
    const indexItem = {
      sku_barcode: '',
    };
    if (tableData.value.length > 0) {
      const hasSpecCode = tableData.value[0].spec_code !== '';
      // 获取第一个SKU条形码作为参考
      const referenceBarcode = tableData.value[0].sku_barcode;
      // 未开启规格
      if (hasSpecCode) {
        // 开启规格
        let spec_index = 1;
        const spec_item = '';
        tableData.value.forEach((item) => {
          if (indexItem.sku_barcode == item.sku_barcode) {
            index += 1;
          }
          if (item.spec_code !== spec_item) {
            spec_index += 1;
          }
          if (index == spec_index) {
            merge.value = true;
          }
        });
      } else {
        // 未开启规格：检查所有条形码是否相同
        const allBarcodesMatch = tableData.value.every(
          (item) => item.sku_barcode === referenceBarcode,
        );
        merge.value = allBarcodesMatch;
      }
    }
  }
  historyData.value = JSON.parse(JSON.stringify(tableData.value)); // 深拷贝保存历史数据
});
const handChangeValue = (row, value) => {
  if (!merge.value) return;
  tableData.value.forEach((item) => {
    if (item.sku_group_code === row.sku_group_code) {
      item.sku_barcode = value;
    }
  });
};
const dynamicSpanMethod = computed(() => {
  if (
    tableData.value &&
    tableData.value.length > 0 &&
    multiSpecs.value &&
    bundleGenerated.value
  ) {
    spanningColumns.value = merge.value
      ? ['skuBarcode', 'specCode', 'initialStock']
      : ['specCode', 'initialStock'];
    return createDynamicSpanMethod(
      tableData.value,
      specDimensions.value,
      unitDimension.value,
      spanningColumns.value,
      merge.value,
    );
  } else {
    if (merge.value) {
      return ({ rowIndex, columnIndex }) => {
        if (columnIndex === 3) {
          // 对于第一行，设置rowspan为表格的总行数，这样这一列就会合并所有行
          if (rowIndex === 0) {
            return {
              rowspan: tableData.value.length,
              colspan: 1,
            };
          } else {
            // 对于其他列，不进行合并，保持默认的单元格大小
            return {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }

    // 未开启多规格或未生成表格时，进行合并
  }
});

// 当仓库选择改变时
const handleWarehouseChange = (row, rowIndex, value) => {};
/**
 * 生成临时ID的工具函数
 * 使用时间戳+随机数的组合确保ID的唯一性,提供
 * @param prefix 可选的ID前缀
 * @returns 唯一的临时ID字符串
 */
function generateTempId(prefix: string = 'temp'): string {
  // 获取当前时间戳
  const timestamp = Date.now();

  // 生成随机数部分 (0-999999)
  const random = Math.floor(Math.random() * 1_000_000);

  // 生成随机字母 (a-z)
  const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));

  // 组合成唯一ID
  return `${prefix}_${timestamp}_${randomChar}${random}`;
}
// 售价 = 成本价 × (1 + 利润率)
// 利润率 = (售价 - 成本价) ÷ 成本价
// 成本价 = 售价 ÷ (1 + 利润率)

// 售价 = 成本价 × (1 + 利润率)
// 利润率 = (售价 - 成本价) ÷ 成本价
// 成本价 = 售价 ÷ (1 + 利润率)
// 三种值都在的情况下
const Scenario1 = (sell_price, pro_rate, co_price) => {
  if (sell_price == 'NaN') {
    sell_price = 0;
  } else if (pro_rate == 'NaN') {
    pro_rate = 0;
  } else if (co_price == 'NaN') {
    co_price = 0;
  }
  // 计算销售利润率
  const SalesProfitMargin = () => {
    // return (((sell_price - co_price) / sell_price) * 100).toFixed(2);
    return ((sell_price / co_price) * 100 - 100).toFixed(2);
  };
  // 计算售价
  const sellPrice = () => {
    // return (co_price / (1 - pro_rate / 100)).toFixed(2);
    return (co_price * (1 + pro_rate / 100)).toFixed(2);
  };
  return {
    selling_price: () => {
      return SalesProfitMargin();
    },
    profit_rate: () => {
      // 计算售价
      return sellPrice();
    },
    cost_price: () => {
      return SalesProfitMargin();
    },
  };
};
const Scenario2 = (sell_price, pro_rate, co_price) => {
  if (sell_price == 'NaN') {
    sell_price = 0;
  } else if (pro_rate == 'NaN') {
    pro_rate = 0;
  } else if (co_price == 'NaN') {
    co_price = 0;
  }
  // 计算销售利润率
  const SalesProfitMargin = () => {
    // return (((sell_price - co_price) / sell_price) * 100).toFixed(2);
    return ((sell_price / co_price) * 100 - 100).toFixed(2);
  };
  // 计算成本价
  const costPrice = () => {
    // (sell_price / (1 + pro_rate / 100)).toFixed(2)
    // return (sell_price * (1 - pro_rate / 100)).toFixed(2);
    return (sell_price / (1 + pro_rate / 100)).toFixed(2);
  };
  // 计算售价
  const sellPrice = () => {
    // return (co_price / (1 - pro_rate / 100)).toFixed(2);

    return (co_price * (1 + pro_rate / 100)).toFixed(2);
  };
  return {
    selling_price: () => {
      if (pro_rate == '') {
        // 销售利润率
        return { value: SalesProfitMargin(), key: 'profit_rate' };
      } else if (co_price == '') {
        // 计算成本价
        return { value: costPrice(), key: 'cost_price' };
      } else {
        return { value: SalesProfitMargin(), key: 'profit_rate' };
      }
    },
    profit_rate: () => {
      if (sell_price == '') {
        // 计算售价
        return { value: sellPrice(), key: 'selling_price' };
      } else if (co_price == '') {
        // 计算成本价
        return { value: costPrice(), key: 'cost_price' };
      } else {
        return { value: SalesProfitMargin(), key: 'profit_rate' };
      }
    },
    cost_price: () => {
      if (sell_price == '') {
        // 计算售价
        return { value: sellPrice(), key: 'selling_price' };
      } else if (!pro_rate) {
        // 计算利润率
        return { value: SalesProfitMargin(), key: 'profit_rate' };
      }
    },
  };
};
const handleInputChangeCalcul = (
  row: RowData,
  rowIndex: number,
  value: number | string,
  key: PriceField,
): void => {
  const PRICE_FIELDS: readonly PriceField[] = [
    'selling_price',
    'cost_price',
    'profit_rate',
  ] as const;
  const REQUIRED_FIELD_COUNT: RequiredFieldCount = {
    THREE_FIELDS: 3,
    TWO_FIELDS: 2,
  } as const;
  if (PRICE_FIELDS.includes(key)) {
    const numValue: number = Number.parseFloat(String(value));
    value = isNaN(numValue) ? '0' : numValue.toString();
  }
  tableData.value[rowIndex][key] = value;
  const getPriceFieldCount = (row: RowData): number => {
    const sellingPrice: number = Number.parseFloat(String(row.selling_price));
    const profitRate: number = Number.parseFloat(String(row.profit_rate));
    const costPrice: number = Number.parseFloat(String(row.cost_price));

    let count: number = 0;
    if (!isNaN(sellingPrice) && sellingPrice > 0) count++;
    if (!isNaN(profitRate)) count++;
    if (!isNaN(costPrice) && costPrice > 0) count++;

    return count;
  };

  const calculateAndUpdate = (
    scenario: ScenarioCalculator,
    method: keyof ScenarioCalculator,
    targetField: null | string = null,
  ): void => {
    const result: CalculationResult | number | string = scenario[method]();

    if (targetField) {
      tableData.value[rowIndex][targetField] = result as number | string;
    } else {
      const calcResult = result as CalculationResult;
      if (calcResult && calcResult.key && calcResult.value !== undefined) {
        tableData.value[rowIndex][calcResult.key] = calcResult.value;
      }
    }
  };

  const fieldCount: number = getPriceFieldCount(row);
  const scenario1 = (): ScenarioCalculator =>
    Scenario1(row.selling_price, row.profit_rate, row.cost_price);
  const scenario2 = (): ScenarioCalculator =>
    Scenario2(row.selling_price, row.profit_rate, row.cost_price);

  /** 数值变化后计算公式 */
  const calculationStrategies: CalculationStrategies = {
    selling_price: {
      threeFields: (): void =>
        calculateAndUpdate(scenario1(), 'selling_price', 'profit_rate'),
      twoFields: (): void => calculateAndUpdate(scenario2(), 'selling_price'),
    },
    profit_rate: {
      threeFields: (): void =>
        calculateAndUpdate(scenario1(), 'profit_rate', 'selling_price'),
      twoFields: (): void => calculateAndUpdate(scenario2(), 'profit_rate'),
    },
    cost_price: {
      threeFields: (): void =>
        calculateAndUpdate(scenario1(), 'cost_price', 'profit_rate'),
      twoFields: (): void => calculateAndUpdate(scenario2(), 'cost_price'),
    },
  };

  const strategy: CalculationStrategy | undefined = calculationStrategies[key];
  if (strategy) {
    if (fieldCount === REQUIRED_FIELD_COUNT.THREE_FIELDS) {
      strategy.threeFields();
    } else if (fieldCount === REQUIRED_FIELD_COUNT.TWO_FIELDS) {
      strategy.twoFields();
    }
  }
};
// 当库存数量改变时
const handleStockQuantityChange = (row, rowIndex, value, key) => {
  const data = props.unitsRef.handGetTableData();
  const unitData = toRaw([...data]);
  if (props.mode === 'add') {
    tableData.value.forEach((item) => {
      item.id = generateTempId();
    });
  }
  const sameSpecRows = findSameSpecRows(
    rowIndex,
    tableData,
    bulkEditSelection.value,
    bulkEditOptions.value,
  );
  const newTableData = [...tableData.value];

  newTableData[rowIndex][key] =
    key === 'initial_stock_quantity' ||
    key === 'initial_stock_warehouse_id' ||
    key === 'profit_rate'
      ? value
      : Number(value).toFixed(2);
  // 更新相同规格的其他行
  if (bulkEditEnabled.value) {
    // 不更新售价
    if (
      key === 'initial_stock_quantity' ||
      key === 'initial_stock_warehouse_id' ||
      key === 'profit_rate'
    ) {
      sameSpecRows.forEach((item) => {
        const index = newTableData.findIndex((row) => {
          return row.skuKey === item.skuKey;
        });
        newTableData[index][key] = value;
      });
    }
    if (
      key === 'selling_price' ||
      key === 'cost_price' ||
      key === 'profit_rate'
    ) {
      // 计算份额值
      const shareValueUnit = unitData.find((unit) => {
        const unitItem = unref({ ...unit });
        return unitItem.secondary_unit_id === row.product_unit_id;
      });
      // 获取比例
      const shareValueUnitRatio =
        shareValueUnit.basic_unit_radio?.split(':')[1] || 1;
      const sharevalue = (value / shareValueUnitRatio).toFixed(2);

      sameSpecRows.forEach((item) => {
        // 第一步 拿到单位信息
        const unitInfo = unitData.find(
          (unit) => unit.secondary_unit_id === item.product_unit_id,
        );
        // 第二步 拿到单位比例
        const unitRatio = unitInfo.basic_unit_radio?.split(':')[1] || 1;
        const index = newTableData.findIndex((row) => {
          return row.skuKey === item.skuKey;
        });

        // 第三步 计算公式份额*比例
        if (key === 'selling_price' || key === 'cost_price') {
          const newValue = (unitRatio * sharevalue).toFixed(2);

          newTableData[index][key] = newValue;
        }

        let tempIndex = 0;
        if (row.sell_price != '') {
          tempIndex += 1;
        }
        if (row.profit_rate != '') {
          tempIndex += 1;
        }
        if (row.cost_price != '') {
          tempIndex += 1;
        }
        let final = '';
        // 步骤一 确认修改的值属于哪一种 售价 利润率 成本价
        switch (key) {
          case 'cost_price': {
            // 计算成本价
            if (tempIndex === 3) {
              final = Scenario1(
                item.selling_price,
                item.profit_rate,
                item.cost_price,
              ).cost_price();
              item.selling_price = final;
            } else if (tempIndex === 2) {
              final = Scenario2(
                item.selling_price,
                item.profit_rate,
                item.cost_price,
              ).cost_price();
              item[final.key] = final.value;
            }
            break;
          }
          case 'profit_rate': {
            // 计算利润率
            if (tempIndex === 3) {
              final = Scenario1(
                item.selling_price,
                item.profit_rate,
                item.cost_price,
              ).profit_rate();
              item.selling_price = final;
            } else if (tempIndex === 2) {
              final = Scenario2(
                item.selling_price,
                item.profit_rate,
                item.cost_price,
              ).profit_rate();
              item[final.key] = final.value;
            }
            break;
          }
          case 'selling_price': {
            if (tempIndex === 3) {
              final = Scenario1(
                item.selling_price,
                item.profit_rate,
                item.cost_price,
              ).selling_price();
              item.profit_rate = final;
            } else if (tempIndex === 2) {
              final = Scenario2(
                item.selling_price,
                item.profit_rate,
                item.cost_price,
              ).selling_price();
              item[final.key] = final.value;
            }
            // 计算利润率和成本价
            break;
          }
        }
      });
    }
  }
  tableData.value = newTableData;
  localConfig.value.specBundleRows = newTableData;
  emitChange();
};

// 删除行示例
async function handleDeleteRow(item, index) {
  let resultCode = '';
  let resultData = '';
  let resultMessage = '';

  if (item.id) {
    const { code, data, message } = await preCheckRemoveUsingPOST({
      merchant_id: merchantId.value,
      product_info_ids: [item.id],
    });
    resultCode = code;
    resultData = data;
    resultMessage = message;
  } else {
    resultCode = 'SUCCESS';
  }

  const deletedProductData = [];
  const deteleGoods = () => {
    const newTableData = [...tableData.value];
    const deletedRow = newTableData[index];

    // 判断是否为主单位（基础单位）
    const isMainUnit = deletedRow.is_basic === 1;

    if (isMainUnit) {
      // 如果删除的是主单位，那么相同规格的也删除
      // 获取相同规格的 skuKey（去掉单位部分）
      const specKey = deletedRow.skuKey.split('|').slice(0, -1).join('|'); // 移除最后的单位部分

      // 找到所有相同规格的 SKU 并删除
      const indicesToRemove = [];
      newTableData.forEach((row, idx) => {
        const rowSpecKey = row.skuKey.split('|').slice(0, -1).join('|');
        if (rowSpecKey === specKey) {
          indicesToRemove.push(idx);
        }
      });

      // 从后往前删除，避免索引变化
      indicesToRemove
        .sort((a, b) => b - a)
        .forEach((idx) => {
          deletedProductData.push({ ...newTableData[idx] });
          newTableData.splice(idx, 1);
        });
    } else {
      // 否则删除当前行
      deletedProductData.push({ ...newTableData[index] });
      newTableData.splice(index, 1);
      ElMessage.success(t('inventory.row-delete'));
    }

    // 更新数据
    tableData.value = newTableData;
    localConfig.value.specBundleRows = newTableData;

    // 检查是否需要取消勾选规格配置项
    checkAndUpdateSpecSelection(newTableData);

    if (localConfig.value.specBundleRows.length === 0) {
      localConfig.value.bundleGenerated = false;
    }

    // 删除同步单位
    if (deletedRow && deletedRow.product_unit_id) {
      emit('sku-deleted', {
        data: deletedProductData,
        unitId: deletedRow.product_unit_id,
        sku: deletedRow,
        isMainUnit,
      });
    }

    emitChange();
  };
  // 判断是否可以删除
  if (resultCode === 'SUCCESS') {
    // 柔性校验
    if (resultData?.remove_check_enum) {
      // tableData.value
      let productList = [item];
      if (resultData && resultData.product_info_id_list.length < 0) {
        productList = [];
      }
      ElMessageBox.confirm(
        deleteTip(productList)[resultData?.remove_check_enum],
        t('common.system-message'),
        {
          dangerouslyUseHTMLString: true,
          type: 'warning',
        },
      ).then(() => {
        deteleGoods();
      });
    } else {
      deteleGoods();
      // 如果当前删除的单位与采购单位或销售单位一致则自动设置成主单位
    }
  } else {
    let productList = [];
    if (resultData && resultData.length > 0) {
      productList = [item];
    }
    ElMessageBox.confirm(
      getTipHtml(resultMessage, productList),
      t('common.system-message'),
      {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        showCancelButton: false,
      },
    ).then(() => {});
  }
  // if (resultCode === 'SUCCESS') {
  // } else {
  //   ElMessage.error(message);
  // }
}

// 检查并更新规格选择状态
function checkAndUpdateSpecSelection(currentTableData) {
  // 如果没有 SKU 数据了，直接返回
  if (!currentTableData || currentTableData.length === 0) {
    return;
  }

  // 获取当前所有 SKU 中使用的规格值 ID
  const usedSpecValueIds = new Set();
  currentTableData.forEach((row) => {
    if (
      row.product_info_spec_list &&
      Array.isArray(row.product_info_spec_list)
    ) {
      row.product_info_spec_list.forEach((spec) => {
        if (spec.product_spec_value_id) {
          usedSpecValueIds.add(spec.product_spec_value_id);
        }
      });
    }
  });

  // 检查每个规格行是否还有被使用的规格值
  const updatedSpecRows = [];
  const updatedSelectedSpecs = { ...localConfig.value.selectedSpecs };

  localConfig.value.specRows.forEach((specRow) => {
    // 检查这个规格行的规格值是否还有在使用的
    const hasUsedValues = specRow.selectedValues.some((value) =>
      usedSpecValueIds.has(value.id),
    );

    if (hasUsedValues) {
      // 如果还有使用的规格值，保留这个规格行
      updatedSpecRows.push(specRow);
    } else {
      // 如果没有使用的规格值了，取消勾选这个规格
      if (updatedSelectedSpecs[specRow.specId]) {
        delete updatedSelectedSpecs[specRow.specId];
      }
    }
  });

  // 更新规格行和选择状态
  localConfig.value.specRows = updatedSpecRows;
  localConfig.value.selectedSpecs = updatedSelectedSpecs;
}

// 删除数据对应的单位
const deleteSkuByUnitId = (unitId) => {
  if (!unitId) return;

  const skuIndex = tableData.value.findIndex(
    (row) => row.product_unit_id === unitId,
  );
  if (skuIndex !== -1) {
    const newTableData = [...tableData.value];
    const delItemData = JSON.parse(JSON.stringify(newTableData[skuIndex]));
    newTableData.splice(skuIndex, 1);
    tableData.value = newTableData;
    localConfig.value.specBundleRows = newTableData;

    if (newTableData.length === 0) {
      localConfig.value.bundleGenerated = false;
    }
    emit('deleteUnitItem', delItemData);
    emitChange();
    return true;
  }

  return false;
};

const handleInputChange = (props: InputSyncProps) => {
  batchTableData(props, {
    tableData,
    bulkEditEnabled,
    bulkEditSelection,
    specRows,
  });
};

const handleStatusChange = (row, value) => {
  const rowIndex = tableData.value.findIndex(
    (item) => item.skuKey === row.skuKey,
  );
  if (rowIndex !== -1) {
    const newTableData = [...tableData.value];
    newTableData[rowIndex].status = value;
    tableData.value = newTableData;
    localConfig.value.specBundleRows = newTableData;
    emitChange();
  }
};
const handRowUpload = (row, value) => {
  const rowIndex = tableData.value.findIndex(
    (item) => item.skuKey === row.skuKey,
  );
  if (rowIndex !== -1) {
    const newTableData = [...tableData.value];
    newTableData[rowIndex].profile_photo = value.url;
    tableData.value = newTableData;
    localConfig.value.specBundleRows = newTableData;
  }
};

// 使用 hooks 中的 createTableColumns 方法创建表格列
const tableColumns = computed(() => {
  const columns = createTableColumns(
    skuSpecTableConfig,
    props.mode,
    specRows.value,
  );
  return columns.map((column) => {
    if (
      column.label &&
      typeof column.label === 'string' &&
      column.label.startsWith('inventory.')
    ) {
      return {
        ...column,
        label: t(column.label),
      };
    }
    return column;
  });
});

// 批量编辑选项
const bulkEditOptions = computed(() => {
  return getBulkEditOptions(specRows.value, props.unitsConfig);
});

// 监听批量编辑开关
watch(bulkEditEnabled, (newVal) => {
  if (!newVal) {
    bulkEditSelection.value = '';
  }
});

// 监听多单位数量限制
watch(
  () => props.limitMultiSpecs,
  (newVal) => {
    if (newVal && multiSpecs.value) {
      // 如果单位超过限制且多规格已启用，则关闭多规格
      handleMultiSpecsToggle(false);
      ElMessage.warning(t('inventory.units_exceed_limit_specs_disabled'));
    }
  },
);

// 规格值选择弹窗相关
const specValueDialogVisible = ref(false);
const currentSpecRow = ref(null);
const selectedSpecValues = ref([]);
const availableSpecValues = ref([]);

const openSpecValueSelector = async (row) => {
  currentSpecRow.value = row;

  try {
    const allValues = await getProductSpecValueList(row.specId, 'close');

    availableSpecValues.value = allValues.map((val) => ({
      label: val.product_spec_value,
      value: val.id,
      original: val,
    }));

    selectedSpecValues.value = row.selectedValues.map((val) => val.id);

    specValueDialogVisible.value = true;
  } catch (error) {
    console.error(error);
    ElMessage.error(t('inventory.failed_to_load_spec_values'));
  }
};

// 处理规格值确认选择
const handleSpecValuesConfirmed = (selectedIds) => {
  if (!currentSpecRow.value) return;

  const selectedValues = selectedIds
    .map((id) => {
      const valueObj = availableSpecValues.value.find(
        (opt) => opt.value === id,
      );
      return valueObj ? valueObj.original : null;
    })
    .filter((val) => val !== null);

  const rowIndex = specRows.value.findIndex(
    (row) => row.specId === currentSpecRow.value.specId,
  );
  if (rowIndex !== -1) {
    const updatedRows = [...specRows.value];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      selectedValues,
      allSelected: selectedValues.length === availableSpecValues.value.length,
    };

    localConfig.value.specRows = updatedRows;
    emitChange();
  }

  currentSpecRow.value = null;
};

const handleSpecValueAdded = async (newSpecValue) => {
  try {
    const allValues = await getProductSpecValueList(
      currentSpecRow.value.specId,
      'close',
    );

    availableSpecValues.value = allValues.map((val) => ({
      label: val.product_spec_value,
      value: val.id,
      original: val,
    }));

    if (!selectedSpecValues.value.includes(newSpecValue.id)) {
      selectedSpecValues.value = [...selectedSpecValues.value, newSpecValue.id];
    }
  } catch (error) {
    console.error('Error refreshing spec values:', error);
  }
};

// 处理清空规格组合按钮点击
const handleClearBundle = async () => {
  const result = await clearBundleData();

  if (result.success) {
    clearSpecsTableExceptFirst();
    bulkEditEnabled.value = false;
    bulkEditSelection.value = '';

    ElMessage.success(t('inventory.clear-success'));
  }
};

// 更新所有 SKU 状态
const updateAllSkuStatus = (status) => {
  if (bundleGenerated.value && tableData.value.length > 0) {
    const updatedTableData = tableData.value.map((row) => ({
      ...row,
      status,
    }));

    tableData.value = updatedTableData;
    localConfig.value.specBundleRows = updatedTableData;
    emitChange();
  }
};

// 根据选择的单位添加 SKU
const addSkuForUnit = (unit) => {
  if (
    (bundleGenerated.value && tableData.value.length > 0) ||
    !unit ||
    !unit.secondary_unit_id
  )
    return;

  const newRow = {
    unit: unit.secondary_unit_name,
    id: unit.id || '',
    // spec_code: unit.is_basic_unit ? '' : unit.secondary_unit_id.substring(0, 4),
    sku_barcode: randomBarcode(),
    sku_group_code: '',
    initial_stock_quantity: props.productListContent.stock_total_quantity || '',
    initial_stock_warehouse_id:
      props.productListContent.sale_warehouse_id || '',
    initial_stock_warehouse_location_id: 1,
    major_name: props.productListContent.major_name || '',
    merchant_id: merchantId.value,

    remark: '',
    status: props.productListContent.status || 'ON_SALE',
    product_profile_id: '',
    profile_photo: props.skuImage || '',
    basic_unit_radio: unit.basic_unit_radio?.split(':')[1],
    selling_price:
      unit.selling_price || props.productListContent.selling_price || '',
    cost_price: unit.cost_price || props.productListContent.cost_price || '',
    package_barcode: unit.package_barcode || '',
    product_unit_id: unit.secondary_unit_id || '',
    product_unit_name: unit.secondary_unit_name || '',
    basic_unit_id:
      unit.basic_unit_id || props.productListContent.major_unit_id || '',
    is_basic: unit.is_basic_unit || 0,
    product_info_spec_list: [],
    skuKey: `unit-${unit.secondary_unit_id}`,
  };

  const existingIndex = tableData.value.findIndex(
    (row) => row.skuKey === newRow.skuKey,
  );

  if (existingIndex === -1) {
    tableData.value = [...tableData.value, newRow];
  } else {
    const updatedTableData = [...tableData.value];
    updatedTableData[existingIndex] = { ...newRow };
    tableData.value = updatedTableData;
  }

  emitChange();
};

const updateSkuPrices = (unitData) => {
  if (bundleGenerated.value || !unitData || !unitData.product_unit_id) return;

  const updatedTableData = [...tableData.value];
  let updated = false;

  for (let i = 0; i < updatedTableData.length; i++) {
    if (updatedTableData[i].product_unit_id === unitData.product_unit_id) {
      updatedTableData[i] = {
        ...updatedTableData[i],
        selling_price: unitData.selling_price,
        cost_price: unitData.cost_price,
        basic_unit_radio:
          unitData.basic_unit_radio?.split(':')[1] ||
          updatedTableData[i].basic_unit_radio,
        package_barcode:
          unitData.package_barcode || updatedTableData[i].package_barcode,
      };
      updated = true;
    }
  }

  if (updated) {
    tableData.value = updatedTableData;
    localConfig.value.specBundleRows = updatedTableData;
    emitChange();
  }
};

const updateAllSkusBasicUnit = ({
  newBasicUnitId,
  newBasicUnitName,
  oldBasicUnitId,
}) => {
  if (bundleGenerated.value || !newBasicUnitId || tableData.value.length === 0)
    return;

  const updatedTableData = [...tableData.value];
  let updated = false;

  for (let i = 0; i < updatedTableData.length; i++) {
    if (
      oldBasicUnitId &&
      updatedTableData[i].basic_unit_id !== oldBasicUnitId
    ) {
      continue;
    }

    updatedTableData[i] = {
      ...updatedTableData[i],
      basic_unit_id: newBasicUnitId,
      is_basic: updatedTableData[i].product_unit_id === newBasicUnitId ? 1 : 0,
    };
    updated = true;
  }

  if (updated) {
    tableData.value = updatedTableData;
    localConfig.value.specBundleRows = updatedTableData;
    emitChange();
  }
};

const updateSkuUnitId = (oldUnitId, newUnit) => {
  if (!oldUnitId || !newUnit || !newUnit.secondary_unit_id) return;

  const existingIndex = tableData.value.findIndex(
    (row) => row.product_unit_id === oldUnitId,
  );

  if (existingIndex === -1) {
    addSkuForUnit(newUnit);
  } else {
    const oldRow = tableData.value[existingIndex];
    const updatedRow = {
      ...oldRow,
      unit: newUnit.secondary_unit_name,
      product_unit_id: newUnit.secondary_unit_id,
      product_unit_name: newUnit.secondary_unit_name,
      selling_price: newUnit.selling_price,
      cost_price: newUnit.cost_price,
      basic_unit_radio: newUnit.basic_unit_radio?.split(':')[1] || '1',
      package_barcode: newUnit.package_barcode || '',
      is_basic: newUnit.is_basic_unit || 0,
      skuKey: `unit-${newUnit.secondary_unit_id}`,
    };

    const updatedTableData = [...tableData.value];
    updatedTableData[existingIndex] = updatedRow;

    tableData.value = updatedTableData;
    localConfig.value.specBundleRows = updatedTableData;
    emitChange();
  }
};

const clearSpecsTableExceptFirst = () => {
  if (tableData.value && tableData.value.length > 0) {
    if (
      props.unitsConfig &&
      props.unitsConfig.units &&
      props.unitsConfig.units.length > 0
    ) {
      const newRows = [];

      props.unitsConfig.units.forEach((unit) => {
        if (unit.secondary_unit_id) {
          const newRow = {
            unit: unit.secondary_unit_name,
            id: unit.id || '',
            sku_barcode: randomBarcode(),
            sku_group_code: '',
            initial_stock_quantity:
              props.productListContent.stock_total_quantity || '',
            initial_stock_warehouse_id:
              props.productListContent.sale_warehouse_id || '',
            initial_stock_warehouse_location_id: 1,
            major_name: props.productListContent.major_name || '',
            merchant_id: merchantId.value,
            remark: '',
            status: props.productListContent.status || 'ON_SALE',
            product_profile_id: '',
            profile_photo: props.skuImage || '',
            basic_unit_radio: unit.basic_unit_radio?.split(':')[1] || '1',
            selling_price:
              unit.selling_price ||
              props.productListContent.selling_price ||
              '0',
            cost_price:
              unit.cost_price || props.productListContent.cost_price || '0',
            package_barcode: unit.package_barcode || '',
            product_unit_id: unit.secondary_unit_id || '',
            product_unit_name: unit.secondary_unit_name || '',
            basic_unit_id:
              unit.basic_unit_id ||
              props.productListContent.major_unit_id ||
              '',
            is_basic: unit.is_basic_unit || 0,
            product_info_spec_list: [],
            skuKey: `unit-${unit.secondary_unit_id}`,
          };
          newRows.push(newRow);
        }
      });

      tableData.value = newRows;
      localConfig.value.specBundleRows = newRows;
    } else {
      tableData.value = [];
      localConfig.value.specBundleRows = [];
    }

    // Keep bundle state based on units presence
    localConfig.value.bundleGenerated = multiSpecs.value
      ? false
      : tableData.value.length > 0;

    emitChange();
  }
};

const handTableData = () => {
  return tableData.value;
};
const handleMerge = () => {
  return merge.value;
};
//  备份数据
const oldSpecTableData = ref([]);
// 重置sku所有配置回归初始化
const resetData = () => {
  // 0. 备份数据
  oldSpecTableData.value = JSON.parse(JSON.stringify(tableData.value));
  // 1. 重置本地配置状态
  localConfig.value = {
    multiSpecs: false,
    selectedSpecs: {},
    specRows: [],
    bundleGenerated: false,
    specBundleRows: [],
  };

  // 2. 重置规格相关状态
  specTypeDisabled.value = [];
  specItemDisabled.value = [];

  // 3. 重置规格值选择器对话框状态
  specValueDialogVisible.value = false;
  currentSpecRow.value = null;
  selectedSpecValues.value = [];
  availableSpecValues.value = [];

  // 4. 重置维度和跨行数据
  dimensionList.value = [];
  rowSpanArr.value = [];
  specDimensions.value = [];
  unitDimension.value = null;

  // 5. 重置批量编辑状态
  bulkEditEnabled.value = false;
  bulkEditSelection.value = '';

  // 6. 重置合并相关状态
  merge.value = false;
  historyData.value = [];
  spanningColumns.value = ['skuBarcode', 'specCode', 'initialStock'];
  enterStatus.value = false;

  // 7. 重置备份数据
  oldTableData.value = [];
  newTableData.value = [];

  // 8. 如果有单位配置，根据单位重新生成基础SKU数据
  if (
    props.unitsConfig &&
    props.unitsConfig.units &&
    props.unitsConfig.units.length > 0
  ) {
    const newSkuRows = [];
    props.unitsConfig.units.forEach((unit) => {
      if (unit.secondary_unit_id) {
        const newRow = {
          unit: unit.secondary_unit_name,
          id: unit.id || '',
          spec_code: '',
          sku_barcode: randomBarcode(),
          sku_group_code: '',
          initial_stock_quantity:
            props.productListContent.stock_total_quantity || '',
          initial_stock_warehouse_id:
            props.productListContent.sale_warehouse_id || '',
          initial_stock_warehouse_location_id: 1,
          major_name: props.productListContent.major_name || '',
          merchant_id: merchantId.value,
          remark: '',
          status: props.productListContent.status || 'ON_SALE',
          product_profile_id: '',
          profile_photo: props.skuImage || '',
          basic_unit_radio: unit.basic_unit_radio?.split(':')[1] || '1',
          selling_price:
            unit.selling_price || props.productListContent.selling_price || '',
          cost_price:
            unit.cost_price || props.productListContent.cost_price || '',
          package_barcode: unit.package_barcode || '',
          product_unit_id: unit.secondary_unit_id || '',
          product_unit_name: unit.secondary_unit_name || '',
          basic_unit_id:
            unit.basic_unit_id || props.productListContent.major_unit_id || '',
          is_basic: unit.is_basic_unit || 0,
          product_info_spec_list: [],
          skuKey: `unit-${unit.secondary_unit_id}`,
        };
        newSkuRows.push(newRow);
      }
    });

    if (newSkuRows.length > 0) {
      localConfig.value.specBundleRows = newSkuRows;
      localConfig.value.bundleGenerated = false; // 不是通过规格生成的
    }
  }
  // 清空表格数据
  tableData.value = [];
  // 9. 触发变更事件
  emitChange();
};
const is_enabled_stock_warning = ref(false);
/** 库存预警字段列*/
const stockWarnColumns = ref([
  {
    prop: 'stock_warning_quantity_maximum',
    label: t('product-list.min-stock'),
    type: 'input',
  },
  {
    prop: 'stock_warning_quantity_minimum',
    label: t('product-list.safety-stock'),
    type: 'input',
  },
  {
    prop: 'stock_warning_quantity_safety',
    label: t('product-list.max-stock'),
    type: 'input',
  },
]);
/** 库存预警表格数据*/
const stockWarnTableData = ref([
  {
    stock_warning_quantity_maximum: 0,
    stock_warning_quantity_minimum: 0,
    stock_warning_quantity_safety: 0,
    spec_code: '',
    warehouse_id: '',
  },
]);
// 库存预警相关
const isPerWarehouseWarning = ref(false);
const isPerSpecWarning = ref(false);

/** 判断是否有操作列 如果没有则添加操作列，否则不添加*/
const addOptionColumn = () => {
  if (isPerWarehouseWarning.value || isPerSpecWarning.value) {
    if (!stockWarnColumns.value.find((item) => item.prop === 'option')) {
      stockWarnColumns.value.push({
        prop: 'option',
        label: t('common.option'),
      });
    }
  } else {
    // 否则移除操作列
    const index = stockWarnColumns.value.findIndex(
      (item) => item.prop === 'option',
    );
    if (index !== -1) {
      stockWarnColumns.value.splice(index, 1);
    }
  }
};

/** 开启子仓库预警*/
const handlePerWarehouseWarningChange = (val) => {
  if (val) {
    // 如果开启子仓库预警，默认开启规格预警向库存预警字段列在第一列添加子仓库ID
    stockWarnColumns.value.unshift({
      prop: 'warehouse_id',
      label: t('product-list.warehouse'),
      type: 'select',
    });
  } else {
    // 如果关闭子仓库预警，移除库存预警字段列中的子仓库ID
    stockWarnColumns.value.shift();
  }
  addOptionColumn();
  // 更新库存预警表格数据中仓库ID
  stockWarnTableData.value.forEach((item) => {
    item.warehouse_id = '';
  });
};
/** 开启规格预警*/
const handlePerSpecWarningChange = (val) => {
  if (val) {
    // 如果开启规格预警，判断是否开启子仓库预警如果开启加载子仓库列后面否则的话加载规格ID列在第一列
    if (isPerWarehouseWarning.value) {
      stockWarnColumns.value.splice(1, 0, {
        prop: 'spec_code',
        label: t('product-list.spec'),
        type: 'select',
      });
    } else {
      stockWarnColumns.value.unshift({
        prop: 'spec_code',
        label: t('product-list.spec'),
        type: 'select',
      });
    }
  } else {
    // 如果关闭规格预警，移除规格预警列
    const index = stockWarnColumns.value.findIndex(
      (item) => item.prop === 'spec_code',
    );
    if (index !== -1) {
      stockWarnColumns.value.splice(index, 1);
    }
  }
  addOptionColumn();
  // 更新库存预警表格数据中的规格ID
  stockWarnTableData.value.forEach((item) => {
    item.spec_code = '';
  });
};
/** 添加库存预警行*/
const handleAddStockWarn = () => {
  stockWarnTableData.value.push({
    stock_warning_quantity_maximum: 0,
    stock_warning_quantity_minimum: 0,
    stock_warning_quantity_safety: 0,
    spec_code: '',
    warehouse_id: '',
  });
};
/** 规格列option*/
const specCodeOptions = computed(() => {
  const options = [];
  tableData.value.forEach(
    (item: {
      product_info_spec_list: { spec_name: string }[];
      spec_code: string;
    }) => {
      const optionObj = {};
      optionObj.value = item.spec_code;
      optionObj.label =
        item.product_info_spec_list.length > 0
          ? item.product_info_spec_list
              .map((item) => item.product_spec_name)
              .join('-')
          : item.product_spec_name;
      options.push(optionObj);
    },
  );
  return options;
});

// 单位的变化
watch(
  () => props.unitsConfig,
  (newConfig) => {
    if (
      newConfig &&
      newConfig.units &&
      newConfig.units.length > 0 &&
      tableData.value.length === 0 &&
      !multiSpecs.value &&
      props.mode !== 'view'
    ) {
      newConfig.units.forEach((unit) => {
        addSkuForUnit(unit);
      });
    }
  },
  { deep: true, immediate: true },
);
/** 设置规格信息
 * 目前只有编辑和详情需要将获取到的配置设置到这个组件里
 * 复制的原来watch里面的逻辑
 */
const setSpecConfig = (newConfig) => {
  if (
    newConfig &&
    Object.keys(newConfig).length > 0 &&
    (props.mode === 'edit' ||
      props.mode === 'copy' ||
      props.mode === 'view' ||
      (props.mode == 'add' && newConfig.multiSpecs)) &&
    !isEqual(newConfig, localConfig.value)
  ) {
    const skuList = addSkuKeyToSkuList(newConfig.specBundleRows);
    const multiSpecs =
      newConfig.multiSpecs ||
      (props.mode === 'view' && newConfig.specRows?.length > 0);
    let selectedSpecs = {};
    let specRows = [];
    let bundleGenerated =
      newConfig.bundleGenerated ||
      (props.mode === 'view' && newConfig.specBundleRows?.length > 0);
    let specBundleRows = [];

    if (newConfig.selectedSpecs) {
      selectedSpecs = { ...newConfig.selectedSpecs };
    }

    if (newConfig.specRows && newConfig.specRows.length > 0) {
      const specGroups = {};
      newConfig.specRows.forEach((spec) => {
        if (!specGroups[spec.product_spec_id]) {
          specGroups[spec.product_spec_id] = {
            specId: spec.product_spec_id,
            specName: spec.product_spec_name,
            is_update_config:
              props.mode == 'edit' ? props.is_update_config : false,
            allSelected: false,
            selectedValues: [],
          };

          selectedSpecs[spec.product_spec_id] = true;
        }

        //
        if (spec.product_spec_value_id) {
          const valueExists = specGroups[
            spec.product_spec_id
          ].selectedValues.some((val) => val.id === spec.product_spec_value_id);

          if (!valueExists) {
            specGroups[spec.product_spec_id].selectedValues.push({
              id: spec.product_spec_value_id,
              product_spec_value: spec.product_spec_value_name,
              product_spec_code: spec.product_spec_code || '',
              product_spec_id: spec.product_spec_id,
              is_update_config:
                props.mode == 'edit' ? props.is_update_config : false,
            });
          }
        }
      });

      // 将分组后的数据转换为数组形式
      specRows = Object.values(specGroups);
    }
    // 更新是否已生成组合
    bundleGenerated = newConfig.bundleGenerated;
    // 更新规格组合行
    if (skuList && skuList.length > 0) {
      specBundleRows = skuList;
    }

    // // 更新本地状态
    localConfig.value = {
      multiSpecs,
      selectedSpecs: selectedSpecs ? { ...selectedSpecs } : {},
      specRows: specRows ? [...specRows] : [],
      bundleGenerated,
      specBundleRows: specBundleRows ? [...specBundleRows] : [],
    };

    if (
      (bundleGenerated || props.mode === 'view') &&
      newConfig.specBundleRows &&
      newConfig.specBundleRows.length > 0
    ) {
      buildDimensionList(localConfig.value.specRows, props.unitsConfig);
      buildRowSpanArr();
      // const newSkuList = buildTableData();
      // localConfig.value.specBundleRows = newSkuList;
      // localConfig.value.oldSkuList = newSkuList;
      emitChange();

      emit('bundle-generated', {
        specRows: JSON.parse(JSON.stringify(localConfig.value.specRows)),
        specBundleRows: JSON.parse(
          JSON.stringify(localConfig.value.specBundleRows),
        ),
      });
      // 在此更新状态
      if (props.mode == 'copy') {
        emit('reset-form-mode');
      }
    }
  }
};
const stockWarnData = computed(() => {
  // 如果没有开启直接返回
  if (!is_enabled_stock_warning.value) {
    return {
      list: [],
      isPerSpecWarning: false,
      isPerWarehouseWarning: false,
      is_enabled_stock_warning: false,
    };
  }

  return {
    list: stockWarnTableData.value,
    isPerSpecWarning: isPerSpecWarning.value,
    isPerWarehouseWarning: isPerWarehouseWarning.value,
    is_enabled_stock_warning: is_enabled_stock_warning.value,
  };
});

defineExpose({
  handleMultiSpecsToggle,
  reverseDeduction,
  onDataChange,
  updateAllSkuStatus,
  addSkuForUnit,
  deleteSkuByUnitId,
  updateSkuPrices,
  updateSkuUnitId,
  updateAllSkusBasicUnit,
  clearSpecsTableExceptFirst,
  handTableData,
  handleMerge,
  resetData,
  tableData,
  stockWarnData, // 库存警告数据
  setSpecConfig,
});
</script>

<template>
  <div class="specs-configuration">
    <FormSection :title="$t('inventory.specs-configuration')">
      <template #header-right>
        <ElTooltip
          class="box-item"
          effect="customized"
          :content="$t(`inventory.open-spec-prompt`)"
          placement="top"
          :show-after="600"
          :enterable="false"
        >
          <ElSwitch
            v-show="showUnits"
            v-model="multiSpecs"
            v-auth="'inventory_product-list_product-add_specs'"
            :active-text="t('inventory.multi-specs')"
            :disabled="
              mode === 'view' ||
              (is_update_config && mode == 'edit') ||
              limitMultiSpecs
            "
            @change="handleMultiSpecsToggle"
          />
        </ElTooltip>

        <span class="hint-text">{{
          $t('inventory.spec-purchase-and-sales-units')
        }}</span>
      </template>

      <div>
        <div v-show="multiSpecs || (mode === 'view' && specRows.length > 0)">
          <div class="spec-settings">
            <!-- 规格设置 -->
            <span>{{ $t('inventory.spec-setting') }}:</span>
            <div class="spec-checkboxes">
              <ElCheckbox
                v-for="spec in productSpecList"
                :key="spec.id"
                v-model="selectedSpecs[spec.id]"
                :disabled="mode === 'view' || props.is_update_config"
                @change="(val) => handleSpecCheckboxChange(spec, val)"
              >
                {{ spec.product_spec_name }}
              </ElCheckbox>
              <ElButton
                v-if="mode !== 'view' || (!is_update_config && mode == 'edit')"
                type="text"
                size="small"
                plain
                :disabled="mode === 'view' || props.is_update_config"
                @click="handleAddSpec"
              >
                <ElIcon><Plus /></ElIcon> {{ $t('common.add') }}
              </ElButton>
            </div>
          </div>

          <ElTable :data="specRows" style="width: 100%">
            <ElTableColumn type="index" label="#" width="50" />
            <ElTableColumn :label="t('inventory.spec')" width="130">
              <template #default="{ row }">
                {{ row.specName }}
              </template>
            </ElTableColumn>

            <ElTableColumn :label="t('inventory.spec-range')">
              <template #default="{ row }">
                <div class="value-range">
                  <template>
                    <span>{{ $t('inventory.all') }}</span>
                  </template>
                  <div class="value-tags">
                    <ElTag
                      v-for="value in row.selectedValues"
                      :key="value.id"
                      :closable="true"
                      @close="handleRemoveSpecValueLocal(row, value)"
                    >
                      {{ value.product_spec_value }}
                    </ElTag>
                    <ElButton
                      v-if="
                        mode !== 'view' || (!is_update_config && mode == 'edit')
                      "
                      type="primary"
                      size="small"
                      style="margin-left: 5px"
                      round
                      plain
                      @click="openSpecValueSelector(row)"
                    >
                      {{ $t('common.select') }}
                    </ElButton>
                  </div>
                </div>
              </template>
            </ElTableColumn>
          </ElTable>
          <div class="generate-part">
            <div class="spec-bundle">
              <span>{{ t('inventory.spec-bundle') }}:</span>
              <ElButton
                v-if="mode !== 'view'"
                v-auth="'inventory_product-list_product-add_unit-bundle'"
                type="primary"
                @click="generateBundle"
              >
                {{
                  bundleGenerated
                    ? $t('inventory.regenerate-bundle')
                    : $t('inventory.generate-bundle')
                }}
              </ElButton>
              <span class="hint-text hint-text2">{{
                t('inventory.after-selecting-the-product')
              }}</span>
            </div>
            <span
              v-if="mode !== 'view' && bundleGenerated"
              class="text-cerulean cursor-pointer"
              @click="handleClearBundle"
            >
              <i class="iconfont icon-clear"></i> {{ t('common.clear') }}
            </span>
          </div>
        </div>
        <div v-if="mode !== 'view'" class="bulk-edit">
          <!-- 批量编辑 -->
          <span>{{ $t('inventory.bulk-edit') }}:</span>
          <ElSwitch v-model="bulkEditEnabled" />
          <ElSelect
            v-model="bulkEditSelection"
            class="select-bulk-edit"
            :placeholder="$t('inventory.all')"
            :disabled="!bulkEditEnabled"
          >
            <ElOption
              v-for="item in bulkEditOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </div>
        <!-- 库存预警设置 -->
        <div class="mb-5">
          <p>
            {{ t('product-list.stock-warning-settings') }}
            <ElSwitch v-model="is_enabled_stock_warning" />
          </p>
          <div v-if="is_enabled_stock_warning">
            <div>
              <ElCheckbox
                v-model="isPerWarehouseWarning"
                @change="handlePerWarehouseWarningChange"
              >
                {{ t('product-list.enable-sub-warehouse-early-warning') }}
              </ElCheckbox>
              <ElCheckbox
                v-model="isPerSpecWarning"
                @change="handlePerSpecWarningChange"
              >
                {{ t('product-list.enable-spec-settings') }}
              </ElCheckbox>
            </div>
            <!-- 库存预警设置 -->
            <div>
              <ElTable :data="stockWarnTableData" style="width: 100%">
                <ElTableColumn
                  v-for="(col, colIndex) in stockWarnColumns"
                  :key="col.prop"
                  :prop="col.prop"
                  :label="col.label"
                >
                  <template #default="{ row }">
                    <div v-if="col.prop === 'warehouse_id'">
                      <ElSelect
                        class="w-full"
                        v-model="row[col.prop]"
                        :placeholder="$t('inventory.all')"
                      >
                        <ElOption
                          v-for="item in warehouseListContent"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </ElSelect>
                    </div>
                    <div v-else-if="col.prop === 'spec_code'">
                      <ElSelect
                        class="w-full"
                        v-model="row[col.prop]"
                        :placeholder="$t('inventory.all')"
                      >
                        <ElOption
                          v-for="item in specCodeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                    </div>
                    <div v-else-if="col.prop === 'option'">
                      <ElButton
                        type="primary"
                        size="small"
                        round
                        plain
                        @click="handleAddStockWarn(row)"
                      >
                        {{ $t('common.add') }}
                      </ElButton>
                      <ElButton
                        type="primary"
                        size="small"
                        round
                        plain
                        @click="handleAddOption(row)"
                      >
                        {{ $t('common.del') }}
                      </ElButton>
                    </div>
                    <ElInput class="w-full" v-model="row[col.prop]" v-else />
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>

        <ElTable
          :data="tableData"
          border
          :span-method="dynamicSpanMethod"
          size="small"
          style="width: 100%"
        >
          <template v-for="(column, index) in tableColumns" :key="index">
            <ElTableColumn
              v-if="column.type === 'index'"
              type="index"
              :label="column.label"
              :width="column.width"
              :align="column.align"
              :fixed="column.fixed"
            />
            <!-- 动态规格列-->
            <ElTableColumn
              v-for="dim in specDimensions"
              v-else-if="column.dynamicSpec"
              :key="dim.key"
              :prop="dim.key"
              :label="`${dim.key}(${$t('inventory.spec')})`"
              align="center"
              width="120"
            />
            <!-- 单位尺寸列 -->
            <ElTableColumn
              v-else-if="column.dynamicUnit"
              :prop="unitDimension.key"
              :label="$t(`inventory.${unitDimension.key}`)"
              align="center"
              width="100"
            />
            <!-- 常规列 -->
            <ElTableColumn v-else v-bind="column">
              <template v-if="column.prop == 'skuBarcode'" #header>
                <div class="sku_barcode_box">
                  {{ t(column.label) }}
                  <!-- mergeOpenTips -->
                  <ElTooltip
                    :content="
                      merge
                        ? t('inventory.merge-tips')
                        : t('inventory.merge-open-tips')
                    "
                    placement="top"
                  >
                    <div class="sku_barcode_icon" @click="handleBarcodemerge">
                      <span
                        v-show="!merge"
                        class="iconfont icon-caozuo-quanping-shousuo"
                      ></span>
                      <span v-show="merge" class="iconfont icon-zhankai"></span>
                    </div>
                  </ElTooltip>
                </div>
              </template>
              <template #default="scope">
                <component
                  :is="
                    column.render({
                      row: scope.row,
                      $index: scope.$index,
                      column: scope.column,
                      warehouseListContent,
                      imgUrl: scope.row.imgUrl,
                      handleStockQuantityChange,
                      handleInputChangeCalcul,
                      handChangeValue,
                      handleWarehouseChange,
                      handleDeleteRow,
                      mode,
                      handleAddWarehouse,
                      handleInputChange,
                      handleStatusChange,
                      handRowUpload,
                      unitsConfig: props.unitsConfig,
                    })
                  "
                  v-if="column.render"
                />
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </ElTableColumn>
          </template>
        </ElTable>
      </div>
    </FormSection>
    <AddAndEditSpec ref="specModalRef" @success="handleSpecCreated" />

    <CheckBoxModal
      v-model:visible="specValueDialogVisible"
      :title="$t('product-list.select-spec-values')"
      :initial-options="availableSpecValues"
      :initial-selected="selectedSpecValues"
      :current-spec="currentSpecRow"
      :disable-items="specItemDisabled"
      @confirm="handleSpecValuesConfirmed"
      @cancel="specValueDialogVisible = false"
      @spec-value-added="handleSpecValueAdded"
    />
  </div>
</template>

<style scoped>
.generate-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.specs-configuration {
  margin-bottom: 20px;
}

.hint-text {
  max-width: 450px;
  margin-left: 10px;
  font-size: 11px;
  color: #f56c6c;
  white-space: wrap;
}

.hint-text2 {
  color: #999 !important;
}

.spec-settings {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  white-space: nowrap;
}

.spec-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  max-width: 600px;
  margin-left: 10px;
}

.value-range {
  display: flex;
  align-items: center;
  max-width: 550px;
}

.value-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-left: 10px;
}

.spec-bundle {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 20px 0;
  white-space: nowrap;
}

.bulk-edit {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 20px 0;
}

.image-placeholder {
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
}

:deep(.el-select__placeholder.is-transparent) {
  font-size: 11px;
}

:deep(.product-image-container) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
}

:deep(.image-list-thumb) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.specs-locked-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #e6a23c;
}

.sku_barcode_box {
  position: relative;
}

.sku_barcode_icon {
  position: absolute;
  top: 1px;
  right: 10px;
  font-size: 14px;
  cursor: pointer;
}

.select-bulk-edit {
  width: 180px;
}

:deep(
  .el-input__inner::-webkit-inner-spin-button,
  .el-input__inner::-webkit-outer-spin-button
) {
  margin: 0;
  appearance: none !important;
}
</style>
