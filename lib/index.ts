import fs from 'fs';

import logger from './logger';
import { instance as config } from './config';
import { EmailQuiz } from './internals';

async function main () {
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  await config.init();
  const emailQuiz = new EmailQuiz(config);
  await emailQuiz.test();
}

main().catch(err => {
  logger.error(err);
  logger.error('UNEXPECTED ERROR OCCUR')
});
