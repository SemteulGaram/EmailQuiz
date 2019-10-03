class EmailQuizSocket extends EventTarget {
  constructor () {
    super();

    this.isConnected = false;

    this.socket = new io();
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.dispatchEvent(new CustomEvent('connectStatusChange', { isConnected: true }));
    });
  }
}

class EmailQuiz {
  constructor () {
    this.eqs = new EmailQuizSocket();

    this.elm = {};
    this.elm.root = document.getElementById('app');
    this.elm.loading = document.getElementById('loading');
    this.elm.loading.addEventListener('animationend', event => {
      if (this.elm.loading.classList.contains('hide')) {
        this.elm.loading.style.display = 'none';
      }
    });
    this.elm.loading.classList.add('hide');
  }

  async start () {

  }
}

window.addEventListener('load', _ => {
  const emailQuiz = new EmailQuiz();
  // TODO: remove this
  window.emailQuiz = emailQuiz;
  emailQuiz.start().catch(err => {
    console.error(err);
    
  });
});