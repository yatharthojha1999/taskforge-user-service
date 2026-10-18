module.exports = function makeGetUserByLinknameAndEmailAction({ getUserByLinknameAndEmailUsecase }) {
    return async function getUserByLinknameAndEmailAction(req, res) {
        console.log('getUserByLinknameAndEmailAction Called!');
        const domain = req.params["linkname"];
        const email = req.params["email"];

        const apiResult = await getUserByLinknameAndEmailUsecase({ domain, email });
        res.status(200).json(apiResult);
    }
}