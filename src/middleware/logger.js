import winston from 'winston';
import path from 'path';
import __dirname from '../utils/utils.js';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

winston.addColors(customLevels.colors);

const createLogger = (env) => {
  if (env === 'development') {
    return winston.createLogger({
      levels: customLevels.levels,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug',
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: customLevels.levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          level: 'info',
        }),
        new winston.transports.File({
          filename: path.join(__dirname, 'logs', 'errors.log'),
          level: 'error',
        }),
      ],
    });
  }
};

const logger = createLogger(process.env.NODE_ENV);

export const middlewareLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

export default logger;
