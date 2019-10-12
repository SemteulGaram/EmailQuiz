import fs from 'fs';

import logger from './logger';
import { EmailQuiz } from './internals';
import { SmtpOptions } from './types/SmtpOptions';
import { ImapOptions } from './types/ImapOptions';

export class Config {
  static DEFAULT_CONFIG: string;
  ready: boolean;
  path: string;
  private _v: IConfig;

  constructor (path: string) {
    this.path = path;
    this._v = JSON.parse(Config.DEFAULT_CONFIG);
    this.ready = false;
  }

  async init(): Promise<Config> {
    try {
      this._v = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
      this.ready = true;
      return this;
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.debug('Config not found. Create one...');
        await this._createConfig();
        //logger.info('Config created. Edit "config.json" and restart service');
        //process.exit(0);
        this._v = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
        this.ready = true;
        return this;
      }
      throw err;
    }
  }

  get(key: keyof IConfig): any {
    if (!this.ready) throw new Error('Config must initialize before use.');
    return this._v[key];
  }

  getSmtpOptions(ctx: EmailQuiz): SmtpOptions|null {
    const opt = this.get('smtpOptions');
    try {
      return SmtpOptions.fromConfig(ctx, opt);
    } catch (err) {
      // isn't init value?
      if (typeof opt !== 'object' && Object.keys(opt).length === 0) {
        ctx.logger.warn(`Wrong smtpOptions config (code: ${err})`);
      }
      return null;
    }
  }

  setSmtpOptions(opt: any) {
    this._v['smtpOptions'] = opt;
  }

  getImapOptions(ctx: EmailQuiz): ImapOptions|null {
    const opt = this.get('imapOptions');
    try {
      return ImapOptions.fromConfig(ctx, opt);
    } catch (err) {
      // isn't init value?
      if (typeof opt !== 'object' && Object.keys(opt).length === 0) {
        ctx.logger.warn(`Wrong imapOptions config (code: ${err})`);
      }
      return null;
    }
  }

  // TODO: more strict set Smtp, Imap Options
  setImapOptions(opt: any) {
    this._v['imapOptions'] = opt;
  }


  async save() {
    return await fs.promises.writeFile(this.path, JSON.stringify(this._v), 'utf-8');
  }

  async _createConfig() {
    return await fs.promises.writeFile(this.path, Config.DEFAULT_CONFIG, 'utf-8');
  }
}
Config.DEFAULT_CONFIG = `{"serverPort":7102,"replyName":"EmailQuiz",`
  + `"successSubject":"축하합니다!","failSubject":"안타깝네요!","smtpOptions":{},"imapOptions":{}}`;

export interface IConfig {
  serverPort: number,
  replyName: string,
  successSubject: string,
  failSubject: string,
  smtpOptions: any,
  imapOptions: any
}

export const instance = new Config('./data/config.json');

export class ReplyHtmlConfig {
  path: string;
  html: string;

  constructor(path: string) {
    this.path = path;
    this.html = '';
  }

  async init() {
    try {
      this.html = await fs.promises.readFile(this.path, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.error(`파일을 찾을 수 없습니다. 관리자에게 문의해주세요 [${ this.path }]`);
        return process.exit(2);
      }
      throw err;
    }
  }
}

export const successReplyHtml = new ReplyHtmlConfig('./data/success.html');
export const failReplyHtml = new ReplyHtmlConfig('./data/fail.html');
