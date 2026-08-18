import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
const controller = new SettingsController();

router.use(requireCurrentUser);

router.get("/", controller.getSettings.bind(controller));
router.patch("/", controller.updateSettings.bind(controller));

export default router;
