<template>
  <setting-server-base title="수신용 서버" :statusMessage="statusMessage" :statusIcon="statusIcon">
    <span class="input-label">IMAP Host</span>
    <br/>
    <input class="text-input" type="text" v-model="optImapHost" placeholder="imap.naver.com"/>
    <br/>
    <span class="input-label">IMAP Port</span>
    <br/>
    <input class="text-input" type="text" v-model="optImapPort" placeholder="993"/>
    <br/>
    <span class="input-label">IMAP User</span>
    <br/>
    <input class="text-input" type="text" v-model="optImapUser" placeholder="Naver 아이디"/>
    <br/>
    <span class="input-label">IMAP Password</span>
    <br/>
    <input class="password-input" type="password" v-model="optImapPass" placeholder="Naver 비번"/>
  </setting-server-base>
</template>
<script>
import SettingServerBase from './ServerBase.vue';

export default {
  components: {
    SettingServerBase
  }, 
  data () {
    return {
      statusMessage: '서버응답 대기 중',
      statusIcon: '',
      optImapHost: '',
      optImapPort: '',
      optImapUser: '',
      optImapPass: ''
    }
  }
}
</script>
