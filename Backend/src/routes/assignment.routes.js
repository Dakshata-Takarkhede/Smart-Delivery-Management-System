import { Router } from "express";

import {
    assignOrder, 
    getAssignmentMetrics,
    failAssignment,
} from "../controllers/assignment.controllers.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:orderId").post(assignOrder) //testing-done

router.route("/assignment-metrics").get(getAssignmentMetrics) //testing-done

router.route("/fail/:assignmentId").patch(failAssignment) //testing-done


export default router