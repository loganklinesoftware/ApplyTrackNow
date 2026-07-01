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

  findApplication(id) {
    return this.applications.find((application) => application.id === id);
  }

  updateApplication(id, updatedData) {
    const application = this.findApplication(id);
    if (!application) {
      return;
    }

    application.company = updatedData.company;
    application.role = updatedData.role;
    application.status = updatedData.status;
    application.dateApplied = updatedData.dateApplied;
    application.recruiter = updatedData.recruiter;
    application.interviewDate = updatedData.interviewDate;
    application.nextFollowUp = updatedData.nextFollowUp;
    application.jobUrl = updatedData.jobUrl;
    application.notes = updatedData.notes;
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

    if (applications.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.textContent =
        "No applications yet. Click + Add Applicaiton to get started.";
      cell.colSpan = 6;
      cell.classList.add("empty-state");

      row.appendChild(cell);
      tableBody.append(row);

      return;
    }

    for (let application of applications) {
      const row = document.createElement("tr");

      row.appendChild(this.createCell(application.company));
      row.appendChild(this.createCell(application.role));
      //   row.appendChild(this.createCell(application.status));
      row.appendChild(this.createStatusCell(application.status));
      row.appendChild(this.createCell(application.dateApplied));
      row.appendChild(this.createCell(application.nextFollowUp || "-"));

      const cellAction = document.createElement("td");

      // Edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit-btn");
      editButton.dataset.id = application.id;

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.dataset.id = application.id;

      cellAction.appendChild(editButton);
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

  createStatusCell(status) {
    const cell = document.createElement("td");

    const badge = document.createElement("span");

    badge.textContent = status;

    badge.classList.add("status-badge");
    badge.classList.add(`status-${status.toLowerCase()}`);

    cell.appendChild(badge);

    return cell;
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

let editingApplicationId = null;

tracker.applications = StorageService.loadApplications();
refreshUI();

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

// EVENT LISTENERS
const tableBody = document.getElementById("applicationsTableBody");
tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    const buttonId = event.target.dataset.id;
    const application = tracker.findApplication(buttonId);

    if (!application) {
      return;
    }

    editingApplicationId = buttonId;

    document.getElementById("modalTitle").textContent = "Edit Application";
    document.getElementById("submitApplicationBtn").textContent =
      "Update Application";
    document.getElementById("companyInput").value = application.company;
    document.getElementById("roleInput").value = application.role;
    document.getElementById("statusInput").value = application.status;
    document.getElementById("dateAppliedInput").value = application.dateApplied;
    document.getElementById("recruiterInput").value = application.recruiter;
    document.getElementById("interviewDateInput").value =
      application.interviewDate;
    document.getElementById("nextFollowUpInput").value =
      application.nextFollowUp;
    document.getElementById("jobUrlInput").value = application.jobUrl;
    document.getElementById("notesInput").value = application.notes;

    applicationModal.classList.remove("hidden");
  }

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
const applicationForm = document.getElementById("applicationForm");
openModalBtn.addEventListener("click", function () {
  editingApplicationId = null;
  applicationForm.reset();
  document.getElementById("modalTitle").textContent = "Add Application";
  document.getElementById("submitApplicationBtn").textContent =
    "Add Application";
  applicationModal.classList.remove("hidden");
});

cancelModalBtn.addEventListener("click", function () {
  editingApplicationId = null;
  applicationForm.reset();
  applicationModal.classList.add("hidden");
});

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

  const applicationData = {
    company,
    role,
    status,
    dateApplied,
    recruiter,
    interviewDate,
    nextFollowUp,
    jobUrl,
    notes,
  };

  if (editingApplicationId === null) {
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
  } else {
    tracker.updateApplication(editingApplicationId, applicationData);

    editingApplicationId = null;
  }

  StorageService.saveApplications(tracker.getApplications());
  refreshUI();
  applicationModal.classList.add("hidden");
  applicationForm.reset();
});
