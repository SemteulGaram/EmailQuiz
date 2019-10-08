import fs from 'fs';

import { config as dotenv } from 'dotenv';
dotenv();

import logger from './logger';
import { instance as config } from './config';
import { EmailQuiz } from './internals';
import { EmailQuizServer } from './server';
import { noopReporter } from './types/IReporter';

async function main () {
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  await config.init();
  const emailQuiz = new EmailQuiz(config);
  //await emailQuiz.test();
  const server = new EmailQuizServer(emailQuiz);
  server.listen();
  emailQuiz.imap.updateOptions({
    imap: {
      user: <string>process.env.IMAP_USER,
      password: <string>process.env.IMAP_PASS,
      host: <string>process.env.IMAP_HOST,
      port: <number><unknown>process.env.IMAP_PORT,
      tls: true,
      authTimeout: 5000
    }
  });
  const submissions = await emailQuiz.getUnreadSubmissions(noopReporter);
  console.log(submissions);
}

main().catch(err => {
  logger.error(err);
  logger.error('UNEXPECTED ERROR OCCUR');
});
