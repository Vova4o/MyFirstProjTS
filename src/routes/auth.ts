import { Router } from "express";
import { registerUser, authUser, loginUser, registerWithPasswordUser, loginWithPasswordUser } from "../controllers/auth.controller";

const auth = Router();

auth.post("/register", registerUser);
auth.get("/authorise", authUser);
auth.post('/login', loginUser);
auth.post('/registerwithpassword', registerWithPasswordUser);
auth.post('/loginwithpassword', loginWithPasswordUser);
export default auth;