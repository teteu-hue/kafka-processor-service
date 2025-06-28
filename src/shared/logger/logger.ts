import { createLogger, transports, format } from "winston";
import "winston-mongodb";
import 'dotenv/config';

const logger = createLogger({
    transports: [
        new transports.MongoDB({
            db: process.env.DB_CONN_STRING || 'mongodb://mongodb:27017',
            collection: 'logs',
            level: 'info',
            options: {
                useUnifiedTopology: true
            }
        }),
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
    ]
});

export default logger;
