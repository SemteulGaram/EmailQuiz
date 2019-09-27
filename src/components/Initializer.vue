<template>
  <div id="initializer" class="card">
    <span class="mdi mdi-email-newsletter icon"></span>
    <h3>EmailQuiz 초기설정화면</h3>
    <hr/>
    <div class="helper">
      <span class="helper-icon" :class="helperIcon"></span>
      <span class="helper-message">{{ helperMessage }}</span>
    </div>
    <div class="form-container">
      <setting-smtp></setting-smtp>
      <setting-imap></setting-imap>
    </div>
    <button v-on:click="submit">시작하기</button>
  </div>
</template>
<script>
import SettingSmtp from './setting/Smtp.vue';
import SettingImap from './setting/Imap.vue';

export default {
  components: {
    SettingSmtp,
    SettingImap
  },
  data() {
    return {
      helperIcon: 'mdi mdi-alert',
      helperMessage: '각각의 송수신에 사용할 이메일 서버를 설정해주세요',
      smtpStatusMessage: '서버응답 대기중',
      smtpStatusIcon: '',
      imapStatusMessage: '서버응답 대기중',
      imapStatusIcon: ''
    }
  },
  methods: {
    submit () {
      this.$emit('showDialog', 'solid 5px #00BFA5', '', 'TITLE', 'Hello, world!');
    }
  }
}
</script>
<style scoped>
#initializer {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  background-color: #00897B;
  color: #FFFFFF;
  text-align: center;
  max-height: 80vh;
  overflow: auto;
}

#initializer > .icon {
  font-size: 5rem;
  line-height: 100%;
}

#initializer > h3 {
  font-weight: 900;
  margin: 0;
}

#initializer > hr {
  border: 1px solid #FFFFFF;
}

#initializer > .helper {
  display: table-cell;
  vertical-align: middle;
}

#initializer > .helper > .helper-icon {
  font-size: 2rem;
  line-height: 100%;
  vertical-align: middle;
}

#initializer > .helper > .helper-message {
  line-height: 100%;
  vertical-align: middle;
}

#initializer input:focus, #initializer input:hover {
  border-bottom: 1px solid #64FFDA;
  background-color: rgba(255, 255, 255, 0.2)
}

#initializer > .form-container {
  display: flex;
  align-items: center;
}

@media screen and (max-width: 767px) {
  #initializer > .form-container {
    display: block;
  }
}

#initializer button {
  font-family: nixgon, sans-serif;
  font-weight: 700;
  background-color: #00695C;
  line-height: 100%;
  color: #FFFFFF;
  border: none;
  padding: 1em;
  border-radius: 5px;
  transition: background-color .5s;

  margin-top: .5em;
}

#initializer button:focus, #initializer button:hover {
  background-color: #00796B;
}
</style>
