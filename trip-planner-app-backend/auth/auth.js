require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = JsonWebTokenError.verify(token, privateKey);
        req.user = decoded;
        next();
    }

    catch {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}

module.exports = {
    privateKey,
    auth
};