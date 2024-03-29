export default class Student {
  static async list(search) {
    let res = await fetch(`/api/students?q=${search}`);
    let data = await res.json();
    return data.students;
  }

  static async load(id) {
    let res = await fetch(`/api/students/${id}`);
    let data = await res.json();
    if (res.status === 200) {
      return new Student(data);
    }
    throw new Error(data.error);
  }

  constructor(data) {
    /* Copy all key/values from data and put them in this */
    Object.assign(this, data);

    this._uri = `/api/students/${this.id}`;
  }

  async listCourses() {
    let res = await fetch(`${this._uri}/courses`);
    let json = await res.json();
    return json.courses;
  }

  async enroll(code, units) {
    let res = await fetch(`${this._uri}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, units: units })
    });
    let data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.error);
    }
    
    /* Reload the student to update instance variables */
    let res2 = await fetch(this._uri);
    let data2 = await res2.json();
    Object.assign(this, data2);
  }

  async update(body) {
    let res = await fetch(this._uri, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    let data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.error);
    }
    Object.assign(this, data);
  }
}
