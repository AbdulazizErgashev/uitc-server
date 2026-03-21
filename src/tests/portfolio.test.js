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
  await prisma.portfolio.deleteMany({});
  await prisma.$disconnect();
});

describe("Portfolio API", () => {
  it("POST /api/portfolio - create", async () => {
    const res = await request(app)
      .post("/api/portfolio")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "UITC App",
        category: "app",
        description: "Sample portfolio item",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("UITC App");
  });

  it("GET /api/portfolio - list", async () => {
    const res = await request(app).get("/api/portfolio");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.count).toBeGreaterThan(0);
  });
});
