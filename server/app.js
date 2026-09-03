const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { errorHandler, notFoundHandler } = require("./error-handling.js")

const PORT = 5005;

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// STATIC DATA
// Import the provided files with JSON data of students and cohorts here:
// ...

const Cohort = require("./models/CohortModel");
const Student = require("./models/StudentsModel");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ["http://localhost:5173", "http://example.com"], // Add the URLs of allowed origins to this array
  }),
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// get all the cohort
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => res.json(cohorts))
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

// create a cohort
app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res.status(500).json("error in cohort creation");
    });
});

//specific cohort
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findById(req.params.cohortId);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json("Cohort Id does not exit.");
  }
});

//updates a specific cohort

app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const response = await Cohort.findByIdAndUpdate(
      req.params.cohortId,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    res.status(201).json(response);
  } catch (error) {
    next(error)
  }
});

//cohort delete
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res.sendStatus(204);
  } catch {
    res.status(500).json("failed to delete");
  }
});

// Create a student
app.post("/api/students", async (req, res) => {
  try {
    const response = await Student.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json("error in student creation");
  }
});

// Get all students
app.get("/api/students", (req, res, next) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {res.json(students)})
    .catch((error) => {
      next(error)
    });
});

// Get all students in a specific cohort
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const response = await Student.find({ cohort: req.params.cohortId })
    .populate("cohort");
    res.status(201).json(response);
  }catch(error){
   next(error)
  }
});

// Get a specific student
app.get("/api/students/:studentId", async (req, res, next) => {
  try {
    const response = await Student.findById(req.params.studentId)
    .populate("cohort");
    res.status(201).json(response);
  }catch(error){
    next(error);
  }
});

// Update a specific student
app.put("/api/students/:studentId", async (req, res, next) => {
  try {
    const response = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    res.status(201).json(response);
  }catch(error){
    next(error);
  }
});

// Delete a specific student
app.delete("/api/students/:studentId", async (req, res, error) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.sendStatus(204);
  }catch(error){
    next(error)
  }
});

app.use(errorHandler)
app.use(notFoundHandler)

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
