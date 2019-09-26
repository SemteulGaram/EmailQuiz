import imaps, { ImapSimpleOptions, ImapSimple } from 'imap-simple';

export interface IReceiveMail{
  from: string;
  title: string;
  content: string;
}

export class EQ_Imap {
  _opt: ImapSimpleOptions;

  constructor (options: ImapSimpleOptions) {
    this._opt = options;
  }

  updateOptions (options: ImapSimpleOptions): void {
    this._opt = options;
  }

  async hasNewMail (): Promise<boolean> {
    return false;
  }
  
  async getNextMail (): Promise<IReceiveMail|null> {
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