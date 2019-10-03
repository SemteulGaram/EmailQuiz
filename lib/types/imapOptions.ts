export interface IImapAuth {
  user: string;
  pass: string;
}

export class ImapOptions {
  host: string;
  port: string;
  secure: boolean;
  auth: IImapAuth;
  
  constructor(opt: any) {
    if (typeof opt !== 'object' || opt === null) {
      throw 'INVALIDOBJ';
    }

    
  }
}