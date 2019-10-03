import  { Signale } from 'signale';

const options: any = {
  types: {
    debug: {
      badge: '-',
      color: 'gray',
      label: 'Debug',
      logLevel: 'debug'
    },
    info: {
      badge: '*',
      color: 'blue',
      label: 'Info',
      logLevel: 'info'
    },
    warn: {
      badge: '!',
      color: 'yellow',
      label: 'Warning',
      logLevel: 'warn'
    },
    error: {
      badge: '×',
      color: 'red',
      label: 'Error',
      logLevel: 'error'
    },
    smtp: {
      badge: '◁',
      color: 'green',
      label: 'SMTP',
      logLevel: 'info'
    },
    imap: {
      badge: '▷',
      color: 'cyan',
      label: 'IMAP',
      logLevel: 'info'
    }
  }
};

const signale: any = new Signale(options);
const logger = {
  isDebug: false,

  // @ts-ignore
  bind({ isDebug: newDebugMode }) {
    this.isDebug = !!newDebugMode;
    return this;
  },

  _logger(...args: Array<any>) {
    if (!this.isDebug) return;
    signale._logger(...args);
  }
}

export default new Proxy(signale, {
  get: function(obj: any, prop: any): any {
    // @ts-ignore
    if (logger[prop]) return logger[prop];

    return obj[prop];
  }
})
