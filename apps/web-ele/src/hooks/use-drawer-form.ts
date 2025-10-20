/**
 * 整体drawer表单
 */
/**
 * 导入抽屉组件和表单相关的类型定义
 * DrawerApiOptions: 抽屉组件的配置选项类型
 * IGourdFormProps: 表单组件的属性类型
 */
import type { DrawerApiOptions, IGourdFormProps } from '@igourd/common-ui';

/**
 * 导入服务类型定义
 */
import type { Service } from '.';

/**
 * 导入扩展的VxeGrid API类型
 * 用于表格组件的操作和控制
 */
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';

/**
 * 导入Vue的inject函数
 * 用于在组件中注入依赖
 */
import { inject } from 'vue';

/**
 * 导入抽屉和表单相关的钩子函数
 */
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';

/**
 * 抽屉表单选项接口定义
 * 包含抽屉配置和表单配置
 */
interface DrawerFormOptions {
  /** 抽屉组件的配置选项 */
  drawerOptions: DrawerApiOptions;
  /** 表单组件的配置选项 */
  formOptions: IGourdFormProps<object>;
}

/**
 * 抽屉表单钩子函数
 * 将抽屉组件和表单组件结合使用，提供一个在抽屉中显示的表单
 *
 * @param options - 抽屉表单的配置选项
 * @returns 返回抽屉组件、表单组件及其API
 */
export function useDrawerForm(options: DrawerFormOptions) {
  const handleSubmit = options.formOptions.handleSubmit;
  const { gridApi, service } = inject<{
    gridApi: ExtendedVxeGridApi;
    service: Partial<Service<unknown, unknown>>;
  }>(Symbol.for('PageGrid'), {} as unknown as any);

  // 保存原始的确认回调函数
  const onConfirm = options.drawerOptions.onConfirm;

  // 重写抽屉的确认回调函数
  options.drawerOptions.onConfirm = async function () {
    // 如果存在原始确认回调，则先执行
    if (onConfirm) {
      return await onConfirm();
    }

    // 验证表单数据
    await formAPI.validate().catch((error: any) => {
      document
        .querySelector('.formily-element-plus-form-item-error-help')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });

      throw error;
    });

    // 锁定抽屉，防止重复提交
    drawerApi.lock();

    try {
      if (handleSubmit) {
        await handleSubmit(formAPI.values);
      } else {
        await (Reflect.has(formAPI.values, 'id')
          ? service.update?.(formAPI.values)
          : service.create?.(formAPI.values));
        gridApi?.reload();
        drawerApi.close();
      }
    } finally {
      drawerApi.unlock();
    }
    gridApi?.reload();
    drawerApi.unlock();
    drawerApi.close();
  };

  // 如果没有提供打开状态变化回调，则添加默认处理
  if (!options.drawerOptions.onOpenChange) {
    options.drawerOptions.onOpenChange = function (isOpen) {
      if (isOpen) {
        // 打开抽屉时，设置表单的初始值
        formAPI.setValues(drawerApi.getData());
      } else {
        // 关闭抽屉时，重置表单
        formAPI.values = {};
      }
    };
  }

  // 创建抽屉组件和API
  const [Drawer, drawerApi] = useIgourdDrawer(options.drawerOptions);

  // 创建表单组件和API
  const { Form, formAPI } = useIgourdForm(options.formOptions);

  // 返回抽屉组件、表单组件及其API
  return { Drawer, Form, drawerApi, formAPI };
}
