const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");
const { User } = require("../models");


router.get('/', authenticateUser, asyncHandler (async(req, res) => {
    const user = req.currentUser;
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    password: user.password,
  });
}))


router.post('/', asyncHandler(async(req, res) => {
      try {
        await User.create(req.body);
        res.status(201).json({ message: "Account successfully created!" }).setHeader('Location','/');
      } catch (error) {
        if (
          error.name === "SequelizeValidationError" ||
          error.name === "SequelizeUniqueConstraintError"
        ) {
          const errors = error.errors.map((err) => err.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
}))

module.exports = router