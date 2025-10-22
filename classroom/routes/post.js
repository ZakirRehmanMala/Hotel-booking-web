const express = require("express")
const router = express.Router()

/////posts
router.get("/posts", async (req, res) => {
    res.send("Get for posts users");
});
router.get("/posts/:id", async (req, res) => {
    res.send("Get One  USer of posts");
});
router.post("/posts", async (req, res) => {
    res.send("Post For Users of posts");
});
router.delete("/posts/:id", async (req, res) => {
    res.send("delete user of ID of posts");
});
module.exports = router