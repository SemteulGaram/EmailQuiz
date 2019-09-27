import http from 'http';
import { URL } from 'url';
import path from 'path';
import fs from 'fs';

import io from 'socket.io';

import { instance as config } from './config';
import logger from './logger';
import { EmailQuiz } from './email-quiz';

export class EmailQuizServer {
  ctx: EmailQuiz;
  server: http.Server;
  logger: any;
  io: io.Server;
  
  constructor(ctx: EmailQuiz) {
    this.ctx = ctx;
    this.logger = logger;
    this.server = http.createServer(this._middleware.bind(this));
    this.io = io(this.server);

    this.io.on('connection', (socket: io.Socket) => {
      socket.on('smtpConnect', () => {

      });

      socket.on('imapConnect', () => {

      });
    });
  }

  static mimeType(path: string): string {
    //@ts-ignore logically not happen
    const fileName: string = path.split('/').pop();
    if (fileName.indexOf('.') === -1) {
      return 'text/plain';
    }

    //@ts-ignore logically not happen
    switch (fileName.split('.').pop().toLowerCase()) {
      case 'html':
        return 'text/html';
      case 'js':
        return 'text/javascript';
      case 'woff2':
        return 'font/woff2';
      default:
        return 'text/plain';
    }
  }

  async _middleware(req: http.IncomingMessage, res: http.ServerResponse) {
    const mUrl = new URL(req.url || '/', 'http:/localhost');
    const paths = mUrl.pathname.replace(/^\/|\/+$/g, '').split('/').map(v => decodeURIComponent(v));

    let filePath = null;
    let stat = null;
    let readStream = null;
    // TODO: path safe test
    switch (paths[0]) {
      case '':
        filePath = path.resolve('index.html');
        stat = await fs.promises.stat(filePath);
  
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Length': stat.size
        });
  
        readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
        return;
      case 'dist':
        filePath = path.resolve(...paths);
        stat = null;
        try {
          stat = await fs.promises.stat(filePath);
        } catch (err) {
          break;
        }
              
        res.writeHead(200, {
          'Content-Type': EmailQuizServer.mimeType(filePath),
          'Content-Length': stat.size
        });
  
        readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
        return;
      case 'static':
        paths.shift();
        filePath = path.resolve('./static', ...paths);

        try {
          stat = await fs.promises.stat(filePath);
        } catch (err) {
          break;
        }

        res.writeHead(200, {
          'Content-Type': EmailQuizServer.mimeType(filePath),
          'Content-Length': stat.size
        });
  
        readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
        return;
      }

      res.statusCode = 404;
      res.end();
  }

  listen() {
    this.server.addListener('listening', () => {
      this.logger.info(`서버가 ${ config.get('serverPort') }포트에서 시작되었습니다.`);
      this.logger.info(`브라우저를 열어 http://localhost:${ config.get('serverPort') }/ 주소로 접속해 관리 페이지를 열 수 있습니다.`);
    });
    this.server.listen(config.get('serverPort'));
  }
}