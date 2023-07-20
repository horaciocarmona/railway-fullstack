import winston, { createLogger } from 'winston'
import "dotenv/config";

const loggingConfig={
    development: [
        new winston.transports.Console({level: 'debug'}),
        new winston.transports.File({filename: './logs.log' , level: 'info'})
    ],
    production: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({filename: './error.log' , level: 'warn'})

    ],
};

const addLogger=(req,res,next)=>{
    req.logger=winston.createLogger({
        transport: loggingConfig[config.app.ENV]
    })
    req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`)
    next();
}

export default addLogger