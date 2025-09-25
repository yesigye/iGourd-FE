import { usePreferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

import { languageTranslationEnumsList } from '#/api/common';

export const getLanguageDict = async (groupKey: string): any => {
  const { locale } = usePreferences();
  const userApp = useUserStore().userInfo?.current_login_user_app;
  const dictList = await languageTranslationEnumsList({
    app_id: userApp?.app_id,
    app_key: userApp?.app_key,
    lang_tag: locale.value,
    group_key: groupKey,
  });
  return dictList.map((item) => {
    return {
      value: item.source_value,
      label: item.translations[locale.value],
    };
  });
};
