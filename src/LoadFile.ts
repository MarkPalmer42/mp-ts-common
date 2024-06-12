
import fs from 'fs';
import path from 'path';

function LoadFile(filename: string) : Promise<Buffer>
{
    return new Promise((resolve, reject) =>
    {
        let filepath = filename;

        if(filename[0] == '.')
        {
            const pathList = [__dirname].concat(filename.split('/'));
            filepath = path.join.apply(null, pathList);
        }
        
        fs.readFile(filepath, (err, content) =>
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(content);
            }
        });
    });
}

export default LoadFile;
