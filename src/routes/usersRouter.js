import { Router } from "express";
import {
  getResetPassword,
  getValidateNewPassword,
  updateUser,
  getUsers,
  getUserById,
} from "../controller/userController.js";
import { authRole } from "../middleware/authRole.js";

export const router = Router();

router.get("/",getUsers);

router.get("/:uid", getUserById);

router.post("/resetPassword", getResetPassword);

router.post("/validateNewPassword/:token", getValidateNewPassword);

router.put("/premium/:uid",authRole(['admin']), updateUser);

export default router;
