import { Router } from "express";
import { CoverLetterController } from "../controllers/cover-letter.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
const controller = new CoverLetterController();

router.use(requireCurrentUser);

router.post("/", controller.generate.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/:id", controller.get.bind(controller));
router.patch("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
