import { Router } from "express";
import {
  getResetPassword,
  getValidateNewPassword,
  getPremium,
} from "../controller/userController.js";

export const router = Router();

router.post("/resetPassword", getResetPassword);

router.post("/validateNewPassword/:token", getValidateNewPassword);

router.put("/premium/:uid", getPremium);

export default router;
