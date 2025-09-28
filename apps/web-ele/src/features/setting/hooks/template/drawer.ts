import { ref } from 'vue';

import { useIgourdDrawer } from '@igourd/common-ui';

export const useAddTemplateDrawer = () => {
  const templateType = ref('');
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: '添加打印模板',
    appendToMain: true,
    class: 'w-full',
    async onOpenChange(isOpen) {
      if (isOpen) {
        const type = drawerApi.getData().templateType;
        templateType.value = type;
      }
    },
    onClosed() {},
    async onConfirm() {},
  });
  return {
    Drawer,
    drawerApi,
    templateType,
  };
};
