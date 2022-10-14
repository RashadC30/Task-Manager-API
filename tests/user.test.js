const request = require('supertest');
const app = require('../source/app');
const User = require("../source/models/user");
const { userOne, userOneId, configDb } = require("./fixtures/db")

beforeEach(configDb)

test("Should signup new user", async () => {
    const response = await request(app).post("/users").send({
        name: "Rashad",
        email: "rashad@bomb.com",
        password: "WellthatllDo"
    }).expect(201)


    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Rashad",
            email: "rashad@bomb.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("WellthatllDo")
})


test("Should login existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login nonexistent user", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: "LETSAGOGO"
    }).expect(400)
})

test("Should get user profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get user profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should delete user account", async () => {
    const response = await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test("Should not delete unauthorized user profile", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/Escape-room.jpeg")
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Merrill"
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual("Merrill")
})

test("Should not update invalid user field", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Singapore"
        })
        .expect(400)
})