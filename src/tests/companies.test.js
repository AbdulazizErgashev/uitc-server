import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../prisma/prisma.js";

let token;
let companyId;

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

describe("Companies API", () => {
  it("GET /api/companies - fetch all companies", async () => {
    const res = await request(app)
      .get("/api/companies")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/companies - create a company", async () => {
    const res = await request(app)
      .post("/api/companies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Company",
        logo_url: "https://via.placeholder.com/150",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test Company");

    companyId = res.body.data.id; // keyinchalik update/delete uchun saqlaymiz
  });

  it("GET /api/companies/:id - fetch single company", async () => {
    const res = await request(app)
      .get(`/api/companies/${companyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(companyId);
  });

  it("PATCH /api/companies/:id - update company", async () => {
    const res = await request(app)
      .patch(`/api/companies/${companyId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Company" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Company");
  });

  it("DELETE /api/companies/:id - delete company", async () => {
    const res = await request(app)
      .delete(`/api/companies/${companyId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
