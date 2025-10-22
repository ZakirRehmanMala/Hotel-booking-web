const express = require("express");
const router = express.Router();
router.get("/users", async (req, res) => {
    res.send("Get for users");
});
router.get("/users/:id", async (req, res) => {
    res.send("Get One USer of users");
});
router.post("/users", async (req, res) => {
    res.send("Get For Users");
});
router.delete("/users/:id", async (req, res) => {
    res.send("delete user of ID");
});
module.exports = router