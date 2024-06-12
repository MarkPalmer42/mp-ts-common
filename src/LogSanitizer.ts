
const LogSanitizer = (obj: object) =>
{
    const target = {...obj};

    if("stoken" in target)
    {
        target["stoken"] = "...";
    }
    if("token" in target)
    {
        target["token"] = "...";
    }

    return JSON.stringify(target);
}

export default LogSanitizer;
