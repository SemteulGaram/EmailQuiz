import nodemailer, { Transporter } from 'nodemailer';

import { EmailQuiz } from './internals';
import SMTPPool from 'nodemailer/lib/smtp-pool';

export class EQ_Smtp {
  ctx: EmailQuiz;
  logger: any;
  transporter: Transporter|null;
  opt: SMTPPool.Options|null;

  constructor(ctx: EmailQuiz) {
    this.ctx = ctx;
    this.logger = ctx.logger;
    this.transporter = null;
    this.opt = null;
  }

  async isReady () {
    return !!this.transporter;
  }

  updateOptions (opt: SMTPPool.Options) {
    if (this.transporter) {
      this.logger.smtp(`이미 transport 인스턴스가 있는 상황에서 옵션을 변경했습니다. 서버를 재시작해야 할 수도 있습니다.`);
    }
    this.opt = opt;
  }

  async startWithOptions(opt: SMTPPool.Options) {
    if (this.transporter) {
      this.transporter.close();
      // transporter may close later
    }
    this.opt = opt;
    return await this.start();
  }

  async start () {
    if (!this.opt) throw 'ERROPTIONSNOTSET';
    this.transporter = nodemailer.createTransport(this.opt);
    this.logger.smtp(`서버 트랜스포트 인스턴스 생성됨 [${ this.opt.host }]`);
  }

  async stop () {
    if (!this.transporter) throw 'ERRNOTSTARTED';
    this.transporter.close();
    this.transporter = null;
  }

  async sendMail(to: string, from: string, html: string): Promise<any> {
    if (!this.transporter) throw 'ERRNOTREADY';
    return await this.transporter.sendMail({ to, from, html });
  }
}
