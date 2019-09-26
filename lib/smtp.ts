import nodemailer, { Transporter } from 'nodemailer';

import { EmailQuiz } from './internals';

export class EQ_Smtp {
  ctx: EmailQuiz;
  transporter: Transporter;

  constructor (ctx: EmailQuiz) {
    this.ctx = ctx;
    this.transporter = nodemailer.createTransport({
      host: ctx.config.get('smtpHost'),
      port: ctx.config.get('smtpPort'),
      secure: ctx.config.get('smtpSecure'),
      auth: {
        user: ctx.config.get('smtpUser'),
        pass: ctx.config.get('smtpPass')
      },
      tls:{
          ciphers:'SSLv3'
      }
    });
  }

  static autoConfigs(type: number): any {
    return [
      {
        secure: true,
      }, {
        secure: false,
        tls:{
          ciphers:'SSLv3'
        }
      }
    ]
  }

  _getConfigFromCtx () {
    return {
      host: this.ctx.config.get('smtpHost'),
      port: this.ctx.config.get('smtpPort'),
      secure: this.ctx.config.get('smtpSecure'),
      auth: {
        user: this.ctx.config.get('smtpUser'),
        pass: this.ctx.config.get('smtpPass')
      }
    }
  }

  async sendMail (to: string, from: string, html: string): Promise<any> {
    return await this.transporter.sendMail({ to, from, html });
  }
}
