import express from "express";
import passport from "../config/passport.js";
import userController from "../controllers/user-controller.js";

const oAuthRouter = express.Router();

oAuthRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
oAuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/oauth/failed" }),
  userController.loginOAuth
);

oAuthRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
oAuthRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/api/oauth/failed" }),
  userController.loginOAuth
);

oAuthRouter.get("/failed", (req, res) => {
  res.status(401).json({ message: "OAuth authentication failed" });
});

export default oAuthRouter;