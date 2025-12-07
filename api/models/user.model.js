const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avator: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/17822/17822103.png"
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;