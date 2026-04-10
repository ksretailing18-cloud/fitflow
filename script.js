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

const isPurchased = () => localStorage.getItem("fitflowPurchased") === "true";

const getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);
const checkoutStatus = getQueryParam("checkout");

if (checkoutStatus === "success") {
  localStorage.setItem("fitflowPurchased", "true");
}

const programLinks = document.querySelectorAll('.site-nav a[href="program.html"]');
if (!isPurchased() && programLinks.length) {
  programLinks.forEach((link) => {
    link.style.display = "none";
  });
}

if (checkoutStatus === "cancel") {
  const purchaseMessageNode = document.getElementById("purchaseMessage");
  if (purchaseMessageNode) {
    purchaseMessageNode.textContent = "Payment was canceled. Try again or select a different plan.";
    purchaseMessageNode.className = "form-message error";
  }
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

const purchaseForm = document.getElementById("purchaseForm");
const purchaseMessage = document.getElementById("purchaseMessage");
if (purchaseForm && purchaseMessage) {
  purchaseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!purchaseForm.checkValidity()) {
      purchaseMessage.textContent = "Please select a plan and enter your details.";
      purchaseMessage.className = "form-message error";
      return;
    }

    const planValue = document.getElementById("purchasePlan").value;

    try {
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: planValue })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      purchaseMessage.textContent = error.message;
      purchaseMessage.className = "form-message error";
    }
  });
}

const programForm = document.getElementById("programForm");
const programResult = document.getElementById("programResult");
if (window.location.pathname.endsWith("program.html") && !isPurchased()) {
  const mainContent = document.querySelector("main");
  if (mainContent) {
    mainContent.innerHTML = `
      <section class="section">
        <div class="container">
          <article class="card reveal">
            <h2>Program Locked</h2>
            <p class="lead">You must purchase a FitFlow plan before creating a workout program.</p>
            <a class="btn btn-primary" href="purchase.html">Buy FitFlow</a>
          </article>
        </div>
      </section>
    `;
  }
}

if (programForm && programResult && isPurchased()) {
  programForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!programForm.checkValidity()) {
      programResult.innerHTML = `<p class="form-message error">Please complete all fields to generate your workout split.</p>`;
      return;
    }

    const schedule = document.getElementById("programSchedule").value.trim();
    const goal = document.getElementById("programGoal").value;
    const level = document.getElementById("programExperience").value;
    const availability = document.getElementById("programAvailability").value;
    const focus = document.getElementById("programFocus").value;

    const scheduleNote = schedule
      ? `Class schedule detected: ${schedule}. Workouts are arranged around your busiest days.`
      : "No schedule entered; this split uses a student-friendly weekly pattern.";

    let planDays = [];
    if (availability === "2-3") {
      planDays = [
        {
          day: "Monday",
          title: "Full Body Foundation",
          details:
            "Squats, bench press, and rows. Focus on movement quality with 3 sets of 8-10 reps."
        },
        {
          day: "Wednesday",
          title: "Lower Body + Core",
          details:
            "Deadlift variation, lunges, and plank work. Build strength with controlled tempo."
        },
        {
          day: "Friday",
          title: "Upper Body + Conditioning",
          details:
            "Overhead press, pull-ups, and core stability. Finish with light cardio or conditioning."
        }
      ];
    } else if (availability === "4") {
      planDays = [
        {
          day: "Monday",
          title: "Upper Push",
          details: "Bench press, shoulder press, and triceps work. 3–4 sets of 6–10 reps."
        },
        {
          day: "Tuesday",
          title: "Lower Strength",
          details: "Squats, Romanian deadlifts, and lunges. Build lower-body strength safely."
        },
        {
          day: "Thursday",
          title: "Upper Pull",
          details: "Rows, pull-ups, and rear delt work with 3–4 sets of 8–12 reps."
        },
        {
          day: "Friday",
          title: "Full Body Finish",
          details: "Deadlift variation, kettlebell swings, and mobility drills for balanced recovery."
        }
      ];
    } else {
      planDays = [
        {
          day: "Monday",
          title: "Push Focus",
          details: "Bench press, overhead press, and chest accessory work."
        },
        {
          day: "Tuesday",
          title: "Pull Focus",
          details: "Rows, pull-ups, and biceps training for vertical and horizontal pull strength."
        },
        {
          day: "Wednesday",
          title: "Legs & Core",
          details: "Squats, lunges, hamstring work, and core stability exercises."
        },
        {
          day: "Thursday",
          title: "Upper Hypertrophy",
          details: "Light press variations, lateral raises, and higher-rep shoulder work."
        },
        {
          day: "Friday",
          title: "Strength & Recovery",
          details: "Deadlift variation, mobility flow, and active recovery training."
        }
      ];
    }

    const focusLabel = focus || "Balanced";
    const goalLabel = goal || "General Fitness";
    const levelLabel = level || "Beginner";

    programResult.innerHTML = `
      <h3>${goalLabel} Workout Split (${levelLabel})</h3>
      <p class="lead">${scheduleNote}</p>
      <p class="lead">Training focus: ${focusLabel}. ${availability === "2-3" ? "A compact, high-impact split fits your busy week." : availability === "4" ? "A consistent 4-day plan with built-in recovery." : "A 5-day training split with clear session focus."}</p>
      <div class="plan-grid">
        ${planDays
          .map(
            (item) => `
            <article class="plan-day">
              <strong>${item.day} — ${item.title}</strong>
              <p>${item.details}</p>
            </article>
          `
          )
          .join("")}
      </div>
    `;
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

    const dayOrder =
      availability === "2-3"
        ? ["Monday", "Wednesday", "Friday"]
        : availability === "4"
          ? ["Monday", "Tuesday", "Thursday", "Friday"]
          : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const goalPlans = {
      "Muscle Gain": [
        {
          title: "Upper Strength",
          details: "Chest, back, shoulders, and arms built with compound lifts and hypertrophy volume.",
          bullets: [
            "Warm-up: band pull-aparts, scapular push-ups, light dumbbell presses.",
            "Main lift: 4x6 bench press, 3x8 incline row.",
            "Accessory: 3x10 dumbbell shoulder press, 3x12 hammer curls.",
            "Finish: core plank ladder and 5 min row cooldown.",
          ],
        },
        {
          title: "Lower Hypertrophy",
          details: "Quadriceps, hamstrings, glutes and posterior chain for muscle-building legs.",
          bullets: [
            "Warm-up: hip hinge drills, bodyweight squats, leg swings.",
            "Main lift: 4x8 back squat or front squat.",
            "Accessory: 3x10 Romanian deadlifts, 3x12 walking lunges.",
            "Finish: 3x15 glute bridges and mobility for hips.",
          ],
        },
        {
          title: "Full Body Volume",
          details: "A full-body session that reinforces compound strength with extra accessory work.",
          bullets: [
            "Warm-up: dynamic warm-up and kettlebell swings.",
            "Main lift: 3x8 deadlift or trap-bar deadlift.",
            "Accessory: 3x10 pull-ups, 3x12 dumbbell bench press.",
            "Finish: 2 rounds of conditioning and abdominal stability work.",
          ],
        },
        {
          title: "Upper/Lower Repeat",
          details: "Repeat upper and lower focus sessions with tighter rest for a 4-day split.",
          bullets: [
            "Warm-up: shoulder and hip prep.",
            "Main lift: 4x6 incline press or front squat.",
            "Accessory: 3x12 rows, 3x15 leg curl variations.",
            "Finish: core circuit and full-body mobility.",
          ],
        },
        {
          title: "Recovery & Movement",
          details: "Active recovery with mobility, stability, and a light metabolic finisher.",
          bullets: [
            "Warm-up: joint rotations and foam rolling.",
            "Main work: bodyweight circuit, glute activation, plank variations.",
            "Accessory: 3x12 banded monster walks and thoracic mobility.",
            "Finish: 10 min walk or bike and stretching.",
          ],
        },
      ],
      "Fat Loss": [
        {
          title: "Circuit Strength",
          details: "Mixed strength and metabolic conditioning with short rest intervals.",
          bullets: [
            "Warm-up: jump rope, hip mobility, dynamic plank.",
            "Main circuit: 3 rounds of goblet squats, push-ups, TRX rows.",
            "Accessory: kettlebell swings and walking lunges.",
            "Finish: 8 min interval bike or stair climber.",
          ],
        },
        {
          title: "Push/Pull Intervals",
          details: "Upper-body interval training paired with core and conditioning.",
          bullets: [
            "Warm-up: shoulder circles and banded face pulls.",
            "Main lift: 3x8 dumbbell bench press, 3x10 bent-over row.",
            "Accessory: 3x12 shoulder taps and mountain climbers.",
            "Finish: 10 min HIIT or sled push alternative.",
          ],
        },
        {
          title: "Legs + Conditioning",
          details: "Lower-body energy systems work plus mobility to maintain performance.",
          bullets: [
            "Warm-up: lunges, ankle mobility, glute activation.",
            "Main lift: 4x10 split squat or Romanian deadlift.",
            "Accessory: 3x15 step-ups and calf raises.",
            "Finish: 12 min EMOM bike and stretch.",
          ],
        },
        {
          title: "Full Body Burner",
          details: "A full-body metabolic session that supports fat loss with strength elements.",
          bullets: [
            "Warm-up: quick bodyweight drills and banded warm-up.",
            "Main circuit: 4 rounds of thrusters, pull-ups, kettlebell swings.",
            "Accessory: core stability and glute bridges.",
            "Finish: 5 min sled or sprint alternative.",
          ],
        },
        {
          title: "Recovery & Mobility",
          details: "Light active recovery plus movement prep to keep training consistent.",
          bullets: [
            "Warm-up: yoga flow and foam rolling.",
            "Main work: mobility drills, glute activation, hip stability.",
            "Accessory: 3x10 bird dogs and side plank holds.",
            "Finish: breathing practice and hip stretch sequence.",
          ],
        },
      ],
      "Strength": [
        {
          title: "Heavy Push",
          details: "Barbell bench and overhead press work with strength-building accessories.",
          bullets: [
            "Warm-up: shoulder prep and barbell warm-up sets.",
            "Main lift: 5x5 bench press or close-grip bench.",
            "Accessory: 4x6 incline dumbbell press, 3x8 dips.",
            "Finish: core stability and tempo plank holds.",
          ],
        },
        {
          title: "Heavy Pull",
          details: "Deadlift focus with heavy posterior chain work and grip conditioning.",
          bullets: [
            "Warm-up: banded pull-aparts and hinge activation.",
            "Main lift: 5x3 deadlift or trap-bar deadlift.",
            "Accessory: 4x8 barbell rows, 3x10 face pulls.",
            "Finish: farmer carries and lower-back mobility.",
          ],
        },
        {
          title: "Leg Strength",
          details: "Squat and leg strength emphasis with stability and posterior chain support.",
          bullets: [
            "Warm-up: hip mobility and goblet squat prep.",
            "Main lift: 5x5 back squat or front squat.",
            "Accessory: 3x8 Romanian deadlifts, 3x12 split squats.",
            "Finish: single-leg glute work and calf strength.",
          ],
        },
        {
          title: "Speed & Power",
          details: "Explosive training for strength carryover with dynamic effort lifts.",
          bullets: [
            "Warm-up: jump squats and band resisted push-downs.",
            "Main lift: 6x3 speed bench or trap-bar speed pulls.",
            "Accessory: 3x10 box jumps, 3x12 kettlebell swings.",
            "Finish: mobility and recovery breathing.",
          ],
        },
        {
          title: "Recovery & Technique",
          details: "Technique-driven session with light movement, mobility, and core resilience.",
          bullets: [
            "Warm-up: movement pattern checks and joint prep.",
            "Main work: paused squats, tempo deadlift variations.",
            "Accessory: 3x12 glute bridges, 4x10 banded rows.",
            "Finish: static stretching and posture drills.",
          ],
        },
      ],
      "General Fitness": [
        {
          title: "Full Body Strength",
          details: "Balanced session with strength, stability, and conditioning elements.",
          bullets: [
            "Warm-up: dynamic warm-up and mobility flow.",
            "Main lift: 3x10 goblet squats, 3x10 push-ups.",
            "Accessory: 3x12 bent-over rows, 3x15 walking lunges.",
            "Finish: core circuit and light conditioning.",
          ],
        },
        {
          title: "Core & Mobility",
          details: "A movement-focused day with core stability and recovery-based mobility.",
          bullets: [
            "Warm-up: hip circles and shoulder mobility.",
            "Main work: plank variations, dead bugs, bird dogs.",
            "Accessory: 3x12 glute bridges and wall slides.",
            "Finish: 10 min yoga-style mobility.",
          ],
        },
        {
          title: "Upper/Lower Mix",
          details: "A mixed upper and lower body session for general strength and endurance.",
          bullets: [
            "Warm-up: active warm-up and light band work.",
            "Main lift: 3x8 dumbbell rows, 3x8 split squats.",
            "Accessory: 3x12 shoulder presses, 3x15 kettlebell swings.",
            "Finish: conditioning and cooldown stretch.",
          ],
        },
        {
          title: "Conditioning + Strength",
          details: "A light conditioning day with strength support for work capacity.",
          bullets: [
            "Warm-up: mobility and light cardio.",
            "Main circuit: 3 rounds of rowing, bodyweight squats, and push-ups.",
            "Accessory: 3x12 single-leg deadlifts.",
            "Finish: breathing practice and flexibility work.",
          ],
        },
        {
          title: "Active Recovery",
          details: "Gentle movement and mobility to recover between harder sessions.",
          bullets: [
            "Warm-up: easy bike or brisk walk.",
            "Main work: foam rolling, hip openers, thoracic rotation.",
            "Accessory: 3x15 banded monster walks, 3x10 cat-cow flow.",
            "Finish: 8 min breathing and stretching.",
          ],
        },
      ],
    };

    const levelNotes = {
      Beginner: "This preview keeps movements simple and volume manageable while reinforcing good technique.",
      "Some Experience": "You will see a bit more volume and structure, with compound lifts paired by focus.",
      Intermediate: "This plan includes higher intensity and more structured load progression for steady gains.",
    };

    const selectedSessions = goalPlans[goalLabel] || goalPlans["General Fitness"];
    const planDays = dayOrder.map((day, index) => {
      const session = selectedSessions[index % selectedSessions.length];
      return {
        day,
        title: session.title,
        details: session.details,
        bullets: session.bullets,
      };
    });

    const availabilityNote =
      availability === "2-3"
        ? "Compressed 3-session week that keeps focus on the biggest movement patterns."
        : availability === "4"
          ? "A 4-day rhythm that balances training stimulus with recovery blocks."
          : "A 5-day plan that covers strength, conditioning, and mobility across the week.";

    const scheduleNote = schedule
      ? `Detected class schedule: ${schedule}. Training is shown as if scheduled around your busiest academic blocks.`
      : "No class schedule entered yet, so this preview uses a standard school-week training layout.";

    demoResult.innerHTML = `
      <h3>${goalLabel} Plan Preview (${levelLabel})</h3>
      <p class="lead">${scheduleNote}</p>
      <p class="lead">${availabilityNote}</p>
      <p class="lead">${levelNotes[levelLabel] || levelNotes.Beginner}</p>
      <div class="plan-grid">
        ${planDays
          .map(
            (item) => `
          <article class="plan-day">
            <strong>${item.day} — ${item.title}</strong>
            <p>${item.details}</p>
            <ul>
              ${item.bullets.map((line) => `<li>${line}</li>`).join("")}
            </ul>
          </article>
        `
          )
          .join("")}
      </div>
    `;
  });
}
