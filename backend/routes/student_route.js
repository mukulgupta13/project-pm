const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth_middleware");
const { adminUserOnly } = require("../middleware/permission_middleware");
const {
  createStudent,
  retrieveAllStudents,
  retrieveStudent,
  updateStudent,
  deleteStudent,
  updateLinks,
  removeLinks,
} = require("../controller/student_controller");

router.use([authenticateToken, adminUserOnly]);

router.get("/", retrieveAllStudents);

router.get("/:id", retrieveStudent);

router.post("/", createStudent);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

router.put("/:id/update-links", updateLinks);

router.delete("/:id/remove-links", removeLinks);

module.exports = router;
