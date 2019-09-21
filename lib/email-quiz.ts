import nodemailer from 'nodemailer';
import { Signale } from 'signale';

import logger from './logger';
import { Config } from './config';
import { NodemailerTransport } from './internals';


export class EmailQuiz {
  config: Config;
  logger: Signale
  transport: NodemailerTransport;

  constructor (config: Config) {
    this.config = config;
    this.logger = logger;
    this.transport = new NodemailerTransport(this);
  }

  async test () {
    // TODO: test code
    await this.transport.test();
  }
}
