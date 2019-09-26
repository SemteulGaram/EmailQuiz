<template>
  <header>
    <span class="mdi mdi-mailbox-outline icon" v-on:click="gotoHome"></span>
  </header>
</template>

<script>
export default {
  methods: {
    gotoHome() {
      console.log('TODO go home');
      // TODO
    }
  }
}
</script>

<style scoped>
  header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    background-color: #00695C;
    color: #FFFFFF;
    font-size: 3rem;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
  }

  header > .icon {
    line-height: 100%;
    margin-left: 1rem;
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
</style>
