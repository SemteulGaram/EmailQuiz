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
      <div class="form form-l">
        <div class="status">
          <span class="subtitle">송신용 서버</span>
          <span class="icon">●</span>
          <br/>
          <span class="desc">{{ smtpStatusMessage }}</span>
        </div>
        <input type="text" v-model="optSmtpHost" placeholder="SMTP Host"/>
        <br/>
        <input type="text" v-model="optSmtpPort" placeholder="SMTP Port"/>
        <br/>
        <input type="text" v-model="optSmtpUser" placeholder="SMTP User"/>
        <br/>
        <input type="text" v-model="optSmtpPass" placeholder="SMTP Password"/>
      </div>
      <div class="form form-r">
        <div class="status">
          <span class="subtitle">수신용 서버</span>
          <span class="icon">●</span>
          <br/>
          <span class="desc">{{ lmapStatusMessage }}</span>
        </div>
        <input type="text" v-model="optSmtpHost" placeholder="LMAP Host"/>
        <br/>
        <input type="text" v-model="optSmtpHost" placeholder="LMAP Port"/>
        <br/>
        <input type="text" v-model="optSmtpHost" placeholder="LMAP User"/>
        <br/>
        <input type="text" v-model="optSmtpHost" placeholder="LMAP Password"/>
      </div>
    </div>
    <button>시작하기</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      helperIcon: 'mdi mdi-alert',
      helperMessage: '각각의 송수신에 사용할 이메일 서버를 설정해주세요',
      smtpStatusMessage: '초기화 중',
      lmapStatusMessage: '초기화 중'
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
  }

  #initializer > .icon {
    font-size: 5rem;
    line-height: 100%;
  }

  #initializer > h3 {
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

  #initializer input {
    font-family: 'Nanum Gothic', sans-serif;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #FFFFFF;
    color: #FFFFFF;
    font-weight: 700;
    margin: .2em;
    padding: .5em;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    transition: background-color .5s, border-bottom .5s;
  }

  #initializer input::placeholder {
    color: #CCCCCC;
    opacity: 1;
  }

  #initializer input:focus, #initializer input:hover {
    border-bottom: 1px solid #64FFDA;
    background-color: rgba(255, 255, 255, 0.2)
  }

  #initializer > .form-container {
    display: flex;
    align-items: center;
  }

  #initializer .form {
    background-color: #00796B;
    margin: .6rem;
    padding: .6rem;
    border-radius: 2px;
  }
  
  #initializer button {
    font-family: 'Nanum Gothic', sans-serif;
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

  #initializer .status {
    padding: 5px;
    text-align: left;
  }

  #initializer .status > .subtitle {
    
  }

  #initializer .status > .icon {
    float: right;
  }

  #initializer .status > .desc {
    font-size: .8rem;
    color: #CCCCCC;
  }
</style>
