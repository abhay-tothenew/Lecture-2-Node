const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const port = 3000;

const users_data = "d:/node/Lecture-2/users.json";

function getUsers() {
  try {
    const data = fs.readFileSync(users_data, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading file", e);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(users_data, JSON.stringify(users));
  } catch (e) {
    console.error("Error writing file", e);
  }
}

//SEARCH users

app.get("/users/search", (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).send("Query is required");
      return;
    }

    const users = getUsers();

    const filter_search = users.filter((user) => {
      return user.Username.toLowerCase().includes(query.toLowerCase());
    });

    return res.status(200).send(filter_search);
  } catch (e) {
    res.status(500).send("Error getting users");
  }
});

//GET users

app.get("/users", (req, res) => {
  try {
    const users = getUsers();

    res.status(200).send({
      users,
    });
  } catch (err) {
    res.status(500).send("Error getting users");
  }
});

//CREATE user

app.post("/users/create", (req, res) => {
  try {
    const { Username, Password, FirstName, LastName } = req.body;

    let users = getUsers();

    users.push({
      Username,
      Password,
      FirstName,
      LastName,
    });

    writeUsers(users);

    res.send(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
