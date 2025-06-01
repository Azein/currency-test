import { Router } from "express";
import { AccountController } from "../controllers/account.controller";

const router = Router();

router.get("/search", AccountController.search);
router.get("/", AccountController.getAll);
router.get("/:id", AccountController.getOne);
router.get("/owner/:ownerId", AccountController.getByOwnerId);
router.post("/", AccountController.create);
router.put("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);

export default router; 