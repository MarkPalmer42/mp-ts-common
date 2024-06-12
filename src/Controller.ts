
import Log from './Log';
import LogSanitizer from './LogSanitizer';

const LogIncoming = (method: string, request: string, content: object) =>
{
    Log.Debug(`<-- ${method} ${request} ${LogSanitizer(content)}`);
}

const LogOutgoing = (status: number, response: object) =>
{
    Log.Debug(`--> ${status} ${LogSanitizer(response)}`);
}

const SendResponse = (res: any, response: object, statusCode: number) =>
{
    const status = statusCode ? statusCode : 200;
    const responseObj = response ? response : {};

    res.status(status);
    res.json(responseObj);
    res.end();

    LogOutgoing(status, responseObj);
}

const Post = (router: any, location: string, middleware: any[], callback: any) =>
{
    router.post(location, middleware, async (req: any, res: any) =>
    {
        LogIncoming('POST', req.originalUrl, req.body);
        const result = await callback(req, res);
        if(result)
        {
            SendResponse(res, result.response, result.statusCode);
        }
    });
}

const Get = (router: any, location: string, middleware: any[], callback: any) =>
{
    router.get(location, middleware, async(req: any, res: any) =>
    {
        LogIncoming('GET', req.originalUrl, req.query);
        const result = await callback(req, res);
        if(result)
        {
            SendResponse(res, result.response, result.statusCode);
        }
    });
}

export { Post, Get };
