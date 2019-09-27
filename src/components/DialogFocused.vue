<template>
  <div v-if='visible' class='dialog-container'>
    <dialog-raw :visible="visible" :titleColor="titleColor" :titleIcon="titleIcon" :title="title" :content="content"></dialog-raw>
  </div>
</template>

<script>
import DialogRaw from './DialogRaw.vue';

export default {
  props: [
    'visible',
    'titleColor',
    'titleIcon',
    'title',
    'content'
  ],
  components: {
    DialogRaw
  }
}
</script>

<style scoped>
.dialog-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 8;
  background-color: rgba(0, 0, 0, 0.25);
}
</style>