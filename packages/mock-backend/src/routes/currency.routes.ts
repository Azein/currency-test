import { Router } from "express";
import { CurrencyController } from "../controllers/currency.controller";

const router = Router();

router.get("/", CurrencyController.getAll);
router.get("/:id", CurrencyController.getOne);
router.post("/", CurrencyController.create);
router.put("/:id", CurrencyController.update);
router.delete("/:id", CurrencyController.delete);

export default router; 