<template>
  <div class="upload-box">
    <el-upload
      action="#"
      :multiple="false"
      :disabled="self_disabled"
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-progress="handleProgress"
      :drag="drag"
      :accept="fileType.join(',')"
      :file-list="fileList"
    >
      <div class="el-upload__text">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div>
          {{ t('common.fileDrop') }} <em>{{ t('common.clickUp') }}</em>
        </div>
      </div>
      <!-- <template #file="{ file }">
        {{ file }}
        <div class="file-item">
          <span>{{ file.name }} -- {{ file.url }}</span>
          <span v-if="uploadProgress[index] !== undefined">{{ uploadProgress[index] }}%</span>
        </div>
      </template> -->
      <template #tip>
        <div class="el-upload__tip">
          {{ t('common.fileTip', { size: '5M' }) }}
          <br />
          {{ t('common.fileSupport') }}
        </div>
      </template>
    </el-upload>
    <down-load-files v-if="showDownload" :uploaded-files="uploadedFiles" />
  </div>
</template>

<script setup lang="ts" name="UploadImgs">
import { ref, computed, inject, watch, onBeforeUnmount, toRaw } from 'vue';
import { upload } from '#/api';
import type { UploadProps, UploadFile, UploadUserFile } from 'element-plus';
import { UploadFilled } from '@igourd/icons';
import { formContextKey, ElMessage, ElUpload } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import DownLoadFiles from './download-files.vue';
const { t } = useI18n();

interface UploadFileProps {
  fileList?: UploadUserFile[];
  api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit?: 1; // 最大图片上传数 ==> 非必传（默认为 5张）
  fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
  fileType?: File.ImageMimeType[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height?: string; // 组件高度 ==> 非必传（默认为 150px）
  width?: string; // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
  // 是否显示下载按钮
  showDownload?: boolean; // 非必传（默认为 true）
  // 是否显示预览按钮
  showPreview?: boolean; // 非必传（默认为 true）
  defaultUrl?: string; // 新增默认展示的文件URL
}

const props = withDefaults(defineProps<UploadFileProps>(), {
  fileList: () => [],
  drag: true,
  disabled: false,
  limit: 1,
  fileSize: 5,
  fileType: () => ['image/jpeg', 'image/png', 'image/gif'],
  height: '150px',
  width: '150px',
  borderRadius: '8px',
  defaultUrl: '',
});

const emit = defineEmits([
  'handleUploadFiles',
  'update:fileList',
  'onUploadSuccess',
]);
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

const _fileList = ref<UploadUserFile[]>(props.fileList);
const uploadedFiles = ref<{ name: string; url: string }[]>([]);
const uploadProgress = ref<number[]>([]);
const fileList = ref<UploadUserFile[]>([]);

// 监听 props.fileList 列表默认值改变
watch(
  () => props.fileList,
  (n: UploadUserFile[]) => {
    _fileList.value = n;
  },
);

// 监听默认URL变化
watch(
  () => props.defaultUrl,
  (url) => {
    if (url) {
      // 将默认URL转换为fileList格式
      fileList.value = [
        {
          name: url.split('/').pop() || 'file',
          url: url,
        },
      ];
      uploadedFiles.value = fileList.value;
    } else {
      fileList.value = [];
      uploadedFiles.value = [];
    }
  },
  { immediate: true },
);

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < 5;
  // 文件大小限制为5M, 文件格式不支持jsp, php, html, htm, shtml, phtml, js, svg, xml, flv, fla, swf
  // const imgType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(rawFile.type);
  // 排除文件格式
  const type = ![
    'jsp',
    'php',
    'html',
    'htm',
    'shtml',
    'phtml',
    'js',
    'svg',
    'xml',
    'flv',
    'fla',
    'swf',
  ].includes(rawFile.type);
  if (!type) {
    ElMessage.warning(t('common.fileNotSupport'));
  }
  if (!imgSize) {
    ElMessage.warning(`${t('common.fileSizeNotExceeding')} 5M！`);
  }
  return type && imgSize;
};

const handleProgress = (event: any, file: UploadFile) => {
  const index = _fileList.value.findIndex((f) => f.uid === file.uid);
  if (index !== -1) {
    uploadProgress.value[index] = Math.round(event.percent);
  }
};

/**
 * @description 文件上传
 * @param options upload 所有配置项
 * */
const handleHttpUpload = async ({ file }) => {
  let formData = new FormData();
  formData.append('file', file);
  try {
    const api = props.api ?? upload;
    const { data } = await api(formData);
    uploadedFiles.value.push({ name: file.name, url: data.url });
    emit('handleUploadFiles', data, toRaw(uploadedFiles.value));
    emit('onUploadSuccess', data.url);
    ElMessage.success(t('common.uploadSuccess'));
  } catch (error) {
    ElMessage.error(t('common.uploadFail'));
  }
};

const clearFileList = () => {
  _fileList.value = [];
  uploadedFiles.value = [];
  uploadProgress.value = [];
  fileList.value = [];
};

onBeforeUnmount(() => {
  clearFileList();
});

defineExpose({
  clearFileList,
});
</script>

<style scoped lang="scss">
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #acaeb3;

  .icon-icon_details,
  .icon-import {
    font-size: 12px;
    color: #acaeb3;
    cursor: pointer;
  }
}

.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  width: 600px;
  // height: 250px;
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.el-upload-dragger) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    padding: 0;
    overflow: hidden;
    text-align: center;
    background-color: #ecf5ff;
    border: 1px dashed var(--el-border-color-darker);
    border-radius: v-bind(borderradius);

    &:hover {
      border: 1px dashed var(--el-color-primary);
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderradius);
    }

    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
    }

    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .el-upload__tip {
    line-height: 15px;
  }
}
</style>
