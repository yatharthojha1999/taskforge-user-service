module.exports = function makeValidateLinkAction({ validateLinkUsecase }) {
    return async function validateLinkAction(req, res) {
        console.log('validateLinkAction Called!');
        const linkname = req.params["linkname"];

        const apiResult = await validateLinkUsecase({ linkname });
        res.status(200).json(apiResult);
    }
}