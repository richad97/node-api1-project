const model = require("./users/model");

const express = require("express");

const server = express();

server.use(express.json());

// GET /api/users
server.get("/api/users", async (req, res) => {
  try {
    const fetchedUsers = await model.find();
    res.json(fetchedUsers);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The users information could not be retrieved" });
  }
});

// GET /api/users/:id
server.get("/api/users/:id", async (req, res) => {
  try {
    const fetchedUser = await model.findById(req.params.id);

    if (fetchedUser === undefined) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      res.status(200).json(fetchedUser);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user information could not be retrieved" });
  }
});

// POST /api/users
server.post("/api/users", async (req, res) => {
  try {
    const body = req.body;

    if (body.name === undefined || body.bio === undefined) {
      res
        .status(400)
        .json({ message: "Please provide name and bio for the user" });
    } else {
      const insertedUser = await model.insert({
        name: body.name,
        bio: body.bio,
      });
      res.status(201).json(insertedUser);
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the user to the database",
    });
  }
});

// DELETE /api/users/:id
server.delete("/api/users/:id", async (req, res) => {
  try {
    const fetchedUser = await model.findById(req.params.id);

    if (fetchedUser === undefined) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      model.remove(req.params.id);
      res.status(200).json(fetchedUser);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user information could not be removed" });
  }
});

// PUT /api/users/:id
server.put("/api/users/:id", async (req, res) => {
  try {
    const fetchedUser = await model.findById(req.params.id);

    if (fetchedUser === undefined) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else if (req.body.name === undefined || req.body.bio === undefined) {
      res
        .status(400)
        .json({ message: "Please provide name and bio for the user" });
    } else {
      //   res.json(fetchedUser);
      await model.update(req.params.id, { id: req.params.id, ...req.body });

      res.status(200).json({ ...req.body, id: req.params.id });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The user information could not be modified" });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
