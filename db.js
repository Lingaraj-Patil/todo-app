const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const User = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const Todo = new mongoose.Schema({
    userId: ObjectId,
    title: String,
    done: Boolean
})

const UserModel = mongoose.model('user',User);
const TodoModel = mongoose.model('todo',Todo);

module.exports = {
    UserModel,
    TodoModel
}