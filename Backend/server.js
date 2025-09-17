const express = require("express");
require("dotenv").config();

const workoutRoutes = require("./routes/workout");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Workout API 🚀");
  9;
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/workouts", workoutRoutes);

//connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 4000", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
