import logger from "./logger";
import { LogMeta } from "./LogMeta";

export class Log {

    static info(message: string, meta?: LogMeta) {
        logger.info(message, meta)
    }

    static error(message: string, meta?: LogMeta) {
        logger.error(message, meta);
    }

    static warn(message: string, meta?: LogMeta) {
        logger.warn(message, meta);
    }

    static debug(message: string, meta?: LogMeta) {
        logger.debug(message, meta);
    }

    static kafkaMessage(message: string, meta?: LogMeta) {
        logger.info(message, meta);
    }
    
}
