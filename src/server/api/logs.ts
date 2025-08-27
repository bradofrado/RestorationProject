import { type Log, type LoggingType } from '~/utils/types/logger';
import { type User } from '~/utils/types/auth';
import { type LoggerDAO } from '../dao/LogDAO';

type LogMethod = (message: string, user?: User) => Promise<void>;

export interface ILogger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
}

export class MainLogger implements ILogger {
  constructor(private loggerDAO: LoggerDAO) {}

  private createLog(
    type: LoggingType,
    message: string,
    user: User | null
  ): Log {
    return {
      date: new Date(),
      message,
      user,
      type,
      id: -1,
    };
  }
  public async info(message: string, user?: User) {
    console.log(message);
    await this.loggerDAO.create(this.createLog('INFO', message, user ?? null));
  }
  public async error(message: string, user?: User) {
    console.error(message);
    await this.loggerDAO.create(this.createLog('ERROR', message, user ?? null));
  }
  public async warn(message: string, user?: User) {
    console.warn(message);
    await this.loggerDAO.create(this.createLog('WARN', message, user ?? null));
  }
}

export class EmptyLogger implements ILogger {
  public info() {
    return Promise.resolve();
  }
  public error() {
    return Promise.resolve();
  }
  public warn() {
    return Promise.resolve();
  }
}
