const request = require("supertest")
const Task = require("../source/models/task")
const app = require('../source/app')
const { 
    userOne, 
    userOneId, 
    userTwo, 
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
     configDb } = require("./fixtures/db")

beforeEach(configDb)

test('Should create task for user', async () => {
   const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "For the test"
        })
        .expect(201)
   const task = await Task.findById(response.body._id)
   expect(task).not.toBeNull()
   expect(task.completed) .toEqual(false)
})

test("Should get task back for user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test("Should not let authorize delete", async () => {
    const response = await request(app)
        .delete(`/tasks/${userOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})