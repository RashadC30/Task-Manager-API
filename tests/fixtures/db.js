const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../../source/models/user")
const Task = require("../../source/models/task")

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Jason",
    email: "Example@what.com",
    password: "Everyone21",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Blake",
    email: "Twins@Canyon.com",
    password: "LispBigtwin1",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Feed the Dog",
    completed: false,
    creator: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Get two cases of Modelo",
    completed: true,
    creator: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Barbacue the steaks and ribs",
    completed: false,
    creator: userTwo._id
}

const configDb = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    configDb
}