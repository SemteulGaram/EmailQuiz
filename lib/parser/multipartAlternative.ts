import { decode } from '../tool/base64';

export interface MultipartPart {
  header: Map<string, string>;
  contentType: string;
  isBase64: boolean;
  body: string;
}

export class MultipartAlternative {
  parts: MultipartPart[];

  constructor (body: string, divideStr: string) {
    this.parts = [];

    const bodySplit = body.split('\n');
    divideStr = MultipartAlternative._escapeDivideStr(divideStr);
    const lastDivider = new RegExp('^--' + divideStr + '--$');
    const divider = new RegExp('^--' + divideStr + '$');
    console.log('ORIGIN LENGTH ', divideStr.length + 2);

    let partIndex = 0;
    let lineIndex = 0;
    let isBody = false;
    this.parts[0] = {
      header: new Map(),
      contentType: '',
      isBase64: false,
      body: ''
    }
    
    if (bodySplit[0].match(divider)) lineIndex = 1;
    while (lineIndex < bodySplit.length) {
      if (bodySplit[lineIndex].match(lastDivider)) {
        break;
      } else if (bodySplit[lineIndex].match(divider)) {
        this.parts[++partIndex] = {
          header: new Map(),
          contentType: '',
          isBase64: false,
          body: ''
        }
        isBody = false;
      } else if (bodySplit[lineIndex] === '') {
        isBody = true;
      } else if (isBody) {
        if (this.parts[partIndex].body !== '') this.parts[partIndex].body += '\n';
        this.parts[partIndex].body += bodySplit[lineIndex];
      } else {
        const dividerIndex = bodySplit[lineIndex].indexOf(':');
        if (dividerIndex === -1) {
          this.parts[partIndex].header.set(bodySplit[lineIndex], '');  
        } else {
          const key = bodySplit[lineIndex].substring(0, dividerIndex).trim();
          const value = bodySplit[lineIndex].substring(dividerIndex + 1,
            bodySplit[lineIndex].length).trim();

          this.parts[partIndex].header.set(key, value);

          const lowKey = key.toLowerCase();
          if (lowKey === 'content-type') {
            // TODO
            const sepIndex = value.indexOf(';');
            if (sepIndex !== -1) {
              this.parts[partIndex].contentType = value.substring(0, sepIndex);
            } else {
              this.parts[partIndex].contentType = value;
            }
            
          } else if (lowKey === 'content-transfer-encoding'
            && value.match(/(?:^|\W)base64(?:$|\W)/i)) {
            
            this.parts[partIndex].isBase64 = true;
          }
        }
      }
      lineIndex++;
    }
  }

  static _escapeDivideStr (str: string): string {
    const toEscape = '[\$\^\*\+\?\(\)\[\]\\\|\.\/]';
    return str.replace(toEscape, '\\$&');
  }
}