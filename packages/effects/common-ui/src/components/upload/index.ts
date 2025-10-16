import type { Field } from '@formily/core';

// UploadFiles.ts — Formily x-component（Element Plus 上传适配，纯 h 渲染）
import { computed, defineComponent, h, ref, watch } from 'vue';

import {
  Download as IconDownload,
  View as IconView,
  UploadFilled,
} from '@element-plus/icons-vue';
import { connect, mapProps, useField } from '@formily/vue';
import {
  ElButton,
  ElIcon,
  ElImageViewer,
  ElMessage,
  ElUpload,
} from 'element-plus';

// ====== 类型定义 ======
type UploadValueObject = {
  // 你可以按需扩展：例如后端的 fileId、bucket 等
  [k: string]: any;
  name?: string;
  size?: number;
  type?: string;
  uid?: number | string;
  url: string;
};

type ValueType = 'object' | 'url';

export type UploadProps = {
  accept?: string;
  // Element Plus <el-upload> 原生 props（常用列出，其它用 attrs 透传）
  action?: string;

  allowTypes?: string[]; // 允许的 MIME 类型（如 ['image/jpeg','image/png']）
  autoUpload?: boolean;
  data?: Record<string, any>;
  disabled?: boolean;
  drag?: boolean;
  headers?: Record<string, any>;
  httpRequest?: (options: any) => Promise<any>; // 自定义上传请求（覆盖默认）
  limit?: number;
  listType?: 'picture' | 'picture-card' | 'text';
  maxSizeMB?: number; // 单文件最大 MB，超出拦截
  method?: 'patch' | 'post' | 'put';
  multiple?: boolean;
  onChange?: (val: any) => void;

  // 预览：图片弹窗 or 新窗打开
  previewInViewer?: boolean;
  showFileList?: boolean;
  transformResponse?: (
    resp: any,
    file: any,
  ) => null | string | UploadValueObject;
  // 受控值（Formily connect 会映射 value/onChange）
  value?: string[] | UploadValueObject[];
  // 自定义扩展
  valueType?: ValueType; // 'object'（默认）或 'url'（仅保存 url 数组）
  withCredentials?: boolean;
};

const isImage = (file: any) => {
  const t = file?.type || '';
  const name: string = file?.name || '';
  return /^image\//.test(t) || /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(name);
};

// ====== 值 <-> ElUpload 文件结构 转换 ======
const toElFiles = (
  val: string[] | undefined | UploadValueObject[],
  valueType: ValueType,
) => {
  const arr = Array.isArray(val) ? val : [];
  return arr.map((it: any, idx) => {
    if (valueType === 'url') {
      return {
        uid: `u-${idx}-${String(it)}`,
        name: String(it).split('/').pop() || `file-${idx}`,
        url: String(it),
        status: 'success',
      };
    }
    const o = it as UploadValueObject;
    return {
      uid: o.uid ?? `u-${idx}-${o.url}`,
      name: o.name || o.url?.split('/').pop() || `file-${idx}`,
      url: o.url,
      size: o.size,
      type: o.type,
      status: 'success',
      raw: o,
    };
  });
};

const fromElFiles = (
  files: any[],
  valueType: ValueType,
): string[] | UploadValueObject[] => {
  if (valueType === 'url') {
    return files.filter((f) => !!f?.url).map((f) => String(f.url));
  }
  return files
    .filter((f) => !!f?.url)
    .map((f) => {
      const base: UploadValueObject = {
        url: f.url,
        name: f.name,
        size: f.size,
        type: f.type,
        uid: f.uid,
      };
      // 如果 transformResponse 返回过更多字段，也在 raw 里保留了，可以 merge
      return { ...base, ...(f.raw && typeof f.raw === 'object' ? f.raw : {}) };
    });
};

export default connect(
  defineComponent<UploadProps>({
    name: 'UploadFiles',
    inheritAttrs: false,
    props: [
      'value',
      'onChange',
      'action',
      'headers',
      'data',
      'method',
      'withCredentials',
      'multiple',
      'limit',
      'accept',
      'listType',
      'drag',
      'autoUpload',
      'disabled',
      'showFileList',
      'valueType',
      'maxSizeMB',
      'allowTypes',
      'transformResponse',
      'httpRequest',
      'previewInViewer',
    ] as unknown as undefined,
    setup(props, { attrs }) {
      const field = useField<Field>();
      const valueType = computed<ValueType>(() => props.valueType || 'object');
      const fileList = ref<any[]>(
        toElFiles(props.value as any, valueType.value),
      );
      const viewerVisible = ref(false);
      const viewerIndex = ref(0);

      // 当外部值变化，同步到内部 fileList
      watch(
        () => props.value,
        (nv) => {
          fileList.value = toElFiles(nv as any, valueType.value);
        },
        { deep: true },
      );

      const emitChange = (nextFiles: any[]) => {
        const val = fromElFiles(nextFiles, valueType.value);
        props.onChange?.(val);
      };

      // —— 前置校验（类型/大小）——
      const beforeUpload = (rawFile: any) => {
        if (props.disabled) return false;
        if (
          props.allowTypes &&
          props.allowTypes.length > 0 &&
          !props.allowTypes.includes(rawFile.type)
        ) {
          ElMessage.warning(`文件类型不允许：${rawFile.type || 'unknown'}`);
          return false;
        }
        if (props.maxSizeMB && rawFile.size > 0) {
          const sizeMB = rawFile.size / 1024 / 1024;
          if (sizeMB > props.maxSizeMB) {
            ElMessage.warning(
              `文件过大：${sizeMB.toFixed(2)}MB（上限 ${props.maxSizeMB}MB）`,
            );
            return false;
          }
        }
        return true;
      };

      // —— 上传成功：写入 value ——
      const onSuccess = (
        response: any,
        uploadFile: any,
        uploadFiles: any[],
      ) => {
        let mapped: any = null;
        if (typeof props.transformResponse === 'function') {
          mapped = props.transformResponse(response, uploadFile);
        } else {
          // 默认尝试取常见路径
          const url =
            response?.url ||
            response?.data?.url ||
            response?.data?.fileUrl ||
            response?.result?.url;
          const name =
            response?.name || response?.data?.name || uploadFile?.name;
          if (url) {
            mapped =
              valueType.value === 'url'
                ? url
                : { url, name, size: uploadFile?.size, type: uploadFile?.type };
          }
        }

        if (!mapped) {
          // 如果无法识别响应，回退为本地对象（但 url 为空，需要后端返回才可下载）
          mapped =
            valueType.value === 'url'
              ? uploadFile?.url || ''
              : {
                  url: uploadFile?.url || '',
                  name: uploadFile?.name,
                  size: uploadFile?.size,
                  type: uploadFile?.type,
                };
        }

        // 更新 uploadFiles 列表的当前项，填充 url 等信息
        const idx = uploadFiles.findIndex((f: any) => f.uid === uploadFile.uid);
        if (idx !== -1) {
          uploadFiles[idx] = {
            ...uploadFiles[idx],
            url:
              valueType.value === 'url'
                ? String(mapped)
                : (mapped as UploadValueObject).url,
            raw: valueType.value === 'url' ? {} : mapped,
            status: 'success',
          };
        }

        fileList.value = uploadFiles;
        emitChange(uploadFiles);
      };

      const onError = () => {
        ElMessage.error('上传失败');
      };

      const onRemove = (_: any, uploadFiles: any[]) => {
        fileList.value = uploadFiles;
        emitChange(uploadFiles);
      };

      const onExceed = () => {
        ElMessage.warning(`最多可上传 ${props.limit} 个文件`);
      };

      const onPreview = (file: any) => {
        if (props.previewInViewer && isImage(file)) {
          const idx = fileList.value.findIndex((f) => f.uid === file.uid);
          viewerIndex.value = Math.max(0, idx);
          viewerVisible.value = true;
        } else {
          const url = file.url;
          if (url) window.open(url, '_blank');
        }
      };

      // —— 只读态渲染（Preview）——
      const readPretty = computed(
        () => field.value?.readPretty || props.disabled,
      );

      const renderReadPretty = () => {
        const files = fileList.value || [];
        if (files.length === 0)
          return h(
            'div',
            { style: 'color: var(--el-text-color-placeholder);' },
            '无附件',
          );
        return h(
          'div',
          {
            class: 'uploadfiles-readpretty',
            style: 'display:flex; flex-wrap:wrap; gap:8px;',
          },
          files.map((f, i) =>
            isImage(f)
              ? h(
                  'div',
                  {
                    key: f.uid,
                    style:
                      'width:96px; height:96px; border:1px solid var(--el-border-color); border-radius:6px; overflow:hidden; position:relative; cursor:pointer;',
                  },
                  [
                    h('img', {
                      src: f.url,
                      style: 'width:100%; height:100%; object-fit:cover;',
                      onClick: () => onPreview(f),
                    }),
                  ],
                )
              : h(
                  'div',
                  {
                    key: f.uid,
                    style:
                      'display:flex; align-items:center; gap:6px; border:1px solid var(--el-border-color); padding:6px 8px; border-radius:6px;',
                  },
                  [
                    h(ElIcon, { size: 16 }, { default: () => h(UploadFilled) }),
                    h(
                      'a',
                      {
                        href: f.url,
                        target: '_blank',
                        style:
                          'max-width:260px; overflow:hidden; text-overflow:ellipsis; whiteSpace:"nowrap"',
                      },
                      f.name || f.url,
                    ),
                    h(
                      ElButton,
                      { text: true, onClick: () => onPreview(f) },
                      {
                        default: () => [
                          h(ElIcon, null, { default: () => h(IconView) }),
                          ' 预览',
                        ],
                      },
                    ),
                    h(
                      ElButton,
                      {
                        text: true,
                        onClick: () => window.open(f.url, '_blank'),
                      },
                      {
                        default: () => [
                          h(ElIcon, null, { default: () => h(IconDownload) }),
                          ' 下载',
                        ],
                      },
                    ),
                  ],
                ),
          ),
        );
      };

      // —— 上传组件渲染 ——
      const renderUpload = () =>
        h(
          ElUpload as any,
          {
            // 基本
            action: props.httpRequest ? undefined : props.action,
            headers: props.headers,
            data: props.data,
            method: props.method,
            withCredentials: props.withCredentials,
            multiple: props.multiple,
            limit: props.limit,
            accept: props.accept,
            listType: props.listType || 'text',
            drag: props.drag,
            autoUpload: props.autoUpload ?? true,
            disabled: props.disabled,
            showFileList: props.showFileList ?? true,

            // 受控 fileList
            fileList: fileList.value,

            // 钩子
            beforeUpload,
            httpRequest: props.httpRequest, // 自定义请求（若传入）
            onSuccess,
            onError,
            onRemove,
            onExceed,
            onPreview,

            // 透传 attrs（例如 name/request/…）
            ...attrs,
          },
          {
            // 默认插槽（按钮/拖拽面板）
            default: () =>
              props.drag
                ? h('div', { style: 'padding:20px; text-align:center;' }, [
                    h(ElIcon, { size: 28 }, { default: () => h(UploadFilled) }),
                    h(
                      'div',
                      {
                        style:
                          'margin-top:8px; color: var(--el-text-color-secondary);',
                      },
                      '将文件拖拽到此处或点击上传',
                    ),
                  ])
                : h(
                    ElButton,
                    { type: 'primary' },
                    { default: () => '点击上传' },
                  ),
            // picture-card 模式的 + 号
            // trigger: () => null,
          },
        );

      return () =>
        h('div', { class: 'formily-x-uploadfiles' }, [
          readPretty.value ? renderReadPretty() : renderUpload(),
          // 图片查看器
          props.previewInViewer && viewerVisible.value
            ? h(ElImageViewer as any, {
                urlList: (fileList.value || [])
                  .filter(isImage)
                  .map((f) => f.url),
                initialIndex: viewerIndex.value,
                onClose: () => (viewerVisible.value = false),
              })
            : null,
        ]);
    },
  }),
  // 把 formily 的 readPretty 映射到 disabled（只读），也把 value 双绑托管给我们内部逻辑
  mapProps({ readOnly: 'disabled' }),
);
