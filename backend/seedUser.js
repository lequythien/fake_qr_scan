const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("./models/Admin"); // Đúng đường dẫn model Admin

dotenv.config();

const createTestAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("admin already exists");
    } else {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await Admin.create({
        name: "Nguyễn Văn Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
      });
      console.log("admin created");
    }
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

// Nếu bạn muốn chạy file trực tiếp
createTestAdmin();