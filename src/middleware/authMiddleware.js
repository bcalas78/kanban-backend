const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({ message: "Accès refusé: token manquant"});
    }

    try {
        const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedJwt;
        next();
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

module.exports = authMiddleware;