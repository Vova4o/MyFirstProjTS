import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const auth = Router();

auth.post("/register", registerUser);
auth.post("/login", loginUser);

export default auth;