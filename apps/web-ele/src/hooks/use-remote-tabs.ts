import { nextTick, reactive, ref } from 'vue';
import { useLanguage } from './use-language';

export function useRemoteTableTabs(
  i18nKey: string,
  formKey: string,
  effect?: () => any,
) {
  const tabs = ref<any[]>([]);
  const tabsActiveKey = ref<string>('');
  const tabsOption = reactive({
    formKey,
    defaultActiveValue: '',
  });
  useLanguage(i18nKey).then((res) => {
    tabs.value = res;
    tabsOption.defaultActiveValue = res[0]?.value;
    tabsActiveKey.value = res[0].value;
  });
  nextTick(() => {
    effect?.();
  });
  return { tabs, tabsOption, tabsActiveKey };
}
