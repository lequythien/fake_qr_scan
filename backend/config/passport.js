const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    Admin.findOne({ email })
      .then((admin) => {
        if (!admin) {
          return done(null, false, { message: "Người dùng không tồn tại." });
        }

        return bcrypt.compare(password, admin.password)
          .then((isMatch) => {
            if (!isMatch) {
              return done(null, false, { message: "Mật khẩu không đúng." });
            }

            return done(null, admin);
          });
      })
      .catch((err) => {
        return done(err);
      });
  })
);

// Lưu user vào session
passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

// Lấy user từ session
passport.deserializeUser((id, done) => {
  Admin.findById(id)
    .then((admin) => done(null, admin))
    .catch((err) => done(err));
});
