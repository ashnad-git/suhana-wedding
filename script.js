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
    boost: 1.05,
    bandBoosts: [1.45, 1.25, 1.1, 1, 0.9, 0.8]
  },
  {
    el: document.querySelector(".reception-glitter"),
    seed: 0x5A1723,
    boost: 1.42,
    bandBoosts: [1.6, 1.34, 1.12, 1.02, 0.9, 0.82]
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

function buildGlitterField(field, seed, boost, bandBoosts = []) {
  field.replaceChildren();

  const rng = mulberry32(seed);
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const scale = (mobile ? 0.72 : 1) * boost;
  const bands = [
    { start: 0, end: 10, count: 66, star: 0.11, rare: 0.08 },
    { start: 10, end: 25, count: 56, star: 0.09, rare: 0.07 },
    { start: 25, end: 40, count: 40, star: 0.06, rare: 0.05 },
    { start: 40, end: 60, count: 28, star: 0.04, rare: 0.04 },
    { start: 60, end: 75, count: 12, star: 0.03, rare: 0.03 },
    { start: 75, end: 90, count: 5, star: 0, rare: 0.02 }
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
      const y = easedBandY(band.start, band.end);
      const x = lerp(0, 100);
      const tone = y < 10
        ? (field.classList.contains("reception-glitter")
          ? (rng() < 0.58 ? "maroon" : rng() < 0.84 ? "gold" : rng() < 0.95 ? "highlight" : "gold")
          : (rng() < 0.34 ? "maroon" : rng() < 0.8 ? "gold" : rng() < 0.93 ? "highlight" : "gold"))
        : y < 25
          ? (field.classList.contains("reception-glitter")
            ? (rng() < 0.46 ? "maroon" : rng() < 0.8 ? "gold" : rng() < 0.92 ? "highlight" : "gold")
            : (rng() < 0.28 ? "maroon" : rng() < 0.78 ? "gold" : rng() < 0.91 ? "highlight" : "gold"))
          : y < 40
            ? (rng() < 0.26 ? "maroon" : rng() < 0.78 ? "gold" : rng() < 0.92 ? "highlight" : "gold")
            : y < 60
              ? (rng() < 0.18 ? "maroon" : rng() < 0.82 ? "gold" : rng() < 0.92 ? "highlight" : "gold")
              : (rng() < 0.12 ? "maroon" : rng() < 0.88 ? "gold" : "highlight");

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
      field.appendChild(particle);
    }
  });
}

glitterFields.forEach(({ el, seed, boost, bandBoosts }) => buildGlitterField(el, seed, boost, bandBoosts));

let glitterResizeFrame = null;
window.addEventListener("resize", () => {
  if (!glitterFields.length) return;
  window.cancelAnimationFrame(glitterResizeFrame);
  glitterResizeFrame = window.requestAnimationFrame(() => {
    glitterFields.forEach(({ el, seed, boost, bandBoosts }) => buildGlitterField(el, seed, boost, bandBoosts));
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

document.querySelector("#rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get("name").trim().split(" ")[0];
  const attending = data.get("attending");
  const attendanceLabel = {
    sangeeth: "Sangeeth",
    reception: "Reception",
    both: "Sangeeth and Reception",
    none: "no events"
  }[attending] || "the celebration";
  document.querySelector("#formMessage").textContent =
    attending === "none"
      ? `Thank you for letting us know, ${name}.`
      : `Thank you, ${name}. We'll note your attendance for ${attendanceLabel}.`;
  event.currentTarget.querySelector(".button").textContent = "Response received";
});

const rsvpForm = document.querySelector("#rsvpForm");
const attendingChoices = rsvpForm.querySelectorAll('input[name="attending"]');
const rsvpExtras = rsvpForm.querySelectorAll("[data-rsvp-extra]");
const rsvpExtraInputs = rsvpForm.querySelectorAll('[data-rsvp-extra] input, [data-rsvp-extra] select');

function resetRsvpExtras() {
  rsvpForm.querySelectorAll('select[name="sangeethGuests"], select[name="receptionGuests"]').forEach((select) => {
    select.value = "0";
  });

  rsvpForm.querySelectorAll('input[name="foodPreference"], input[name="stayRequired"]').forEach((input) => {
    input.checked = false;
  });
}

function setRsvpExtrasEnabled(enabled) {
  rsvpExtras.forEach((el) => {
    el.classList.toggle("is-disabled", !enabled);
  });

  rsvpExtraInputs.forEach((input) => {
    input.disabled = !enabled;
    if (!enabled && input.type === "radio") {
      input.checked = false;
    }
  });

  rsvpForm.querySelectorAll('input[name="foodPreference"], input[name="stayRequired"]').forEach((input) => {
    input.required = enabled;
  });
}

function syncRsvpExtras() {
  const selected = rsvpForm.querySelector('input[name="attending"]:checked');
  if (selected && selected.value === "none") {
    resetRsvpExtras();
    setRsvpExtrasEnabled(false);
    return;
  }

  setRsvpExtrasEnabled(true);
}

attendingChoices.forEach((input) => {
  input.addEventListener("change", syncRsvpExtras);
});

syncRsvpExtras();
