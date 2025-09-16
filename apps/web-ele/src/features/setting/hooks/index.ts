import { ref } from 'vue';
import { getSystemSettingsApi, updateSystemSettingsApi } from '@@/setting/apis';

export function useSystemSettings() {
  const settings = ref(null);
  const loading = ref(false);

  const loadSettings = async () => {
    loading.value = true;
    try {
      const response = await getSystemSettingsApi();
      settings.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  const saveSettings = async (data: any) => {
    loading.value = true;
    try {
      await updateSystemSettingsApi(data);
      await loadSettings();
    } finally {
      loading.value = false;
    }
  };

  return {
    settings,
    loading,
    loadSettings,
    saveSettings,
  };
}

// Setting Hooks
export * from './payment';
export * from './saleset';
export * from './storeset';
export * from './template';
