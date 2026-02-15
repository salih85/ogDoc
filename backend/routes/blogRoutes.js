
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
    addBlog,
    getBlog,
    getUserBlogs,
    deleteUserPost,
    getBlogById,
    updateBlog,
    createDraft,
    shareBlog
} = require("../controllers/blogController");

const router = express.Router();

// 1. Health Check for Routing
router.get("/blog/ping", (req, res) => res.json({ message: "Blog routes active" }));

// 2. High Priority Routes (Specific)
router.post("/blog/share-post/:postId", protect, shareBlog);
router.post("/blog/create-draft", protect, createDraft);
router.get("/blog/user-blogs", protect, getUserBlogs);

// 3. Document Operations
router.post("/blog/postblog", protect, addBlog);
router.get("/blog/deleteblog/:postId", protect, deleteUserPost);
router.post("/blog/updateblog/:postId", protect, updateBlog);

// 4. Retrieval Routes (General)
router.get("/blog/:postId", getBlogById);
router.get("/viewblog/:slug", getBlog);

module.exports = router;
