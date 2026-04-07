import express from "express";
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./teamMembers.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { adminMiddleware } from "../../middlewares/role.js";
import { validate } from "../../middlewares/validate.js";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  idParamSchema,
} from "../../validators/teamMembers.validator.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/", getTeamMembers);
router.get("/:id", validate(idParamSchema, "params"), getTeamMember);

router.use(authMiddleware, adminMiddleware);

router.post(
  "/",
  upload.single("image"),
  validate(createTeamMemberSchema),
  createTeamMember,
);

router.patch(
  "/:id",
  upload.single("image"),
  validate(idParamSchema, "params"),
  validate(updateTeamMemberSchema),
  updateTeamMember,
);

router.delete("/:id", validate(idParamSchema, "params"), deleteTeamMember);

export default router;
