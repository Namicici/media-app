<style lang="less" scoped>
.active-box {
  border: solid 1px transparent;
  height: 64px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  &-front,
  &-end {
    width: 0;
    background: transparent;
  }
}
.active-box.active {
  border: solid 1px #fff;
}
.active-box-front.active,
.active-box-end.active {
  width: 5px;
  background: #fff;
}
</style>
<template>
  <div class="active-box" :class="{ active }">
    <div class="active-box-front" :class="{ active }"></div>
    <slot></slot>
    <div class="active-box-end" :class="{ active }"></div>
  </div>
</template>
<script lang="ts" setup>
import { defineOptions } from "vue";
defineOptions({
  name: "ActiveBox",
});
defineProps<{
  active: boolean;
}>();
</script>
