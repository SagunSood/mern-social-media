import express from "express";
//import { login } from "../controllers/auth.js";
import passport from "passport";


const router = express.Router();

// router.post("/login", login);

router.post(
    "/login",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );
  

export default router;
