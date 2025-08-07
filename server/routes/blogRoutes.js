import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blogController.js";
import upload from "../moddleware/multer.js";
import auth from "../moddleware/auth.js";

const blogRouter = express.Router();

// blogRouter.post("/addBlog", upload.single("image"), auth, addBlog);
// blogRouter.post("/addBlog", upload.single("image"), auth, addBlog);
// blogRouter.get("/all", getAllBlogs);
// blogRouter.get("/:blogId", getBlogById);
// blogRouter.post("/delete", auth, deleteBlogById);
// blogRouter.post("/toggle-publish", auth, togglePublish);
// blogRouter.post("/add-comment", addComment);
// blogRouter.get("/comments", getBlogComments);
// blogRouter.post("/generate", auth, generateContent);

blogRouter.post("/addBlog", upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", deleteBlogById);
blogRouter.post("/toggle-publish", togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);
blogRouter.post("/generate", generateContent);

export default blogRouter;
