<script setup lang="ts">
import { computed, defineExpose, defineProps, nextTick, ref, watch } from 'vue';

import { ElMessage } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { cloneDeep, isEqual } from '@igourd/utils';

import { preCheckRemoveUsingPOST } from '@@/inventory/apis';
import { storeToRefs } from 'pinia';

import { randomBarcode, randomProductCode } from '#/utils/addProduct';

import SpecsConfiguration from './SpecsConfiguration.vue';
import UnitsConfiguration from './UnitsConfiguration.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  productData: {
    type: Object,
    default: () => ({}),
  },
  unitList: {
    type: Array,
    default: () => [],
  },
  warehouseList: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'copy', 'edit', 'view'].includes(value),
  },
  showUnits: {
    type: Boolean,
    default: true,
  },
});
// 添加 emit 声明
const emit = defineEmits([
  'update:multiStatus',
  'update:specBundle',
  'reset-form-mode',
  'update:productCodes',
  'add-unit',
  'add-warehouse',
]);
const { t } = useI18n();
const userStore = useUserStore();
const { owner_id: merchantId } = storeToRefs(userStore);
const is_update_config = ref(false);

// 多单位规格副本
const backupSpecRows = ref([]);
const backupUnitsConfig = ref(null);

const warehouseListContent = computed(() => props.warehouseList);
const productListContent = computed(() => {
  const mainUnitId =
    unitsConfig.value.units && unitsConfig.value.units.length > 0
      ? unitsConfig.value.units[0].secondary_unit_id
      : props.productData.major_unit_id;

  const mainUnitName =
    unitsConfig.value.units && unitsConfig.value.units.length > 0
      ? unitsConfig.value.units[0].secondary_unit_name
      : props.productData.major_unit_name;

  return {
    major_name: props.productData.major_name,
    major_unit_id: mainUnitId,
    major_unit_name: mainUnitName,
    cost_price: props.productData.cost_price,
    selling_price: props.productData.selling_price,
    profile_id: props.productData.product_profile_id,
    stock_total_quantity: props.productData.initial_stock_quantity,
    sale_warehouse_id: props.productData.initial_stock_warehouse_id,
    status: props.productData.status,
  };
});
// 计算出主单位对象，包含名称和ID
const mainUnitObject = computed(() => {
  const defaultUnitId = '';
  const defaultUnitName = '';

  if (!props.productData.major_unit_id) {
    return { id: defaultUnitId, name: defaultUnitName };
  }

  const unit = props.unitList.find(
    (u) => u.id === props.productData.major_unit_id,
  );
  return unit
    ? { id: unit.id, name: unit.name }
    : { id: defaultUnitId, name: defaultUnitName };
});

// 从父组件获取售价和成本价
const sellingPrice = computed(() => props.productData.selling_price || '');
const costPrice = computed(() => props.productData.cost_price || '');

const unitsConfig: any = ref({
  id: '',
  multiUnits: false,
  units: [
    {
      type: t('inventory.major_unit_name'),
      unit: '',
      ratio: '1:1',
      is_basic_unit: 1,
      conversion: '',
      cost_price: '',
      selling_price: '',
      remarks: '',
      packageBarcode: '',
    },
  ],
  purchaseUnit: '',
  salesUnit: '',
});

const specsConfig = ref({
  multiSpecs: false,
  selectedSpecs: {},
  specRows: [],
  bundleGenerated: false,
  specBundleRows: [],
});

// 添加控制多规格的相关状态
const unitCountExceeded = ref(false);

const handleSpecsConfigUpdate = (config) => {
  if (!isEqual(specsConfig.value, config)) {
    specsConfig.value = { ...config };
    updateMultiStatus();
  }
};

const handleUnitsConfigUpdate = (config) => {
  if (!isEqual(unitsConfig.value, config)) {
    unitsConfig.value = { ...config };
    updateMultiStatus();

    // 当单位配置更新时，检查单位数量
    if (config.units && Array.isArray(config.units)) {
      handleUnitCountChange(config.units.length);
    }
  }
};

const handleUnitCountChange = (count) => {
  if (count > 4) {
    unitCountExceeded.value = true;
    if (specsConfigRef.value && specsConfig.value.multiSpecs) {
      specsConfigRef.value.handleMultiSpecsToggle(false);
    }
  } else {
    unitCountExceeded.value = false;
  }
};

// 更新多规格/多单位状态并通知父组件
const updateMultiStatus = () => {
  const isMulti = specsConfig.value.multiSpecs;
  emit('update:multiStatus', isMulti);
};
// 删除的商品id
const deletedProductIds = ref([]);
const deletedProductTable = ref([]);
const submitSKU = () => {
  // if (props.mode == 'view') return false;

  const skuList: any = {
    // 商品基础信息
    id: props.mode == 'add' ? '' : props.productData.id,
    // 多单位配置
    is_enabled_multi_unit: unitsConfig.value.multiUnits ? 1 : 0,

    // 多规格配置
    is_enabled_multi_spec: specsConfig.value.multiSpecs ? 1 : 0,

    // 商品多单位多规格列表
    product_info_list: [],

    // 单位比例信息
    product_profile_unit_radio_list: unitsConfig.value.units.map((unit) => ({
      id:
        props.mode == 'edit' && unitsConfig.value.multiUnits == 1
          ? unit?.id
          : '',
      merchant_id: merchantId.value,
      product_profile_id: '',
      is_basic_unit: unit.basic_unit_id === unit.secondary_unit_id ? 1 : 0,
      basic_unit_id: unit.basic_unit_id,
      basic_unit_name: unit.basic_unit_name,
      secondary_unit_id: unit?.secondary_unit_id,
      secondary_unit_name: unit?.secondary_unit_name,

      basic_unit_radio: unit?.basic_unit_radio?.split(':')[1] || '1',
      package_barcode: unit?.package_barcode,
      selling_price: unit.selling_price,
      cost_price: unit.cost_price,
    })),

    // 单位信息
    product_profile_unit_info: {
      id: props.mode == 'edit' ? unitsConfig?.value?.id : '',
      merchant_id: merchantId.value,
      product_profile_id:
        props.productData?.product_profile_unit_info?.product_profile_id || '',
      product_unit_ids: unitsConfig.value.units
        .map((u) => u.secondary_unit_id)
        .join(','),
      product_unit_names: unitsConfig.value.units
        .map((u) => u.secondary_unit_name)
        .join(','),
      purchase_unit_id: unitsConfig.value.purchaseUnit?.purchase_unit_id,
      purchase_unit_name: unitsConfig.value.purchaseUnit?.purchase_unit_name,
      sale_unit_id: unitsConfig.value.salesUnit?.sale_unit_id,
      sale_unit_name: unitsConfig.value.salesUnit?.sale_unit_name,
    },

    // 多规格列表
    product_profile_spec_list: Object.entries(specsConfig.value.selectedSpecs)
      .filter(([_, selected]) => selected)
      .flatMap(([specId]) => {
        const specValues =
          specsConfig.value.specRows.find((row) => row.specId === specId)
            ?.selectedValues || [];
        return specValues.map((v) => ({
          // id: v?.id,
          merchant_id: merchantId.value,
          product_profile_id: v?.product_profile_id,
          product_spec_id: specId,
          product_spec_value_id: v?.id,
        }));
      }),
  };
  if (skuList.product_profile_spec_list.length === 0) {
    skuList.product_profile_spec_list = specsConfig.value?.specRows;
  }

  const skuListData = specsConfigRef.value.handTableData();
  // 如果已经有多规格生成的数据，使用它们
  if (
    specsConfig.value.specBundleRows &&
    specsConfig.value.specBundleRows.length > 0
  ) {
    skuList.product_info_list = skuListData;
  }

  if (skuList.product_info_list.length > 0) {
    skuList.product_info_list.forEach((item) => {
      if (!item.basic_unit_id) {
        item.basic_unit_id = props.productData.major_unit_id;
      }
    });
  }
  skuList.delete_product_id_list = deletedProductIds.value;
  return { skuList, deletedProductTable: deletedProductTable.value };
};

const checkSKUChanges = async () => {
  if (specsConfigRef.value && specsConfig.value.multiSpecs) {
    return await specsConfigRef.value.onDataChange();
  }
  return true;
};

const updateAllSkuStatus = (status) => {
  if (specsConfigRef.value) {
    specsConfigRef.value.updateAllSkuStatus(status);
  }
};

const initEditData = (editData) => {
  if (!editData) return;
  try {
    const is_enabled_multi_spec = editData.is_enabled_multi_spec == 1;
    const is_enabled_multi_unit = editData.is_enabled_multi_unit == 1;
    if (props.mode == 'edit') {
      is_update_config.value = editData.is_update_config;
    }
    if (props.mode === 'copy' || props.mode === 'add') {
      const newBarcode = randomBarcode();
      const newProductCode = randomProductCode();
      emit('update:productCodes', {
        barcode: newBarcode,
        productCode: newProductCode,
      });

      if (editData.product_info_list && editData.product_info_list.length > 0) {
        editData.product_info_list = editData.product_info_list.map((item) => {
          return {
            ...item,
            id: '',
            sku_barcode: newBarcode + item.spec_code,
          };
        });
      }
    }
    // 商品基础信息
    Object.assign(props.productData, {
      major_unit_id: editData.major_unit_id,
      major_unit_name: editData.major_unit_name,
      major_name: editData.major_name,
      cost_price: editData.cost_price,
      selling_price: editData.selling_price,
      product_code: editData.product_code,
      profile_photo: editData.profile_photo,
    });

    let unitsList: any = [];
    const hasUnitRadioList =
      editData.product_profile_unit_radio_list?.length > 0;

    const defaultUnit = {
      id: props.mode == 'edit' ? editData.product_info_list?.[0]?.id || '' : '',
      sku_group_code: editData.product_info_list?.[0]?.sku_group_code || '',
      sku_barcode: editData.product_info_list?.[0]?.sku_barcode || '',
      spec_code: editData.product_info_list?.[0]?.spec_code || '',
      type: t('inventory.major_unit_name'),
      basic_unit_id: editData.major_unit_id,
      basic_unit_name: editData.major_unit_name,
      is_update_config: is_update_config.value,
      is_basic_unit: 1,
      basic_unit_radio: '1:1',
      secondary_unit_id: editData.major_unit_id,
      secondary_unit_name: editData.major_unit_name,
      package_barcode: '',
      selling_price: editData.selling_price,
      cost_price: editData.cost_price,
      merchant_id: merchantId.value,
    };
    unitsList = hasUnitRadioList
      ? editData.product_profile_unit_radio_list.map((unit) => ({
          id: unit?.id,
          type:
            unit.secondary_unit_id === editData.major_unit_id
              ? 'Major Unit'
              : 'Minor Unit',
          basic_unit_id: unit.basic_unit_id,
          is_update_config: is_update_config.value,
          basic_unit_name: unit.basic_unit_name,
          is_basic_unit: unit.is_basic_unit,
          basic_unit_radio: unit.basic_unit_radio
            ? `1:${unit.basic_unit_radio}`
            : '1:1',
          secondary_unit_id: unit.secondary_unit_id || editData.major_unit_id,
          secondary_unit_name:
            unit.secondary_unit_name || editData.major_unit_name,
          package_barcode: unit.package_barcode || '',
          selling_price: unit.selling_price,
          cost_price: unit.cost_price,
          merchant_id: merchantId.value,
        }))
      : [defaultUnit];

    if (unitsList.length === 0) {
      unitsList.push(defaultUnit);
    }
    // 没有采购单位与销售单位的情况下，默认取单位主单位
    // 多单位配置
    unitsConfig.value = {
      id: props.mode == 'edit' ? editData.product_profile_unit_info?.id : '',
      multiUnits: is_enabled_multi_unit,
      units: unitsList,
      purchaseUnit: {
        purchase_unit_id:
          editData.product_profile_unit_info?.purchase_unit_id ||
          editData.major_unit_id,
        purchase_unit_name:
          editData.product_profile_unit_info?.purchase_unit_name ||
          editData.major_unit_name,
      },
      salesUnit: {
        sale_unit_id:
          editData.product_profile_unit_info?.sale_unit_id ||
          editData.major_unit_id,
        sale_unit_name:
          editData.product_profile_unit_info?.sale_unit_name ||
          editData.major_unit_name,
      },
    };

    const selectedSpecsMap = {};

    if (
      editData.product_profile_spec_list &&
      editData.product_profile_spec_list.length > 0
    ) {
      // 初始化已选规格值
      editData.product_profile_spec_list.forEach((spec) => {
        selectedSpecsMap[spec.product_spec_id] = true;
      });

      // 单位配置
      specsConfig.value = {
        multiSpecs: is_enabled_multi_spec,
        selectedSpecs: selectedSpecsMap,
        specRows: editData.product_profile_spec_list,
        bundleGenerated:
          editData.product_info_list && editData.product_info_list.length > 0,
        specBundleRows: transformData(editData.product_info_list) || [],
      };
    } else {
      specsConfig.value = {
        multiSpecs: false,
        selectedSpecs: [],
        specRows: [],
        bundleGenerated: false,
        specBundleRows: transformData(editData.product_info_list) || [],
      };
    }

    // 将配置传递到specConfigration.vue
    specsConfigRef.value?.setSpecConfig?.(specsConfig.value);
    // 初始化后更新多规格多单位状态
    nextTick(() => {
      updateMultiStatus();
      // 在编辑模式下，初始化完成后更新备份数据
      backupUnitsConfig.value = cloneDeep(unitsConfig.value);
    });
  } catch (error) {
    console.error(error);
    ElMessage.error(t('inventory.fail_init'));
  }
};
/**
 * Json数据格式化 避免解析的数字类型出现精度问题
 * 数字类型先转成字符串
 * @param jsonString 字符串
 */
// const regex = /("productSpec(?:Id|ValueId)"\s*:\s*)(\d+)/g;

// 替换函数
// function addQuotesToSpecIds(jsonString) {
//   return jsonString.replace(regex, '$1"$2"');
// }
function transformData(data) {
  return data.map((item) => {
    let specKv: any = [];
    try {
      specKv = JSON.parse(item.product_spec_kv);
    } catch (error) {
      console.error('失败：', error);
    }
    const product_info_spec_list = specKv.map((spec) => {
      return {
        product_spec_id: String(spec.productSpecId),
        product_spec_name: spec.productSpecName,
        product_spec_value: spec.productSpecValue,
        product_spec_value_id: String(spec.productSpecValueId),
      };
    });

    const dynamicSpecs = specKv.reduce((acc, spec) => {
      acc[spec.productSpecName] = spec.productSpecValue;
      return acc;
    }, {});
    return {
      ...dynamicSpecs,
      id: item.id,
      unit: item.product_unit_name,
      product_info_spec_list,
      spec_code: item.spec_code,
      sku_barcode: item.sku_barcode,
      sku_group_code: item.sku_group_code,
      initial_stock_quantity: item.initial_stock_quantity,
      initial_stock_warehouse_id: item.initial_stock_warehouse_id,
      initial_stock_warehouse_location_id:
        item.initial_stock_warehouse_location_id,
      major_name: item.major_name,
      merchant_id: item.merchant_id,
      remark: item.remark,
      status: item.status,
      product_profile_id: item.product_profile_id,
      profile_photo: item.profile_photo,
      basic_unit_radio: String(item.basic_unit_radio),
      selling_price: item.selling_price,
      cost_price: item.cost_price,
      package_barcode: item.package_barcode,
      product_unit_id: item.product_unit_id,
      product_unit_name: item.product_unit_name,
      basic_unit_id: item.basic_unit_id || '',
      is_basic: item.is_basic ? 1 : 0,
    };
  });
}
// 重置表单
const resetSKUForm = () => {
  unitsConfig.value = {
    id: '',
    multiUnits: false,
    units: [
      {
        type: t('inventory.major_unit_name'),
        basic_unit_id: '',
        basic_unit_name: '',
        is_basic_unit: 1,
        basic_unit_radio: '1:1',
        secondary_unit_id: '',
        secondary_unit_name: '',
        package_barcode: '',
        selling_price: '',
        cost_price: '',
        merchant_id: '',
      },
    ],
    purchaseUnit: { purchase_unit_id: '', purchase_unit_name: '' },
    salesUnit: { sale_unit_id: '', sale_unit_name: '' },
  };

  specsConfig.value = {
    multiSpecs: false,
    selectedSpecs: {},
    specRows: [],
    bundleGenerated: false,
    specBundleRows: [],
  };

  // 重置后更新状态
  updateMultiStatus();
};

const unitsConfigRef = ref(null);
const specsConfigRef = ref(null);

// 重置多规格多单位状态方法
const resetMultiStatus = () => {
  // 重置多单位配置
  if (unitsConfigRef.value) {
    unitsConfigRef.value.handleMultiUnitsToggle(false);

    unitsConfigRef.value.clearUnitSearchList &&
      unitsConfigRef.value.clearUnitSearchList();
  }

  // 重置多规格配置
  if (specsConfigRef.value) {
    specsConfigRef.value.handleMultiSpecsToggle(false, 'reset');
  }

  // 重置本地数据
  unitsConfig.value = {
    id: '',
    multiUnits: false,
    units: [
      {
        type: t('inventory.major_unit_name'),
        unit: '',
        ratio: '1:1',
        is_basic_unit: 1,
        conversion: '',
        cost_price: '',
        selling_price: '',
        remarks: '',
        packageBarcode: '',
      },
    ],
    purchaseUnit: '',
    salesUnit: '',
  };

  specsConfig.value = {
    multiSpecs: false,
    selectedSpecs: {},
    specRows: [],
    bundleGenerated: false,
    specBundleRows: [],
  };
  backupSpecRows.value = [];
  backupUnitsConfig.value = null;

  // 通知父组件
  updateMultiStatus();
};
const updateConfig = () => {
  is_update_config.value = false;
};
const productIds = ref([]);
// 主单位删除
const handleUnitDeleteMainUnit = async (item, callback) => {
  productIds.value = specsConfigRef.value?.tableData.map((item) => {
    return item.id;
  });
  const tableData = specsConfigRef.value?.tableData;
  // 如果productIds为空，说明这是一批新数据不是数据库存储过的数据，直接删除
  if (!productIds.value || productIds.value.length === 0) {
    specsConfigRef.value?.resetData();
    unitsConfigRef.value.resetData();
    return;
  }

  const { code, data, message } = await preCheckRemoveUsingPOST({
    merchant_id: merchantId.value,
    product_info_ids: productIds.value,
  });
  if (callback && typeof callback === 'function') {
    callback({ code, data, message, tableData });
  }
};
const handleUnitUpdateMainUnit = async (item, callback) => {
  const tableData = specsConfigRef.value?.tableData;
  if (callback && typeof callback === 'function') {
    callback({ tableData });
  }
};
const handleUnitDeleteMainUnitSuccess = () => {
  unitsConfigRef.value.resetData();
  specsConfigRef.value?.resetData();
  deletedProductIds.value = [...deletedProductIds.value, ...productIds.value];
  deletedProductTable.value = [
    ...deletedProductTable.value,
    ...specsConfigRef.value?.tableData,
  ];
  // deletedProductTable去重
  deletedProductTable.value = deletedProductTable.value.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id),
  );
};
const handleUnitDeleteUnit = (item, callback) => {
  const data = specsConfigRef.value?.tableData;
  // 调用回调函数并传入数据
  if (callback && typeof callback === 'function') {
    callback(data);
  }

  return data;
};
// 普通单位删除
const handleDeleteUnitItem = async (item) => {
  deletedProductIds.value = [...deletedProductIds.value, item.id];
  deletedProductTable.value = [...deletedProductTable.value, item];
};

const handleResetFormMode = () => {
  emit('reset-form-mode');
};

const handleAddUnit = () => {
  emit('add-unit');
};

const handleAddWarehouse = () => {
  emit('add-warehouse');
};

const handleBundleGenerated = (data) => {
  backupSpecRows.value = cloneDeep(data.specRows);
  backupUnitsConfig.value = cloneDeep(unitsConfig.value);
};

// 添加数据，根据已选单位
const handleUnitSelected = (data) => {
  if (specsConfigRef.value) {
    if (data.prevUnitId && data.prevUnitId !== data.unitId) {
      specsConfigRef.value.updateSkuUnitId(data.prevUnitId, data.unit);

      if (data.isMainUnit) {
        specsConfigRef.value.updateAllSkusBasicUnit({
          newBasicUnitId: data.unitId,
          newBasicUnitName: data.unit.secondary_unit_name,
          oldBasicUnitId: data.oldMainUnitInfo.id,
        });
      }
    } else {
      specsConfigRef.value.addSkuForUnit(data.unit);
    }
  }
};

// 单位删除同步
const handleUnitDeleted = (data) => {
  if (specsConfigRef.value && !specsConfig.value.bundleGenerated) {
    specsConfigRef.value.deleteSkuByUnitId(data.unitId);
  }
};

// SKU删除同步
const handleSkuDeleted = (data) => {
  data.data.forEach((item) => {
    if (item.id) {
      deletedProductIds.value.push(item.id);
      deletedProductTable.value.push(item);
    }
  });

  if (unitsConfigRef.value && !specsConfig.value.bundleGenerated) {
    const unitIndex = unitsConfig.value.units.findIndex(
      (unit) => unit.secondary_unit_id === data.unitId,
    );
    if (unitIndex > 0) {
      deleteUnitAtIndex(unitIndex);
    }
  }
};

// 找到指定单位的索引
const deleteUnitAtIndex = (index) => {
  if (unitsConfigRef.value && index > 0) {
    const newUnits = [...unitsConfig.value.units];
    newUnits.splice(index, 1);

    unitsConfig.value = {
      ...unitsConfig.value,
      units: newUnits,
    };

    handleUnitCountChange(newUnits.length);
  }
};

// 添加处理单位比例变化的函数
const handleUnitRatioChange = ({ unit, index, ratio }) => {
  // if (index === 0) return;
  const newUnits = [...unitsConfig.value.units];

  const unitIndex = newUnits.findIndex(
    (u) => u.secondary_unit_id === unit.secondary_unit_id,
  );

  if (unitIndex === -1) return;

  const mainUnit = newUnits[0];

  if (unit.basic_unit_radio.split(':')[1] != ratio.toString()) {
    const mainSellingPrice = Number.parseFloat(mainUnit.selling_price) || 0;
    const mainCostPrice = Number.parseFloat(mainUnit.cost_price) || 0;

    unit.selling_price = (mainSellingPrice * ratio).toFixed(2);
    unit.cost_price = (mainCostPrice * ratio).toFixed(2);
  }
  newUnits[unitIndex] = { ...unit };

  unitsConfig.value = {
    ...unitsConfig.value,
    units: newUnits,
  };

  if (!specsConfig.value.multiSpecs && !specsConfig.value.bundleGenerated) {
    updateSkuPricesByUnit(unit);
  }
};

// 添加根据单位变化更新SKU价格的函数
const updateSkuPricesByUnit = (unit) => {
  if (!specsConfigRef.value || !unit.secondary_unit_id) return;

  const updatedSku = {
    unit: unit.secondary_unit_name,
    selling_price: unit.selling_price,
    cost_price: unit.cost_price,
    product_unit_id: unit.secondary_unit_id,
    basic_unit_radio: unit.basic_unit_radio,
    package_barcode: unit.package_barcode,
  };

  specsConfigRef.value.updateSkuPrices(updatedSku);
};

// 添加处理多单位变化的函数
const handleMultiUnitsChanged = (val) => {
  if (!val && specsConfigRef.value) {
    specsConfigRef.value.clearSpecsTableExceptFirst();
  }
};
// 抛出是否合并
const handleMergeForm = () => {
  return specsConfigRef.value.handleMerge();
};

watch(
  () => props.productData,
  (newVal, oldVal) => {
    if (newVal && !isEqual(newVal, oldVal)) {
      if (newVal.major_unit_id !== oldVal?.major_unit_id) {
        const majorUnit = props.unitList.find(
          (u) => u.id === newVal.major_unit_id,
        );
        //         purchaseUnit: '',
        // salesUnit: ''
        if (majorUnit && unitsConfig.value.units.length > 0) {
          const updatedUnits = [...unitsConfig.value.units];
          updatedUnits[0] = {
            ...updatedUnits[0],
            basic_unit_id: majorUnit.id,
            basic_unit_name: majorUnit.name,
            secondary_unit_id: majorUnit.id,
            secondary_unit_name: majorUnit.name,
          };
          unitsConfig.value = {
            ...unitsConfig.value,
            units: updatedUnits,
          };
        }
      }

      if (
        (newVal.selling_price !== oldVal?.selling_price ||
          newVal.cost_price !== oldVal?.cost_price) &&
        unitsConfig.value.units.length > 0
      ) {
        const updatedUnits = [...unitsConfig.value.units];
        updatedUnits[0] = {
          ...updatedUnits[0],
          selling_price: newVal.selling_price || '',
          cost_price: newVal.cost_price || '',
        };
        unitsConfig.value = {
          ...unitsConfig.value,
          units: updatedUnits,
        };
      }
    }
  },
  { deep: true },
);

// 监听多规格和多单位状态变化
watch(
  () => [unitsConfig.value.multiUnits, specsConfig.value.multiSpecs],
  () => {
    updateMultiStatus();
  },
  { immediate: true, deep: true },
);

watch(
  () => unitsConfig.value.units,
  (newUnits) => {
    if (newUnits && Array.isArray(newUnits)) {
      handleUnitCountChange(newUnits.length);
    }
  },
  { deep: true },
);

watch(
  () => props.mode,
  (newMode) => {
    if (props.mode == 'add') {
      is_update_config.value = false;
    }
    nextTick(() => {
      if (
        unitsConfigRef.value &&
        newMode === 'view' &&
        unitsConfig.value.units &&
        unitsConfig.value.units.length > 1
      ) {
        unitsConfig.value.multiUnits = true;
      }

      if (specsConfigRef.value && newMode === 'view') {
        if (
          specsConfig.value.specRows &&
          specsConfig.value.specRows.length > 0
        ) {
          specsConfig.value.multiSpecs = true;
        }

        if (
          specsConfig.value.specBundleRows &&
          specsConfig.value.specBundleRows.length > 0
        ) {
          specsConfig.value.bundleGenerated = true;
        }
      }
    });
  },
);

// 在规格配置组件内监听规格组合状态变化
watch(
  () => specsConfig.value?.specBundleRows,
  (newRows) => {
    if (newRows) {
      // 通知父组件规格组合状态
      emit('update:specBundle', {
        generated: specsConfig.value.bundleGenerated,
        multipleSpecs: newRows.length > 1,
      });
    }
  },
  { deep: true },
);

// 确保暴露这个方法
defineExpose({
  submitSKU,
  initEditData, // 数据回显
  resetSKUForm,
  resetMultiStatus,
  handleResetFormMode, // 状态
  checkSKUChanges, // sku变化
  updateAllSkuStatus, // 更新数据
  backupSpecRows,
  backupUnitsConfig,
  handleMergeForm,
});
</script>

<template>
  <div class="product-sku-form">
    <!-- 多单位配置 -->
    <UnitsConfiguration
      ref="unitsConfigRef"
      :main-unit="mainUnitObject"
      :is_update_config="is_update_config"
      :cost-price="costPrice"
      :selling-price="sellingPrice"
      :external-config="unitsConfig"
      :multi-specs="specsConfig.multiSpecs"
      :mode="mode"
      :unit-lists="props.unitList"
      :specs-bundle-generated="specsConfig.bundleGenerated"
      :unit-count-exceeded="unitCountExceeded"
      @update:units-config="handleUnitsConfigUpdate"
      @reset-form-mode="handleResetFormMode"
      @add-unit="handleAddUnit"
      @unit-count-change="handleUnitCountChange"
      @unit-selected="handleUnitSelected"
      @unit-deleted="handleUnitDeleted"
      @ratio-changed="handleUnitRatioChange"
      @multi-units-changed="handleMultiUnitsChanged"
      @unit-delete-main-unit="handleUnitDeleteMainUnit"
      @unit-delete-main-unit-success="handleUnitDeleteMainUnitSuccess"
      @unit-update-main-unit="handleUnitUpdateMainUnit"
      @unit-delete-unit="handleUnitDeleteUnit"
      @update-config="updateConfig"
    />
    <!-- 多规格配置-->
    <SpecsConfiguration
      ref="specsConfigRef"
      :visible="visible"
      :units-config="unitsConfig"
      :is_update_config="is_update_config"
      :product-code="productData.product_barcode"
      :sku-image="productData.profile_photo"
      :product-list-content="productListContent"
      :warehouse-list-content="warehouseListContent"
      :mode="mode"
      :limit-multi-specs="unitCountExceeded"
      :backup-spec-rows="backupSpecRows"
      :backup-units-config="backupUnitsConfig"
      :show-units="showUnits"
      :units-ref="unitsConfigRef"
      @update:specs-config="handleSpecsConfigUpdate"
      @reset-form-mode="handleResetFormMode"
      @add-warehouse="handleAddWarehouse"
      @bundle-generated="handleBundleGenerated"
      @sku-deleted="handleSkuDeleted"
      @delete-unit-item="handleDeleteUnitItem"
    />
  </div>
</template>

<style scoped>
.product-sku-form {
  /* max-width: 1200px; */
  padding: 20px 20px 20px 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
