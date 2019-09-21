import nodemailer, { Transporter } from 'nodemailer';

import { EmailQuiz } from './internals';

export class NodemailerTransport {
  ctx: EmailQuiz;
  transporter: Transporter;

  constructor (ctx: EmailQuiz) {
    this.ctx = ctx;
    this.transporter = nodemailer.createTransport({
      host: ctx.config.get('transportHost'),
      port: ctx.config.get('transportPort'),
      secure: ctx.config.get('transportSecure'),
      auth: {
        user: ctx.config.get('transportUser'),
        pass: ctx.config.get('transportPass')
      },
      tls:{
          ciphers:'SSLv3'
      }
    });
  }

  async test (): Promise<void> {

  }
}
