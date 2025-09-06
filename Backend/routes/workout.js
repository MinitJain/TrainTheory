const express = require("express");
const {
  createWorkout,
  getAllWorkouts,
  getSingleWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutControllers.js");

const router = express.Router();

// GET all workouts

router.get("/", getAllWorkouts);

// GET a single  workout

router.get("/:id", getSingleWorkout);

// POST a new workout
router.post("/", createWorkout);

// DELETE a new workout
router.delete("/:id", deleteWorkout);

// update a workout
router.patch("/:id", updateWorkout);

module.exports = router;
