import { useProviderLanguage } from '@igourd/hooks';

import { languageTranslationEnumsList } from '#/api/common';

export const useLanguage = useProviderLanguage(languageTranslationEnumsList);
