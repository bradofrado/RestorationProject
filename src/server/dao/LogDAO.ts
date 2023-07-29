import {type Log, logSchema} from '~/utils/types/logger';
import {type Db} from '~/server/db';
import {type Logging as PrismaLog} from '@prisma/client';

export interface LoggerDAO {
    create(log: Log): Promise<Log>;
}

export class PrismaLoggerDAO implements LoggerDAO {
    constructor(private db: Db) {}

    private prismaToLog(logging: PrismaLog): Log {
        return logSchema.parse(logging);
    }
    public async create(log: Log) {
        const logPrisma = await this.db.logging.create({
            data: {
                date: log.date,
                type: log.type,
                message: log.message,
                userId: log.user?.id
            },
            include: {
                user: true
            }
        });

        return this.prismaToLog(logPrisma);
    }
}