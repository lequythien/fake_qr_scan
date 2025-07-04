const express = require("express");
const router = express.Router();
const { login } = require("../controller/admin");
const authenticateJWT = require("../middleware/authenticateJWT");
// Định nghĩa route đăng nhập
router.post("/login", login);

// Định nghĩa route lấy profile, cần xác thực JWT
router.get("/profile", authenticateJWT, (req, res) => {
  // Chỉ truy cập được nếu có token hợp lệ
  res.json({ user: req.user });
});

module.exports = router;