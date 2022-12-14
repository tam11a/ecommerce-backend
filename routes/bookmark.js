const express = require("express");
const { getForUser, createOrDelete } = require("../controllers/bookmark");
const { protect } = require("../middleware/auth");
const { query } = require("../middleware/query");
const router = express.Router();

// Get Bookmarks API
/**
 * @swagger
 * /api/bookmark:
 *  get:
 *    tags: [Bookmark]
 *    summary: Get Bookmarks for User
 *    parameters:
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/").get(protect, query, getForUser);


// Add or remove bookmark API
/**
 * @swagger
 * /api/bookmark/{productId}:
 *  put:
 *    tags: [Bookmark]
 *    summary: Create & Remove Bookmark
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        type: string
 *        description: Product Id
 *    responses:
 *      201:
 *        description: create successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:product_id").put(protect, createOrDelete);

module.exports = router;
