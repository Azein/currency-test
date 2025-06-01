import { Router } from "express";
import { TransferController } from "../controllers/transfer.controller";

const router = Router();

router.post("/", TransferController.transfer);
router.get("/preview", TransferController.previewConversion);

export default router; 