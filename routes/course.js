const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");
const { Course } = require('../models')

router.get('/', asyncHandler(async(req, res) => {
    const courses = req.currentCourse
    console.log(courses)
    res.status(200).json({
        title: courses.title,
        description: courses.description,
        time: courses.estimatedTime,
        materials: courses.materialsNeeded,
        userId: courses.userId
    })
}))

router.get('/:id', asyncHandler(async(req, res) => {
}))

router.post('/', authenticateUser, asyncHandler(async(req, res) => {
          try {
            await Course.create(req.body);
            res.status(201).json({ message: "Course successfully created!" });
            res.location("/");
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

router.put('/:id', authenticateUser, asyncHandler(async(req, res) => {

}))

router.delete('/:id', authenticateUser, asyncHandler(async(req, res) => {
    
}))


module.exports = router