/**
 * 批量编辑 sku table
 */
import type { InputSyncProps } from '../type';

function findSameSpecGroup(tableData: any[], row: any): number[] {
  const result: number[] = [];

  /**
   * 输入框变化，同步所有数据变化
   */
  const generateSpecSignature = (item: any) => {
    if (item.product_info_spec_list && item.product_info_spec_list.length) {
      const sortedSpecs = [...item.product_info_spec_list].sort((a, b) =>
        a.product_spec_id.localeCompare(b.product_spec_id)
      );

      return sortedSpecs.map(spec => `${spec.product_spec_id}:${spec.product_spec_value_id}`).join('|');
    }
    return '';
  };

  const currentSignature = generateSpecSignature(row);

  if (!currentSignature) {
    return [tableData.findIndex(item => item === row)];
  }

  tableData.forEach((item, index) => {
    if (generateSpecSignature(item) === currentSignature) {
      result.push(index);
    }
  });

  return result;
}

function updateBarcodeWithSpecCode(row: any, newSpecCode: string, oldSpecCode: string) {
  if (row.sku_barcode) {
    if (oldSpecCode && row.sku_barcode.endsWith(oldSpecCode)) {
      const baseBarcode = row.sku_barcode.substring(0, row.sku_barcode.length - oldSpecCode.length);
      row.sku_barcode = baseBarcode + newSpecCode;
    } else if (newSpecCode && (!oldSpecCode || !row.sku_barcode.endsWith(oldSpecCode))) {
      row.sku_barcode = row.sku_barcode + newSpecCode;
    }
  }
}

export function batchTableData(props: InputSyncProps, { tableData, bulkEditEnabled, bulkEditSelection, specRows }) {
  const { row, rowType, newVal, oldVal } = props;
  const newTableData = [...tableData.value];

  if (rowType === 'spec_code') {
    const sameSpecGroupIndices = findSameSpecGroup(newTableData, row);

    sameSpecGroupIndices.forEach(index => {
      const currentRow = newTableData[index];
      currentRow.spec_code = newVal;
      updateBarcodeWithSpecCode(currentRow, newVal, oldVal);
    });

    tableData.value = newTableData;
    return;
  }

  if (bulkEditEnabled.value) {
    if (bulkEditSelection.value === 'all') {
      newTableData.forEach(item => {
        item[rowType] = newVal;
      });
    } else if (bulkEditSelection.value?.startsWith('spec_')) {
      const specId = bulkEditSelection.value.split('_')[1];
      newTableData.forEach(item => {
        const hasSpec = item.product_info_spec_list?.some(
          spec => spec.product_spec_id === specId && spec.product_spec_value === row[spec.product_spec_name]
        );
        if (hasSpec) {
          item[rowType] = newVal;
        }
      });
    } else if (bulkEditSelection.value === 'product_unit_name') {
      newTableData.forEach(item => {
        if (item.unit === row.unit) {
          item[rowType] = newVal;
        }
      });
    }
  }

  tableData.value = newTableData;
}
