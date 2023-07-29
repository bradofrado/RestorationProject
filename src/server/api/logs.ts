import {type Log, type LoggingType} from '~/utils/types/logger';
import { type User } from "~/utils/types/auth";
import { type LoggerDAO } from '../dao/LogDAO';

type LogMethod = (message: string, user: User | undefined) => void

export interface ILogger {
    info: LogMethod,
    error: LogMethod,
    warn: LogMethod
}

export class MainLogger implements ILogger {
    constructor(private loggerDAO: LoggerDAO) {}

    private createLog(type: LoggingType, message: string, user: User | undefined): Log {
        return {
            date: new Date(),
            message,
            user,
            type,
            id: -1
        }
    }
    public info(message: string, user: User | undefined) {
        console.log(message);
        void this.loggerDAO.create(this.createLog('INFO', message, user));
    }
    public error(message: string, user: User | undefined) {
        console.error(message);
        void this.loggerDAO.create(this.createLog('ERROR', message, user));
    }
    public warn(message: string, user: User | undefined) {
        console.warn(message);
        void this.loggerDAO.create(this.createLog('WARN', message, user));
    }
    
}

export class EmptyLogger implements ILogger {
    public info() {
        return undefined;
    }
    public error() {
        return undefined;
    }
    public warn() {
        return undefined;
    }
    
}
