import { Router } from "express";
import { register } from "./user/register.controller";
import { login } from "./user/login.controller";
import getActiveUser from "./user/user.controller";
import { getMessages } from "./user/message.controller";

const appRouter = Router();
appRouter.post("/user/register", register);
appRouter.post("/user/login", login);
appRouter.post("/user/message", getMessages);
appRouter.get("/user", getActiveUser);

export default appRouter;
