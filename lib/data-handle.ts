import fs from 'fs';
import os from 'os';

import jsonBeautify from 'json-beautify';

import logger from './logger';

export enum EDataType {
  JSON,
  LINE
}

export interface IDataHandleOptions {
  type?: EDataType;
  ensure?: boolean;
  defaultValue?: any;
}

export default class DataHandle {
  path: string;
  _opt: IDataHandleOptions;
  value: any;

  constructor(path: string, options?: IDataHandleOptions) {
    if (!options) options = {};
    if (!options.type) options.type = EDataType.JSON;

    this.path = path;
    this._opt = options;
    this.value = null;

    logger.debug(`DataHandle[${this.path}][${this._opt.type}] initialized`);
  }

  async load (): Promise<void> {
    logger.debug(`DataHandle[${this.path}][${this._opt.type}] loading`);
    try {
      switch (this._opt.type) {
        case EDataType.JSON:
          this.value = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
          break;
        case EDataType.LINE:
          this.value = (await fs.promises.readFile(this.path, 'utf-8')).replace('\r', '').split('\n');
          break;
        default:
          const err = new Error('Invalid type: ' + this._opt.type);
          err.name = 'ERRINVALIDTYPE';
          throw err;
      }
    } catch (err) {
      if (err.code === 'ENOENT' && this._opt.ensure) {
        logger.info(`DataHandle> ${ this.path } 파일이 존재하지 않습니다. 생성됩니다.`);
        this.value = (this._opt.defaultValue === undefined) ? {} : this._opt.defaultValue;
        return await this.save();
      }

      throw err;
    }
  }

  async save (): Promise<void> {
    logger.debug(`DataHandle[${this.path}][${this._opt.type}] saving`);
    switch (this._opt.type) {
      case EDataType.JSON:

        await fs.promises.writeFile(this.path,
          // @ts-ignore
          jsonBeautify(this.value, null, 2, 80).replace('\n', os.EOL), 'utf-8');
        break;
      case EDataType.LINE:
        if (this.value instanceof Array) {
          await fs.promises.writeFile(this.path, this.value.join(os.EOL), 'utf-8');
        } else {
          const err = new Error('DataHandle type [LINE] but value is not array');
          err.name = 'ERRINVALIDTYPEVALUE';
          throw err;
        }
        break;
      default:
        const err = new Error('Invalid type: ' + this._opt.type);
        err.name = 'ERRINVALIDTYPE';
        throw err;
    }
  }
}
