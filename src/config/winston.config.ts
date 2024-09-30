import { format, transports } from 'winston';
import configuration from 'src/config/configuration';

const config = configuration();

// custom log display format
const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

// Common format for both environments
const commonFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  customFormat,
);

// for development environment
const devLogger = {
  format: format.combine(commonFormat, format.colorize(), format.simple()),
  transports: [new transports.Console(options.console)],
};

// for production environment
const prodLogger = {
  format: commonFormat,
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: 'combine.log',
      level: 'info',
    }),
  ],
};

// export log instance based on the current environment
export const winstonConfig = config.app.debug == 'true' ? devLogger : prodLogger;
