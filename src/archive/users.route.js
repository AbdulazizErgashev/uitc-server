// import express from "express";

// import {
//   getUsers,
//   getUser,
//   updateUser,
//   deleteUser,
// } from "../controllers/users.controller.js";

// import { authMiddleware } from "../middlewares/auth.js";
// import { adminMiddleware } from "../middlewares/role.js";
// import { validate } from "../middlewares/validate.js";

// import {
//   updateUserSchema,
//   idParamSchema,
// } from "./users.validator.js";

// const router = express.Router();

// // Admin-only routes
// router.use(authMiddleware, adminMiddleware);

// // GET all users
// router.get("/", getUsers);

// // GET single user
// router.get("/:id", validate(idParamSchema, "params"), getUser);

// // UPDATE user
// router.patch(
//   "/:id",
//   validate(idParamSchema, "params"),
//   validate(updateUserSchema),
//   updateUser,
// );

// // DELETE user
// router.delete("/:id", validate(idParamSchema, "params"), deleteUser);

// export default router;
