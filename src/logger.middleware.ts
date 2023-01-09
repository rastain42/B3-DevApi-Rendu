import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
const fs = require('fs');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private stream = fs.createWriteStream('./logs/logs.txt', {
    autoClose: true,
    flags: 'a',
  });
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, path: url } = req;
    const body = req.body;
    
    let text = `${dayjs(new Date())} [IP]:${ip} : [${method}] ${url}`;
    if (Object.keys(body).length) text += ` [BODY]: ${JSON.stringify(body)}`;
    this.stream.write(text + '\n');
    next();
  }
}
