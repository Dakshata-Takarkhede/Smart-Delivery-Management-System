import { Router } from "express";

import { 
    getDashboardMetrics
} from "../controllers/dashboardMatrics.controllers.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getDashboardMetrics); //testing-done


export default router