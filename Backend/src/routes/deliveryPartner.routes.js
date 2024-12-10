import { Router } from "express";

import {
    createPartner,
    getAllPartners,
    updatePartner,
    deletePartner,
    updatePartnerMetrics,
} from "../controllers/deliveryPartner.controllers.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/")
.post(createPartner) //testing-done
.get(getAllPartners) //testing-done

router.route("/:partnerId")
.patch(updatePartner) //testing-done
.delete(deletePartner)


router.route("/order/:orderId").patch(updatePartnerMetrics) //testing-done


export default router;