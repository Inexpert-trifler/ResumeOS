import { Router } from "express";
import { RoadmapController } from "../controllers/roadmap.controller";
import { requireCurrentUser } from "../middleware/auth";

const router = Router();
const controller = new RoadmapController();

router.use(requireCurrentUser);

router.post("/", controller.generateRoadmap.bind(controller));
router.get("/", controller.listRoadmaps.bind(controller));
router.get("/:id", controller.getRoadmap.bind(controller));
router.patch("/:id/items/:itemId", controller.updateItemStatus.bind(controller));
router.delete("/:id", controller.deleteRoadmap.bind(controller));

export default router;
