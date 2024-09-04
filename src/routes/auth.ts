import { Router } from "express";
import { registerUser, authUser, loginUser } from "../controllers/auth.controller";

const auth = Router();

auth.post("/register", registerUser);
auth.get("/authorise", authUser);
auth.post('/login', loginUser);
export default auth;