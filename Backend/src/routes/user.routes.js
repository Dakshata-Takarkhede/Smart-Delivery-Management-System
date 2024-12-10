import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getAllUsers,
} from "../controllers/user.controllers.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    registerUser
); //testing-done

router.route("/login").post(loginUser); //testing-done

//secured routes
router.route("/logout").post(verifyJWT, logoutUser); //testing-done

router.route("/refresh-token").post(refreshAccessToken); //testing-done

router.route("/change-password").post(verifyJWT, changeCurrentPassword); //testing-done

router.route("/current-user").get(verifyJWT, getCurrentUser); //testing-done

router.route("/update-account").patch(verifyJWT, updateAccountDetails); //testing-done

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar); //testing-done

router.route('/').get(getAllUsers); 


export default router;