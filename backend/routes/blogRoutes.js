
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

// 1. Health Check for Routing (Verify Deployment)
router.get("/blog/ping", (req, res) => {
    console.log("Ping route hit!");
    res.json({ message: "Blog routes active", timestamp: new Date() });
});

// 2. Sharing Route (High Priority)
// Note: This matches /api/blog/share-post/:postId
router.post("/blog/share-post/:postId", protect, shareBlog);

// 3. Document Management
router.post("/blog/create-draft", protect, createDraft);
router.get("/blog/user-blogs", protect, getUserBlogs);
router.get("/blog/deleteblog/:postId", protect, deleteUserPost);
router.post("/blog/updateblog/:postId", protect, updateBlog);

// 4. Retrieval (Catch-all patterns last)
router.get("/blog/:postId", getBlogById);
router.post("/blog/postblog", protect, addBlog);
router.get("/viewblog/:slug", getBlog);

module.exports = router;
