const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const {
  getAllUsers,
  postUser,
  getRandomUser,
  updateUserById,
  updateUsersById,
  deleteUser,
} = require("../../controllers/users.controllers");

const router = require("express").Router();
router.use([morgan("dev"), cors(), express.json()]);

router.get("/all", getAllUsers);
router.get("/random", getRandomUser);
router.post("/save", postUser);
router.patch("/update/id/:id", updateUserById);
// router.patch("/bulk-update/user/:name", updateUsersById);
router.delete("/delete/:id", deleteUser);

module.exports = router;
