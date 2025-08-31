import type { Form, IFormProps } from '@formily/core';
import type { IMiddleware } from '@formily/shared';
import type {
  ElButton as ElButtonProps,
  ElDrawer as ElDrawerProps,
} from 'element-plus';

import type { Component, VNode } from 'vue';

// import { t } from 'element-plus/lib/locale'
import { createApp, defineComponent, onMounted, ref, Teleport } from 'vue';

import { createForm } from '@formily/core';
import { toJS } from '@formily/reactive';
import { observer } from '@formily/reactive-vue';
import { applyMiddleware, isBool, isFn, isNum, isStr } from '@formily/shared';
import { FormProvider, Fragment, h } from '@formily/vue';
import { ElButton, ElDrawer } from 'element-plus';

import {
  createPortalProvider,
  getPortalContext,
  isValidElement,
  loading,
  resolveComponent,
  stylePrefix,
} from '../__builtins__';

type FormDrawerContentProps = { form: Form };

type FormDrawerContent = ((props: FormDrawerContentProps) => VNode) | Component;

type DrawerTitle = (() => VNode) | Component | number | string | VNode;

type IFormDrawerProps = Omit<typeof ElDrawerProps, 'title'> & {
  beforeClose?: (cb: Function) => void;
  cancelButtonProps?: typeof ElButtonProps;
  cancelText?: (() => VNode) | Component | string | VNode;
  footer?: (() => VNode) | Component | null | VNode;
  loadingText?: string;
  okButtonProps?: typeof ElButtonProps;
  okText?: (() => VNode) | Component | string | VNode;
  onCancel?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  onOK?: () => void;
  onOpen?: () => void;
  onOpend?: () => void;
  title?: DrawerTitle;
};

const PORTAL_TARGET_NAME = 'FormDrawerFooter';

const isDrawerTitle = (props: any): props is DrawerTitle => {
  return isNum(props) || isStr(props) || isBool(props) || isValidElement(props);
};

const getDrawerProps = (props: any): IFormDrawerProps => {
  return isDrawerTitle(props)
    ? ({
        title: props,
      } as IFormDrawerProps)
    : props;
};

export interface IFormDrawer {
  forOpen(middleware: IMiddleware<IFormProps>): IFormDrawer;
  forConfirm(middleware: IMiddleware<IFormProps>): IFormDrawer;
  forCancel(middleware: IMiddleware<IFormProps>): IFormDrawer;
  open(props?: IFormProps): Promise<any>;
  close(): void;
}

export interface IFormDrawerComponentProps {
  content: FormDrawerContent;
  resolve: () => any;
  reject: () => any;
}

export function FormDrawer(
  title: DrawerTitle | IFormDrawerProps,
  content: FormDrawerContent,
): IFormDrawer;

export function FormDrawer(
  title: DrawerTitle | IFormDrawerProps,
  id: string | symbol,
  content: FormDrawerContent,
): IFormDrawer;

export function FormDrawer(
  title: DrawerTitle,
  id: string,
  content: FormDrawerContent,
): IFormDrawer;

export function FormDrawer(
  title: DrawerTitle | IFormDrawerProps,
  id: FormDrawerContent | string | symbol,
  content?: FormDrawerContent,
): {
  close: () => void;
  forCancel: (middleware: IMiddleware<Form>) => {
    close: () => void;
    forCancel: (middleware: IMiddleware<Form>) => any;
    forConfirm: (middleware: IMiddleware<Form>) => any;
    forOpen: (middleware: IMiddleware<IFormProps>) => any;
    open: (props: IFormProps) => never;
  };
  forConfirm: (middleware: IMiddleware<Form>) => {
    close: () => void;
    forCancel: (middleware: IMiddleware<Form>) => any;
    forConfirm: (middleware: IMiddleware<Form>) => any;
    forOpen: (middleware: IMiddleware<IFormProps>) => any;
    open: (props: IFormProps) => never;
  };
  forOpen: (middleware: IMiddleware<IFormProps>) => {
    close: () => void;
    forCancel: (middleware: IMiddleware<Form>) => any;
    forConfirm: (middleware: IMiddleware<Form>) => any;
    forOpen: (middleware: IMiddleware<IFormProps>) => any;
    open: (props: IFormProps) => never;
  };
  open: (props: IFormProps) => never;
} {
  if (isFn(id) || isValidElement(id)) {
    content = id as FormDrawerContent;
    id = 'form-drawer';
  }

  const prefixCls = `${stylePrefix}-form-drawer`;
  const env = {
    root: document.createElement('div'),
    form: null,
    promise: null,
    app: null,
    instance: null,
    openMiddlewares: [],
    confirmMiddlewares: [],
    cancelMiddlewares: [],
  };

  document.body.append(env.root);

  const props = getDrawerProps(title);
  const drawerProps = {
    ...props,
    onClosed: () => {
      props.onClosed?.();
      env.app.unmount();
      env.app = null;
      env.instance = null;
      env.root?.parentNode?.removeChild(env.root);
      env.root = undefined;
    },
  };

  const component = observer(
    defineComponent({
      setup() {
        return () =>
          h(
            Fragment,
            {},
            {
              default: () =>
                resolveComponent(content, {
                  form: env.form,
                }),
            },
          );
      },
    }),
  );

  const render = (visible = true, resolve?: () => any, reject?: () => any) => {
    if (!env.instance) {
      const ComponentConstructor = defineComponent({
        props: ['drawerProps'],
        data() {
          return {
            visible: false,
          };
        },
        render() {
          const {
            onClose,
            onClosed,
            onOpen,
            onOpend,
            onOK,
            onCancel,
            title,
            footer,
            okText,
            cancelText,
            okButtonProps,
            cancelButtonProps,
            ...drawerProps
          } = this.drawerProps;
          return h(
            FormProvider,
            {
              form: env.form,
            },
            {
              default: () =>
                h(
                  ElDrawer,
                  {
                    class: `${prefixCls}`,
                    ...drawerProps,
                    modelValue: this.visible,
                    'onUpdate:modelValue': (val) => {
                      this.visible = val;
                    },
                    onClose: () => {
                      onClose?.();
                    },
                    onClosed: () => {
                      onClosed?.();
                    },
                    onOpen: () => {
                      onOpen?.();
                    },
                    onOpened: () => {
                      onOpend?.();
                    },
                  },
                  {
                    default: () => [
                      h(
                        'div',
                        {
                          class: [`${prefixCls}-body`],
                        },
                        [h(component, {}, {})] as any,
                      ),
                      h(
                        'div',
                        {
                          class: [`${prefixCls}-footer`],
                        },
                        {
                          default: () => {
                            const FooterPortalTarget = h(
                              'span',
                              {
                                id: PORTAL_TARGET_NAME,
                              },
                              {},
                            );

                            if (footer === null) {
                              return [null, FooterPortalTarget];
                            } else if (footer) {
                              return [
                                resolveComponent(footer),
                                FooterPortalTarget,
                              ];
                            }

                            return [
                              h(
                                ElButton,
                                {
                                  ...cancelButtonProps,
                                  onClick: (e: MouseEvent) => {
                                    onCancel?.(e);
                                    reject();
                                  },
                                },
                                {
                                  default: () =>
                                    resolveComponent(
                                      cancelText || '取消',
                                      // t('el.popconfirm.cancelButtonText')
                                    ),
                                },
                              ),
                              h(
                                ElButton,
                                {
                                  type: 'primary',
                                  ...okButtonProps,
                                  onClick: (e: MouseEvent) => {
                                    onOK?.(e);
                                    resolve();
                                  },
                                },
                                {
                                  default: () =>
                                    resolveComponent(
                                      okText || '确定',
                                      // t('el.popconfirm.confirmButtonText')
                                    ),
                                },
                              ),
                              FooterPortalTarget,
                            ];
                          },
                        },
                      ),
                    ],
                    title: () =>
                      h('div', {}, { default: () => resolveComponent(title) }),
                  },
                ),
            },
          );
        },
      });
      env.app = createApp(ComponentConstructor, {
        drawerProps,
        parent: getPortalContext(id as string | symbol),
      });
      env.instance = env.app.mount(env.root);
    }
    env.instance.visible = visible;
  };

  const formDrawer = {
    forOpen: (middleware: IMiddleware<IFormProps>) => {
      if (isFn(middleware)) {
        env.openMiddlewares.push(middleware);
      }
      return formDrawer;
    },
    forConfirm: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.confirmMiddlewares.push(middleware);
      }
      return formDrawer;
    },
    forCancel: (middleware: IMiddleware<Form>) => {
      if (isFn(middleware)) {
        env.cancelMiddlewares.push(middleware);
      }
      return formDrawer;
    },
    open: (props: IFormProps) => {
      if (env.promise) return env.promise;

      env.promise = new Promise(async (resolve, reject) => {
        try {
          props = await loading(drawerProps.loadingText, () =>
            applyMiddleware(props, env.openMiddlewares),
          );
          env.form = env.form || createForm(props);
        } catch (error) {
          reject(error);
        }

        render(
          true,
          () => {
            env.form
              .submit(async () => {
                await applyMiddleware(env.form, env.confirmMiddlewares);
                resolve(toJS(env.form.values));
                if (drawerProps.beforeClose) {
                  setTimeout(() => {
                    drawerProps.beforeClose(() => {
                      formDrawer.close();
                    });
                  });
                } else {
                  formDrawer.close();
                }
              })
              .catch(reject);
          },
          async () => {
            await loading(drawerProps.loadingText, () =>
              applyMiddleware(env.form, env.cancelMiddlewares),
            );

            if (drawerProps.beforeClose) {
              drawerProps.beforeClose(() => {
                formDrawer.close();
              });
            } else {
              formDrawer.close();
            }
          },
        );
      });
      return env.promise;
    },
    close: () => {
      if (!env.root) return;
      render(false);
    },
  };

  return formDrawer as never;
}

const FormDrawerFooter = defineComponent({
  name: 'FFormDrawerFooter',
  setup(props, { slots }) {
    const teleportComponent = ref<null | VNode>(null);

    onMounted(() => {
      if (document.querySelector(`#${PORTAL_TARGET_NAME}`)) {
        teleportComponent.value = h(
          Teleport,
          {
            to: `#${PORTAL_TARGET_NAME}`,
          },
          slots,
        );
      }
    });

    return () => teleportComponent.value;
  },
});

FormDrawer.Footer = FormDrawerFooter;
FormDrawer.Portal = createPortalProvider('form-drawer');

export default FormDrawer;
