import { ref } from 'vue';
import { getHomeDataApi, getHomeStatsApi } from '@@/home/apis';

export function useHomeData() {
  const homeData = ref(null);
  const loading = ref(false);

  const loadHomeData = async () => {
    loading.value = true;
    try {
      const response = await getHomeDataApi();
      homeData.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    homeData,
    loading,
    loadHomeData,
  };
}

export function useHomeStats() {
  const stats = ref(null);
  const loading = ref(false);

  const loadStats = async () => {
    loading.value = true;
    try {
      const response = await getHomeStatsApi();
      stats.value = response.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    stats,
    loading,
    loadStats,
  };
}
