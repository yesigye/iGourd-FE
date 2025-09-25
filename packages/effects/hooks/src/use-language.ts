import { usePreferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

export function useProviderLanguage(
  languageTranslationEnumsList: (data: any) => Promise<any>,
) {
  const { locale } = usePreferences();
  const userApp = useUserStore().userInfo?.current_login_user_app;
  return async function (groupKey: string) {
    const dictList = await languageTranslationEnumsList({
      app_id: userApp?.app_id,
      app_key: userApp?.app_key,
      lang_tag: locale.value,
      group_key: groupKey,
    });
    return dictList.map((item: any) => {
      return {
        value: item.source_value,
        label: item.translations[locale.value],
      };
    });
  };
}
