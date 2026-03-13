import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../prisma/prisma.js";

let token;

beforeAll(async () => {
  // Agar admin oldin yaratilgan bo'lsa login qilamiz
  const res = await request(app)
    .post("/api/auth/login")
    .send({ phone: "+998900000000", password: "admin123" });

  token = res.body.data.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth API", () => {
  it("POST /api/auth/login - success", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ phone: "+998900000000", password: "admin123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/auth/login - fail invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ phone: "+998900000000", password: "wrongpass" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/auth/me - success with token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe("admin");
  });

  it("GET /api/auth/me - fail without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});
