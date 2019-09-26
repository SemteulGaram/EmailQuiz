import { Signale } from 'signale';

import logger from './logger';
import { Config } from './config';
import { EQ_Smtp } from './internals';


export class EmailQuiz {
  config: Config;
  logger: Signale
  transport: EQ_Smtp;

  constructor (config: Config) {
    this.config = config;
    this.logger = logger;
    this.transport = new EQ_Smtp(this);
  }

  async test () {
    // TODO: test code
    //await this.transport.sendMail('', '', '');
  }
}
