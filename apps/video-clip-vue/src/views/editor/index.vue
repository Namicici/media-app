<style scoped lang="less">
.video-editor {
  display: grid;
  grid-template-columns: repeat(10, 10%);
  grid-template-rows: repeat(18, 5.55%);
  background-color: var(--background-color);
  height: 100%;
  &-header {
    grid-column: 1 / 11;
    grid-row: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px var(--divisid-line-color);
  }
}
.canvas-editor {
  grid-column: 1 / 8;
  grid-row: 2 / 9;
}
.player-action-area {
  grid-column: 1 / 8;
  grid-row: 9;
  display: flex;
  justify-content: space-between;
  .player-time,
  .player-radio {
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  .player-time {
    text-align: left;
  }
  .played-time {
    color: var(--primary-color);
  }
  .player-radio {
    text-align: right;
  }
}
.timeline-property {
  grid-column: 8 / 11;
  grid-row: 2 / 10;
  border-left: solid 1px var(--divisid-line-color);
}
.timeline-toolbar {
  grid-column: 1 / 11;
  grid-row: 10;
  display: flex;
  justify-content: space-between;
  border-top: solid 1px var(--divisid-line-color);
  .tool-item {
    display: flex;
    justify-items: center;
    justify-content: start;
  }
}
.timeline-cursor {
  grid-column: 1/ 11;
  grid-row: 11;
  border-top: solid 2px var(--divisid-line-color);
}
.track {
  grid-column: 1/ 11;
  height: 64px;
}
</style>
<template>
  <div class="video-editor">
    <div class="video-editor-header">
      <img src="../../assets/images/logo.svg" />
      <div>
        <Button type="primary">导出</Button>
      </div>
    </div>
    <div class="canvas-editor" ref="canvasElem"></div>
    <div class="player-action-area">
      <div class="player-time">
        <span class="played-time">00:00:10</span>
        <span>/</span>
        <span>00:04:00</span>
      </div>
      <div class="player-action">
        <Button @click="handleVideoPause" v-if="isPlaying"><Icon icon="ic:round-pause" /></Button>
        <Button @click="handleVideoPlay" v-else><Icon icon="solar:play-bold" /></Button>
      </div>
      <div class="player-radio">16/9</div>
    </div>
    <section class="timeline-property"></section>
    <div class="timeline-toolbar">
      <section class="tool-item tool-edit">
        <Button> <Icon icon="icomoon-free:undo2" /></Button>
        <Button><Icon icon="icomoon-free:redo2" /></Button>
        <Button><Icon icon="carbon:split-screen" /></Button>
      </section>
      <section class="tool-item tool-add">
        <Button @click="handleAddVideo"><Icon icon="fluent:video-add-20-filled" /></Button>
        <Button><Icon icon="ph:file-audio" /></Button>
        <Button @click="handleAddText"><Icon icon="fluent:text-add-20-filled" /></Button>
      </section>
    </div>
    <TimelineCursor class="timeline-cursor"></TimelineCursor>
    <VideoTrack
      class="track"
      style="grid-row: 12/13"
      v-if="tlVideoData && tlVideoData?.actions?.length > 0"
      @click="selectedTrack = TrackType.Video"
      :data="tlVideoData.actions"
      :selected="selectedTrack === TrackType.Video"
      >{{ tlVideoData }}</VideoTrack
    >
    <TextTrack
      class="track"
      style="grid-row: 14/15"
      v-if="tlTextData && tlTextData?.actions.length > 0"
      :selected="selectedTrack === TrackType.Text"
      @click="selectedTrack = TrackType.Text"
    ></TextTrack>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import TimelineCursor from "@/components/timeline-cursor/index.vue";
import VideoTrack from "@/components/tracks/video-track.vue";
import TextTrack from "@/components/tracks/text-track.vue";
import Button from "@/components/base/button/index.vue";
import Editor, { TrackType } from "./edit.js";

const canvasElem = ref<HTMLCanvasElement | null>(null);
const videoUrl = ref("../static/IMG_4038.mp4");
const selectedTrack = ref<TrackType | null>(null);
const editorIns = ref(new Editor());
const isPlaying = ref<boolean>(false);
onMounted(async () => {
  if (!canvasElem.value) {
    return;
  }
  await editorIns.value.init(canvasElem.value);
});
const tlVideoData = computed(() => {
  return editorIns.value.tlData.find(({ id }) => id === TrackType.Video);
});
const tlTextData = computed(() => {
  return editorIns.value.tlData.find(({ id }) => id === TrackType.Text);
});

function handleVideoPlay() {
  isPlaying.value = !isPlaying.value;
}

function handleVideoPause() {
  isPlaying.value = !isPlaying.value;
}

function handleAddVideo() {
  let elem = document.createElement("input");
  elem.setAttribute("type", "file");
  elem.addEventListener("change", async () => {
    if (elem.files && elem.files?.length >= 1) {
      let file = elem.files[0];
      videoUrl.value = URL.createObjectURL(file);
      editorIns.value.loadVideo(videoUrl.value);
    }
  });
  elem.click();
}
function handleAddText() {
  editorIns.value.loadText();
}
</script>
