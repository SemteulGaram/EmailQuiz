import fs from 'fs';

import { config as dotenv } from 'dotenv';
dotenv();

import logger from './logger';
import { instance as config } from './config';
import { EmailQuiz } from './internals';
import { EmailQuizServer } from './server';

async function main () {
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  await config.init();
  const emailQuiz = new EmailQuiz(config);
  //await emailQuiz.test();
  const server = new EmailQuizServer(emailQuiz);
  server.listen();
  await emailQuiz.test();
}

main().catch(err => {
  logger.error(err);
  logger.error('UNEXPECTED ERROR OCCUR');
});
