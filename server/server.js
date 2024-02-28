import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb+srv://Grd-32:Grd102020@cluster0.ljcl1hq.mongodb.net/?", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Mongoose schema and model definition for Todo
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  timeOfDay: {
    type: String,
  },
});

// Create a Mongoose model using the schema
const Task = mongoose.model("Task", taskSchema);

// Initialize Express Application
const app = express();

// Set the server port either by an environment variable or use 3500 as default
const port = process.env.PORT || 5000;

// Configuring Express app with the CORDS and BodyParser libraries
app.use(cors());
app.use(bodyParser.json());

// API ROUTES
// Create a new task(Create)
app.post("/api/tasks", (req, res) => {
  const { title, description, place, timeOfDay } = req.body;

  const newTask = new Task({
    title,
    description,
    place,
    timeOfDay,
  });

  newTask.save()
    .then(() => {
      res.status(201).json({ message: "Task created successfully" });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ error: "Unable to create task", details: error });
    });
});

// Get a list of all tasks (Read All)
app.get("/api/tasks", (req, res) => {
  Task.find()
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((error) => {
      res.status(500).json({ error: "Server error", details: error });
    });
});

// Get a single task by ID (Read One)
app.get("/api/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "task not found" });
      }
      res.status(200).json(task);
    })
    .catch((error) => {
      res.status(500).json({ error: "Server error", details: error });
    });
});

// Update a task by ID (Update)
app.put("/api/tasks/:id", (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "task not found" });
      }
      res.status(200).json({ message: "task updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Server error", details: error });
    });
});

// Delete a task by ID (Delete)
app.delete("/api/tasks/:id", (req, res) => {
  // Task.findByIdAndRemove(req.params.id)
  Task.findByIdAndDelete(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).json({ message: "Task deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Server error", details: error });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
