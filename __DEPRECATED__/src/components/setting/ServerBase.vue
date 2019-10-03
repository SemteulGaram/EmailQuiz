<template>
  <div class="server-form">
    <div class="status">
      <span class="title">{{ title }}</span>
      <span class="icon" :class="statusIcon"></span>
      <br/>
      <span class="desc">{{ statusMessage }}</span>
    </div>
    <slot>
      이 컴포넌트의 하위 슬롯이 지정되지 않았습니다.
    </slot>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'statusMessage',
    'statusIcon'
  ]
}
</script>

<style scoped>
.server-form {
  background-color: #00796B;
  margin: .6rem;
  padding: .6rem;
  border-radius: 3px;
  text-align: left;
}

.status {
  padding: 5px;
  text-align: left;
}

.status > .icon {
  float: right;
  width: 1em;
  height: 1em;
  border-radius: .5em;
  background-color: #AAAAAA;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .5) inset;
}

@keyframes statusIconError {
  from {
    background-color: #DD0000;
  }
  to { 
    background-color: #990000;
  }
}

.status > .icon.error {
  animation: statusIconError .5s ease-in-out infinite alternate;
}

.status > .icon.success {
  background-color: #00DD00;
}

.status > .desc {
  font-size: .8rem;
  color: #CCCCCC;
}

.input-label {
  font-size: .6rem;
  margin-left: .6rem;
}

input {
  font-family: nixgon, sans-serif;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #FFFFFF;
  color: #FFFFFF;
  font-weight: 700;
  margin: 0 .2em .2em .2em;
  padding: .2em .5em .5em .5em;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  transition: background-color .5s, border-bottom .5s;
  outline: none;
}

.password-input {
  font-family: sans-serif;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  opacity: 1;
}
</style>
