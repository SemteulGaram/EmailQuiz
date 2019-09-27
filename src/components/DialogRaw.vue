<template>
  <div v-if='visible' class="dialog" :style="{ borderTop: titleColor }">
    <span class="title-icon" :class="titleIcon"></span>
    <span class="title">{{ title }}</span>
    <hr/>
    <span class="content">{{ content }}</span>
    <br/>
    <span class="buttons">
      <button class="button-nocolor deny">취소</button>
      <button class="button agree">확인</button>
    </span>
  </div>
</template>

<script>
export default {
  props: [
    'visible',
    'titleColor',
    'titleIcon',
    'title',
    'content'
  ]
}
</script>

<style scoped>
.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  min-width: 240px;
  transform: translate3d(-50%, -50%, 0);
  background-color: #EFF3F7;
  color: #000000;
  border-top: solid 5px #00BFA5;
  padding: .6rem;
  border-radius: 3px;
}

.title-icon {
  font-size: 1.5rem;
}

.title {
  font-weight: 700;
  font-size: 1.5rem;
}

.buttons {
  float: right;
  margin-top: 1em;
}

.button {
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 700;
  background-color: #00695C;
  line-height: 100%;
  color: #FFFFFF;
  border: none;
  padding: .6em;
  border-radius: 3px;
  transition: background-color .5s;
}

.button:focus, .button:hover {
  background-color: #00796B;
}

.button-nocolor {
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 700;
  background-color: transparent;
  line-height: 100%;
  color: #000000;
  border: none;
  padding: .6em;
  border-radius: 3px;
  transition: background-color .5s;
}

.button-nocolor:focus, .button-nocolor:hover {
  background-color: rgba(0, 0, 0, 0.25);
}
</style>
