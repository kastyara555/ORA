const { verifyToken } = require("../utils/jwt");

const checkAuthorization = (req, res, next) => {
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token);

    if (verifiedToken) {
        return next();
    }

    res.status(401).send('Неавторизированный пользователь');
};

module.exports = { checkAuthorization };
