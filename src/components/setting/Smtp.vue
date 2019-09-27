<template>
  <setting-server-base title="송신용 서버" :statusMessage="statusMessage" :statusIcon="statusIcon">
    <span class="input-label">SMTP Host</span>
    <br/>
    <input class="text-input" type="text" v-model="optSmtpHost" placeholder="smtp.naver.com"/>
    <br/>
    <span class="input-label">SMTP Port</span>
    <br/>
    <input class="text-input" type="text" v-model="optSmtpPort" placeholder="587"/>
    <br/>
    <span class="input-label">SMTP User</span>
    <br/>
    <input class="text-input" type="text" v-model="optSmtpUser" placeholder="Naver 아이디"/>
    <br/>
    <span class="input-label">SMTP Password</span>
    <br/>
    <input class="password-input" type="password" v-model="optSmtpPass" placeholder="Naver 비밀번호"/>
  </setting-server-base>
</template>
<script>
import SettingServerBase from './ServerBase.vue';

function tryConnectSmtp() {
  io
}

export default {
  components: {
    SettingServerBase
  }, 
  data () {
    return {
      statusMessage: '서버응답 대기 중',
      statusIcon: '',
      optSmtpHost: '',
      optSmtpPort: '',
      optSmtpUser: '',
      optSmtpPass: ''
    }
  }
}
</script>
