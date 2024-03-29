import bodyParser from "body-parser";
import express from "express";

const DATABASE_NAME = "lect14_db";

const NAMES = [
  ["Michael", "Chang"], ["Neel", "Kishnani"], ["Kashif", "Nazir"]
];
const STUDENTS = {};
const COURSES = {};
for (let [givenName, surname] of NAMES) {
  let id = (givenName[0] + surname).toLowerCase();
  STUDENTS[id] = { id, givenName, surname, dept: null, units: 0 };
  COURSES[id] = [];
}

let myApi = express.Router();
const initApi = (app) => {
  app.use("/api", myApi);
};

/* Interpret request bodies as JSON and store them in req.body */
myApi.use(bodyParser.json());

myApi.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

myApi.get("/students", (req, res) => {
  let students = Object.values(STUDENTS);
  let search = req.query.q;
  if (search) {
    students = [];
    for (let student of Object.values(STUDENTS)) {
      /* Check if the query is contained in each student's name */
      let name = `${student.givenName} ${student.surname}`.toLowerCase();
      if (name.includes(search.toLowerCase())) students.push(student);
    }
  }
  res.json({ students });
});

/* Middleware */
myApi.use("/students/:id", (req, res, next) => {
  let id = req.params.id;
  let student = STUDENTS[id];
  if (!student) {
    res.status(404).json({ error: "Unknown student" });
    return;
  }
  /* Store the student so the handler can get it */
  res.locals.student = student;
  /* "Keep going": call the handler */
  next();
});

myApi.get("/students/:id", (req, res) => {
  let student = res.locals.student;
  res.json(student);
});

myApi.patch("/students/:id", (req, res) => {
  let student = res.locals.student;
  student.dept = req.body.dept;
  res.json(student);
});

/*** This part was added after lecture ***/

myApi.get("/students/:id/courses", (req, res) => {
  let student = res.locals.student;
  let courses = COURSES[student.id];
  res.json({ courses: courses });
});

myApi.post("/students/:id/courses", (req, res) => {
  let student = res.locals.student;
  let courses = COURSES[student.id];
  let code = req.body.code;
  let units = req.body.units;
  courses.push({ code, units });
  student.units += units;
  res.json({ success: true });
});

export default initApi;
