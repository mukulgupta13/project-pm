const { PermissionError } = require("../common/error_types");

const schoolUserOnly = async (req, res, next) => {
  if (req.user.role.toLowerCase() !== "school") {
    return next(
      new PermissionError(403, "You are not allowed to perform this action.")
    );
  }
  next();
};

const adminUserOnly = async (req, res, next) => {
  console.log(req.user);
  if (!req.user.is_admin) {
    return next(
      new PermissionError(403, "You are not allowed to perform this action.")
    );
  }
  next();
};

const studentUserOnly = async (req, res, next) => {
  if (req.user.role.toLowerCase() !== "student") {
    return next(
      new PermissionError(403, "You are not allowed to perform this action.")
    );
  }
  next();
};

module.exports = {
  schoolUserOnly,
  adminUserOnly,
  studentUserOnly,
};
