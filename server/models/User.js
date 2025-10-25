import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,

    },
    // password: {
    //     type: String,
    //     required: true
    // },

})

const User = mongoose.model("User", UserSchema);

export default User;