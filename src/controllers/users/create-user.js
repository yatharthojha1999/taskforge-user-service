module.exports = function makeCreateUserAction({ createUserUsecase }) {
    return async function createUserAction(req, res) {
        console.log('createUserAction Called!');
        const domain = req.body["domain"];
        const name = req.body["name"];
        const email = req.body["email"];
        const status = req.body["status"] || 'pending';
        const is_super_admin = req.body["isSuperAdmin"] || false;
        const address = req.body["address"];
        const zipcode = req.body["zipcode"];
        const city = req.body["city"];
        const state = req.body["state"];
        const country = req.body["country"];
        const password = req.body["password"];

        const apiResult = await createUserUsecase({
            domain, name, email, status, is_super_admin, address, zipcode, city, state, country, password
        })
        res.status(200).json(apiResult);
    }
}