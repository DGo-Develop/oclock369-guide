const { createLogger, transports, format } = require('winston');
const { combine, timestamp, label, printf, splat, errors } = format;

// Formato personalizado para los mensajes de registro
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

class Logger {
    constructor(logLabel = 'bussines-error', logLevel = process.env.LOG_LEVEL || 'debug', timestampFormat = process.env.TIMESTAMP_FORMAT || 'YYYY-MM-DD HH:mm:ss') {
        this.logger = createLogger({
            level: logLevel,
            format: combine(
                errors({ stack: true }),
                splat(),
                label({ label: `(${process.env.LOG_LEVEL || 'log: '}) ${logLabel}: ` }),
                timestamp({ format: timestampFormat }),
                myFormat
            ),
            transports: [new transports.Console()],
        });
    }

    info(message) {
        this.logger.info(message);
    }

    error(message) {
        this.logger.error(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    debug(message) {
        this.logger.debug(message);
    }
}

module.exports = Logger;
