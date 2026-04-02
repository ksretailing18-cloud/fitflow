// Shared utilities for all pages
const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

// Mobile menu toggle for smaller screens
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

// Simple reveal animation on scroll
const revealTargets = document.querySelectorAll(".reveal");
if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((item) => revealObserver.observe(item));
}

// Homepage email signup behavior
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
if (signupForm && signupMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!signupForm.checkValidity()) {
      signupMessage.textContent = "Please enter your name and a valid email.";
      signupMessage.className = "form-message error";
      return;
    }

    signupMessage.textContent =
      "Thanks for signing up! We'll keep you updated on FitFlow.";
    signupMessage.className = "form-message success";
    signupForm.reset();
  });
}

// Optional fallback: supports a simple email form with id="emailForm"
// and a message element with id="emailMessage".
const emailForm = document.getElementById("emailForm");
const emailMessage = document.getElementById("emailMessage");
if (emailForm && emailMessage) {
  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!emailForm.checkValidity()) {
      emailMessage.textContent = "Please enter a valid email address.";
      emailMessage.className = "form-message error";
      return;
    }

    emailMessage.textContent =
      "Thanks for signing up! We'll keep you updated on FitFlow.";
    emailMessage.className = "form-message success";
    emailForm.reset();
  });
}

// Contact page form behavior
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");
if (contactForm && contactMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactMessage.textContent =
        "Please complete all fields with valid details.";
      contactMessage.className = "form-message error";
      return;
    }

    contactMessage.textContent =
      "Thanks for reaching out. We'll get back to you soon.";
    contactMessage.className = "form-message success";
    contactForm.reset();
  });
}

// How It Works demo behavior
const demoForm = document.getElementById("demoForm");
const demoResult = document.getElementById("demoResult");
if (demoForm && demoResult) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const schedule = document.getElementById("classSchedule").value.trim();
    const goal = document.getElementById("goal").value;
    const level = document.getElementById("experience").value;
    const availability = document.getElementById("availability").value;

    const goalLabel = goal || "General Fitness";
    const levelLabel = level || "Beginner";

    const days = [
      {
        day: "Monday",
        workout: "Upper Body Fundamentals + 10 min cardio finisher",
      },
      { day: "Tuesday", workout: "Mobility + Core Stability" },
      { day: "Wednesday", workout: "Lower Body Strength + Technique review" },
      { day: "Thursday", workout: "Active recovery walk + stretch session" },
      { day: "Friday", workout: "Full Body Progression Circuit" },
      { day: "Saturday", workout: "Optional Conditioning / Campus Sports" },
    ];

    // Change output text slightly to feel personalized
    const availabilityNote =
      availability === "2-3"
        ? "Plan compressed to high-impact 3 sessions."
        : availability === "4"
          ? "Balanced 4-day split with recovery built in."
          : "5-day progression split with flexibility options.";

    const scheduleNote = schedule
      ? `Detected class schedule: ${schedule}. Sessions are placed around your busiest blocks.`
      : "No class schedule entered yet, so this preview uses a standard student timetable.";

    demoResult.innerHTML = `
      <h3>${goalLabel} Plan Preview (${levelLabel})</h3>
      <p class="lead">${scheduleNote}</p>
      <p class="lead">${availabilityNote}</p>
      <div class="plan-grid">
        ${days
          .map(
            (item) => `
          <article class="plan-day">
            <strong>${item.day}</strong>
            <p>${item.workout}</p>
          </article>
        `
          )
          .join("")}
      </div>
    `;
  });
}
