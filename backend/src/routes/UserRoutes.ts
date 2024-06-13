import { Router } from "express";
import UserController from "../controllers/UserController";
import { validation } from "../middleware/validators/validation";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validators/userValidation";

const router = Router();

router.post("/register", validation, validateRegister, UserController.register);
router.post("/login", validation, validateLogin, UserController.login);

export default router;
