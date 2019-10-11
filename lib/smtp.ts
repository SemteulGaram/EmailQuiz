import nodemailer, { Transporter } from 'nodemailer';

import { EmailQuiz } from './internals';
import SMTPPool from 'nodemailer/lib/smtp-pool';

export class EQ_Smtp {
  ctx: EmailQuiz;
  logger: any;
  transporter: Transporter|null;
  opt: SMTPPool.Options|null;
  replyName: string;

  constructor(ctx: EmailQuiz) {
    this.ctx = ctx;
    this.logger = ctx.logger;
    this.transporter = null;
    this.opt = null;
    this.replyName = 'EmailQuiz';
  }

  isReady (): boolean {
    return !!this.transporter;
  }

  updateOptions (opt: SMTPPool.Options): void {
    if (this.transporter) {
      this.logger.smtp(`이미 transport 인스턴스가 있는 상황에서 옵션을 변경했습니다. 서버를 재시작해야 할 수도 있습니다.`);
    }
    this.opt = opt;
  }

  updateReplyName (name: string): void {
    this.replyName = name;
  }

  async startWithOptions(opt: SMTPPool.Options): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      // transporter may close later
    }
    this.opt = opt;
    await this.start();
    return;
  }

  async start (): Promise<boolean> {
    if (!this.opt) return false;
    this.transporter = nodemailer.createTransport(this.opt);
    this.logger.smtp(`서버 트랜스포트 인스턴스 생성됨 [${ this.opt.host }]`);
    return true;
  }

  async stop (): Promise<boolean> {
    if (!this.transporter) return false;
    this.transporter.close();
    this.transporter = null;
    return true;
  }

  async sendMail(to: string, subject: string|undefined, html: string): Promise<any> {
    if (!this.transporter) throw 'ERRNOTREADY';
    if (!this.opt || !this.opt.auth || !this.opt.auth.user) throw 'ERRINVALIDUSER';
    // TODO: server check
    return await this.transporter.sendMail({ to,
      from: `${ this.replyName } <${ this.opt.auth.user }>`, subject, html });
  }
}
