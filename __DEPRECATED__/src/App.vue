<template>
  <div id="app" :class="{ ondialog: isOndialog }">
    <div id="page">
      <common-header></common-header>
      <initializer v-on:showDialog="showDialog"></initializer>
    </div>
    <dialog-focused :visible="isOndialog" :titleColor="dialogTitleColor" :titleIcon="dialogTitleIcon" :title="dialogTitle" :content="dialogContent"></dialog-focused>
  </div>
</template>

<script>
import CommonHeader from './components/CommonHeader.vue';
import Initializer from './components/Initializer.vue';
import DialogFocused from './components/DialogFocused.vue';
import store from './store.js';

export default {
  components: {
    CommonHeader,
    Initializer,
    DialogFocused
  },
  data () {
    return {
      isOndialog: false,
      dialogTitleColor: '',
      dialogTitleIcon: '',
      dialogTitle: '',
      dialogContent: ''
    }
  },
  methods: {
    showDialog(color, icon, title, content) {
      this.isOndialog = true;
      this.dialogTitleColor = color;
      this.dialogTitleIcon = icon;
      this.dialogTitle = title;
      this.dialogContent = content;
    }
  }
}
</script>

<style>
@font-face {
  font-family: nixgon;
  src: url('assets/NIXGONFONTS_L_2.0.otf');
}

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: nixgon, sans-serif;
  margin: 0;
}

#page {
  background-color: #EFF3F7;
  color: #000000;
  width: 100%;
  height: calc(100% - 64px);
  padding-top: 64px;
  overflow: auto;
}

#app.ondialog > #page {
  filter: blur(5px);
}

.card {
  padding: .5em;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}
</style>
