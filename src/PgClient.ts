
import pg from 'pg';
import Log from './Log';

import PgCredentials from './PgCredentials'
import fs from 'fs';

class PgClient
{
    private _connected: boolean = false;
    private _connection?: pg.Client;
    private _closed = true;
    private _pgSSL: boolean = false;
    private _pgCAFile: string = "";
    private _dbCredentials: string = "";

    constructor(pgSSL: boolean, pgCAFile: string, dbCredentialsFile: string)
    {
        this._pgSSL = pgSSL;
        this._pgCAFile = pgCAFile;
        this._dbCredentials = dbCredentialsFile;
    }

    public get connected() : boolean
    {
        return this._connected
    }

    public set connected(connected_: boolean)
    {
        this._connected = connected_;
    }

    public get connection() : pg.Client
    {
        if(this._connection)
        {
            return this._connection;
        }
        else
        {
            throw new Error("Not connected.");
        }
    }

    private reconnect(resolve: (reason: string) => void) : NodeJS.Timeout
    {
        Log.Info('Connection to database lost, attempting to reconnect in 3000ms.');
        return setTimeout(() =>
        {
            this.connect2(resolve);
        }, 3000);
    }

    private async attemptConnection(resolve: (reason: string) => void) : Promise<void>
    {
        const credentials = new PgCredentials();
        await credentials.init(this._dbCredentials);
        let credentialsObject : { [id: string]: {} } = {
            host: credentials.host,
            database: credentials.database,
            port: credentials.port,
            password: credentials.password,
            user: credentials.user,
        };

        if(this._pgSSL == true)
        {
            credentialsObject =
            { ssl:
                {
                    rejectUnauthorized: false,
                    ca: fs.readFileSync(this._pgCAFile).toString(),
                }, ...credentialsObject
            }
        }
        const connection = new pg.Client(credentialsObject);
        let reconnectTimeout: NodeJS.Timeout;

        connection.on('error', error => {
            this._connected = false;
            Log.Error('An error occured in database connection ' + error);
            if(!reconnectTimeout)
            {
                reconnectTimeout = this.reconnect(resolve);
            }
        });

        connection.on('end', () => {
            this._connected = false;
            Log.Error('Database connection ended.');
            if(!this._closed && !reconnectTimeout)
            {
                reconnectTimeout = this.reconnect(resolve);
            }
        });

        connection.on('notice', info =>
        {
            Log.Info('A notice from database: ' + info);
        });

        connection.on('notification', info =>
        {
            Log.Info('A notification from database: ' + info);
        });

        connection.connect(async (error) =>
        {
            if(error)
            {
                this._connected = false;
                Log.Error('An error occured during database connection ' + error);
                if(!reconnectTimeout)
                {
                    reconnectTimeout = this.reconnect(resolve);
                }
            }
            else
            {
                this._connected = true;
                this._connection = connection;
                Log.Info('Database connection established successfully.');
                resolve("established");
            }
        });
    }

    private async connect2(resolver: (reason: string) => void)
    {
        if(resolver)
        {
            this.attemptConnection(resolver);
        }
        else
        {
            return new Promise((resolve: (reason: string) => void) =>
            {
                this.attemptConnection(resolve);
            });
        }
    }

    connect()
    {
        this._closed = false;
        return new Promise(async (resolve: (reason: string) => void) =>
        {
            this.connect2(resolve);
        });
    }

    close()
    {
        return new Promise(resolve =>
        {
            if(!this._closed)
            {
                this._closed = true;

                this.connection.end(err =>
                {
                    if(!err)
                    {
                        Log.Info('Database connection closed.');
                        this._connection = undefined;
                        resolve("connection_closed");
                    }
                    else
                    {
                        Log.Error("Database connection is not closed properly.");
                    }
                })
            }
        })  
        
    }
}

export default PgClient;
