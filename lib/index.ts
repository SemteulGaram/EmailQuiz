import fs from 'fs';

import { config as dotenv } from 'dotenv';
dotenv();

import logger from './logger';
import { instance as config, successReplyHtml, failReplyHtml } from './config';
import { EmailQuiz } from './internals';
import { EmailQuizServer } from './server';
import { noopReporter } from './types/IReporter';

async function main () {
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  await config.init();
  await successReplyHtml.init();
  await failReplyHtml.init();
  const emailQuiz = new EmailQuiz(config, {
    successReplyHtml,
    failReplyHtml
  });
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
  emailQuiz.smtp.updateOptions({
    pool: true,
    host: <string>process.env.SMTP_HOST,
    port: <number>parseInt(''+process.env.SMTP_PORT),
    auth: {
      user: <string>process.env.SMTP_USER,
      pass: <string>process.env.SMTP_PASS
    }
  });
  await emailQuiz.smtp.start();
  let submissions = await emailQuiz.getUnreadSubmissions(noopReporter);
  /*submissions = submissions.map(v => {
    if (v.body.length > 50) {
      v.body = v.body.substring(0, 50);
    }
    return v;
  });*/
  submissions.forEach(async v => {
    await emailQuiz.sendSuccessMail(v.from, {
      // TODO: CODE
      code: 'TODO: CODE'
    });
  })
  logger.info(submissions);
}

main().catch(err => {
  logger.error(err);
  logger.error('UNEXPECTED ERROR OCCUR');
});
