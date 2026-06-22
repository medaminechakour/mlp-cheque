const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Token manquant. Connectez-vous d'abord."
    });
  }

  try {
    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contient { id, email, role }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Token invalide ou expiré."
    });
  }
};

module.exports = authMiddleware;