
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import Log from './Log';

const AuthenticateJWT = (req: any, res: any, next: any) =>
{
    if(req.headers && req.headers.authorization)
    {
        let elements = req.headers.authorization.split(' ');

        if(elements.length == 2)
        {
            let token = elements[1];

            admin.auth().verifyIdToken(token)
            .then(() =>
            {
                Log.Info('firebase auth successful');

                req.user = jwt.decode(token);

                next()
            })
            .catch(error =>
            {
                Log.Error('JWT verification failed: ' + error);
                res.sendStatus(403);
            });
        }
        else
        {
            res.sendStatus(401);
        }
    }
    else
    {
        res.sendStatus(401);
    }
}

export default AuthenticateJWT;
