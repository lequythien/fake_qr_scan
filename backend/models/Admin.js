const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
     email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ."],
    },
    password:{
        type: String,
        required: true,
    },
})
module.exports = mongoose.model("Admin", AdminSchema);