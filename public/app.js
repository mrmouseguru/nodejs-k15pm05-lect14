import Student from "./student.js";

export default class App {
  constructor() {
    this._onList = this._onList.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._onUpdate = this._onUpdate.bind(this);

    let b = document.querySelector("#load");
    b.addEventListener("click", this._onLoad);
    b = document.querySelector("#list");
    b.addEventListener("click", this._onList);
    b = document.querySelector("#update");
    b.addEventListener("click", this._onUpdate);

    this._student = null;
  }

  async _onLoad(event) {
    let id = prompt("Student ID:");
    try {
      let s = await Student.load(id);
      this._student = s;
      await this._showStudent();
    } catch (e) {
      this._setResults(e.message);
    }
  }

  async _onList() {
    let query = prompt("Search:");
    let students = await Student.list(query);
    let str = "";
    for (let s of students) {
      str += `${s.givenName} ${s.surname} (${s.id})\n`;
    }
    this._setResults(str);
  }

  async _onUpdate() {
    await this._student.update({ dept: "Computer Science" });
    await this._student.enroll("CS193X", 3);
    await this._showStudent();
  }

  async _showStudent() {
    let s = this._student;
    if (!s) {
      this._setResults("No student loaded");
      return;
    }
    let str = `ID: ${s.id}\nName: ${s.givenName} ${s.surname}\nDept: ${s.dept}\nUnits: ${s.units}`;

    str += "\n\nCourses:\n";
    let courses = await s.listCourses();
    for (let course of courses) {
      str += `${course.code} (${course.units} units)\n`;
    }
    this._setResults(str);
  }

  _setResults(text) {
    document.querySelector("#results").textContent = text;
  }
}
