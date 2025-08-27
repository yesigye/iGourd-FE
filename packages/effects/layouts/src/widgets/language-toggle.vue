<script setup lang="ts">
import type { SupportedLanguagesType } from '@igourd/locales';

import { SUPPORT_LANGUAGES } from '@igourd/constants';
import { Languages } from '@igourd/icons';
import { loadLocaleMessages } from '@igourd/locales';
import { preferences, updatePreferences } from '@igourd/preferences';

import { IgourdDropdownRadioMenu, IgourdIconButton } from '@igourd-core/shadcn-ui';

defineOptions({
  name: 'LanguageToggle',
});

async function handleUpdate(value: string | undefined) {
  if (!value) return;
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <IgourdDropdownRadioMenu
      :menus="SUPPORT_LANGUAGES"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <IgourdIconButton>
        <Languages class="text-foreground size-4" />
      </IgourdIconButton>
    </IgourdDropdownRadioMenu>
  </div>
</template>
