<style lang="less" scoped></style>
<template>
  <ActiveBox :active="item.id === selected.id" v-for="item in data" :key="item.id">
    <Snapshot :action="item">{{ item }}</Snapshot>
  </ActiveBox>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
import ActiveBox from "./active-box.vue";
import Snapshot from "./snapshot.vue";
import type { TimelineAction } from "@/views/editor/edit";

defineProps<{
  data: Array<TimelineAction>;
  selected: TimelineAction;
}>();
</script>
