<script lang="ts" setup>
import { useIgourdModal, IgourdButton } from '@igourd/common-ui';

const [SlideModal, slideModalApi] = useIgourdModal({
  animationType: 'slide',
});

const [ScaleModal, scaleModalApi] = useIgourdModal({
  animationType: 'scale',
});

function openSlideModal() {
  slideModalApi.open();
}

function openScaleModal() {
  scaleModalApi.open();
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <IgourdButton @click="openSlideModal">滑动动画</IgourdButton>
      <IgourdButton @click="openScaleModal">缩放动画</IgourdButton>
    </div>

    <SlideModal title="滑动动画示例" class="w-[500px]">
      <p>这是使用滑动动画的弹窗，从顶部向下滑动进入。</p>
    </SlideModal>

    <ScaleModal title="缩放动画示例" class="w-[500px]">
      <p>这是使用缩放动画的弹窗，以缩放淡入淡出的方式显示。</p>
    </ScaleModal>
  </div>
</template>
