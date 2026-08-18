import { Router } from "express";
import { CoachController } from "../controllers/coach.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
const controller = new CoachController();

router.use(requireCurrentUser);

router.post("/conversations", controller.createConversation.bind(controller));
router.get("/conversations", controller.listConversations.bind(controller));
router.get("/conversations/:id", controller.getConversation.bind(controller));
router.post("/conversations/:id/messages", controller.postMessage.bind(controller));
router.delete("/conversations/:id", controller.deleteConversation.bind(controller));

export default router;
