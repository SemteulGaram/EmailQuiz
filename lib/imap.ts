import imaps, { ImapSimpleOptions, ImapSimple } from 'imap-simple';

import { EmailQuiz } from './internals';

export interface IReceiveMail{
  from: string;
  title: string;
  content: string;
}

export class EQ_Imap {
  ctx: EmailQuiz;
  logger: any;
  _opt: ImapSimpleOptions|null;

  constructor (ctx: EmailQuiz) {
    this.ctx = ctx;
    this.logger = ctx.logger;
    this._opt = null;
  }

  // TODO: remove this
  async test () {
    return imaps.connect({
      imap: {
        //@ts-ignore
        user: process.env.IMAP_USER,
        //@ts-ignore
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST,
        //@ts-ignore
        port: process.env.IMAP_PORT,
        tls: true,
        authTimeout: 10000
      }
    }).then((connection: imaps.ImapSimple) => {
      return connection.openBox('INBOX').then(() => {
        const searchCriteria = [
          'UNSEEN'
        ];

        const fetchOptions = {
          bodies: ['HEADER', 'TEXT'],
          markSeen: false
        };

        return connection.search(searchCriteria, fetchOptions).then(results => {
          const subjects = results.map(res => {
            return res.parts.filter(part => {
              return part.which === 'HEADER';
            })[0].body.subject[0];
          });

          this.logger.imap(subjects);
        })
      });
    }).catch((err: any) => this.logger.error(err));
  }

  updateOptions (options: ImapSimpleOptions): void {
    this._opt = options;
  }

  async hasNewMail (): Promise<boolean> {
    return false;
  }
  
  async getNextMail (): Promise<IReceiveMail|null> {
    if (!this._opt) return null;
    const connection: ImapSimple = await imaps.connect(this._opt);
    await connection.openBox('INBOX');
    const results: Array<imaps.Message> = await connection.search(['UNSEEN'], {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false
    });

    if (results.length > 0) {
      // TODO
      console.log(results[0]);
      return null;
    }
    return null;
  }
}