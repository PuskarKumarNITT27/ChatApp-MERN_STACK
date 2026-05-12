import express from 'express'
import { getMessages, getUsers, sendMessage } from '../controllers/message.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.get("/users",isAuthenticated,getUsers);
router.get("/:receiverId",isAuthenticated,getMessages);
router.post("/send/:receiverId",isAuthenticated,sendMessage);

export default router;