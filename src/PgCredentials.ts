
import LoadFile from './LoadFile';

class PgCredentials
{
    private _user: string = "";
    private _database: string = "";
    private _host: string = "";
    private _password: string = "";
    private _port: number = 0;

    constructor()
    {

    }

    async init(filePath: string) : Promise<void>
    {
        const credentials = await LoadFile(filePath);
        const credentialsObject = JSON.parse(credentials.toString());

        function getValue(key: string) : string
        {
            return key in credentialsObject ? credentialsObject[key] : "";
        }

        this._user = getValue("user");
        this._database = getValue("database");
        this._host = getValue("host");
        this._password = getValue("password");
        this._port = Number(getValue("port"));
    }

    public get user() : string
    {
        return this._user;
    }

    public get database() : string
    {
        return this._database;
    }

    public get host() : string
    {
        return this._host;
    }

    public get password() : string
    {
        return this._password;
    }

    public get port() : number
    {
        return this._port;
    }

}

export default PgCredentials;
