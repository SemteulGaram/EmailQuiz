import fs from 'fs';
import { inspect } from 'util';

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
const logger: any = {
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

const stream = fs.createWriteStream('log.txt', { flags: 'a'});
const mLogger = {
  _base: (type: string, ...args: any[]) => {
    const log = '[' + type.toUpperCase() + '] ' + args.map(v => { return (typeof v === 'object' && v !== null) ? inspect(v) : v }).join(' ');
    console.log(log);
    stream.write(log + '\n');
  },
  debug: (...args: any[]) => { mLogger._base('debug', ...args); },
  info: (...args: any[]) => { mLogger._base('info', ...args); },
  warn: (...args: any[]) => { mLogger._base('warn', ...args); },
  error: (...args: any[]) => { mLogger._base('error', ...args); },
  smtp: (...args: any[]) => { mLogger._base('smtp', ...args); },
  imap: (...args: any[]) => { mLogger._base('imap', ...args); }
}

export default mLogger;
/*
export default new Proxy(signale, {
  get: function(obj: any, prop: any): any {
    if (logger[prop]) return logger[prop];

    return obj[prop];
  }
})
*/
