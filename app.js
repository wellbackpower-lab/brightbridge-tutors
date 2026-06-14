// BrightBridge Tutors
// This file keeps the first version simple: data is stored in browser localStorage.
// Later, the same fields can be moved into Supabase using data/schema.sql.

const STORAGE_KEYS = {
  enquiries: "bb_enquiries",
  tutors: "bb_tutors",
};

const sampleTutors = [
  {
    id: crypto.randomUUID(),
    name: "Alicia Lim",
    contact: "+65 9000 1111",
    subjects: ["Mathematics", "Science"],
    levels: ["Primary", "Secondary"],
    locations: ["East", "Central", "Online"],
    availability: ["Weekday evenings", "Flexible"],
    rate: 45,
    experience: 4,
    bio: "Patient NIE-trained relief teacher with experience preparing students for PSLE and lower secondary exams.",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Ravi Menon",
    contact: "+65 9000 2222",
    subjects: ["Physics", "Mathematics"],
    levels: ["Secondary", "JC", "IB"],
    locations: ["West", "Central", "Online"],
    availability: ["Weekend afternoons", "Flexible"],
    rate: 65,
    experience: 7,
    bio: "Engineering graduate focused on clear explanations, practice planning, and exam confidence.",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Siti Rahman",
    contact: "+65 9000 3333",
    subjects: ["English", "Chinese"],
    levels: ["Primary", "Secondary"],
    locations: ["North", "Online"],
    availability: ["Weekend mornings", "Weekday evenings"],
    rate: 50,
    experience: 5,
    bio: "Bilingual tutor who helps students improve composition, comprehension, and oral confidence.",
    createdAt: new Date().toISOString(),
  },
];

const sampleEnquiries = [
  {
    id: crypto.randomUUID(),
    studentName: "Mrs Tan for Chloe",
    contact: "+65 8123 4567",
    level: "Primary",
    subject: "Mathematics",
    location: "East",
    availability: "Weekday evenings",
    budget: 50,
    notes: "Primary 5 student preparing for PSLE foundation gaps.",
    status: "New",
    createdAt: new Date().toISOString(),
  },
];

const enquiryForm = document.querySelector("#enquiryForm");
const tutorForm = document.querySelector("#tutorForm");
const enquiriesList = document.querySelector("#enquiriesList");
const tutorsList = document.querySelector("#tutorsList");
const matchesList = document.querySelector("#matchesList");
const enquiryMessage = document.querySelector("#enquiryMessage");
const tutorMessage = document.querySelector("#tutorMessage");
const adminToggleButton = document.querySelector("#adminToggleButton");
const adminPanel = document.querySelector("#adminPanel");
const seedDataButton = document.querySelector("#seedDataButton");
const clearDataButton = document.querySelector("#clearDataButton");

function readRecords(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveRecords(key, records) {
  localStorage.setItem(key, JSON.stringify(records));
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function includesIgnoreCase(list, target) {
  return list.some((item) => item.toLowerCase() === target.toLowerCase());
}

function availabilityMatches(tutorAvailability, requestedAvailability) {
  return (
    includesIgnoreCase(tutorAvailability, requestedAvailability) ||
    includesIgnoreCase(tutorAvailability, "Flexible") ||
    requestedAvailability === "Flexible"
  );
}

function calculateMatchScore(enquiry, tutor) {
  let score = 0;
  const reasons = [];

  if (includesIgnoreCase(tutor.subjects, enquiry.subject)) {
    score += 35;
    reasons.push("subject");
  }

  if (includesIgnoreCase(tutor.levels, enquiry.level)) {
    score += 25;
    reasons.push("level");
  }

  if (includesIgnoreCase(tutor.locations, enquiry.location) || includesIgnoreCase(tutor.locations, "Online")) {
    score += 20;
    reasons.push("location");
  }

  if (availabilityMatches(tutor.availability, enquiry.availability)) {
    score += 15;
    reasons.push("availability");
  }

  if (!enquiry.budget || Number(tutor.rate) <= Number(enquiry.budget)) {
    score += 5;
    reasons.push("budget");
  }

  return { score, reasons };
}

function getMatchesForEnquiry(enquiry, tutors) {
  return tutors
    .map((tutor) => ({ tutor, ...calculateMatchScore(enquiry, tutor) }))
    .filter((match) => match.score >= 55)
    .sort((a, b) => b.score - a.score);
}

function makeParentTemplate(enquiry, match) {
  const tutor = match.tutor;
  return `Hi ${enquiry.studentName}, thanks for your tuition enquiry for ${enquiry.level} ${enquiry.subject}.

We found a potential tutor: ${tutor.name}, who teaches ${tutor.subjects.join(", ")} for ${tutor.levels.join(", ")} students.

Rate: S$${tutor.rate}/hour
Availability: ${tutor.availability.join(", ")}
Why this match: ${match.reasons.join(", ")}

Would you like us to arrange an intro call or trial lesson?`;
}

function makeTutorTemplate(enquiry, tutor) {
  return `Hi ${tutor.name}, we have a potential assignment:

Student request: ${enquiry.level} ${enquiry.subject}
Location: ${enquiry.location}
Preferred timing: ${enquiry.availability}
Budget: ${enquiry.budget ? `S$${enquiry.budget}/hour` : "Not provided"}

Are you available and interested?`;
}

function recordDate(record) {
  return new Intl.DateTimeFormat("en-SG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(record.createdAt));
}

function createPills(items) {
  return items.map((item) => `<span class="pill">${item}</span>`).join("");
}

function renderEnquiries(enquiries) {
  if (!enquiriesList) {
    return;
  }

  if (!enquiries.length) {
    enquiriesList.innerHTML = `<p class="empty">No enquiries yet.</p>`;
    return;
  }

  enquiriesList.innerHTML = enquiries
    .map(
      (enquiry) => `
        <article class="record-card">
          <strong>${enquiry.studentName}</strong>
          <p>${enquiry.level} ${enquiry.subject} in ${enquiry.location}</p>
          <div class="meta">
            <span class="pill">${enquiry.availability}</span>
            <span class="pill">${enquiry.budget ? `S$${enquiry.budget}/hr` : "Budget open"}</span>
            <span class="pill">${enquiry.status}</span>
          </div>
          <p>${enquiry.notes || "No notes added."}</p>
          <small>${enquiry.contact} - ${recordDate(enquiry)}</small>
        </article>
      `
    )
    .join("");
}

function renderTutors(tutors) {
  if (!tutorsList) {
    return;
  }

  if (!tutors.length) {
    tutorsList.innerHTML = `<p class="empty">No tutor applications yet.</p>`;
    return;
  }

  tutorsList.innerHTML = tutors
    .map(
      (tutor) => `
        <article class="record-card">
          <strong>${tutor.name}</strong>
          <p>${tutor.bio}</p>
          <div class="meta">
            ${createPills(tutor.subjects)}
            ${createPills(tutor.levels)}
            ${createPills(tutor.locations)}
          </div>
          <p>S$${tutor.rate}/hr - ${tutor.experience} years experience</p>
          <small>${tutor.contact} - ${recordDate(tutor)}</small>
        </article>
      `
    )
    .join("");
}

function renderMatches(enquiries, tutors) {
  if (!matchesList) {
    return;
  }

  if (!enquiries.length || !tutors.length) {
    matchesList.innerHTML = `<p class="empty">Add at least one enquiry and one tutor to see matches.</p>`;
    return;
  }

  matchesList.innerHTML = enquiries
    .map((enquiry) => {
      const matches = getMatchesForEnquiry(enquiry, tutors);

      if (!matches.length) {
        return `
          <article class="record-card">
            <strong>${enquiry.studentName}: ${enquiry.level} ${enquiry.subject}</strong>
            <p>No strong matches yet. Recruit more tutors for ${enquiry.subject}, ${enquiry.level}, ${enquiry.location}.</p>
          </article>
        `;
      }

      const matchCards = matches
        .slice(0, 3)
        .map(
          (match) => `
            <div class="record-card">
              <strong>${match.tutor.name} <span class="score">${match.score}/100</span></strong>
              <p>Matched on ${match.reasons.join(", ")}.</p>
              <div class="template">${makeParentTemplate(enquiry, match)}</div>
              <div class="template">${makeTutorTemplate(enquiry, match.tutor)}</div>
            </div>
          `
        )
        .join("");

      return `
        <article class="record-card">
          <strong>${enquiry.studentName}: ${enquiry.level} ${enquiry.subject}</strong>
          <div class="record-list">${matchCards}</div>
        </article>
      `;
    })
    .join("");
}

function renderDashboard() {
  const enquiries = readRecords(STORAGE_KEYS.enquiries);
  const tutors = readRecords(STORAGE_KEYS.tutors);

  renderEnquiries(enquiries);
  renderTutors(tutors);
  renderMatches(enquiries, tutors);
}

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = formToObject(enquiryForm);
  const enquiry = {
    id: crypto.randomUUID(),
    ...data,
    budget: data.budget ? Number(data.budget) : "",
    status: "New",
    createdAt: new Date().toISOString(),
  };

  const enquiries = readRecords(STORAGE_KEYS.enquiries);
  saveRecords(STORAGE_KEYS.enquiries, [enquiry, ...enquiries]);

  enquiryForm.reset();
  enquiryMessage.textContent = "Thank you. We have received your request and will review suitable tutor options.";
  renderDashboard();
});

tutorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = formToObject(tutorForm);
  const tutor = {
    id: crypto.randomUUID(),
    name: data.name,
    contact: data.contact,
    subjects: splitList(data.subjects),
    levels: splitList(data.levels),
    locations: splitList(data.locations),
    availability: splitList(data.availability),
    rate: Number(data.rate),
    experience: Number(data.experience),
    bio: data.bio,
    createdAt: new Date().toISOString(),
  };

  const tutors = readRecords(STORAGE_KEYS.tutors);
  saveRecords(STORAGE_KEYS.tutors, [tutor, ...tutors]);

  tutorForm.reset();
  tutorMessage.textContent = "Thank you. Your tutor profile has been received for review.";
  renderDashboard();
});

if (adminToggleButton && adminPanel) {
  adminToggleButton.addEventListener("click", () => {
    const isHidden = adminPanel.hidden;

    adminPanel.hidden = !isHidden;
    adminToggleButton.setAttribute("aria-expanded", String(isHidden));
    adminToggleButton.textContent = isHidden ? "Hide internal preview" : "Show internal preview";
  });
}

if (seedDataButton) {
  seedDataButton.addEventListener("click", () => {
    saveRecords(STORAGE_KEYS.enquiries, sampleEnquiries);
    saveRecords(STORAGE_KEYS.tutors, sampleTutors);
    renderDashboard();
  });
}

if (clearDataButton) {
  clearDataButton.addEventListener("click", () => {
    const confirmed = confirm("Clear all local enquiries and tutor applications on this browser?");

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.enquiries);
    localStorage.removeItem(STORAGE_KEYS.tutors);
    renderDashboard();
  });
}

renderDashboard();
