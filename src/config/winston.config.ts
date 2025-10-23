import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import 'winston-daily-rotate-file';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        nestWinstonModuleUtilities.format.nestLike('NS-70', {
          colors: true,
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%NS-70.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '7d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json({
          space: 2,
          replacer: (key, value) => {
            if (key === 'password' || key === 'token') {
              return undefined; // Exclude sensitive information
            }
            return value;
          },
        }),
      ),
    }),
  ],
};
