import { Router } from "express";
import { createProforma } from "../controllers/proforma.controller.js";

const router = Router();

router.post("/", createProforma);

export default router;
