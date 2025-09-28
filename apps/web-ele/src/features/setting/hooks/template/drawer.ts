import { useIgourdDrawer } from '@igourd/common-ui';

export const useAddTemplateDrawer = () => {
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: '添加打印模板',
    appendToMain: true,
    class: 'w-full',
    async onOpenChange(isOpen) {
      if (isOpen) {
      }
    },
    onClosed() {},
    async onConfirm() {},
  });
  return {
    Drawer,
    drawerApi,
  };
};
