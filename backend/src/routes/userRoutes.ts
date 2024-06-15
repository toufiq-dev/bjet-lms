import { Router } from "express";
import UserController from "../controllers/userController";
import { validateRegister, validateLogin } from "../validators/userValidation";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

router.post("/register", validate(validateRegister), UserController.register);
router.post("/login", validate(validateLogin), UserController.login);

export default router;
