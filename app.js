// CLASSES
class JobApplication {
  constructor(
    company,
    role,
    status,
    dateApplied,
    recruiter = "",
    interviewDate = "",
    nextFollowUp = "",
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
    this.nextFollowUp = nextFollowUp;
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
  createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
  }

  renderApplications(applications) {
    const tableBody = document.getElementById("applicationsTableBody");
    tableBody.innerHTML = "";

    for (let application of applications) {
      const row = document.createElement("tr");

      row.appendChild(this.createCell(application.company));
      row.appendChild(this.createCell(application.role));
      row.appendChild(this.createCell(application.status));
      row.appendChild(this.createCell(application.dateApplied));
      row.appendChild(this.createCell(application.nextFollowUp || "-"));

      const cellAction = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.dataset.id = application.id;
      cellAction.appendChild(deleteButton);
      row.appendChild(cellAction);

      tableBody.append(row);
    }
  }

  updateStats(applications) {
    const totalApplications = applications.length;
    const totalApplicationsPresentation =
      document.getElementById("totalApplications");
    totalApplicationsPresentation.textContent = totalApplications;

    const numInterviews = applications.filter(
      (application) => application.status === "Interview",
    ).length;
    const interviewsCountPresentation =
      document.getElementById("interviewsCount");
    interviewsCountPresentation.textContent = numInterviews;

    const numOffers = applications.filter(
      (application) => application.status === "Offer",
    ).length;
    const offerCountPresentation = document.getElementById("offersCount");
    offerCountPresentation.textContent = numOffers;

    const numRejections = applications.filter(
      (application) => application.status === "Rejected",
    ).length;
    const rejectionCountPresentation =
      document.getElementById("rejectionsCount");
    rejectionCountPresentation.textContent = numRejections;

    const numResponses = numInterviews + numOffers + numRejections;
    const responseRatePresentation = document.getElementById("responseRate");
    responseRatePresentation.textContent = `${totalApplications === 0 ? 0 : Math.round((numResponses / totalApplications) * 100)}%`;
  }
}

class StorageService {
  static saveApplications(applications) {
    localStorage.setItem("applications", JSON.stringify(applications));
  }

  static loadApplications() {
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications === null) {
      return [];
    }

    return JSON.parse(savedApplications);
  }
}

// APP SETUP
const tracker = new ApplicationTracker();
const ui = new UIManager();

function refreshUI() {
  const applications = tracker.getApplications();

  ui.renderApplications(applications);
  ui.updateStats(applications);
}
// SAMPLE DATA
function loadSampleData() {
  const google = new JobApplication(
    "Google",
    "Software Engineer Intern",
    "Interview",
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
}
// loadSampleData();

tracker.applications = StorageService.loadApplications();
refreshUI();
// EVENT LISTENERS
const tableBody = document.getElementById("applicationsTableBody");
tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const buttonId = event.target.dataset.id;
    tracker.deleteApplication(buttonId);
    StorageService.saveApplications(tracker.getApplications());
    refreshUI();
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

const applicationForm = document.getElementById("applicationForm");

applicationForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const company = document.getElementById("companyInput").value;
  const role = document.getElementById("roleInput").value;
  const status = document.getElementById("statusInput").value;
  const dateApplied = document.getElementById("dateAppliedInput").value;
  const recruiter = document.getElementById("recruiterInput").value;
  const interviewDate = document.getElementById("interviewDateInput").value;
  const nextFollowUp = document.getElementById("nextFollowUpInput").value;
  const jobUrl = document.getElementById("jobUrlInput").value;
  const notes = document.getElementById("notesInput").value;

  const newApplication = new JobApplication(
    company,
    role,
    status,
    dateApplied,
    recruiter,
    interviewDate,
    nextFollowUp,
    jobUrl,
    notes,
  );

  tracker.addApplication(newApplication);
  StorageService.saveApplications(tracker.getApplications());
  refreshUI();
  applicationModal.classList.add("hidden");
  applicationForm.reset();
});
