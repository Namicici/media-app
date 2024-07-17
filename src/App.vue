<script setup lang="ts">
import {ref} from 'vue'

const videoUrl = ref('/static/IMG_4038.mp4')

function  handleSelectSourceVideo() {
  let elem = document.createElement('input')
  elem.setAttribute('type', 'file')
  elem.addEventListener('change', () => {
    if (elem.files && elem.files?.length >= 1) {
      let file = elem.files[0]
      videoUrl.value = URL.createObjectURL(file)
    }
  })
  elem.click()
}

</script>

<template>
  <section class="source-section">
    <section class="source-video">
      <h1>原视频</h1>
      <button @click="handleSelectSourceVideo">选择视频</button>
      <video controls :src="videoUrl">
      </video>
    </section>
    <section class="caption">
      <h1>字幕</h1>
    </section>
  </section>
  <section class="new-video">
    <h1>合成视频</h1>
    <video controls :src="videoUrl">
      <track kind="subtitles" src="/static/sample.vtt"></track>
    </video>
  </section>
</template>

<style scoped lang="less">
.source-section {
  display: flex;
  justify-content: space-between;
}
.source-video {
  width: 50%;
}
.caption {
  width: 50%;
}
video {
  margin-top: 8px;
  display: block;
  width:100%;
}

::cue {
  color: red;
  background: transparent;
}
</style>
