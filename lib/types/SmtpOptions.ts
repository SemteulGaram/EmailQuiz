import SMTPPool = require("nodemailer/lib/smtp-pool");
import { EmailQuiz } from "../internals";

export interface ISmtpAuth {
  user: string;
  pass: string;
}

export class SmtpOptions {
  ctx: EmailQuiz;
  logger: any;

  host: string;
  port: number;
  auth: ISmtpAuth;
  
  optionIndex: number;
  isValid: boolean;

  static additionalOptions: Array<any> = [
    {
      secure: true
    },
    {
      secure: false,
      tls:{
        ciphers:'SSLv3'
      }
    },
    {
      secure: false
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
    if (typeof opt.authr.pass !== 'string') throw 'INVALIDPASS';
    this.auth = {
      user: opt.auth.user,
      pass: opt.auth.pass
    };

    this.optionIndex = 0;
    this.isValid = false;
  }

  connectionResult(success: boolean) {
    if (this.isValid) {
      this.logger.warn(`SMTP> Try override additional options index`);
      return;
    }

    if (success) {
      this.logger.smtp(`Find valid additional options (index: ${ this.optionIndex })`);
      this.isValid = true;
    } else {
      this.optionIndex++;
    }
  }

  getOptions(): SMTPPool.Options {
    if (!SmtpOptions.additionalOptions[this.optionIndex]) throw 'ERRADDITIONALOPTIONSEXHAUSTED';

    return Object.assign({
      pool: true,
      host: this.host,
      port: this.port,
      auth: {
        user: this.auth.user,
        pass: this.auth.pass
      }
    }, SmtpOptions.additionalOptions[this.optionIndex]);
  }

  static fromConfig(ctx: EmailQuiz, config: any): SmtpOptions {
    const obj = new SmtpOptions(ctx, config);
    obj.optionIndex = config.optionIndex;
    obj.isValid = config.isValid
    return obj;
  }

  toConfig(): any {
    return {
      host: this.host,
      port: this.port,
      auth: {
        user: this.auth.user,
        pass: this.auth.pass
      },
      optionIndex: this.optionIndex,
      isValid: this.isValid
    }
  }
}