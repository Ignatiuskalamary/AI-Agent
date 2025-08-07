import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";
import main from "../configs/geminiapi.js";

export const addBlog = async (req, res) => {
  try {
    console.log("Acoming1");
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const publishedStatus = isPublished === "true";
    console.log(isPublished);
    const imageFile = req.file;
    console.log("Acoming2");
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    //Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    //optimize image URL
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          width: "1280",
        },
        //   height: "600",
        { quality: "auto" }, // Automatically adjust quality for better performance
        //   crop: "scale",
        { format: "webp" }, // Convert to WebP format for better performance
      ],
    });
    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished: publishedStatus, // Convert string to boolean
    });
    res.json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
    console.error("Error in addBlog:", error);
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.error("Error in getAllBlogs:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.error("Error in getBlogById:", error);
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);

    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.error("Error in deleteBlogById:", error);
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.error("Error in togglePublish:", error);
  }
};

// export const addComment = async (req, res) => {
//   try {
//     const { blog, name, content } = req.body;
//     console.log("Adding comment:", { blog, name, content });
//     await Comment.create({
//       blog,
//       name,
//       content,
//       // Default to false, admin will approve later
//     });
//     res.json({ success: true, message: "Comment added for review" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//     console.error("Error in addComment:", error);
//   }
// };

export const addComment = async (req, res) => {
  try {
    const { blog, name, comment } = req.body;

    // Validate that `blog` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blog)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog ID" });
    }

    await Comment.create({ blog, name, comment });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.error("Error in addComment:", error);
  }
};

export const getBlogComments = async (req, res) => {
  try {
    console.log("comm");
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.error("Error in getBlogComments:", error);
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate a blog content for this topic in simple text format"
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
