import express, { Router } from "express";
import { getStreamToken } from "../controllers/chat.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get(`/token`, protectRoute, getStreamToken);

export default router;
