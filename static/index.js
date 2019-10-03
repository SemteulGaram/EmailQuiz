const logger = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
}

class EmailQuizSocket extends EventTarget {
  constructor () {
    super();

    this.isConnected = false;

    this.socket = new io();
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.dispatchEvent(new CustomEvent('connectStatusChange', { isConnected: true }));
    });
    // TODO: disconnect, reconnect
  }

  smtpConnect(opt) {
    return new Promise((resolve, reject) => {
      this.socket.once('smtpConnectResponse', res => {
        if (typeof res !== 'object' || res === null) {
          logger.error('Invalid smtpConnectResponse:', res);
          return;
        }

        if (res.success) {
          // TODO
          logger.debug('TODO: success');
        } else {
          // TODO
          logger.success('TODO: fail');
        }

        // TODO: timeout
        // TODO: duplicated request
      });

      this.socket.emit('smtpConnect', opt);
    });
  }

  imapConnect(opt) {
    return new Promise((resolve, reject) => {
      this.socket.once('imapConnectResponse', res => {
        if (typeof res !== 'object' || res === null) {
          logger.error('Invalid imapConnectResponse:', res);
          return;
        }

        if (res.success) {
          // TODO
          logger.debug('TODO: success');
        } else {
          // TODO
          logger.success('TODO: fail');
        }

        // TODO: timeout
        // TODO: duplicated request
      });

      this.socket.emit('imapConnect', opt);
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

  start () {
    return new Promise((resolve, reject) => {

    });
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