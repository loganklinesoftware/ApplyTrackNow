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
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.dataset.id = application.id;
      cellAction.appendChild(deleteButton);
      row.appendChild(cellAction);

      tableBody.append(row);
    }
  }
}

// testing data

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

// EVENT LISTENERS
const tableBody = document.getElementById("applicationsTableBody");
tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const buttonId = event.target.dataset.id;
    tracker.deleteApplication(buttonId);
    ui.renderApplications(tracker.getApplications());
  }
});

const openModalBtn = document.getElementById("openModalBtn");
const applicationModal = document.getElementById("applicationModal");
const cancelModalBtn = document.getElementById("cancelModalBtn");

openModalBtn.addEventListener("click", function () {
  applicationModal.classList.remove("hidden");
});

cancelModalBtn.addEventListener("click", function () {
  applicationModal.classList.add("hidden");
});

const submitAppBtn = document.getElementById("submitApplicationBtn");

submitAppBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const company = document.getElementById("companyInput").value;
  const role = document.getElementById("roleInput").value;
  const status = document.getElementById("statusInput").value;
  const dateApplied = document.getElementById("dateAppliedInput").value;
  const recruiter = document.getElementById("recruiterInput").value;
  const interviewDate = document.getElementById("interviewDateInput").value;
  const jobUrl = document.getElementById("jobUrlInput").value;
  const notes = document.getElementById("notesInput").value;

  const newApplication = new JobApplication(
    company,
    role,
    status,
    dateApplied,
    recruiter,
    interviewDate,
    jobUrl,
    notes,
  );

  tracker.addApplication(newApplication);

  ui.renderApplications(tracker.getApplications());

  applicationModal.classList.add("hidden");

  applicationForm.reset();
});
