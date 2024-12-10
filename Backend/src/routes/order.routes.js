import { Router } from "express";

import {
    createOrder,
    getAllOrders,
} from "../controllers/order.controllers.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


router.route("/assign").post(createOrder) //testing-done
router.route("/").get(getAllOrders) //testing-done


export default router;
