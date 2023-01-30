import winston from 'winston';
import config from '../config';

const Logger = winston.createLogger({
  level: config.logLevel,
  transports: new winston.transports.Console(),
  format: winston.format.cli(),
});

export default Logger;
