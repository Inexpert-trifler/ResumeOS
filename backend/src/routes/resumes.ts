import { Router } from "express";
import { ResumeController } from "../controllers/resume.controller";
import { requireCurrentUser } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createResumeSchema, updateResumeSchema } from "../validation/resume.validation";

const router = Router();
const controller = new ResumeController();

router.use(requireCurrentUser);
router.get("/", controller.list.bind(controller));
router.post("/", validateBody(createResumeSchema), controller.create.bind(controller));
router.get("/:id", controller.get.bind(controller));
router.patch("/:id", validateBody(updateResumeSchema), controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
