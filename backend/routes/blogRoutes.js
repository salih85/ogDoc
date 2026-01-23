const routes = require('express').Router()
const { getBlog,addBlog } = require('../controllers/blogController')
routes
    .route('/viewblog/:slug')
    .get(getBlog)
routes
    .route('/postblog')
    .post(addBlog)

module.exports = routes