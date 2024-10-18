<style lang="less" scoped>
canvas {
  width: 100%;
  height: 32px;
}
</style>
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from "vue";
import TimelineCursor from "./timeline-cursor.ts";
defineOptions({
  name: "TimelineCursor",
});
const props = defineProps({
  config: { type: Object, default: () => {} },
});
const canvasRef = ref<HTMLCanvasElement | null>(null);

let timelineInstance: TimelineCursor | null = null;
function instance() {
  if (timelineInstance) {
    timelineInstance = null;
  }
  timelineInstance = new TimelineCursor({
    ...Object.assign({}, props.config, {
      canvasWidth: canvasRef.value?.clientWidth,
    }),
    el: canvasRef.value,
  });
}
onMounted(() => {
  instance();
});
watch(
  props.config,
  () => {
    instance();
  },
  { deep: true },
);
</script>
