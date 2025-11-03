<script lang="ts" setup>
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue';

// 导入项目的国际化配置
import { useI18n } from '@igourd/locales';

// 导入国际化方法
import { i18nAddResources, i18nChangeLanguage } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ElMessage } from 'element-plus';

import { upload } from '#/api/upload/index';

import '@wangeditor/editor/dist/css/style.css';
// 引入 css
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:modelValue']);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('');

// 添加编辑器重新渲染的 key
const editorKey = ref(0);

const toolbarConfig = {
  excludeKeys: [
    'uploadVideo', // 排除视频上传菜单
    'insertVideo', // 排除插入视频菜单（如果有的话）
  ],
};
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义上传方法
      async customUpload(file, insertFn) {
        try {
          // 检查文件大小
          if (file.size > 2 * 1024 * 1024) {
            ElMessage.error('文件大小不能超过2MB');
            return false;
          }
          // 检查文件类型
          if (!file.type.startsWith('image/')) {
            ElMessage.error('文件类型必须是图片');
            return false;
          }
          const imageNum = editorRef.value.getElemsByType('image');
          // 每一个富文本最多三个图片
          if (imageNum.length > 2) {
            ElMessage.error('最多只能上传3张图片');
            return;
          }
          // 创建FormData对象
          const formData = new FormData();
          formData.append('file', file);

          // 调用项目的fileUpload API
          const data = await upload(formData);
          // 检查响应结果

          const imageUrl = data.url;
          // 插入图片到编辑器
          // insertFn(图片URL, 图片alt文本, 图片链接href)
          insertFn(imageUrl, data.file_name, imageUrl);
        } catch (error) {
          console.error('图片上传失败:', error);
        }
      },
    },
  },
};
const mode = 'simple'; // 或 'simple'

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 获取当前语言
const { locale } = useI18n();

// 监听语言变化并切换编辑器语言
const switchEditorLanguage = async (lang: string) => {
  // 先销毁现有编辑器实例
  if (editorRef.value) {
    editorRef.value.destroy();
    editorRef.value = null;
  }

  // 切换语言
  switch (lang) {
    case 'en': {
      i18nChangeLanguage('en');
      break;
    }
    case 'fr': {
      // 需要先添加法语语言包，然后切换
      addFrenchLanguage();
      i18nChangeLanguage('fr');
      break;
    }
    case 'zh_CN': {
      i18nChangeLanguage('zh-CN');
      break;
    }
    default: {
      i18nChangeLanguage('zh-CN');
    }
  }

  // 强制重新渲染编辑器组件
  editorKey.value++;

  // 等待下一个 tick 确保组件重新渲染
  await nextTick();
};

// 添加法语语言包
const addFrenchLanguage = () => {
  i18nAddResources('fr', {
    // 工具栏翻译
    editor: {
      more: 'Plus',
      justify: 'Aligner',
      indent: 'Indenter',
      image: 'Image',
      video: 'Vidéo',
      undo: 'Annuler',
      redo: 'Rétablir',
      bold: 'Gras',
      italic: 'Italique',
      underline: 'Souligné',
      strikeThrough: 'Barré',
      fontSize: 'Taille de police',
      fontFamily: 'Police',
      lineHeight: 'Hauteur de ligne',
      textAlign: 'Alignement du texte',
      bulletedList: 'Liste à puces',
      numberedList: 'Liste numérotée',
      insertLink: 'Insérer un lien',
      insertTable: 'Insérer un tableau',
      codeBlock: 'Bloc de code',
      quote: 'Citation',
      headerSelect: 'Titre',
      header1: 'Titre 1',
      header2: 'Titre 2',
      header3: 'Titre 3',
      header4: 'Titre 4',
      header5: 'Titre 5',
    },
    common: {
      ok: 'OK',
      delete: 'Supprimer',
      enter: 'Entrée',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      close: 'Fermer',
    },
    blockQuote: {
      title: 'Citation',
    },
    codeBlock: {
      title: 'Bloc de code',
    },
    color: {
      color: 'Couleur du texte',
      bgColor: 'Couleur de fond',
      default: 'Couleur par défaut',
      clear: 'Effacer la couleur de fond',
    },
    link: {
      insert: 'Insérer un lien',
      text: 'Texte du lien',
      url: 'URL du lien',
      unLink: 'Supprimer le lien',
      edit: 'Modifier le lien',
      validateText: 'Veuillez saisir le texte du lien',
      validateUrl: 'Veuillez saisir une URL valide',
    },
    image: {
      insert: 'Insérer une image',
      upload: 'Télécharger une image',
      alt: 'Texte alternatif',
      href: "Lien de l'image",
      width: 'Largeur',
      height: 'Hauteur',
    },
    table: {
      insert: 'Insérer un tableau',
      addRow: 'Ajouter une ligne',
      addCol: 'Ajouter une colonne',
      deleteRow: 'Supprimer la ligne',
      deleteCol: 'Supprimer la colonne',
      deleteTable: 'Supprimer le tableau',
    },
  });
};

// 组件挂载时设置语言
onMounted(() => {
  switchEditorLanguage(locale.value);
});

// 监听语言变化
watch(
  () => locale.value,
  (newLang) => {
    switchEditorLanguage(newLang);
  },
);
watch(
  () => props.modelValue,
  (newVal) => {
    console.log(newVal);

    emits('update:modelValue', newVal);
  },
);
</script>
<template>
  <!-- 富文本组件 -->
  <div style="border: 1px solid #ccc">
    <!-- 使用 key 强制重新渲染编辑器 -->
    <Toolbar
      :key="editorKey"
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :key="editorKey"
      :model-value="modelValue"
      style="height: 500px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @update:model-value="emits('update:modelValue', $event)"
      @on-created="handleCreated"
    />
  </div>
</template>
