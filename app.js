class JobApplication {
  constructor(
    company,
    role,
    status,
    dateApplied,
    recruiter = "",
    interviewDate = "",
    jobUrl = "",
    notes = "",
  ) {
    this.id = crypto.randomUUID();

    this.company = company;
    this.role = role;
    this.status = status;
    this.dateApplied = dateApplied;

    this.recruiter = recruiter;
    this.interviewDate = interviewDate;
    this.jobUrl = jobUrl;
    this.notes = notes;
  }
}

class ApplicationTracker {
  constructor() {
    this.applications = [];
  }

  addApplication(application) {
    this.applications.push(application);
  }

  deleteApplication(id) {
    this.applications = this.applications.filter(
      (application) => application.id !== id,
    );
  }

  getApplications() {
    return this.applications;
  }
}

class UIManager {
  renderApplications(applications) {
    let tableBody = document.getElementById("applicationsTableBody");
    tableBody.innerHTML = "";

    for (let application of applications) {

      let row = document.createElement("tr");

      let cellCompany = document.createElement("td");
      cellCompany.textContent = application.company;
      row.appendChild(cellCompany);

      let cellRole = document.createElement("td");
      cellRole.textContent = application.role;
      row.appendChild(cellRole);

      let cellStatus = document.createElement("td");
      cellStatus.textContent = application.status;
      row.appendChild(cellStatus);

      let cellDate = document.createElement("td");
      cellDate.textContent = application.dateApplied;
      row.appendChild(cellDate);

      let cellFollow = document.createElement("td");
      cellFollow.textContent = "Today";
      row.appendChild(cellFollow);
      
      let cellAction = document.createElement("td");
      cellAction.textContent = "DELETE";
      row.appendChild(cellAction);

      tableBody.append(row);
    }
  }
}

// testing

const tracker = new ApplicationTracker();

const google = new JobApplication(
  "Google",
  "Software Engineer Intern",
  "Applied",
  "2026-06-26",
);

const amazon = new JobApplication(
  "Amazon",
  "Frontend Engineer",
  "Applied",
  "2026-06-27",
);

tracker.addApplication(google);
tracker.addApplication(amazon);
console.log(tracker.getApplications());
// tracker.deleteApplication(google.id);
console.log(tracker.getApplications());
const ui = new UIManager();
ui.renderApplications(tracker.getApplications());
