import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../../prisma/prisma.js";

describe("Team Member API", () => {
  let token;
  let createdId;

  /**
   * 🔐 BEFORE ALL
   * Agar senda auth route bo‘lsa real login qil
   * bo‘lmasa fallback token ishlat
   */
  beforeAll(async () => {
    try {
      const res = await request(app).post("/auth/login").send({
        email: "admin@example.com",
        password: "123456",
      });

      token = `Bearer ${res.body.data.accessToken}`;
    } catch (err) {
      // fallback (agar auth yo‘q bo‘lsa)
      token = "Bearer YOUR_ADMIN_TOKEN";
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // =========================
  // GET ALL
  // =========================
  it("GET /team-members -> should get all members", async () => {
    const res = await request(app).get("/team-members");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // =========================
  // CREATE
  // =========================
  it("POST /team-members -> should create member", async () => {
    const res = await request(app)
      .post("/team-members")
      .set("Authorization", token)
      .field("name", "Abu Dev")
      .field("role", "Backend Developer")
      .field("bio", "Test bio")
      .field("expertise", JSON.stringify(["Node.js", "Prisma"]))
      .field("achievements", JSON.stringify(["Built APIs"]))
      .attach("image", "tests/test-image.jpg");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Abu Dev");

    createdId = res.body.data.id;
  });

  // =========================
  // GET ONE
  // =========================
  it("GET /team-members/:id -> should get one", async () => {
    const res = await request(app).get(`/team-members/${createdId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdId);
  });

  // =========================
  // UPDATE (IMAGE OPTIONAL)
  // =========================
  it("PATCH /team-members/:id -> should update member without image", async () => {
    const res = await request(app)
      .patch(`/team-members/${createdId}`)
      .set("Authorization", token)
      .field("name", "Updated Name");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Name");
  });

  // =========================
  // UPDATE WITH IMAGE
  // =========================
  it("PATCH /team-members/:id -> should update with image", async () => {
    const res = await request(app)
      .patch(`/team-members/${createdId}`)
      .set("Authorization", token)
      .field("role", "Senior Backend Developer")
      .attach("image", "tests/test-image.jpg");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.role).toBe("Senior Backend Developer");
    expect(res.body.data.image).toBeDefined();
  });

  // =========================
  // DELETE
  // =========================
  it("DELETE /team-members/:id -> should delete", async () => {
    const res = await request(app)
      .delete(`/team-members/${createdId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(204);
  });

  // =========================
  // ERROR CASE
  // =========================
  it("GET /team-members/:id -> should return 404", async () => {
    const res = await request(app).get(`/team-members/${createdId}`);

    expect(res.statusCode).toBe(404);
  });
});
