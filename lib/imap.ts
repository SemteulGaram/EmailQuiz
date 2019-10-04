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
    //if (!this._opt) return null;
    const connection: ImapSimple = await imaps.connect({
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
      }});
    await connection.openBox('INBOX');
    const results: Array<imaps.Message> = await connection.search(['UNSEEN'], {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false
    });

    if (results.length > 0) {
      //@ts-ignore
      console.log(results[0][0].body);
      return null;
    }
    return null;
  }
}

/* TODO: parse mail
// Encoding UTF8 ⇢ base64

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

b64EncodeUnicode('✓ à la mode') // "4pyTIMOgIGxhIG1vZGU="
b64EncodeUnicode('\n') // "Cg=="

// Decoding base64 ⇢ UTF8

function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}
*/
