import SMTPPool = require("nodemailer/lib/smtp-pool");

export interface ISmtpAuth {
  user: string;
  pass: string;
}

export enum AdditionalOptionsTryStatus {
  UNKNOWN,
  FAIL,
  SUCCESS
};

export class SmtpOptions {
  host: string;
  port: number;
  auth: ISmtpAuth;
  additionalOptionsTry: Array<AdditionalOptionsTryStatus>;
  exhausted: boolean;
  cursor: number;

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

  constructor (opt: any) {
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

    this.additionalOptionsTry = []
    SmtpOptions.additionalOptions.forEach((v, i) => {
      this.additionalOptionsTry[i] = AdditionalOptionsTryStatus.UNKNOWN;
    })

    this.exhausted = false;
    this.cursor = 0;
  }

  setCurrentOptionStatus(status: AdditionalOptionsTryStatus) {
    this.additionalOptionsTry[this.cursor] = status;
    if (status = AdditionalOptionsTryStatus.FAIL) {
      this.cursor++;
    }
  }

  getOptions(): SMTPPool.Options {
    if (!SmtpOptions.additionalOptions[this.cursor]) throw 'ERRADDITIONALOPTIONSEXHAUSTED';

    return Object.assign({
      pool: true,
      host: this.host,
      port: this.port,
      auth: {
        user: this.auth.user,
        pass: this.auth.pass
      }
    }, SmtpOptions.additionalOptions[this.cursor]);
  }

  static fromConfig(config: any): SmtpOptions {
    const obj = new SmtpOptions(config);
    obj.additionalOptionsTry = config.additionalOptionsTry;
    obj.exhausted = config.exhausted;
    obj.cursor = config.cursor;
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
      additionalOptionsTry: this.additionalOptionsTry,
      exhausted: this.exhausted,
      cursor: this.cursor
    }
  }
  // TODO: clean additionalOptions
}