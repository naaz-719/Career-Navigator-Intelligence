import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import decisionEngineRouter from "./decision-engine/index.js";
import copilotRouter from "./copilot/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/decision-engine", decisionEngineRouter);
router.use("/copilot", copilotRouter);

export default router;
