import SMTPPool = require("nodemailer/lib/smtp-pool");

export class SmtpOptions {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;

  constructor (opt: any) {
    if (typeof opt !== 'object' || opt === null) throw 'INVALIDOBJ';

    if (typeof opt.host !== 'string') throw 'INVALIDHOST';
    this.host = opt.host;

    if (opt.port != parseInt(opt.port) || opt.port < 0) throw 'INVALIDPORT';
    this.port = parseInt(opt.port);

    this.secure = !!opt.secure;

    if (typeof opt.user !== 'string') throw 'INVALIDUSER';
    this.user = opt.user;

    if (typeof opt.pass !== 'string') throw 'INVALIDPASS';
    this.pass = opt.pass;

    
    //if (typeof opt.type !== 'number' && typeof opt.type !== 'undefined') throw 'INVALIDTYPE'
  }

  toOptions(): SMTPPool.Options {
    return {
      pool: true,
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.pass
      }
    }
  }
}