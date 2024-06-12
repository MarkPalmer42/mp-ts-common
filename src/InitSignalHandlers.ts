
import Log from './Log';

const closeGracefully = (callback: () => Promise<void>, signal: NodeJS.Signals) =>
{
    Log.Info(`Signal ${signal} received, shutting down gracefully.`);
    callback().then(() =>
    {
        Log.Info(`Exiting process.`);
        process.exit(0);
    })
    .catch((error) =>
    {
        Log.Info(`An error occured during shutdown: ${error.stack}`);
        process.exit(1);
    });
}

const InitSignalHandlers = (callback: () => Promise<void>) =>
{
    process.on('SIGINT', sig => closeGracefully(callback, sig));
    process.on('SIGTERM', sig => closeGracefully(callback, sig));
}

export default InitSignalHandlers;
