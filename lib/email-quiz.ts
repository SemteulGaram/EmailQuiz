import { Signale } from 'signale';
import imaps from 'imap-simple';

import logger from './logger';
import { Config } from './config';
import { EQ_Smtp, EQ_Imap } from './internals';
import { IReporter } from './types/IReporter';
import { inspect } from 'util';

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

  async runReplyAll(reporter: IReporter): Promise<null> {
    // Initialize
    this.logger.info('모든 메시지에 답장 실행');
    reporter.info('모든 메시지에 답장 실행');
    if (!this.imap.isReady()) throw 'ERRIMAPNOTREADY';
    // TODO: uncomment
    // if (!this.smtp.isReady()) throw 'ERRSMTPNOTREADY';
    
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
      return null;
    }
    this.logger.info(`읽지 않은 총 메일 수: [${ msgs.length }]`);
    reporter.info(`읽지 않은 총 메일 수: [${ msgs.length }]`);

    // Parse target message
    msgs.filter((msg: imaps.Message) => {
      return (!!(<string>msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === 'HEADER';
        // TODO: match string
      })[0].body.subject[0]).match('제출'));
    });
    this.logger.info(`새로운 정답 제출자 수: [${ msgs.length }}]`);
    reporter.info(`새로운 정답 제출자 수: [${ msgs.length }}]`);
    if (msgs.length === 0) {
      return null;
    }

    // Check answer
    msgs.map((msg: imaps.Message) => {
      const header =  msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === 'HEADER';
      })[0].body;
      const body = msg.parts.filter((part: imaps.MessageBodyPart) => {
        return part.which === 'TEXT';
      })[0].body.replace('\r\n', '\n');

      const isBase64 = header['content-transfer-encoding'].match(/(?:^|\W)base64(?:$|\W)/i);

      return [
        
      ]
    });

    // Reply message

    return null;
  }
}
