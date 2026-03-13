import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../prisma/prisma.js";

let token;
let courseId;

beforeAll(async () => {
  // Admin login
  const res = await request(app)
    .post("/api/auth/login")
    .send({ phone: "+998900000000", password: "admin123" });

  token = res.body.data.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Courses API", () => {
  it("GET /api/courses - fetch all courses", async () => {
    const res = await request(app).get("/api/courses");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/courses - create a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Course", description: "Course description" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Course");

    courseId = res.body.data.id; // keyinchalik update/delete uchun saqlaymiz
  });

  it("GET /api/courses/:id - fetch single course", async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(courseId);
  });

  it("PATCH /api/courses/:id - update course", async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Course" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Course");
  });

  it("DELETE /api/courses/:id - delete course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
