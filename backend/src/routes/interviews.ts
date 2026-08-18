import { Router } from "express";
import { InterviewController } from "../controllers/interview.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
const controller = new InterviewController();

router.use(requireCurrentUser);

router.post("/sessions", controller.createSession.bind(controller));
router.get("/sessions", controller.listSessions.bind(controller));
router.get("/sessions/:id", controller.getSession.bind(controller));
router.post("/sessions/:id/questions", controller.generateQuestions.bind(controller));
router.post("/sessions/:sessionId/answers", controller.submitAnswer.bind(controller));
router.post("/sessions/:sessionId/evaluate", controller.evaluateSession.bind(controller));

export default router;
