import express from "express";
import * as fancy from "../controllers/fancyControllers.js";

const router = express.Router();

router.get("/getPSFancy", fancy.getPSFancy);
router.get("/getPSMatchingFancy", fancy.premiumMatchingFancy);
router.post("/updateDisableSetting", fancy.updateDisableSetting);
router.get("/getDisableSetting", fancy.getDisableSetting);

router.get("/getPremiumFancy", fancy.getPremiumFancy);

export default router;