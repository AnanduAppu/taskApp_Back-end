const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please fill your name"],
        minlength: [4, "At least needed four letters"],
        maxlength: [20, "You reached the max character limit"],
        lowercase: true
    },

    password: {
        type: String,
        required: [true, "Please fill the password"],
        minlength: [4, "Password, at least needs 4 letters"],
    },
    role: {
        type: String,
        default: 'user'
    },
    tasks:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true 
    }],
    tasks_finished:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true 
    }]
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("userData", userSchema);
