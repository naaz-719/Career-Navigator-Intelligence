import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import decisionEngineRouter from "./decision-engine/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/decision-engine", decisionEngineRouter);

export default router;
