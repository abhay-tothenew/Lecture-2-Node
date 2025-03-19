const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4001;

app.use(cors());
app.use(bodyParser.json());

function readStudents() {
  try {
    const data = fs.readFileSync("d:/node/Lecture-2/students.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeStudents(students) {
  fs.writeFileSync("students.json", JSON.stringify(students, null, 2));
}

app.get("/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});

app.post("/students/create", (req, res) => {
  const { name, branch, grade } = req.body;
  const students = readStudents();

  console.log("students", students);

  students.push({
    id: students.length + 1,
    name,
    branch,
    grade,
  });
  writeStudents(students);
  res.json({ message: "Student added successfully" });
});

app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { grade } = req.body;
  let students = readStudents();
  students = students.map((student) => {
    if (student.id === id) {
      return {
        grade,
      };
    }
    return student;
  });
  writeStudents(students);
  res.json({ message: "Student updated successfully" });
});

app.get("/students/branch", (req, res) => {
  const { branch } = req.query;
  const students = readStudents();
  const filteredStudents = students.filter(
    (student) => student.branch === branch
  );
  res.json(filteredStudents);
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  let students = readStudents();
  students = students.filter((student) => student.id !== id);
  writeStudents(students);
  res.json({ message: "Student deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is on http://localhost:${PORT}`);
});
