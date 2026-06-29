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
tracker.deleteApplication(google.id);
console.log(tracker.getApplications())