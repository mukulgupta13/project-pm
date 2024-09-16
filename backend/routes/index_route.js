const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth_middleware");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello from Project Management App!",
  });
});

router.use(authenticateToken);

module.exports = router;
