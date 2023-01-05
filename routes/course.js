const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");
const { Course, User } = require("../models");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const course = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(course);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(course);
  })
);

router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const user = req.currentUser;
      await Course.create({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: user.id,
      });
      res.status(201).json({ message: "Course successfully created!" }).setHeader('Location', '/');
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
  })
);

router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const user = req.currentUser;
      const course = await Course.findByPk(req.params.id);
      if (course.userId === user.id) {
        course.title = req.body.title;
        course.description = req.body.description;
        await Course.update(
          { title: req.body.title, description: req.body.description },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        res.status(204).end();
      } else {
        res
          .status(403)
          .json({ message: "Access Denied. Unauthorized user" })
          .end();
      }
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
    // const course = await Course.findByPk(req.params.id);
    // if (course) {
    //   course.title = req.body.title;
    //   course.description = req.body.description;
    //   await Course.update(
    //     { title: req.body.title, description: req.body.description },
    //     {
    //       where: {
    //         id: req.params.id,
    //       },
    //     }
    //   );
    //   res.status(204).end();
    // } else {
    //   res.status(400).json({ error: 'Error'});
    // }
  })
);

router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course.userId === user.id) {
      course.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(204).end();
    } else {
      res.status(403).json({ message: "Unauthorized user" }).end();
    }
  })
);

module.exports = router;
