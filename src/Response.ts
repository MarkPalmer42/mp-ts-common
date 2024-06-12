
import Log from './Log';

const BadRequest = (error?: string) =>
{
    if(error)
    {
        Log.Error(`Incorrect request received: ${error}`);
    }

    return {response:{'result':'error','error':'bad_request'},statusCode:400};
}

const Unauthorized = (error?: string) =>
{
    if(error)
    {
        Log.Error(`Incorrect request received: ${error}`);
    }

    return {response:{'result':'error','error':'unauthorized'},statusCode:401};
}

const InternalError = (error: Error) =>
{
    if(error)
    {
        Log.Error(`Exception: ${error.message}, Stacktrace: ${error.stack}`);
    }
    
    return { response: {result: 'error', error: 'internal_error' }, statusCode: 500 };
}

const Create = (response: object, statusCode: number) =>
{
    return { response: response, statusCode: statusCode };
}

const NotFound = () =>
{
    return { response: {}, statusCode: 404 };
}

const Success = (response: object = {}) =>
{
    return { response: { result:'success', ...response }, statusCode:200 };
}

const Error = (error: string) =>
{
    return { response: { result: 'error', error: error }, statusCode:200 };
}

export { BadRequest, Unauthorized, InternalError, Create, NotFound, Success, Error };
