
const VerifyResult = (result: object) =>
{
    return 'status' in result && Number(result.status) >= 200 && Number(result.status) < 300;
}

export default VerifyResult;

