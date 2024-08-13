
import winston from 'winston';
import 'winston-daily-rotate-file'

import moment from 'moment';

function format()
{
    return winston.format.printf(info => `[${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss.SSS')}] ${info.level}: ${info.message}`);
}

function getFileAndLine(offset=4)
{
    let stackTrace = Object(new Error('')).stack.split("\n");
    let stackLine = stackTrace[offset];
    let openBracketIdx = stackLine.indexOf("(");
    let closeBracketIdx = stackLine.indexOf(")");
    let file = stackLine.substring(openBracketIdx + 1, closeBracketIdx);
    let splitFile = file.split("/");
    return splitFile[splitFile.length - 1];
}

function logMessage(message: string | object) : string
{
    const fileAndLine = getFileAndLine();
    const appendedFileAndLine = fileAndLine !== "" ? ` (${fileAndLine})` : "";

    if(typeof message === 'object')
    {
        return `${JSON.stringify(message)}${appendedFileAndLine}`;
    }
    else
    {
        return `${message}${appendedFileAndLine}`;
    }
}

class LogClass
{
    private _logger?: winston.Logger;

    constructor()
    {
        
    }

    Init(serviceName: string, logLevel: string, logToConsole: boolean, logPath: string) : void
    {
        const fileTransport = new winston.transports.DailyRotateFile(
        {
            filename: `${serviceName}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            dirname: logPath
        });

        this._logger = winston.createLogger(
        {
            level: logLevel,
            format: format(),
            defaultMeta: { service: serviceName },
            transports: logToConsole ? [fileTransport, new winston.transports.Console({format: format()})] : [fileTransport]
        });
    }

    Debug(message : string) : void
    {
        this._logger?.debug(logMessage(message))
    }

    Info(message : string) : void
    {
        this._logger?.info(logMessage(message));
    }

    Warning(message : string) : void
    {
        this._logger?.warn(logMessage(message));
    }

    Error(message : string) : void
    {
        this._logger?.error(logMessage(message));
    }

}

let Log = new LogClass();

export default Log;
