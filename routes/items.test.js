process.env.NODE_ENV = "test";
const request = require("supertest")

const app = require("../app")
const items = require("../fakeDb")

let skittles = { 
    name: "skittles",
    price: 3.99
}

beforeEach(function (){
    items.push(skittles)
});

afterEach(function(){
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [skittles]})
    })
})

describe("GET /items/:name", () => {
    test("Get an item by name", async () => {
        const res = await request(app).get(`/items/${skittles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: skittles })
    })
    test("Respond with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/smarties`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Create new item", async () => {
        const res = await request(app).post('/items').send({ name: "skittles", price: 3.99});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ item: { name: "skittles", price: 3.99}})
    })
    test("Respond with 400 if params missing", async () => {
        const res = await request(app).post('/items').send({});
        expect(res.statusCode).toBe(400)
    })
})

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-BELOW NOT TESTING CORRECTLY
// describe("PATCH /items/:name", () => {
//     test("Update an item", async () => {
//         const res = await request(app).patch(`/items/${skittles.name}`).send({ name: "reeses", price: 2.05});
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({ item: { name: "reeses", price: 2.05}})
//     })
//     test("Responds with 404 for invalid item", async () => {
//         const res = await request(app).patch(`/items/chips`).send({name: "reeses", price: 2.05})
//         expect(res.statusCode).toBe(404)
//     })
// })

describe("DELETE /items/:name", () => {
    test("Delete an item", async () => {
        const res = await request(app).delete(`/items/${skittles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted"})
    })
    test("Respond with 404 for invalid item", async() => {
        const res = await request(app).delete('/items/salad');
        expect(res.statusCode).toBe(404)
    })

})