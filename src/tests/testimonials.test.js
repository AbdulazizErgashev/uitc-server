import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../prisma/prisma.js";

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ phone: "+998900000000", password: "admin123" });

  token = res.body.data.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Testimonials API", () => {
  it("GET /api/testimonials", async () => {
    const res = await request(app).get("/api/testimonials");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/testimonials", async () => {
    const res = await request(app)
      .post("/api/testimonials")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        course_id: "uuid-course",
        quote: "Great course!",
        rating: 5,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
