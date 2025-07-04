const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email })
    .then(admin => {
      if (!admin) {
        return res.status(400).json({ message: "Người dùng không tồn tại." });
      }
      return bcrypt.compare(password, admin.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng." });
          }
          const token = jwt.sign(
            { id: admin._id, name: admin.name ,email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          res.json({ token }); // Chỉ trả về token
        });
    })
    .catch(err => {
      res.status(500).json({ message: "Lỗi máy chủ." });
    });
};

module.exports = { login };