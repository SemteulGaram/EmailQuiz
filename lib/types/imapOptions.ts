import { ImapSimpleOptions } from "imap-simple";

import { EmailQuiz } from "../internals";

export class ImapOptions {
  ctx: EmailQuiz;
  logger: any;

  host: string;
  port: number;
  user: string;
  password: string;
  
  optionIndex: number;
  isValid: boolean;

  static additionalOptions: Array<any> = [
    {
      tls: true
    },
    {
      tls: false
    }
  ];

  constructor (ctx: EmailQuiz, opt: any) {
    this.ctx = ctx;
    this.logger = ctx.logger;

    if (typeof opt !== 'object' || opt === null) throw 'INVALIDOBJ';

    if (typeof opt.host !== 'string') throw 'INVALIDHOST';
    this.host = opt.host;

    if (opt.port != parseInt(opt.port) || opt.port < 0) throw 'INVALIDPORT';
    this.port = parseInt(opt.port);

    if (typeof opt.auth.user !== 'string') throw 'INVALIDUSER';
    this.user = opt.user;

    if (typeof opt.authr.pass !== 'string') throw 'INVALIDPASS';
    this.password = opt.password;

    this.optionIndex = 0;
    this.isValid = false;
  }

  connectionResult(success: boolean) {
    if (this.isValid) {
      this.logger.warn(`IMAP> Try override additional options index`);
      return;
    }

    if (success) {
      this.logger.imap(`Find valid additional options (index: ${ this.optionIndex })`);
      this.isValid = true;
    } else {
      this.optionIndex++;
    }
  }

  getOptions(): ImapSimpleOptions {
    if (!ImapOptions.additionalOptions[this.optionIndex]) throw 'ERRADDITIONALOPTIONSEXHAUSTED';

    return Object.assign({
      pool: true,
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password
    }, ImapOptions.additionalOptions[this.optionIndex]);
  }

  static fromConfig(ctx: EmailQuiz, config: any): ImapOptions {
    const obj = new ImapOptions(ctx, config);
    obj.optionIndex = config.optionIndex;
    obj.isValid = config.isValid
    return obj;
  }

  toConfig(): any {
    return {
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      optionIndex: this.optionIndex,
      isValid: this.isValid
    }
  }
}
