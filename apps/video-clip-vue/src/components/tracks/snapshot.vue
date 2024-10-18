<style lang="less" scoped>
.snapshot {
  height: 64px;
  width: 100%;
  background: teal;
}
</style>
<template>
  <canvas class="snapshot" ref="snapshotCanvasElem"></canvas>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { TimelineAction } from "@/views/editor/edit";
import { defineProps } from "vue";

const props = defineProps<{
  action: TimelineAction;
}>();

const snapshotCanvasElem = ref();

function drawSnapshots() {
  if (props.action.data) {
    const ctx = snapshotCanvasElem.value.getContext("2d", { alpha: false });
    if (!ctx) {
      return;
    }
    let offset = 0;
    let swidth = snapshotCanvasElem.value.clientWidth / props.action.data.length;
    for (let i = 0; i < props.action.data.length; i++) {
      let vframe: VideoFrame = props.action.data[i].video;
      ctx.drawImage(
        vframe,
        offset,
        0,
        (64 * devicePixelRatio * vframe.displayHeight) / vframe.displayWidth,
        64 * devicePixelRatio,
      );
      offset += swidth;
    }
  }
}
onMounted(() => {
  drawSnapshots();
});
</script>
