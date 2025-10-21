<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ElButton,
  ElCheckbox,
  ElCol,
  ElDrawer,
  ElImage,
  ElMessage,
  ElPagination,
  ElRow,
  ElTable,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElUpload,
} from '@igourd/common-ui';

import { FileService, InventoryService } from '@/apis';
// import { FileService } from '@/apis/system/file';
import localStorageService from '@/service/localStorage.service';
import useUserStore from '@/store/modules/useUserStore';
import { debounce } from '@/utils';
import { useProductSKU } from '@/views/inventory/components/hooks/useProductSKU';
import {
  listPreview,
  tabPreviewList,
} from '@/views/inventory/components/import.config';
import { useProductImport } from '@/views/inventory/components/useProductImport';
import { UploadFilled } from '@element-plus/icons-vue';
import Draggable from 'vuedraggable';
import * as XLSX from 'xlsx';

const props = defineProps({
  productImportShow: {
    type: Boolean,
    default: false,
  },
  productImportTitle: {
    type: String,
    default: 'Vendor List Edit',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close-tkr', 'update:modelValue']);
const { getProductSpecList, getProductSpecValueList, productSpecList } =
  useProductSKU();
const {
  dynamicTableKey,
  showImportResult,
  buildTemplateObject,
  translateRow,
  addSpecificationColumns,
  removeAllSpecColumns,
  updateMainSpecColumn,
  getCurrentValue,
  getOldValue,
  hasOldValue,
  getCellColor,
  translateTempXlsxFile,
  translateSpec,
  exportDataToExcel,
} = useProductImport();

const userStore = useUserStore();

const userInfo = localStorageService.get('userinfo');
const merchant_id = userInfo?.current_login_user_app?.owner_id;

const activePreview = ref(1);
let excelValue = reactive({});
const previewValue = ref([]);
const fileList = ref([]);
const isFileUploaded = ref(false);

const importTableData = ref([]);
// 上传文件的 ref
const uploadRef = ref(null);
// 清除文件的方法
const clearSelectedFiles = () => {
  isShowSave.value = false;
  excelValue = {};
  isFileUploaded.value = false;
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};
const removeFile = (file) => {
  clearSelectedFiles();
};
const handleFileChange = (file, newFileList) => {
  fileList.value =
    newFileList.length > 1
      ? [newFileList[newFileList.length - 1]]
      : newFileList;
};

// 计算筛选后的数据
const filteredListData = computed(() => {
  if (activePreview.value == 2) {
    return previewValue.value.filter((item) => item.is_old_data == 0);
  } else if (activePreview.value == 3) {
    return previewValue.value.filter((item) => item.is_old_data == 1);
  }
  return previewValue.value;
});

// 自动更新总数据量
watch(filteredListData, (newValue) => {
  pagesValue.value.total = newValue.length;
});

// 根据分页获取显示的数据
const filterCellContent = computed(() => {
  const start = (pagesValue.value.page_num - 1) * pagesValue.value.page_size;
  const end = start + pagesValue.value.page_size;
  return filteredListData.value.slice(start, end);
});

// 用户已选择的商品名称
const chosenTableKeys = computed(() => {
  return importTableData.value
    ?.filter(
      (item) =>
        (item.is_selected || item.is_fixed) &&
        item.table_column_key !== 'spec-',
    )
    .map((item) => String(item.table_column_key));
});
// 用户已选择的商品名称对象
const chosenTableKeysShow = computed(() => {
  return importTableData.value
    ?.filter(
      (item) =>
        (item.is_selected || item.is_fixed) &&
        item.table_column_key !== 'spec-',
    )
    .map((item) => item);
});

// 获取所有商品标签
const getProductTitle = () => {
  const params = {
    merchant_id,
    table_key: 'product_import',
  };
  InventoryService.dynamicTableColumnFind(params)
    .then(async (res) => {
      const { data } = res;
      dynamicTableColumn.value.table_column_keys =
        data?.table_column_keys || [];

      const mainSpecColumn = dynamicTableColumn.value.table_column_keys.find(
        (item) => item.table_column_key === 'spec-',
      );

      if (mainSpecColumn && mainSpecColumn.is_selected) {
        await getProductSpecList();
        addSpecificationColumns(
          dynamicTableColumn,
          productSpecList,
          importTableData,
        );
      }

      checkField(null);
    })
    .catch((error) => {
      ElMessage.error(error);
    });
};

// 临时文件上传
const temFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  FileService.upload(formData)
    .then((res) => {
      if (res.code !== 'SUCCESS') {
        return false;
      }
      ElMessage.success(t('inventory.upload-success'));
      excelValue = {
        file_name: res.data.file_name,
        page_num: 1,
        page_size: 500,
        table_column_keys: chosenTableKeys.value.filter(
          (item) => item !== 'spec-',
        ),
        table_key: 'product_import',
      };
      isFileUploaded.value = true;
    })
    .catch((error) => {
      console.log(error);
      ElMessage.error(error);
    });
};

const filteredData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const filteredItem = {};
    chosenTableKeys.value.forEach((column) => {
      if (column in item) {
        filteredItem[column] = item[column];
      }
    });
    return filteredItem;
  });
};
// 表格页码
const pagesValue = ref({
  page_num: 1,
  page_size: 15,
  pages: 0,
  total: 7,
});

// 计算总页数
const totalPages = computed(() =>
  Math.ceil(pagesValue.value.total / pagesValue.value.page_size),
);

// 分页数据
const paginatedList = computed(() => {
  const start = (pagesValue.value.page_num - 1) * pagesValue.value.page_size;
  const end = start + pagesValue.value.page_size;
  return previewValue.value.slice(start, end);
});

// 处理页码改变
const handlePageChange = (newPage) => {
  pagesValue.value.page_num = newPage;
};

// 处理每页条数改变
const handleSizeChange = (newSize) => {
  pagesValue.value.page_size = newSize;
  pagesValue.value.page_num = 1; // 重置为第一页
};

const tabelValue = ref([]);
// const fileAllValue = ref([]);
const MAX_COLUMNS = 5;
const displayedColumns = computed(() =>
  chosenTableKeys.value.filter((key) => key !== 'spec-'),
);
// 文件解析
const fileParsing = async (params) => {
  try {
    const firstRes = await FileService.excelParsing(params);
    const { data, code } = firstRes;
    if (firstRes.code !== 'SUCCESS') {
      loadingControl(false);
      ElMessage.error(firstRes.message);
    }
    // const totalPages = data.table_datas?.pages || 1;
    let allData = data.table_datas?.list || [];
    const page_size = data.table_datas?.page_size || 500;
    const page_num = data.table_datas?.page_num || 1;
    const total = data.table_datas?.total || 0;

    for (let i = 2; i <= allData.length && i <= 20; i++) {
      if (page_size * page_num >= total) break;
      const pageRes = await FileService.excelParsing({
        ...params,
        page_num: i,
      });
      allData = [...allData, ...pageRes.data.table_datas.list];
    }
    loadingControl(false);
    // 后续也需要做分页
    filePreview({
      merchant_id,
      table_datas: allData,
    });
  } catch (error) {
    console.error('文件解析失败:', error);
    loadingControl(false);
  }
};

// 解析
const productPreview = debounce(() => {
  if (Object.keys(excelValue).length === 0) {
    ElMessage.error(t('inventory.please-upload-analysis-xlsx'));
  } else {
    loadingControl(true);
    fileParsing(excelValue);
  }
}, 300);
const loadingControl = (value) => {
  userStore.setAppLoading(value);
  userStore.setPauseLoading(value);
};

// 文件预览
const filePreview = (params) => {
  InventoryService.excelPreview(params)
    .then((res) => {
      const { code, data, message } = res;
      const cleanedData = data.product_table_datas?.map((item) => {
        const newItem = { ...item };
        Object.keys(newItem)?.forEach((key) => {
          if (key?.startsWith('Spec-') && key?.includes('_')) {
            const newKey = key?.replace(/_/g, '');
            newItem[newKey] = newItem[key];
            delete newItem[key];
          }
        });

        return newItem;
      });
      tabelValue.value = filteredData(cleanedData);
      isShowSave.value = !isShowSave.value;
      previewValue.value = data?.product_table_datas;
      pagesValue.value.total = data?.product_table_datas.length;

      // 检查是否存在 initial_stock_quantity 字段，如果存在则默认选中第一个复选框
      const hasInitialStock = chosenTableKeys.value.includes(
        'initial_stock_quantity',
      );
      if (hasInitialStock) {
        checkedType.value = [1]; // 选中第一个复选框 (generate_opening_stock)
      } else {
        checkedType.value = [];
      }
    })
    .catch((error) => {
      ElMessage.error(
        JSON.stringify(error?.message || t('account.unknownError')),
      );
    });
};
// checkedType.value =[1,2]
// 文件导入
const fileImport = () => {
  if (previewValue.value.length === 0)
    ElMessage.error(t('inventory.please-preview-first'));
  const params = {
    is_generate_initial_stock: !!(
      checkedType.value.length > 0 && checkedType.value.includes(1)
    ),
    is_update_old_product: !!(
      checkedType.value.length > 0 && checkedType.value.includes(2)
    ),
    merchant_id,
    table_datas: previewValue.value,
  };
  InventoryService.excelImport(params)
    .then((res) => {
      const { code, data, message } = res;
      showImportResult(data, chosenTableKeys.value).then(() => {
        clearSelectedFiles();
      });
    })
    .catch((error) => {
      ElMessage.error(
        JSON.stringify(error?.message || t('account.unknownError')),
      );
    });
};

// 上传前校验文件大小和格式
const beforeUpload = async (file) => {
  const isAcceptedFormat =
    file.type ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const isLt20MB = file.size / 1024 / 1024 < 20;

  if (!isAcceptedFormat) {
    ElMessage.error(t('inventory.file-format-error'));
  }

  if (!isLt20MB) {
    ElMessage.error(t('inventory.file-size-limit', { value: 20 }));
  }
  // 验证过的文件
  const verifiedFile = await validateAndFilterFile(file);
  if (verifiedFile.file) {
    temFileUpload(verifiedFile.file);
  }
};

// 导入可接受文件类型
const acceptedFormats = '.xlsx';

// 验证文件并过滤不符合要求的标题
const validateAndFilterFile = async (file) => {
  if (!file || !file.name.endsWith('.xlsx')) {
    ElMessage.error(t('inventory.please-upload-valid-excel'));
    return false;
  }

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
      type: 'array',
      cellStyles: true,
      cellFormulas: true,
      compression: true,
    });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    if (!worksheet) {
      ElMessage.error(t('inventory.no-sheets-found'));
      return false;
    }

    // 获取并分析标题
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
    const translateValue = translateTempXlsxFile(chosenTableKeys.value);

    // 统计标题信息
    const headerAnalysis = {
      total: headers.length,
      valid: 0,
      filtered: 0,
      validHeaders: [],
      filteredHeaders: [],
    };

    // 分析有效和被过滤的标题
    headers.forEach((header) => {
      if (translateValue.includes(header)) {
        headerAnalysis.valid++;
        headerAnalysis.validHeaders.push(header);
      } else {
        headerAnalysis.filtered++;
        headerAnalysis.filteredHeaders.push(header);
      }
    });

    // 如果所有标题都是有效的，返回原始文件
    if (headerAnalysis.filtered == 0) {
      return { file, value: {} };
    }

    const validHeaders = headerAnalysis.validHeaders;

    if (validHeaders.length === 0) {
      ElMessage.error(t('inventory.no-required-columns'));
      return false;
    }

    // 过滤数据并统计行数
    const allRows = XLSX.utils.sheet_to_json(worksheet);
    const rowAnalysis = {
      totalRows: allRows.length,
      validRows: 0,
      emptyRows: 0,
    };

    const filteredData = allRows
      .map((row) => {
        const filteredRow = {};
        let hasData = false;

        validHeaders.forEach((header) => {
          if (row[header] !== undefined) {
            filteredRow[header] = row[header];
            hasData = true;
          }
        });

        if (hasData) {
          rowAnalysis.validRows++;
          return filteredRow;
        } else {
          rowAnalysis.emptyRows++;
          return null;
        }
      })
      .filter((row) => row !== null);

    if (filteredData.length === 0) {
      ElMessage.warning(t('inventory.noValidDataFound'));
      return file;
    }

    // 创建新的工作簿
    const newWorksheet = XLSX.utils.json_to_sheet(filteredData, {
      header: validHeaders,
    });

    // 复制原始格式设置
    if (worksheet['!cols'])
      newWorksheet['!cols'] = worksheet['!cols'].slice(0, validHeaders.length);
    if (worksheet['!rows']) newWorksheet['!rows'] = worksheet['!rows'];
    if (worksheet['!merges']) {
      newWorksheet['!merges'] = worksheet['!merges'].filter(
        (merge) => merge.e.c < validHeaders.length,
      );
    }

    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'FilteredData');

    // 写入文件
    const newFileBuffer = XLSX.write(newWorkbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true,
      bookSST: true,
    });

    const newBlob = new Blob([newFileBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const newFile = new File([newBlob], file.name, {
      type: newBlob.type,
      lastModified: file.lastModified,
    });

    return {
      file: newFile,
      value: {
        headers: headerAnalysis,
        rows: rowAnalysis,
        fileSize: {
          original: file.size,
          processed: newFile.size,
        },
      },
    };
  } catch (error) {
    console.error('文件处理错误:', error);
    ElMessage.error(t('inventory.fileProcessingError'));
    return false;
  }
};

// 下载模版
const downloadExcel = async () => {
  const keysForTemplate = [...chosenTableKeys.value].filter(
    (key) => key !== 'spec-',
  );

  const templateData = await buildTemplateObject(
    keysForTemplate,
    productSpecList,
    getProductSpecValueList,
  );

  const translatedRows = templateData.map((row) => translateRow(row));
  // 创建工作簿和工作表
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(translatedRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 生成 Blob 并触发下载
  const blob = new Blob(
    [XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'product_import_template.xlsx'; // 下载文件的文件名
  document.body.append(link);
  link.click();
  link.remove();
};

const { t } = useI18n();
const isImportShow = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
async function caslaryChecked(item) {
  const tableKeys = ['initial_stock_quantity', 'initial_stock_warehouse_name'];
  const index = tableKeys.indexOf(item.table_column_key);
  if (index !== -1) {
    const checkedItemKey = tableKeys[index === 0 ? 1 : 0];
    const nIndex = dynamicTableColumn.value.table_column_keys.findIndex(
      (nItem) => nItem.table_column_key === checkedItemKey,
    );
    dynamicTableColumn.value.table_column_keys[nIndex].is_selected =
      item.is_selected;
  }
}

// 商品title选择
const checkField = async (item) => {
  if (!item) {
    importTableData.value = dynamicTableColumn.value.table_column_keys.filter(
      (item) => item.is_selected || item.is_fixed,
    );
    return;
  }

  if (item.is_fixed !== 1) {
    item.is_selected = !item.is_selected;

    if (item.table_column_key === 'spec-') {
      if (item.is_selected) {
        // await getProductSpecList();
        addSpecificationColumns(
          dynamicTableColumn,
          productSpecList,
          importTableData,
        );
      } else {
        removeAllSpecColumns(dynamicTableColumn);
      }
    } else if (
      item.table_column_key.startsWith('spec-') &&
      item.table_column_key !== 'spec-'
    ) {
      updateMainSpecColumn(dynamicTableColumn);
    }

    await caslaryChecked(item);
  }

  importTableData.value = dynamicTableColumn.value.table_column_keys.filter(
    (item) => item.is_selected || item.is_fixed,
  );
  getColumnModif();
};

const getColumnModif = () => {
  const value = filteredArray(dynamicTableColumn.value.table_column_keys);
  const parms = {
    merchant_id,
    table_column_keys: value,
    table_key: 'product_import',
  };
  InventoryService.dynamicTableColumnModify(parms)
    .then((res) => {
      const { code, data, message } = res;
      // console.log(data);
      if (!code == 'SUCCESS') {
        ElMessage.error(message);
      }
    })
    .catch((error) => {
      ElMessage.error(error);
    });
};

const importType = ref(1);
const handleClose = () => {
  // isImportShow.value = false;
  clearSelectedFiles();
  emit('close-tkr');
};
// 获取表格字段
const dynamicTableColumn = ref({
  merchant_id: 0,
  table_column_keys: [],
  table_key: 'string',
  user_id: 0,
});

const filteredArray = (originalArray) => {
  return originalArray
    .filter((obj) => obj.is_selected) // 只保留 is_selected 为 true 的对象
    .map((obj) => ({
      is_selected: obj.is_selected,
      table_column_key: obj.table_column_key,
    }));
};

// 预览
const isShowSave = ref(false);

// 预览相关
const checkedType = ref([]);

const checkTabPreview = (val) => {
  console.log(val);
  activePreview.value = val;
};

onMounted(async () => {
  await getProductSpecList();
  getProductTitle();
  window?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});
</script>
<!-- 假设一行数据是表格的 -->
<template>
  <div class="list-import-box">
    <ElDrawer
      v-model="isImportShow"
      :with-header="false"
      direction="rtl"
      size="86%"
      custom-class=""
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <!-- 列表关闭栏 -->
      <div class="close86" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="drawer-title">
        <p class="title">
          {{ t('inventory.product_import') }}&nbsp;&nbsp;<i
            class="iconfont icon-bangzhu"
          ></i>
        </p>
      </div>
      <div class="drawer-content">
        <ElTabs class="import-tab" v-model="importType">
          <ElTabPane :label="t('inventory.import_files')" :name="1" />
          <!-- <el-tab-pane :label="t('inventory.import_history')" :name="2">
            <div>{{ t('inventory.import_history_content') }}</div>
          </el-tab-pane> -->
        </ElTabs>
        <div class="import-content">
          <!-- 功能模块1 -->
          <div class="import-content-module">
            <h5>1. {{ t('inventory.import_field') }}</h5>
            <ul>
              <ElRow :gutter="10">
                <template
                  v-for="(item, index) in dynamicTableColumn.table_column_keys"
                  :key="index"
                >
                  <ElCol
                    :lg="4"
                    :md="4"
                    :sm="4"
                    :xl="4"
                    :xs="4"
                    v-if="!item.is_fixed"
                  >
                    <!-- <el-tooltip effect="dark" :content="item.table_column_key" placement="top"> -->
                    <li
                      class="importField"
                      :class="[
                        item.is_fixed
                          ? 'diabled'
                          : item.is_selected
                            ? 'isChack'
                            : '',
                      ]"
                      @click="checkField(item)"
                    >
                      {{ dynamicTableKey(item) }}
                    </li>
                    <!-- </el-tooltip> -->
                  </ElCol>
                </template>
              </ElRow>
              <div class="desc">
                {{ t('inventory.template_import_recommendation') }}
              </div>
            </ul>
          </div>
          <div class="import-content-module">
            <h5>{{ t('inventory.excel_list') }}</h5>
            <div class="item_list">
              <ElRow :gutter="10">
                <Draggable
                  :list="chosenTableKeysShow"
                  item-key="name"
                  animation="300"
                  group="horizontal-group"
                  class="drag-container"
                  direction="horizontal"
                >
                  <template #item="{ element }">
                    <ElCol :lg="4" :md="4" :sm="4" :xl="4" :xs="4">
                      <div class="item">
                        <span class="iconfont icon-tuodong"></span>
                        {{ dynamicTableKey(element) }}
                        <!-- {{ t(`inventory.${element.table_column_key}`) }} -->
                      </div>
                    </ElCol>
                  </template>
                </Draggable>
              </ElRow>
            </div>
          </div>
          <!-- 下载模版模块 -->
          <div class="import-content-module">
            <h5>2. {{ t('inventory.download_template') }}</h5>
            <div class="template-down" @click="downloadExcel">
              <span>{{ t('inventory.excel_template') }}</span>
              <i class="iconfont icon-yunduanxiazai"></i>
            </div>
            <div class="desc">{{ t('inventory.please_select_items') }}</div>
          </div>
          <!-- 上传文件模块 -->
          <div class="import-content-module">
            <h5>3. {{ t('inventory.drag_files') }}</h5>
            <div class="drag-flles">
              <!-- <importFiles></importFiles> -->
              <!-- :http-request="temFileUpload" -->
              <ElUpload
                class="upload-document"
                drag
                ref="uploadRef"
                :limit="2"
                :accept="acceptedFormats"
                :before-upload="beforeUpload"
                :http-request="() => {}"
                :on-remove="removeFile"
                :on-change="handleFileChange"
                :file-list="fileList"
              >
                <UploadFilled
                  style="
                    width: 50px;
                    height: 50px;
                    margin: 0 auto;
                    color: #a8abb2;
                  "
                />
                <div class="el-upload__text">
                  {{ t('inventory.drop_file_here') }}
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    {{ t('common.file-tip', { size: '20M' }) }}
                  </div>
                </template>
              </ElUpload>
            </div>
            <div class="desc">
              <p>1. {{ t('inventory.supports_files', { size: 20 }) }}</p>
              <!-- <p>2. {{ t('inventory.file_data_limit') }}</p> -->
            </div>
          </div>
          <!-- 预览模块 -->
          <div
            class="import-content-module previewMod"
            style="
              box-sizing: border-box;
              padding: 15px;
              border: 1px solid #ccc;
            "
            v-if="isShowSave"
          >
            <h5>{{ $t('inventory.preview') }}</h5>
            <div class="drag-flles">
              <div class="preview-checkbox">
                <el-checkbox-group v-model="checkedType">
                  <ElCheckbox
                    v-for="(item, index) in tabPreviewList"
                    :key="index"
                    :label="item.id"
                    :value="item.id"
                  >
                    {{ t(item.name) }}
                  </ElCheckbox>
                </el-checkbox-group>
              </div>
              <div class="preview-tab">
                <ElRow :gutter="10">
                  <ElCol
                    :lg="4"
                    :md="4"
                    :sm="4"
                    :xl="4"
                    :xs="4"
                    v-for="(item, index) in listPreview"
                    :key="index"
                  >
                    <div
                      class="tab-list"
                      :class="item.id == activePreview ? 'isChack' : ''"
                      @click="checkTabPreview(item.id)"
                    >
                      {{ t(item.name) }}
                    </div>
                  </ElCol>
                </ElRow>
              </div>
              <div>
                <ElTable
                  style="width: 100%"
                  stripe
                  border
                  class="down-table-list"
                  :data="filterCellContent"
                  :header-cell-style="{
                    background: '#F6F8FC',
                    color: '#323232',
                    height: '30px',
                  }"
                >
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
                    v-for="column in displayedColumns"
                    :key="column"
                    :prop="column"
                    :label="translateSpec(column)"
                    align="center"
                  >
                    <!-- 使用作用域插槽自定义单元格内容 -->
                    <template #default="scope">
                      <span :style="{ color: getCellColor(scope.row) }">
                        <!-- 判断是否存在旧值 -->
                        <template v-if="hasOldValue(scope.row, column)">
                          <span style="text-decoration: line-through">
                            {{ getOldValue(scope.row, column) }}
                          </span>
                          &nbsp;→&nbsp;
                          <span>{{ getCurrentValue(scope.row, column) }}</span>
                        </template>
                        <template v-else-if="column != 'profile_photo'">
                          {{ getCurrentValue(scope.row, column) }}
                        </template>
                      </span>
                      <!-- v-if="scope.row[column] == 'profile_photo'" -->
                      <ElImage
                        v-if="column == 'profile_photo'"
                        :src="scope.row.profile_photo"
                        class="product-pic"
                        :preview-src-list="[scope.row.profile_photo]"
                        :initial-index="0"
                        :preview-teleported="true"
                      >
                        <!-- 当图片加载失败时，显示默认图片 -->
                        <template #error>
                          <div class="image-slot">
                            <img
                              @error="handleImageError"
                              src="#/assets/img/productDefault.png"
                              alt=""
                              class="product-pic"
                            />
                          </div>
                        </template>
                      </ElImage>
                    </template>
                  </ElTableColumn>
                </ElTable>
                <div class="mt-4 flex items-center justify-between">
                  <span>
                    {{
                      t('inventory.pagination', {
                        currentPage: pagesValue.page_num,
                        totalPage: totalPages,
                        totolData: pagesValue.total,
                      })
                    }}
                  </span>
                  <ElPagination
                    :current-page="pagesValue.page_num"
                    :page-size="pagesValue.page_size"
                    :total="pagesValue.total"
                    layout="prev, pager, next, sizes"
                    :page-sizes="[15, 30, 50, 100]"
                    :default-page-size="15"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-box">
          <ElButton class="cancel-btn" @click="handleClose">
            {{ t('inventory.cancel') }}
          </ElButton>
          <ElButton class="save-btn" v-if="isShowSave" @click.stop="fileImport">
            {{ t('inventory.save') }}
          </ElButton>
          <ElButton
            class="save-btn"
            v-else
            @click.stop="productPreview"
            :disabled="!isFileUploaded"
          >
            {{ t('inventory.preview') }}
          </ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
<style lang="scss">
.drag-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;
}

.drag-item {
  padding: 10px;
  margin: 5px;
  cursor: move;
  background-color: #f9f9f9;
  border: 1px solid #eee;
}

.import-tab {
  margin-bottom: 20px;
  font-size: 18px;

  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  .el-tabs__item {
    font-size: 18px;
  }

  .el-tabs__item.is-active {
    color: #005cff;
  }

  .el-tabs__active-bar {
    background-color: #005cff;
  }
}
</style>
<style lang="scss" scoped>
.preview-tab {
  margin: 20px 0;

  .tab-list {
    width: 100%;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    color: #323232;
    text-align: center;
    cursor: pointer;
    background: #f6f8fc;
    border-radius: 4px;

    &.isChack {
      background: #9fceff;
    }
  }
}

.item_list {
  max-height: calc(100% - 44px);

  .item {
    position: relative;
    // display: flex;
    align-items: center;
    height: 32px;
    padding-right: 10px;
    padding-left: 30px;
    margin: 0 auto 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 32px;
    color: #0d99ff;
    white-space: nowrap;
    background: #e9f8ff;
    border-radius: 8px;

    .icon-tuodong {
      position: absolute;
      top: 50%;
      left: 10px;
      color: #0d99ff;
      cursor: move;
      transform: translateY(-50%);
    }
  }
}

.drawer-title {
  height: 112px;
  padding-top: 37px;
  padding-left: 50px;
  text-align: left;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 24px;

    .icon-bangzhu {
      color: #7d90b2;
    }
  }
}

.drawer-content {
  padding-top: 35px;
  margin-left: 63px;

  .import-content {
    .import-content-module {
      font-size: 14px;
      color: #323232;

      .importField {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .previewMod {
        border: 1px solid #ccc;
        // width: ;
      }

      .drag-flles {
        padding: 12px 0;
      }

      .template-down {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 50%;
        height: 50px;
        padding: 0 20px;
        margin: 10px 0 5px;
        line-height: 50px;
        cursor: pointer;
        border: 1px solid #ccc;

        .iconfont {
          font-size: 24px;
        }
      }

      .desc {
        margin-bottom: 25px;
        font-size: 12px;
        color: #999;
      }

      h5 {
        font-size: 16px;
        font-weight: bold;
        color: #323232;
      }

      ul {
        margin-top: 12px;

        li {
          padding: 5px 0;
          margin-bottom: 12px;
          text-align: center;
          cursor: pointer;
          border: 1px solid #dbe0eb;
          border-radius: 4px;

          &.diabled {
            background: #f6f8fc;
            border: 1px solid #f6f8fc;
          }

          &.isChack {
            color: #fff;
            background: #4a9ffc;
            border: 1px solid #4a9ffc;
            // pointer-events: none; /* 禁用鼠标事件 */
            // cursor:default;
          }
        }
      }
    }
  }
}

.btn-box {
  .save-btn[disabled] {
    color: #fff;
    cursor: not-allowed;
    background-color: #c0c4cc;
    border-color: #c0c4cc;
  }
}
</style>
