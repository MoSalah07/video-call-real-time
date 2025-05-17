import express, { Router } from "express";
import {
  register,
  login,
  logout,
  onboard,
  getInfoCurrentUser,
} from "../controllers/auth.controller";

import { protectRoute } from "../middleware/auth.middleware";

const router: Router = express.Router();
router.post(`/signup`, register);

router.post(`/login`, login);

router.post(`/logout`, logout);

router.post("/onboarding", protectRoute, onboard);

router.get(`/me`, protectRoute, getInfoCurrentUser);

export default router;
