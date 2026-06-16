const wedding = {
  bride: "Suhana",
  groom: "Deepak",
  date: "2026-09-19T16:30:00+04:00",
  location: "Bangalore",
  venue: "Vijayanagara Club"
};

const $all = (selector) => document.querySelectorAll(selector);
const initials = `${wedding.bride[0]}${wedding.groom[0]}`;
const weddingDate = new Date(wedding.date);

$all("[data-bride]").forEach((el) => { el.textContent = wedding.bride; });
$all("[data-groom]").forEach((el) => { el.textContent = wedding.groom; });
$all("[data-initials]").forEach((el) => { el.textContent = initials; });
$all("[data-location]").forEach((el) => { el.textContent = wedding.location; });
$all("[data-venue]").forEach((el) => { el.textContent = wedding.venue; });
$all("[data-day]").forEach((el) => { el.textContent = String(weddingDate.getDate()).padStart(2, "0"); });
$all("[data-date-title]").forEach((el) => {
  el.textContent = weddingDate.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
});
$all("[data-date-long]").forEach((el) => {
  el.textContent = `September 16-19, 2026, ${wedding.location.split(",")[0]}`;
});

const intro = document.querySelector("#intro");
const site = document.querySelector("#site");
const openInvite = document.querySelector("#openInvite");
const emberField = openInvite.querySelector(".ember-field");
const glitterFields = [
  {
    el: document.querySelector(".welcome-glitter"),
    seed: 0x2A4C91,
    boost: 1.22,
    maxY: 28,
    bandBoosts: [1.8, 1.55, 1.18, 0.35],
    maroonBias: [0.38, 0.28, 0.22, 0.16]
  },
  {
    el: document.querySelector(".reception-glitter"),
    seed: 0x5A1723,
    boost: 1.56,
    maxY: 28,
    bandBoosts: [1.95, 1.7, 1.22, 0.4],
    maroonBias: [0.78, 0.66, 0.42, 0.28]
  }
].filter(({ el }) => el);

for (let index = 0; index < 46; index += 1) {
  const angle = (Math.PI * 2 * index) / 46 + ((index % 5) - 2) * .045;
  const distance = 75 + (index % 9) * 12;
  const ember = document.createElement("span");
  ember.className = "ember";
  ember.style.setProperty("--ember-x", `${Math.cos(angle) * distance}px`);
  ember.style.setProperty("--ember-y", `${Math.sin(angle) * distance - 18}px`);
  ember.style.setProperty("--ember-size", `${1.5 + (index % 4) * .8}px`);
  ember.style.setProperty("--ember-delay", `${.22 + (index % 11) * .055}s`);
  emberField.append(ember);
}

openInvite.addEventListener("click", () => {
  if (intro.classList.contains("opening")) return;
  intro.classList.add("opening");
  openInvite.disabled = true;
  window.setTimeout(() => {
    intro.classList.add("opened");
    site.classList.add("visible");
    site.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    document.querySelector(".hero .reveal").classList.add("in-view");
  }, 3200);
});

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGlitterField(field, seed, boost, bandBoosts = [], maxY = 34, maroonBias = []) {
  field.replaceChildren();

  const rng = mulberry32(seed);
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const scale = (mobile ? 0.72 : 1) * boost;
  const fallDurationScale = 1.33;
  const bands = [
    { start: 0, end: 8, count: 84, star: 0.12, rare: 0.08 },
    { start: 8, end: 18, count: 70, star: 0.1, rare: 0.07 },
    { start: 18, end: 26, count: 50, star: 0.07, rare: 0.05 },
    { start: 26, end: 34, count: 24, star: 0.03, rare: 0.03 }
  ];

  const palette = {
    maroon: ["89, 19, 33", "121, 36, 53"],
    gold: ["224, 172, 105", "214, 155, 77"],
    highlight: ["251, 242, 225", "241, 226, 205"]
  };

  const pick = (values) => values[Math.floor(rng() * values.length)];
  const lerp = (min, max) => min + (max - min) * rng();
  const easedBandY = (start, end) => start + Math.pow(rng(), 1.25) * (end - start);

  bands.forEach((band, bandIndex) => {
    const count = Math.max(0, Math.round(band.count * scale * (bandBoosts[bandIndex] || 1)));
    for (let index = 0; index < count; index += 1) {
      const isStar = rng() < band.star;
      const isRare = !isStar && rng() < band.rare;
      const particle = document.createElement("span");
      const y = Math.min(maxY, easedBandY(band.start, band.end));
      const x = lerp(0, 100);
      const tone = y < 10
        ? (field.classList.contains("reception-glitter")
          ? (rng() < (maroonBias[0] || 0.58) ? "maroon" : rng() < 0.84 ? "gold" : rng() < 0.95 ? "highlight" : "gold")
          : (rng() < (maroonBias[0] || 0.34) ? "maroon" : rng() < 0.8 ? "gold" : rng() < 0.93 ? "highlight" : "gold"))
        : y < 25
          ? (field.classList.contains("reception-glitter")
            ? (rng() < (maroonBias[1] || 0.46) ? "maroon" : rng() < 0.8 ? "gold" : rng() < 0.92 ? "highlight" : "gold")
            : (rng() < (maroonBias[1] || 0.28) ? "maroon" : rng() < 0.78 ? "gold" : rng() < 0.91 ? "highlight" : "gold"))
          : y < 40
            ? (field.classList.contains("reception-glitter")
              ? (rng() < (maroonBias[2] || 0.26) ? "maroon" : rng() < 0.78 ? "gold" : rng() < 0.92 ? "highlight" : "gold")
              : (rng() < (maroonBias[2] || 0.26) ? "maroon" : rng() < 0.78 ? "gold" : rng() < 0.92 ? "highlight" : "gold"))
            : (rng() < (maroonBias[3] || 0.12) ? "maroon" : rng() < 0.88 ? "gold" : "highlight");

      const size = isStar
        ? lerp(1.7, 3.2) * (mobile ? 0.9 : 1)
        : isRare
          ? lerp(1.2, 2.2) * (mobile ? 0.9 : 1)
          : lerp(y < 25 ? 0.5 : 0.4, y < 40 ? 1.5 : y < 60 ? 1.1 : 0.85) * (mobile ? 0.92 : 1);

      const opacity = y < 10
        ? lerp(0.5, 0.96)
        : y < 25
          ? lerp(0.36, 0.86)
          : y < 40
            ? lerp(0.22, 0.6)
            : y < 60
              ? lerp(0.12, 0.38)
              : y < 75
                ? lerp(0.06, 0.18)
                : lerp(0.03, 0.08);

      particle.className = `glitter-particle ${isStar ? "is-star" : "is-dot"} ${isRare ? "is-rare" : ""}`.trim();
      particle.style.setProperty("--x", `${x}%`);
      particle.style.setProperty("--y", `${y}%`);
      particle.style.setProperty("--size", `${size}px`);
      particle.style.setProperty("--opacity", opacity.toFixed(3));
      particle.style.setProperty("--particle-color", `rgb(${pick(
        tone === "maroon" ? palette.maroon :
        tone === "highlight" ? palette.highlight :
        palette.gold
      )})`);
      particle.style.setProperty("--particle-glow", `rgba(${pick(
        tone === "maroon" ? palette.maroon :
        tone === "highlight" ? palette.highlight :
        palette.gold
      )}, ${tone === "maroon" ? 0.24 : tone === "highlight" ? 0.44 : 0.34})`);
      particle.style.setProperty("--rotate", `${lerp(-18, 18).toFixed(1)}deg`);
      particle.style.setProperty("--twinkle-duration", `${lerp(5.5, 11).toFixed(2)}s`);
      particle.style.setProperty("--twinkle-delay", `${lerp(-11, 0).toFixed(2)}s`);
      particle.style.setProperty("--fall-distance", `${lerp(20, 30).toFixed(1)}vh`);
      particle.style.setProperty("--fall-duration", `${(lerp(7.5, 13.5) * fallDurationScale).toFixed(2)}s`);
      particle.style.setProperty("--fall-delay", `${lerp(-13, 0).toFixed(2)}s`);
      field.appendChild(particle);
    }
  });
}

glitterFields.forEach(({ el, seed, boost, bandBoosts, maxY, maroonBias }) => buildGlitterField(el, seed, boost, bandBoosts, maxY, maroonBias));

let glitterResizeFrame = null;
window.addEventListener("resize", () => {
  if (!glitterFields.length) return;
  window.cancelAnimationFrame(glitterResizeFrame);
  glitterResizeFrame = window.requestAnimationFrame(() => {
    glitterFields.forEach(({ el, seed, boost, bandBoosts, maxY, maroonBias }) => buildGlitterField(el, seed, boost, bandBoosts, maxY, maroonBias));
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

$all(".reveal").forEach((el) => observer.observe(el));

function updateCountdown() {
  const remaining = Math.max(0, weddingDate - new Date());
  const units = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60)
  };
  Object.entries(units).forEach(([id, value]) => {
    document.querySelector(`#${id}`).textContent = id === "days" ? String(value) : String(value).padStart(2, "0");
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});
navLinks.addEventListener("click", () => {
  menuToggle.classList.remove("active");
  navLinks.classList.remove("open");
});

window.addEventListener("scroll", () => {
  const image = document.querySelector(".hero-image");
  if (window.scrollY < window.innerHeight) {
    image.style.transform = `translateY(${window.scrollY * 0.16}px) scale(1.05)`;
  }
}, { passive: true });

const RSVP_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzQwJQ_TEhHD5VASxLlu28iXr27m-0Vbw3EbweGtURof5kqZyUAvVeDJjYCoKIev8ymVQ/exec";
const rsvpForm = document.querySelector("#rsvpForm");
const rsvpMessage = document.querySelector("#formMessage");
const rsvpSubmitButton = rsvpForm.querySelector(".button");
const rsvpSubmitLabel = rsvpSubmitButton.textContent;
const attendingChoices = rsvpForm.querySelectorAll('input[name="attending"]');
const rsvpExtras = rsvpForm.querySelectorAll("[data-rsvp-extra]");
const sangeethGuestsSelect = rsvpForm.elements.sangeethGuests;
const receptionGuestsSelect = rsvpForm.elements.receptionGuests;
const foodPreferenceInputs = rsvpForm.querySelectorAll('input[name="foodPreference"]');
const stayRequiredInputs = rsvpForm.querySelectorAll('input[name="stayRequired"]');
const attendanceLabels = {
  sangeeth: "Sangeeth",
  reception: "Reception",
  both: "Sangeeth & Reception",
  none: "None"
};
const foodLabels = {
  veg: "Veg",
  "non-veg": "Non-veg"
};
const stayLabels = {
  yes: "Yes",
  no: "No"
};

function resetRsvpExtras() {
  rsvpForm.querySelectorAll('select[name="sangeethGuests"], select[name="receptionGuests"]').forEach((select) => {
    select.value = "0";
  });

  [...foodPreferenceInputs, ...stayRequiredInputs].forEach((input) => {
    input.checked = false;
  });
}

function setRsvpFieldEnabled(field, enabled) {
  field.classList.toggle("is-disabled", !enabled);

  field.querySelectorAll("input, select").forEach((input) => {
    input.disabled = !enabled;
  });
}

function setSelectEnabled(select, enabled) {
  select.closest("label").classList.toggle("is-disabled", !enabled);
  select.disabled = !enabled;

  if (!enabled) {
    select.value = "0";
  }
}

function setRsvpExtrasEnabled(enabled) {
  rsvpExtras.forEach((field) => {
    setRsvpFieldEnabled(field, enabled);
  });

  [...foodPreferenceInputs, ...stayRequiredInputs].forEach((input) => {
    input.required = enabled;
  });
}

function setRsvpAttendanceFields(attending) {
  const isAttending = attending && attending !== "none";
  const shouldEnableSangeethGuests = attending === "sangeeth" || attending === "both";
  const shouldEnableReceptionGuests = attending === "reception" || attending === "both";

  setSelectEnabled(sangeethGuestsSelect, shouldEnableSangeethGuests);
  setSelectEnabled(receptionGuestsSelect, shouldEnableReceptionGuests);

  if (!isAttending) {
    [...foodPreferenceInputs, ...stayRequiredInputs].forEach((input) => {
      input.checked = false;
    });
  }

  foodPreferenceInputs.forEach((input) => {
    input.disabled = !isAttending;
    input.required = isAttending;
  });

  stayRequiredInputs.forEach((input) => {
    input.disabled = !isAttending;
    input.required = isAttending;
  });
}

function syncRsvpExtras() {
  const selected = rsvpForm.querySelector('input[name="attending"]:checked');

  if (!selected || selected.value === "none") {
    resetRsvpExtras();
    setRsvpExtrasEnabled(false);
    return;
  }

  setRsvpExtrasEnabled(true);
  setRsvpAttendanceFields(selected.value);
}

function setRsvpSubmitState(isSubmitting) {
  rsvpSubmitButton.disabled = isSubmitting;
  rsvpSubmitButton.textContent = isSubmitting ? "Sending..." : rsvpSubmitLabel;
}

function getFirstName(name) {
  return name.trim().split(/\s+/)[0];
}

function getRsvpPayload(form) {
  const data = new FormData(form);
  const attending = data.get("attending");
  const isAttendingNone = attending === "none";

  return {
    name: String(data.get("name") || "").trim(),
    attending: attendanceLabels[attending] || "",
    sangeethGuests: isAttendingNone ? "0" : String(data.get("sangeethGuests") || "0"),
    receptionGuests: isAttendingNone ? "0" : String(data.get("receptionGuests") || "0"),
    foodPreference: isAttendingNone ? "" : (foodLabels[data.get("foodPreference")] || ""),
    stayRequired: isAttendingNone ? "" : (stayLabels[data.get("stayRequired")] || ""),
    source: window.location.href,
    userAgent: navigator.userAgent
  };
}

function getRsvpSuccessMessage(payload) {
  const firstName = getFirstName(payload.name);

  if (payload.attending === "None") {
    return `Thank you for letting us know, ${firstName}.`;
  }

  return `Thank you, ${firstName}. We'll note your attendance for ${payload.attending}.`;
}

function validateRsvpName() {
  const nameInput = rsvpForm.elements.name;

  if (nameInput.value.trim()) {
    nameInput.setCustomValidity("");
    return true;
  }

  nameInput.setCustomValidity("Please enter your full name.");
  nameInput.reportValidity();
  nameInput.setCustomValidity("");
  return false;
}

function validateGuestCounts() {
  const selected = rsvpForm.querySelector('input[name="attending"]:checked');
  const attending = selected ? selected.value : "";
  const shouldValidateSangeeth = attending === "sangeeth" || attending === "both";
  const shouldValidateReception = attending === "reception" || attending === "both";

  sangeethGuestsSelect.setCustomValidity("");
  receptionGuestsSelect.setCustomValidity("");

  if (shouldValidateSangeeth && sangeethGuestsSelect.value === "0") {
    sangeethGuestsSelect.setCustomValidity("Please select at least 1 Sangeeth guest.");
    sangeethGuestsSelect.reportValidity();
    return false;
  }

  if (shouldValidateReception && receptionGuestsSelect.value === "0") {
    receptionGuestsSelect.setCustomValidity("Please select at least 1 Reception guest.");
    receptionGuestsSelect.reportValidity();
    return false;
  }

  return true;
}

function sendRsvpToSheet(payload) {
  const callbackName = `rsvpCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const endpoint = new URL(RSVP_WEB_APP_URL);
  const script = document.createElement("script");
  let timeoutId = null;

  endpoint.searchParams.set("callback", callbackName);
  Object.entries(payload).forEach(([key, value]) => {
    endpoint.searchParams.set(key, value);
  });

  return new Promise((resolve, reject) => {
    function cleanup() {
      window.clearTimeout(timeoutId);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (response) => {
      cleanup();

      if (response && response.ok) {
        resolve(response);
        return;
      }

      reject(new Error(response && response.error ? response.error : "RSVP submission failed."));
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("RSVP endpoint could not be loaded."));
    };

    timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("RSVP endpoint did not respond."));
    }, 12000);

    script.src = endpoint.toString();
    document.body.append(script);
  });
}

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateRsvpName() || !validateGuestCounts() || !rsvpForm.reportValidity()) {
    return;
  }

  if (!RSVP_WEB_APP_URL) {
    rsvpMessage.textContent = "RSVP is not connected yet. Please add the Google Apps Script Web App URL.";
    return;
  }

  const payload = getRsvpPayload(rsvpForm);
  rsvpMessage.textContent = "";
  setRsvpSubmitState(true);

  try {
    await sendRsvpToSheet(payload);
    rsvpMessage.textContent = getRsvpSuccessMessage(payload);
    rsvpSubmitButton.textContent = "Response received";
  } catch (error) {
    rsvpMessage.textContent = "We could not send your response. Please try again.";
    setRsvpSubmitState(false);
  }
});

attendingChoices.forEach((input) => {
  input.addEventListener("change", syncRsvpExtras);
});

syncRsvpExtras();
