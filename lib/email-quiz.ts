import imaps from 'imap-simple';
import mailparser from 'mailparser';

import logger from './logger';
import { Config } from './config';
import { EQ_Smtp, EQ_Imap } from './internals';

import { IReporter } from './types/IReporter';
import { ISimpleParsedEmail } from './types/ISimpleParsedEmail';

export class EmailQuiz {
  config: Config;
  logger: any;
  smtp: EQ_Smtp;
  imap: EQ_Imap;

  constructor(config: Config) {
    this.config = config;
    this.logger = logger;
    this.smtp = new EQ_Smtp(this);
    this.imap = new EQ_Imap(this);
  }

  async sendSuccessMail(to: string, options: any): Promise<boolean> {
    this.smtp.sendMail(to, 'subject', `<p>Another Test</p>`);
    return true;
  }

  async getUnreadSubmissions(reporter: IReporter): Promise<ISimpleParsedEmail[]> {
    // Initialize
    this.logger.info('읽지 않은 정답들 불러오는 중');
    reporter.info('읽지 않은 정답들 불러오는 중');
    if (!this.imap.isReady()) throw 'ERRIMAPNOTREADY';

    // Get message from IMAP server
    const msgs: Array<imaps.Message>|null = await this.imap.getAllUnseenMail();
    if (msgs === null) {
      // Will not happen
      this.logger.error('IMAP 클라이언트가 null을 반환. 있을 수 없는 일');
      reporter.error('IMAP 클라이언트가 null을 반환. 있을 수 없는 일');
      throw 'ERRIMAPNULL';
    }
    if (msgs.length === 0) {
      this.logger.info('읽지 않은 메일이 없으므로 답장할 메시지가 없습니다.');
      reporter.info('읽지 않은 메일이 없으므로 답장할 메시지가 없습니다.');
      return [];
    }
    this.logger.info(`읽지 않은 총 메일 수: [${ msgs.length }]`);
    reporter.info(`읽지 않은 총 메일 수: [${ msgs.length }]`);

    // Parse target message
    const rawSubmissions = msgs.filter((msg: imaps.Message) => {
      return (!!(<string>msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === 'HEADER';
        // TODO: match string
      })[0].body.subject[0]).match('제출'));
    });
    this.logger.info(`새로운 정답 제출자 수: [${ rawSubmissions.length }]`);
    reporter.info(`새로운 정답 제출자 수: [${ rawSubmissions.length }]`);
    if (rawSubmissions.length === 0) {
      return [];
    }

    // Check answer
    /*
    const submissions: ISimpleParsedEmail[] = rawSubmissions.map((msg: imaps.Message) => {
      // Parse header
      let rawHeader: any = msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === 'HEADER';
      })[0].body;
      let header: any = {};
      Object.keys(rawHeader).forEach((key: string) => {
        header[key.toLowerCase()] = rawHeader[key];
      });

      // Parse body
      let body: string = msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === 'TEXT';
      })[0].body;
      body = body.replace(/\r\n/g, '\n');

      // Parse from
      let from: string;
      if (header['from']) {
        if (header['from'].length !== 1) {
          this.logger.warn(`Unexpected: header.from[] length is not 1 [${ header['from'] }]`);
          this.logger.warn('DUMP:', header, body);
          from = '';
        } else {
          from = header['from'][0];
        }
      } else {
        this.logger.warn('Unexpected: header["from"] empty');
        this.logger.warn('DUMP:', header, body);
        from = '';
      }

      // Parse subject
      let subject: string;
      if (header['subject']) {
        subject = header['subject'].join('\n');
      } else {
        subject = '';
      }

      // Parse content-type
      let contentType: string[];
      if (header['content-type']) {
        if (header['content-type'].length !== 1) {
          this.logger.warn(`Unexpected: header.content-type[] length is not 1 [${ header['content-type'].length }]`);
          this.logger.warn('DUMP:', header, body);
          contentType = ['UNKNOWN'];
        } else {
          contentType = header['content-type'][0].split(';').map((v: string) => v.trim());
        }
      } else {
        contentType = ['UNDEFINED'];
      }

      // Parse is root body is base64
      // TODO: encoding
      let isBase64: boolean = header['content-transfer-encoding']
        && !!('' + header['content-transfer-encoding']).match(/(?:^|\W)base64(?:$|\W)/i);

      // Create result object
      const result: ISimpleParsedEmail = {
        subject,
        from,
        body: '',
        contentType: ''
      };

      switch (contentType[0].toLowerCase()) {
        default:
          this.logger.warn(`Unexpected: header.content-type[0]: [${ contentType[0] }]`);
          this.logger.warn('DUMP:', header, body);
          result.contentType = 'UNKNOWN';
          result.body = body;
        break; case 'text/plain':
          result.contentType = 'text/plain';
          result.body = body;
        break; case 'text/html':
          result.contentType = 'text/html';
          result.body = body;
        break; case 'multipart/alternative':
        case 'multipart/mixed':
          const divider = contentType
            .filter(v => v.match(/(?:^|\W)boundary=(\S*)/))
            .map(v => {
              const a = /(?:^|\W)boundary=(\S*)/.exec(v);
              if (!a || !a[1]) return false;
              return a[1].replace(/^[\'\"\`]+|[\'\"\`]+$/g, '');
            })[0];

          if (divider) {
            const multiAlter = new MultipartAlternative(body, divider);

            let filterPart = multiAlter.parts.filter(v => {
              return ['text/plain', 'text/html'].indexOf(v.contentType) !== -1 });
            if (filterPart.length > 0) {
              result.contentType = filterPart[0].contentType;
              result.body = filterPart[0].body;
              isBase64 = filterPart[0].isBase64;

            } else {
              this.logger.warn('Unexpected: multipartAlternative.parts[].content-type');
              this.logger.warn('DUMP:', multiAlter.parts, header, body);
              result.contentType = 'UNKNOWN';
              result.body = body;
            }
          } else {
            this.logger.warn('Unexpected: multipart/alternative with no boundary');
            this.logger.warn('DUMP:', header, body);
            result.contentType = 'UNKNOWN';
            result.body = body;
          }
        break;
      }

      if (isBase64) {
        try {
          result.body = decode(result.body).replace(/\r\n/g, '\n');
        } catch (err) {
          this.logger.error('base64 detected but can\'t parse');
          this.logger.error('DUMP:', err, header, body);
          result.contentType = 'UNKNOWN';
        }
      }

      return result;
    });
    */
     const parsingProcess: Promise<mailparser.ParsedMail>[] = rawSubmissions.map((msg: imaps.Message) => {
      // Parse header
      let all: any = msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === '';
      })[0].body;
      const id = msg.attributes.uid;
      const idHeader = 'Imap-Id: ' + id + '\r\n';

      return new Promise((resolve, reject) => {
        mailparser.simpleParser(idHeader + all, (err, mail: mailparser.ParsedMail) => {
          if (err) return reject(err);
          resolve(mail);
        });
      });
    });

    const submissions: ISimpleParsedEmail[] = (await Promise.all(parsingProcess))
      .map((mail: mailparser.ParsedMail) => {

      return {
        // TODO
        from: mail.from.text,
        subject: mail.subject,
        body: '' + (mail.html || ''),
        contentType: 'text/html'
      }
    });
    return submissions;
  }
}
