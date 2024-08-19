import { Router } from "express";
import {
  getResetPassword,
  getValidateNewPassword,
  updateUser,
  getUsers,
  getUserById,
  uploadDocuments,
  upgradeToPremium
} from "../controller/userController.js";
import { authRole } from "../middleware/authRole.js";
import { upload } from "../utils/utils.js";

export const router = Router();

router.get("/",getUsers);
router.get("/:uid", getUserById);
router.post("/resetPassword", getResetPassword);
router.post("/validateNewPassword/:token", getValidateNewPassword);
router.post("/:uid/documents", upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'productImage', maxCount: 1 },
  { name: 'identification', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 },
  { name: 'proofOfAccountStatus', maxCount: 1 }
]), uploadDocuments);
router.put("/premium/:uid", authRole(['admin']), upgradeToPremium);


export default router;
