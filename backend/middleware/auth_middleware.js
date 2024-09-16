const jwt = require("jsonwebtoken");
const { UnAuthorized } = require("../common/error_types");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return next(new UnAuthorized(401, "No token provided."));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(new UnAuthorized(403, "Invalid token."));
    }
    req.user = user;
    req.user.role = user.is_admin ? "Admin" : user.role;
    next();
  });
}

module.exports = {
  authenticateToken,
};
