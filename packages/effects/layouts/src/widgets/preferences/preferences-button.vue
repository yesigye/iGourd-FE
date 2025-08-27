<script lang="ts" setup>
import { Settings } from '@igourd/icons';

import { IgourdIconButton } from '@igourd-core/shadcn-ui';

import Preferences from './preferences.vue';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>
<template>
  <Preferences @clear-preferences-and-logout="clearPreferencesAndLogout">
    <IgourdIconButton>
      <Settings class="text-foreground size-4" />
    </IgourdIconButton>
  </Preferences>
</template>
