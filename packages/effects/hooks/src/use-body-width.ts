import { onMounted, onUnmounted, ref } from 'vue';

export const useBodyWidth = () => {
  const bodyWidth = ref(0);

  const resizeFn = () => {
    const el = document.body;
    bodyWidth.value = el.clientWidth;
  };

  onMounted(() => {
    const el = document.body;

    bodyWidth.value = el.clientWidth;

    window.addEventListener('resize', resizeFn);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resizeFn);
  });
  return {
    bodyWidth,
  };
};
