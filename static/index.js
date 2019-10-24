const logger = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
}

class EmailQuizSocket extends EventTarget {
  constructor (ctx) {
    super();

    this.isConnected = false;

    this.socket = new io();
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.dispatchEvent(new CustomEvent('connectStatusChange', {
        detail: { isConnected: true } }));
    });
    // TODO: disconnect, reconnect

    this.socket.on('update', data => {
      this.dispatchEvent(new CustomEvent('update', { detail: data }));
    });
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
    logger.debug('EmailQuiz instance initializing...');
    logger.debug('EmailQuizSocket instance initializing...');
    this.eqs = null;
    this._socketHandleInit();

    logger.debug('dom handle initializing...');
    this.elm = {};
    this.indicateElm = {};
    this._domHandleInit();

    logger.debug('loading bar hiding...');
    this.elm.loading = document.getElementById('loading');
    this.elm.loading.addEventListener('animationend', event => {
      if (this.elm.loading.classList.contains('hide')) {
        this.elm.loading.style.display = 'none';
      }
    });
    this.elm.loading.classList.add('hide');
  }

  _socketHandleInit() {
    this.eqs = new EmailQuizSocket(this);
    this.eqs.addEventListener('update', this._update.bind(this));
  }

  _domHandleInit() {
    this.elm.app = document.getElementById('app');
    this.elm.indicate = this.elm.app.querySelector('.indicate');

    [
      'leftCode',
      'recieveMail',
      'submitMail',
      'answerMail',
      'answerRatio'
    ].forEach(v => {
      this.indicateElm[v]
        = this.elm.indicate.querySelector('.' + camelToDash(v));
    });
  }

  // update indicate elements
  _update(data) {
    const update = data.detail;
    if (!update || !update.indicate) {
      logger.warn('update or update.indicate undefined!');
      logger.warn(data);
    } else {
      Object.keys(update.indicate).forEach(key => {
        if (!this.indicateElm[key]) {
          logger.warn(`update.indicate{} has unknown key [${key}]`);
        } else updateTextNode(this.indicateElm[key], update.indicate[key]);
      });
    }
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
