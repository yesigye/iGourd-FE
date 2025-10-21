import { computed, ref } from 'vue';

import { useI18n } from '@igourd/locales';

import { ElMessage, ElMessageBox } from 'element-plus';

export function useSpecsConfiguration() {
  const { t } = useI18n();
  const dimensionList = ref([]);
  const rowSpanArr = ref([]);
  const specDimensions = computed(() => {
    return dimensionList.value.filter((dim) => dim.key !== 'unit');
  });

  const unitDimension = computed(() => {
    return (
      dimensionList.value.find((dim) => dim.key === 'unit') || {
        key: 'unit',
        values: [],
      }
    );
  });

  // 创建表格列辅助方法
  /** 表格列加项 */
  function createTableColumns(baseColumns: any[], mode, isSpec) {
    // 如果是编辑模式，移除初始库存列
    let cols = [...baseColumns];

    const imageColumnIndex = cols.findIndex(
      (col) => col.prop === 'profile_photo',
    );
    if (imageColumnIndex !== -1) {
      cols.splice(imageColumnIndex + 1, 0, { dynamicSpec: true });
    }
    // 如果是编辑模式，移除初始库存列
    if (mode === 'edit') {
      cols = cols.filter((col) => col.prop !== 'initialStock');
    }
    if (isSpec.length <= 0) {
      cols = cols.filter((col) => col.prop !== 'specCode');
    }
    const initialStockIndex = cols.findIndex(
      (col) => col.prop === 'skuBarcode',
    );
    if (initialStockIndex !== -1) {
      if (isSpec.length <= 0) {
        cols.splice(initialStockIndex + 1, 0, { dynamicUnit: true });
      } else {
        cols.splice(initialStockIndex + 2, 0, { dynamicUnit: true });
      }
    }

    return cols;
  }

  // 处理规格复选框变化
  const handleSpecChange = async (
    spec: any,
    checked: boolean,
    specRows: any[],
    getValuesFn: (id: number | string, type: string) => Promise<any[]>,
  ) => {
    if (checked) {
      const existingRowIndex = specRows.findIndex(
        (row) => row.specId === spec.id,
      );

      if (existingRowIndex === -1) {
        const newRow = {
          specId: spec.id,
          specName: spec.product_spec_name,
          allSelected: false,
          selectedValues: [],
          tempValue: null,
        };

        return [...specRows, newRow];
      } else {
        return specRows;
      }
    } else {
      return specRows.filter((row) => row.specId !== spec.id);
    }
  };

  // 处理移除规格值
  const handleRemoveSpecValue = (
    row: any,
    value: any,
    specRows: any[],
    selectedSpecs: Record<string, boolean>,
  ) => {
    const updatedRows = [...specRows];
    const rowIndex = updatedRows.indexOf(row);

    if (rowIndex !== -1) {
      const updatedValues = row.selectedValues.filter((v) => v.id !== value.id);

      if (updatedValues.length === 0) {
        const newSelectedSpecs = { ...selectedSpecs, [row.specId]: false };
        return {
          rows: updatedRows.filter((r) => r.specId !== row.specId),
          selectedSpecs: newSelectedSpecs,
        };
      } else {
        updatedRows[rowIndex] = {
          ...row,
          selectedValues: updatedValues,
          allSelected: false,
        };
        return { rows: updatedRows, selectedSpecs };
      }
    }

    return { rows: updatedRows, selectedSpecs };
  };

  // 重置规格选择
  const resetSpecsSelection = (selectedSpecs: Record<string, boolean>) => {
    const resetSelectedSpecs = {};
    Object.keys(selectedSpecs).forEach((key) => {
      resetSelectedSpecs[key] = false;
    });
    return resetSelectedSpecs;
  };

  function buildDimensionList(specRows, unitsConfig) {
    if (
      !unitsConfig ||
      !Array.isArray(unitsConfig.units) ||
      unitsConfig.units.length === 0
    ) {
      dimensionList.value = [];
      return [];
    }
    const list = specRows.map((specRow) => {
      return {
        key: specRow.specName,
        id: specRow.specId,
        values: specRow.selectedValues.map((val) => ({
          id: val.id,
          name: val.product_spec_value,
          specInfo: {
            ...val,
            product_spec_code: val.product_spec_code || '',
          },
        })),
      };
    });

    list.push({
      key: 'unit',
      id: 'unit',
      values: unitsConfig.units.map((u) => ({
        id: u.secondary_unit_id,
        name: u.secondary_unit_name,
        unitInfo: u,
      })),
    });

    dimensionList.value = list;
    return list;
  }

  function buildRowSpanArr() {
    rowSpanArr.value = [];
    const list = dimensionList.value;
    for (let i = 0; i < list.length; i++) {
      let product = 1;
      for (let j = i + 1; j < list.length; j++) {
        product *= list[j].values.length;
      }
      rowSpanArr.value.push(product);
    }
    return rowSpanArr.value;
  }

  function cartesianProduct(arrays) {
    function recurse(
      arrays,
      current = 0,
      result = [],
      currentCombination = [],
    ) {
      if (current === arrays.length) {
        result.push([...currentCombination]);
        return;
      }

      for (const value of arrays[current]) {
        currentCombination.push(value);
        recurse(arrays, current + 1, result, currentCombination);
        currentCombination.pop();
      }

      return result;
    }

    const result = recurse(arrays);
    return result;
  }

  function createSpanMethod(dimensionList, rowSpanArr, spanningColumns) {
    return function ({ row, column, rowIndex, columnIndex }) {
      const dimIndex = dimensionList.value.findIndex(
        (d) => d.key === column.property,
      );

      if (spanningColumns.includes(column.property)) {
        const unitDimIndex = dimensionList.value.findIndex(
          (d) => d.key === 'unit',
        );
        if (unitDimIndex !== -1) {
          const unitCount = dimensionList.value[unitDimIndex].values.length;
          return rowIndex % unitCount === 0
            ? {
                rowspan: unitCount,
                colspan: 1,
              }
            : {
                rowspan: 0,
                colspan: 0,
              };
        }
        return { rowspan: 1, colspan: 1 };
      }

      if (dimIndex !== -1) {
        const spanCount = rowSpanArr.value[dimIndex];
        return rowIndex % spanCount === 0
          ? {
              rowspan: spanCount,
              colspan: 1,
            }
          : {
              rowspan: 0,
              colspan: 0,
            };
      }

      return { rowspan: 1, colspan: 1 };
    };
  }

  // 根据实际行数据创建动态的跨行方法
  function createSpanMethodByData(rows, specKey) {
    return function ({ row, column, rowIndex }) {
      if (column.property !== specKey) {
        return { rowspan: 1, colspan: 1 };
      }

      const currentSpec = row.find((item) => item.specId === specKey);
      if (!currentSpec) return { rowspan: 1, colspan: 1 };

      if (rowIndex > 0) {
        const prevRow = rows[rowIndex - 1];
        const prevSpec = prevRow.find((item) => item.specId === specKey);
        if (prevSpec && prevSpec.specValueId === currentSpec.specValueId) {
          return { rowspan: 0, colspan: 0 };
        }
      }

      let span = 1;
      for (let i = rowIndex + 1; i < rows.length; i++) {
        const nextSpec = rows[i].find((item) => item.specId === specKey);
        if (nextSpec && nextSpec.specValueId === currentSpec.specValueId) {
          span++;
        } else {
          break;
        }
      }
      return { rowspan: span, colspan: 1 };
    };
  }
  // 动态创建跨行方法
  function createDynamicSpanMethod(
    tableData: any[],
    specDimensions: any[],
    unitDimension: any,
    spanningColumns: string[],
    isMarge: boolean,
  ) {
    // 添加逻辑sku_barcode根据isMarge决定是否合并sku_barcode列
    return function ({ row, column, rowIndex }) {
      // 规格维度
      const specProperties = specDimensions.map((dim) => dim.key);
      if (specProperties.includes(column.property)) {
        const specDataRows = tableData.map((tableRow) => {
          return specProperties.map((prop) => ({
            specId: prop,
            specValueId: tableRow[prop],
            specName: tableRow[prop],
          }));
        });

        return createSpanMethodByData(
          specDataRows,
          column.property,
        )({
          row: specDataRows[rowIndex],
          column,
          rowIndex,
        });
      }

      // 对于需要跨行的列，根据规格组分组
      if (spanningColumns.includes(column.property)) {
        // 根据规格组合创建分组
        const groups = {};

        // 创建分组键 - 使用规格组合作为键
        tableData.forEach((r, i) => {
          let groupKey = '';

          // 使用规格值组合创建一个分组键
          if (r.product_info_spec_list && r.product_info_spec_list.length > 0) {
            // 对规格排序以确保相同的规格组合生成相同的键
            const sortedSpecs = [...r.product_info_spec_list].sort((a, b) =>
              a.product_spec_id.localeCompare(b.product_spec_id),
            );

            groupKey = sortedSpecs
              .map(
                (spec) =>
                  `${spec.product_spec_id}:${spec.product_spec_value_id}`,
              )
              .join('|');
          } else {
            // 没有规格则使用单位作为分组键
            groupKey = `unit:${r.product_unit_id || ''}`;
          }

          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(i);
        });

        // 在每个分组内检查列值并创建子分组
        let spanInfo = null;

        // 遍历所有分组
        for (const groupKey in groups) {
          const groupIndices = groups[groupKey];

          // 如果当前行不在这个组中，继续下一组
          if (!groupIndices.includes(rowIndex)) {
            continue;
          }

          // 在组内根据列值创建子分组
          const valueGroups = {};
          groupIndices.forEach((idx) => {
            const value = tableData[idx][column.prop];
            if (!valueGroups[value]) {
              valueGroups[value] = [];
            }
            valueGroups[value].push(idx);
          });

          // 检查当前行在哪个子分组中
          for (const value in valueGroups) {
            const valueIndices = valueGroups[value];

            if (valueIndices.includes(rowIndex)) {
              // 获取连续的行索引
              const consecutiveIndices = [];
              let startIdx = -1;

              // 以升序排列索引
              valueIndices.sort((a, b) => a - b);

              // 找到当前行所在的连续序列
              for (let i = 0; i < valueIndices.length; i++) {
                if (valueIndices[i] === rowIndex) {
                  // 向前回溯找到序列开始
                  startIdx = i;
                  while (
                    startIdx > 0 &&
                    valueIndices[startIdx] - valueIndices[startIdx - 1] === 1
                  ) {
                    startIdx--;
                  }

                  // 从开始位置向后收集连续的索引
                  let j = startIdx;
                  while (
                    j < valueIndices.length - 1 &&
                    valueIndices[j + 1] - valueIndices[j] === 1
                  ) {
                    consecutiveIndices.push(valueIndices[j]);
                    j++;
                  }
                  consecutiveIndices.push(valueIndices[j]);
                  break;
                }
              }

              if (consecutiveIndices.length > 0) {
                const firstIndex = consecutiveIndices[0];

                if (rowIndex === firstIndex) {
                  spanInfo = {
                    rowspan: consecutiveIndices.length,
                    colspan: 1,
                  };
                } else if (consecutiveIndices.includes(rowIndex)) {
                  spanInfo = {
                    rowspan: 0,
                    colspan: 0,
                  };
                }
              }

              break;
            }
          }

          break;
        }

        if (spanInfo) {
          return spanInfo;
        }
      }

      return { rowspan: 1, colspan: 1 };
    };
  }

  function validateSpecsForBundle(specRows) {
    const totalSpecs = specRows.length;
    const totalValues = specRows.reduce(
      (sum, row) => sum + row.selectedValues.length,
      0,
    );
    const emptyValueRows = specRows.filter(
      (row) => row.selectedValues.length === 0,
    );
    if (emptyValueRows.length > 0) {
      ElMessage.warning(t('inventory.select_spec_values'));
      return false;
    }
    if (totalSpecs > 4) {
      ElMessage.warning(t('inventory.too_many_specs', { value: 4 }));
      return false;
    }

    if (totalValues > 5) {
      ElMessage.warning(t('inventory.too_many_spec_values', { value: 5 }));
      return false;
    }

    return true;
  }

  function validateUnitSelection(tableData) {
    const firstRecord = tableData[0];
    if (!firstRecord || firstRecord.is_basic !== 1) {
      ElMessage.error(t('inventory.please-select-unit-first'));
      return false;
    }

    return true;
  }

  function validatePrices(productListContent, unitsConfig) {
    if (!productListContent.cost_price) {
      ElMessage.error(t('common.please-enter-cost-price'));
      return false;
    }

    if (!productListContent.selling_price) {
      ElMessage.error(t('common.please-enter-selling-price'));
      return false;
    }

    return true;
  }

  function validateBeforeGenerateBundle(
    productListContent,
    unitsConfig,
    specRows,
    tableData,
  ) {
    if (!validateUnitSelection(tableData)) {
      return false;
    }
    // 成本价与售价停止校验
    // if (!validatePrices(productListContent, unitsConfig)) {
    //   return false;
    // }

    if (!validateSpecsForBundle(specRows)) {
      return false;
    }

    return true;
  }

  // 查找相同规格的行
  function findSameSpecRows(
    currentIndex,
    tableData: any[],
    editMethodit,
    editList,
  ) {
    if (!tableData || tableData.length === 0) return [];
    // 获取当前筛选方式
    const editMethoditLabel = editList.find((item) => item.id === editMethodit);
    if (editMethoditLabel) {
      if (editMethodit === 'all') {
        return tableData.value;
      } else if (editMethodit === 'product_unit_name') {
        let returnUnitData = [];
        returnUnitData = tableData.value.filter((item) => {
          return (
            item.product_unit_id ===
            tableData.value[currentIndex].product_unit_id
          );
        });
        return returnUnitData;
      } else {
        let returnData = [];
        returnData = tableData.value.filter((item) => {
          return (
            item[editMethoditLabel.name] ===
            tableData.value[currentIndex][editMethoditLabel.name]
          );
        });
        return returnData;
      }
    }

    // return tableData.value
    //   .map((row, index) => ({ row, index }))
    //   .filter(item => item.row.spec_code === currentRow.spec_code);
  }

  // 清空规格组合数据
  async function clearBundleData() {
    try {
      await ElMessageBox.confirm(
        t('inventory.table_clear_propmt'),
        t('inventory.clearing'),
        {
          confirmButtonText: t('inventory.clearing'),
          cancelButtonText: t('inventory.cancel'),
          type: 'warning',
        },
      );

      dimensionList.value = [];
      rowSpanArr.value = [];

      return {
        success: true,
        clearedData: {
          bundleGenerated: false,
          specBundleRows: [],
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        clearedData: null,
      };
    }
  }

  // 批量编辑相关
  const bulkEditEnabled = ref(false);
  const bulkEditSelection = ref('');

  // 获取批量编辑选项
  const getBulkEditOptions = (specRows: any[], unitsConfig: any) => {
    const options = [{ id: 'all', name: t('common.all'), type: 'all' }];

    // 添加规格选项
    if (specRows && specRows.length > 0) {
      specRows.forEach((row) => {
        options.push({
          id: `spec_${row.specId}`,
          name: row.specName,
          type: 'spec',
        });
      });
    }

    options.push({
      id: 'product_unit_name',
      name: t('sku_list.product_unit_name'),
      type: 'product_unit_name',
    });

    return options;
  };

  // 规格比较
  function compareSpecConfigWithSku(newSpecRows, skuSpecList) {
    if (newSpecRows.length !== skuSpecList.length) {
      return false;
    }
    const skuMapping = {};
    skuSpecList.forEach((item) => {
      skuMapping[item.product_spec_id] = item.product_spec_value_id;
    });

    const newSpecMapping = {};
    const specValueCountMapping = {};
    newSpecRows.forEach((spec) => {
      newSpecMapping[spec.specId] = true;
      specValueCountMapping[spec.specId] = spec.selectedValues.map((v) => v.id);
    });

    for (const specId in skuMapping) {
      if (!newSpecMapping[specId]) {
        return false;
      }
    }

    // 遍历每个需要更新的规格
    for (const spec of newSpecRows) {
      if (!Object.prototype.hasOwnProperty.call(skuMapping, spec.specId)) {
        return false;
      }
      const skuValueId = skuMapping[spec.specId];

      const selectedValueIds = spec.selectedValues.map((v) => v.id);

      if (!selectedValueIds.includes(skuValueId)) {
        return false;
      }

      const valueIds = specValueCountMapping[spec.specId];
      if (valueIds.length !== spec.selectedValues.length) {
        return false;
      }
    }
    return true;
  }

  function compareUnits(newUnits, oldUnits) {
    if (newUnits.length !== oldUnits.length) {
      return false;
    }

    // 定义一个标准化单位对象的函数，取出需要比较的字段
    const unitKey = (unit) => {
      return {
        id: (unit.id || '').trim(),
        secondary_unit_name: (unit.secondary_unit_name || '').trim(),
        basic_unit_radio: (unit.basic_unit_radio || '').trim(),
        package_barcode: (unit.package_barcode || '').trim(),
      };
    };

    const newKeys = newUnits.map(unitKey);
    const oldKeys = oldUnits.map(unitKey);

    // 排序后比较
    const sortFn = (a, b) => {
      return JSON.stringify(a).localeCompare(JSON.stringify(b));
    };
    newKeys.sort(sortFn);
    oldKeys.sort(sortFn);

    return JSON.stringify(newKeys) === JSON.stringify(oldKeys);
  }

  function compareSpecRows(newSpecs, oldSpecs) {
    if (newSpecs.length !== oldSpecs.length) {
      return false;
    }

    const specKey = (spec) => {
      return {
        specId: (spec.specId || '').trim(),
        specName: (spec.specName || '').trim(),
      };
    };

    // 建立两组映射
    const newSpecMap = new Map(
      newSpecs.map((spec) => [JSON.stringify(specKey(spec)), spec]),
    );
    const oldSpecMap = new Map(
      oldSpecs.map((spec) => [JSON.stringify(specKey(spec)), spec]),
    );

    if (newSpecMap.size !== oldSpecMap.size) {
      return false;
    }

    // 对每个匹配的规格，再比较其 selectedValues 部分
    for (const key of newSpecMap.keys()) {
      if (!oldSpecMap.has(key)) {
        return false;
      }

      const newSpec = newSpecMap.get(key);
      const oldSpec = oldSpecMap.get(key);

      const newSelectedValues = newSpec.selectedValues || [];
      const oldSelectedValues = oldSpec.selectedValues || [];

      if (newSelectedValues.length !== oldSelectedValues.length) {
        return false;
      }

      // 规格值对象，取 id 与 product_spec_value
      const valueKey = (val) => {
        return {
          id: (val.id || '').trim(),
          product_spec_value: (val.product_spec_value || '').trim(),
        };
      };

      const newValues = newSelectedValues.map(valueKey);
      const oldValues = oldSelectedValues.map(valueKey);

      newValues.sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b)),
      );
      oldValues.sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b)),
      );

      if (JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
        return false;
      }
    }

    return true;
  }
  function compareData(newData, oldData) {
    const newUnits = newData.units || [];
    const oldUnits = oldData.units || [];
    const newSpecs = newData.specRows || [];
    const oldSpecs = oldData.specRows || [];

    const unitsEqual = compareUnits(newUnits, oldUnits);
    const specsEqual = compareSpecRows(newSpecs, oldSpecs);

    return unitsEqual && specsEqual;
  }
  // 基于单元和规格生成 SKU 唯一键
  function generateSkuKey(sku) {
    const specKeys = sku.product_info_spec_list
      .map((spec) => `${spec.product_spec_id}-${spec.product_spec_value_id}`)
      .join('|');
    return `${specKeys}|unit-${sku.product_unit_id}`;
  }

  // 检查 SKU 变化
  function checkChanges(oldSku, newSku, newSpecRows) {
    // 只比对结构性配置变化，不再比对价格变化
    if (
      oldSku.package_barcode !== newSku.package_barcode ||
      oldSku.unit !== newSku.unit ||
      oldSku.basic_unit_radio !== newSku.basic_unit_radio
    ) {
      return true;
    }
    // 基于最新规格配置数据来校验
    if (!compareSpecConfigWithSku(newSpecRows, newSku.product_info_spec_list)) {
      return true;
    }
    return false;
  }

  // 反向推导 SKU 列表
  function reverseDeduction(oldSkuList, buildSkuListFn, specRows) {
    const validSpecRows = Array.isArray(specRows) ? specRows : [];

    // 为旧 SKU 列表生成 SKU 唯一键
    const oldSkuMap = new Map();
    oldSkuList.forEach((sku) => {
      const key = generateSkuKey(sku);
      oldSkuMap.set(key, sku);
    });
    // 为新 SKU 列表生成 SKU 唯一键
    const newSkuList = buildSkuListFn ? buildSkuListFn() : [];
    const newSkuMap = new Map();
    newSkuList?.forEach((sku) => {
      const key = generateSkuKey(sku);
      newSkuMap.set(key, sku);
    });

    const skusToAdd = [];
    const skusToUpdate = [];
    const skusToDelete = [];

    // 检查新增和更新
    newSkuMap?.forEach((newSku, key) => {
      if (oldSkuMap.has(key)) {
        const oldSku = oldSkuMap.get(key);
        if (checkChanges(oldSku, newSku, validSpecRows)) {
          skusToUpdate.push(newSku);
        }
      } else {
        skusToAdd.push(newSku);
      }
    });

    // 检查删除
    oldSkuMap?.forEach((oldSku, key) => {
      if (!newSkuMap.has(key)) {
        skusToDelete.push(oldSku);
      }
    });

    return { skusToAdd, skusToUpdate, skusToDelete };
  }

  // 用确认方式更改数据
  async function handleDataChange(oldSkuList, buildTableDataFn, onConfirm) {
    const diffResult = reverseDeduction(oldSkuList, buildTableDataFn, '');

    if (
      diffResult.skusToAdd.length > 0 ||
      diffResult.skusToUpdate.length > 0 ||
      diffResult.skusToDelete.length > 0
    ) {
      try {
        await ElMessageBox.confirm(
          t('inventory.sku_data_changed'),
          t('common.confirm'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning',
          },
        );

        if (onConfirm && typeof onConfirm === 'function') {
          onConfirm();
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      return true;
    }
  }

  // 为 SKU 列表添加 SKU 唯一键
  function addSkuKeyToSkuList(skuList) {
    return skuList.map((sku) => {
      return {
        ...sku,
        skuKey: generateSkuKey(sku),
      };
    });
  }

  return {
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
    validateSpecsForBundle,
    validateUnitSelection,
    validatePrices,
    validateBeforeGenerateBundle,
    createTableColumns,
    handleSpecChange,
    handleRemoveSpecValue,
    resetSpecsSelection,
    findSameSpecRows,
    clearBundleData,
    bulkEditEnabled,
    bulkEditSelection,
    getBulkEditOptions,
    generateSkuKey,
    checkChanges,
    reverseDeduction,
    handleDataChange,
    addSkuKeyToSkuList,
    compareData,
  };
}
