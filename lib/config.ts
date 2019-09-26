import fs from 'fs';

import logger from './logger';

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
        logger.info('Config created. Edit "config.json" and restart service');
        process.exit(0);
      }
      throw err;
    }
  }

  get(key: keyof IConfig): any {
    if (!this.ready) throw new Error('Config must initialize before use.');
    return this._v[key];
  }

  async _createConfig() {
    return await fs.promises.writeFile(this.path, Config.DEFAULT_CONFIG, 'utf-8');
  }
}
Config.DEFAULT_CONFIG = `{
  "serverPort": 7102,
  "smtpHost": "<SMTP_HOST_ADDRESS>",
  "smtpPort": 587,
  "smtpSecure": true,
  "smtpUser": "<USERNAME>",
  "smtpPass": "<PASSWORD>",
  "imapHost": "<IMAP_HOST_ADDRESS>",
  "imapPort": 993,
  "imapSecure": true,
  "imapTimeout": 3000,
  "imapUser": "<USER>@<IMAP_MAIL_ADDRESS>",
  "imapPass": "<PASSWORD>"
}`;

export interface IConfig {
  serverPort: number,
  smtpHost: string,
  smtpPort: number,
  smtpSecure: boolean,
  smtpUser: string,
  smtpPass: string,
  imapHost: string,
  imapPort: number,
  imapSecure: boolean,
  imapUser: string,
  imapPass: string
}

export const instance = new Config('./data/config.json');
