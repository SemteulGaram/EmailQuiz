import { Signale } from 'signale';

import logger from './logger';
import { Config } from './config';
import { EQ_Smtp, EQ_Imap } from './internals';


export class EmailQuiz {
  config: Config;
  logger: Signale
  smtp: EQ_Smtp;
  imap: EQ_Imap;

  constructor(config: Config) {
    this.config = config;
    this.logger = logger;
    this.smtp = new EQ_Smtp(this);
    this.imap = new EQ_Imap(this);
  }

  async test() {
    // TODO: test code
    //await this.transport.sendMail('', '', '');
    return await this.imap.test();
  }
}
