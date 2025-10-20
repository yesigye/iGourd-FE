/**
 * 商品添加/编辑功能的组合式函数
 *
 * 这个 Hook 提供了完整的商品管理功能，包括：
 * - 商品表单数据管理和验证
 * - 动态字段配置和处理
 * - 各种下拉选项的数据获取和搜索
 * - 价格和税率的自动计算
 * - 文件上传管理
 * - 多种操作模式支持（新增/编辑/复制/查看）
 *
 * @returns 返回商品管理相关的响应式数据和方法
 */

import { computed, reactive, ref } from 'vue';

import { ElMessage } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { debounce, merge } from '@igourd/utils';

// API 导入
import { getTaxPageListApi } from '@@/account/apis/tax';
import { getCustomerFeaturePageListApi } from '@@/customer/apis/feature';
import {
  getUnitListApi,
  getVendorList,
  getWarehouseListApi,
  productLabelPage,
  productProfileCreate,
  productProfileModify,
  productTwoGroupList,
} from '@@/inventory/apis';
import { storeToRefs } from 'pinia';

// 工具函数导入
import { randomBarcode, randomProductCode } from '#/utils/addProduct';
import { retainDecimal8 } from '#/utils/sale';

// 配置文件导入
import {
  pageSize as configPageSize,
  generateDynamicRules,
  getDefaultForm,
  getDynamicFieldsQueryParams,
  getRules,
  getStatusList,
} from '../product.config';

// 获取用户信息
const userStore = useUserStore();
const { owner_id: merchantId } = storeToRefs(userStore);

export function useProductAdd() {
  const { t } = useI18n();

  // ==================== 基础状态管理 ====================

  /** 是否显示返回按钮 */
  const isReturnShow = ref(false);

  /** 是否显示所有文件 */
  const showAllFiles = ref(false);

  /** 是否显示库存相关字段 */
  const isShowStock = ref(true);

  /** 是否为新建模式 */
  const isNew = ref(false);

  /** 编辑时的原始数据 */
  const isEditData = ref(null);

  /** 是否禁用表单（查看模式） */
  const newDisabled = ref(false);

  /** 文件列表（商品图片） */
  const fileList = ref([]);

  /** 图片预览对话框的图片URL */
  const dialogImageUrl = ref('');

  /** 图片预览对话框是否可见 */
  const dialogVisible = ref(false);

  /** 表单数据 */
  const forms = ref(getDefaultForm());

  /** 状态选项列表 */
  const statusList = ref(getStatusList(t));

  /** 动态字段配置选项 */
  const res_options = ref([]);

  /** 动态字段查询参数 */
  const queryParams_options = getDynamicFieldsQueryParams();

  /** 表单引用 */
  const ruleFormRef = ref();

  /** 表单验证规则 */
  const rules = reactive(getRules(t));

  /** 表单操作模式：add-新增, edit-编辑, copy-复制, view-查看 */
  const formMode = ref('');

  // ==================== 下拉列表数据 ====================

  /** 供应商列表 */
  const vendorListName = ref([]);

  /** 单位列表 */
  const unitList = ref([]);

  /** 仓库列表 */
  const warehouseList = ref([]);

  /** 商品分组列表 */
  const productGroupList = ref([]);

  /** 商品标签列表 */
  const productLabelList = ref([]);

  /** 增值税列表 */
  const vatList = ref([]);

  /** 其他税种列表 */
  const otherTaxList = ref([]);

  // ==================== 税率相关 ====================

  /** 增值税税率 */
  const taxRate = ref(0);

  /** 其他税种税率 */
  const otherTaxRate = ref(0);

  /** 消费税税率 */
  const taxExciseRate = ref(0);

  // ==================== 动态选项弹窗 ====================

  /** 添加选项对话框是否可见 */
  const addOptionDialogVisible = ref(false);

  /** 新选项的值 */
  const newOption = ref('');

  /** 当前操作的动态字段项 */
  const currentItem = ref(null);

  // ==================== 共享库存参数 ====================

  /** 共享库存相关的字段键名 */
  const sharedStockKeys = [
    'basic_product_id',
    'basic_unit_id',
    'basic_unit_radio',
    'product_profile_id',
  ];

  /**
   * 共享库存参数的计算属性
   * 用于在多个商品间共享库存信息
   */
  const sharedStockParams = computed({
    get() {
      return {
        product_profile_id: forms.value.product_profile_id,
        basic_product_id: forms.value.basic_product_id,
        basic_unit_id: forms.value.basic_unit_id,
        basic_unit_radio: forms.value.basic_unit_radio,
      };
    },
    set(val) {
      forms.value.product_profile_id = val.product_profile_id;
      forms.value.basic_product_id = val.basic_product_id;
      forms.value.basic_unit_id = val.basic_unit_id;
      forms.value.basic_unit_radio = val.basic_unit_radio;
    },
  });

  // ==================== 计算属性 ====================

  /**
   * 将动态字段选项按每行3个进行分组，用于页面布局
   * @returns 分组后的动态字段选项数组
   */
  const chunkedOptions = computed(() => {
    const chunks = [];
    const filteredOptions = res_options.value.filter((opt) => opt.isSelect);

    for (let i = 0; i < filteredOptions.length; i += 3) {
      chunks.push(filteredOptions.slice(i, i + 3));
    }

    return chunks;
  });

  // ==================== 工具函数 ====================

  /**
   * 解析动态字段的选项数据
   * @param options - 选项数据，可能是字符串或数组
   * @returns 解析后的选项数组
   */
  function parseOptions(options) {
    if (typeof options === 'string') {
      try {
        return JSON.parse(options);
      } catch {
        return [];
      }
    }
    return options || [];
  }

  /**
   * 更新动态字段数据
   * @param item - 动态字段配置项
   * @param value - 新的值
   */
  const updateDynamicData = (item, value) => {
    forms.value[item.prop] = value;
    if (!forms.value.dynamic_data) {
      forms.value.dynamic_data = {};
    }
    forms.value.dynamic_data[item.prop] = value;
  };

  // ==================== 数据获取函数 ====================

  /**
   * 获取动态字段列表配置
   * @param merchantId - 商户ID
   */
  async function fetchDynamicColumnList(merchantId) {
    const res = await getCustomerFeaturePageListApi(queryParams_options);
    // if (res && res.data) {
    // 构建动态字段配置
    res_options.value = res?.list?.map((item) => {
      return {
        disabled: false,
        isSelect: true,
        required: item.is_compulsory, // 是否必填
        label: item.name,
        prop: item.key,
        placeholder: '',
        value: '',
        is_fixed_option: item.is_fixed_option, // 是否固定选项
        type: item.type,
        options: item.options,
      };
    });

    // 初始化表单中的动态字段
    res?.list.forEach((item) => {
      if (!(item.key in forms.value)) {
        forms.value[item.key] = '';
      }
    });

    // 生成动态字段的验证规则
    const dynamicRules = generateDynamicRules(res_options.value, t);
    Object.assign(rules, dynamicRules);
    // }
  }

  /**
   * 获取供应商列表
   * @param keywords - 搜索关键词
   */
  const getVendorListName = (keywords) => {
    getVendorList({
      page_num: 1,
      keywords,
      page_size: configPageSize,
    }).then((res) => {
      vendorListName.value = res.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
    });
  };

  /**
   * 供应商搜索处理函数（防抖）
   * @param query - 搜索查询字符串
   */
  const handleVendorSearch = debounce((query) => {
    if (!query.trim() && vendorListName.value.length > 0) return;
    getVendorListName(query);
  }, 300);

  /**
   * 获取单位列表
   * @param keywords - 搜索关键词
   */
  const getUnitList = (keywords) => {
    getUnitListApi({
      page_num: 1,
      keywords,
      page_size: 500,
    }).then((res) => {
      unitList.value = res?.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
    });
  };

  /**
   * 单位搜索处理函数（防抖）
   * @param query - 搜索查询字符串
   */
  const handleUnitSearch = debounce((query) => {
    if (!query.trim() && unitList?.value?.length != 0) return;
    getUnitList(query);
  }, 300);

  /**
   * 获取仓库列表
   */
  const getWarehouseList = () => {
    getWarehouseListApi({
      page_num: 1,
      page_size: configPageSize,
    }).then((res) => {
      warehouseList.value = res?.list?.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
    });
  };

  /**
   * 获取商品分组列表
   * @param keywords - 搜索关键词
   */
  const getProductGroupList = (keywords) => {
    productTwoGroupList({
      page_num: 1,
      page_size: configPageSize,
      parent_id: null,
      end_create_time: '',
      keywords,
      major_name: '',
      minor_name: '',
      remark: '',
      start_create_time: '',
    }).then((res) => {
      productGroupList.value = res.list;
    });
  };

  /**
   * 商品分组搜索处理函数（防抖）
   * @param query - 搜索查询字符串
   */
  const handleProductGroupSearch = debounce((query) => {
    if (!query.trim() && productGroupList.value.length > 0) return;
    getProductGroupList(query);
  }, 300);

  /**
   * 获取商品标签列表
   */
  const getProductLabelList = async () => {
    await productLabelPage({
      page_num: 1,
      page_size: configPageSize,
    }).then((res) => {
      productLabelList.value = res.list;
    });
  };

  /**
   * 获取税率列表（包括增值税和其他税种）
   */
  const getVatList = async () => {
    try {
      const res = await getTaxPageListApi({
        page_num: 1,
        page_size: configPageSize,
      });
      // if (res.code === 'SUCCESS') {
      // 分离增值税和其他税种
      vatList.value = res.list.filter((item) => item.tax_type === 'VAT');
      otherTaxList.value = res.list.filter(
        (item) => item.tax_type === 'OTHER_TAX',
      );
      // }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 并行获取所有下拉列表数据
   */
  const fetchData = async () => {
    try {
      await Promise.all([
        getWarehouseList(),
        getVendorListName(),
        // getUnitList(''), // 注释掉，按需加载
        getProductGroupList(),
        getProductLabelList(),
        getVatList(),
      ]);
    } catch (error) {
      console.error(error);
      ElMessage.error(error.message);
    }
  };

  // ==================== 表单操作函数 ====================

  /**
   * 生成随机商品编码
   */
  function refreshCode() {
    forms.value.product_code = randomProductCode();
  }

  /**
   * 重置表单到初始状态
   */
  function resetForm() {
    showAllFiles.value = false;

    // 重置表单验证
    if (ruleFormRef.value) {
      ruleFormRef.value.resetFields();
    }

    // 重置为默认表单结构
    const defaultForm = getDefaultForm();
    Object.keys(forms.value).forEach((key) => {
      if (key in defaultForm) {
        forms.value[key] = defaultForm[key];
      } else if (key !== 'dynamic_data') {
        // 清除不在默认表单中的额外属性
        forms.value[key] = '';
      }
    });

    // 确保所有默认值都被设置
    Object.keys(defaultForm).forEach((key) => {
      forms.value[key] = defaultForm[key];
    });

    // 显式清除重要字段
    forms.value.dynamic_data = '';
    forms.value.profile_photo = '';
    forms.value.id = '';
    forms.value.product_profile_id = '';

    // 重置动态字段
    res_options.value.forEach((item) => {
      forms.value[item.prop] = '';
    });

    // 为新增和复制模式生成随机码
    if (formMode.value === 'copy' || formMode.value === 'add') {
      forms.value.product_barcode = randomBarcode();
      forms.value.product_code = randomProductCode();
    }
  }

  /**
   * 处理表单输入变化，自动计算价格关系
   * @param field - 变化的字段名
   * @param value - 新的值
   */
  const handleInputChange = debounce((field, value) => {
    if (!value || value < forms.value[field]) {
      forms.value[field] = value;
      return;
    }

    // 获取价格相关字段的值
    const costPrice = Number.parseFloat(forms.value.cost_price);
    const profitRate = Number.parseFloat(forms.value.profit_rate);
    const sellingPrice = Number.parseFloat(forms.value.selling_price);

    // 根据变化的字段自动计算其他相关字段
    switch (field) {
      case 'cost_price': {
        // 成本价变化时，根据利润率计算售价，或根据售价计算利润率
        if (!isNaN(costPrice) && !isNaN(profitRate)) {
          forms.value.selling_price = (
            costPrice *
            (1 + profitRate / 100)
          ).toFixed(2);
        } else if (!isNaN(costPrice) && !isNaN(sellingPrice)) {
          forms.value.profit_rate = (
            ((sellingPrice - costPrice) / costPrice) *
            100
          ).toFixed(2);
        }
        break;
      }
      case 'profit_rate': {
        // 利润率变化时，根据成本价计算售价
        if (!isNaN(costPrice) && !isNaN(profitRate)) {
          forms.value.selling_price = (
            costPrice *
            (1 + profitRate / 100)
          ).toFixed(2);
        }
        break;
      }
      case 'selling_price': {
        // 售价变化时，根据成本价计算利润率
        if (!isNaN(costPrice) && !isNaN(sellingPrice) && costPrice > 0) {
          forms.value.profit_rate = (
            ((sellingPrice - costPrice) / costPrice) *
            100
          ).toFixed(2);
        }
        break;
      }
    }
  }, 300);

  // ==================== 动态选项管理 ====================

  /**
   * 打开添加选项对话框
   * @param item - 动态字段配置项
   */
  function openAddOptionDialog(item) {
    // 限制选项数量不超过12个
    if (parseOptions(item.options)?.length >= 12) {
      return ElMessage.warning(t('purchase.personIsLazy', { value: 12 }));
    }
    currentItem.value = item;
    addOptionDialogVisible.value = true;
  }

  /**
   * 添加新选项到动态字段
   */
  function addOption() {
    if (!newOption.value || !currentItem.value) {
      ElMessage.warning(t('purchase.pleaseInputAValidOption'));
      return;
    }

    try {
      const options = parseOptions(currentItem.value.options);
      options.push(newOption.value);
      currentItem.value.options = JSON.stringify(options);
      currentItem.value.value = newOption.value;
      updateDynamicData(currentItem.value, newOption.value);
      ElMessage.success(t('purchase.optionAddedSuccessfully'));
      newOption.value = '';
      addOptionDialogVisible.value = false;
    } catch (error) {
      console.error(error);
      ElMessage.error(t('purchase.optionAdditionFailed'));
    }
  }

  /**
   * 关闭添加选项对话框
   */
  function closeAddOptionDialog() {
    addOptionDialogVisible.value = false;
    newOption.value = '';
  }

  /**
   * 清除数组中对象的ID字段（用于新增时避免ID冲突）
   * @param array - 需要处理的数组
   * @returns 处理后的数组
   */
  const clearArrayIds = (array) => {
    if (Array.isArray(array) && array.length > 0) {
      // 如果第一个元素的ID已经是空字符串，直接返回
      if (
        array[0] &&
        typeof array[0] === 'object' &&
        'id' in array[0] &&
        array[0].id === ''
      ) {
        return array;
      }
      // 清除所有对象的ID字段
      return array.map((item) => {
        if (item && typeof item === 'object') {
          const newItem = { ...item };
          if ('id' in newItem) {
            newItem.id = '';
          }
          return newItem;
        }
        return item;
      });
    }
    return array;
  };

  // ==================== 表单提交 ====================

  /**
   * 提交表单数据
   * @param sku - SKU相关数据
   * @param ismerge - 是否为合并操作
   * @param stockWarnData - 库存警告数据
   * @returns API响应结果
   */
  const onSubmit = async (sku, ismerge, stockWarnData) => {
    try {
      // 表单验证
      debugger;
      const isValid = await ruleFormRef.value.validate();
      if (!isValid) return;

      let response;

      // 处理初始库存数量，保留8位小数
      forms.value.initial_stock_quantity = retainDecimal8(
        forms.value.initial_stock_quantity,
        8,
      );
      forms.value.initial_stock_warehouse_location_id = 1;

      // 默认库存数量为0
      if (forms.value.initial_stock_quantity === '') {
        forms.value.initial_stock_quantity = 0;
      }

      // 构建动态数据
      const dynamicData = {};
      res_options.value.forEach((item) => {
        if (forms.value[item.prop]) {
          dynamicData[item.prop] = forms.value[item.prop];
        }
      });
      forms.value.dynamic_data = JSON.stringify(dynamicData);

      // 清空一些不需要的字段
      forms.value.product_info_list = null;
      forms.value.product_profile_unit_radio_list = null;
      forms.value.product_profile_spec_list = null;
      forms.value.product_profile_unit_info = null;

      // 合并表单数据和SKU数据
      const productForm = merge({}, forms.value, sku);

      // 处理基本单位信息
      if (
        sku &&
        sku.product_profile_unit_radio_list &&
        Array.isArray(sku.product_profile_unit_radio_list)
      ) {
        const basicUnit = sku.product_profile_unit_radio_list.find(
          (unit) => unit.is_basic_unit === 1,
        );
        if (basicUnit) {
          productForm.major_unit_id = basicUnit.secondary_unit_id;
          productForm.major_unit_name = basicUnit.secondary_unit_name;
        }
      }

      // 新增模式时清除ID字段
      if (formMode.value === 'add') {
        if (productForm.product_info_list) {
          productForm.product_info_list = clearArrayIds(
            productForm.product_info_list,
          );
        }

        if (productForm.product_profile_unit_radio_list) {
          productForm.product_profile_unit_radio_list = clearArrayIds(
            productForm.product_profile_unit_radio_list,
          );
        }

        if (productForm.product_profile_spec_list) {
          productForm.product_profile_spec_list = clearArrayIds(
            productForm.product_profile_spec_list,
          );
        }
        productForm.id = '';
      }

      // 检查SKU条形码重复（非合并操作时）
      if (!ismerge) {
        let thePreviousItem = {
          sku_barcode: '',
        };
        let samelength = 1;
        productForm.product_info_list.forEach((item, index) => {
          if (thePreviousItem.sku_barcode === item.sku_barcode) {
            samelength += 1;
          } else {
            thePreviousItem = item;
          }
        });
        if (samelength > 1) {
          ElMessage.error(t('inventory.skuBarcodeTips'));
          return false;
        }
      }
      // 库存预警设置
      if (stockWarnData) {
        stockWarnData.list.forEach((item) => {
          item.stock_warning_quantity_maximum = Number(
            item.stock_warning_quantity_maximum,
          );
          item.stock_warning_quantity_minimum = Number(
            item.stock_warning_quantity_minimum,
          );
          item.stock_warning_quantity_safety = Number(
            item.stock_warning_quantity_safety,
          );
        });
        productForm.stock_warning_list = stockWarnData.list;
        productForm.is_per_spec_warning = stockWarnData.isPerSpecWarning;
        productForm.is_per_warehouse_warning =
          stockWarnData.isPerWarehouseWarning;
        productForm.is_enabled_stock_warning =
          stockWarnData.is_enabled_stock_warning;
      }
      // 根据操作模式调用不同的API
      if (formMode.value === 'add') {
        response = await productProfileCreate(productForm);
      } else {
        // 编辑模式时，如果单位比例列表为空，则设为null
        if (
          productForm.product_profile_unit_radio_list &&
          productForm.product_profile_unit_radio_list.length > 0 &&
          productForm.product_profile_unit_radio_list[0].id === ''
        ) {
          productForm.product_profile_unit_radio_list = null;
        }

        response = await productProfileModify(productForm);
      }

      return response;
    } catch (error) {
      console.error(error);
      return { code: 'ERROR', message: error.message };
    }
  };

  // ==================== 抽屉/对话框管理 ====================

  /**
   * 打开商品编辑抽屉
   * @param data - 商品数据（编辑时传入，新增时为null）
   * @param isEdit - 是否为编辑模式
   * @param isDetail - 是否为详情查看模式
   * @param merchantId - 商户ID
   * @param type - 操作类型（copy-复制）
   */
  const openDrawer = async (data, isEdit, isDetail, merchantId, type) => {
    isReturnShow.value = true;
    isNew.value = !isEdit;
    newDisabled.value = isDetail;

    // 根据参数设置表单模式
    if (isDetail) {
      formMode.value = 'view';
    } else if (isEdit && type != 'copy') {
      formMode.value = 'add';
    } else if (!isEdit && type == 'copy') {
      formMode.value = 'copy';
    } else {
      formMode.value = 'edit';
    }

    // 获取动态字段配置
    await fetchDynamicColumnList(merchantId);

    if (data) {
      // 编辑模式：填充现有数据
      isShowStock.value = false;
      const copiedData = JSON.parse(JSON.stringify(data));
      console.log(copiedData, 'copiedData');

      // 处理商品标签ID列表
      copiedData.product_label_id_list =
        copiedData.product_label_list?.map((label) => label.id) || [];
      forms.value = copiedData;

      // 计算利润率
      if (copiedData.cost_price && copiedData.selling_price) {
        const costPrice = Number.parseFloat(copiedData.cost_price);
        const sellingPrice = Number.parseFloat(copiedData.selling_price);
        if (costPrice > 0) {
          forms.value.profit_rate = (
            ((sellingPrice - costPrice) / costPrice) *
            100
          ).toFixed(2);
        }
      }

      // 设置各种税率
      if (
        copiedData.vat_tax?.calculation_type === 'PERCENTAGE' &&
        !taxRate.value
      ) {
        taxRate.value = `${copiedData.vat_tax.percentage}%`;
      } else if (copiedData.vat_tax) {
        taxRate.value = copiedData.vat_tax.tax_amount;
      }

      if (
        copiedData.other_tax?.calculation_type === 'PERCENTAGE' &&
        !otherTaxRate.value
      ) {
        otherTaxRate.value = `${copiedData.other_tax.percentage}%`;
      } else if (copiedData.other_tax) {
        otherTaxRate.value = copiedData.other_tax.tax_amount;
      }

      if (
        copiedData.excise_tax?.calculation_type === 'PERCENTAGE' &&
        !taxExciseRate.value
      ) {
        taxExciseRate.value = `${copiedData.excise_tax.percentage}%`;
      } else if (copiedData.excise_tax) {
        taxExciseRate.value = copiedData.excise_tax.tax_amount;
      }

      isEditData.value = copiedData;

      // 设置商品图片
      fileList.value = copiedData.profile_photo
        ? [{ name: 'profile', url: copiedData.profile_photo }]
        : [];
    } else {
      // 新增模式：重置表单
      isShowStock.value = true;
      resetForm();
      isEditData.value = {};
      fileList.value = [];

      // 生成随机码
      if (formMode.value === 'copy' || formMode.value === 'add') {
        forms.value.product_barcode = randomBarcode();
        forms.value.product_code = randomProductCode();
      } else {
        forms.value.product_barcode = data.product_barcode;
        forms.value.product_code = data.product_code;
      }
    }

    // 处理动态数据
    if (data?.dynamic_data) {
      const dynamicDataParsed = JSON.parse(data.dynamic_data);
      res_options.value.forEach((item) => {
        if (dynamicDataParsed[item.prop] !== undefined) {
          forms.value[item.prop] = dynamicDataParsed[item.prop];
        }
      });
    }
  };

  /**
   * 切换文件显示模式（显示所有文件或仅主要文件）
   */
  function handleSwitchFiles() {
    showAllFiles.value = !showAllFiles.value;
  }

  // ==================== 返回值 ====================

  return {
    // 响应式数据
    forms,
    rules,
    statusList,
    isReturnShow,
    showAllFiles,
    isShowStock,
    isNew,
    newDisabled,
    fileList,
    dialogImageUrl,
    dialogVisible,
    ruleFormRef,
    vendorListName,
    unitList,
    warehouseList,
    productGroupList,
    productLabelList,
    vatList,
    otherTaxList,
    taxRate,
    otherTaxRate,
    taxExciseRate,
    res_options,
    chunkedOptions,
    sharedStockParams,
    sharedStockKeys,
    addOptionDialogVisible,
    newOption,
    currentItem,
    formMode,

    // 方法
    parseOptions,
    updateDynamicData,
    fetchDynamicColumnList,
    handleVendorSearch,
    handleUnitSearch,
    handleProductGroupSearch,
    fetchData,
    refreshCode,
    resetForm,
    handleInputChange,
    openAddOptionDialog,
    addOption,
    closeAddOptionDialog,
    onSubmit,
    openDrawer,
    handleSwitchFiles,
  };
}
