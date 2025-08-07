import express from "express";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getDashboard,
} from "../controllers/adminController.js";
import auth from "../moddleware/auth.js";

const adminRouter = express.Router();

// Middleware to check if user is admin
adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", getAllComments);
//adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/blogs", getAllBlogsAdmin);
adminRouter.post("/deletecomment", deleteCommentById);
adminRouter.post("/approve-comment", approveCommentById);
adminRouter.get("/dashboard", getDashboard);

export default adminRouter;
