const wedding = {
  bride: "Suhana",
  groom: "Deepak",
  date: "2026-09-19T16:30:00+04:00",
  location: "Bangalore, India",
  venue: "The Secret Garden"
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
  el.textContent = `${weddingDate.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })} · ${wedding.location.split(",")[0]}`;
});

const intro = document.querySelector("#intro");
const site = document.querySelector("#site");
document.querySelector("#openInvite").addEventListener("click", () => {
  intro.classList.add("opening");
  window.setTimeout(() => {
    intro.classList.add("opened");
    site.classList.add("visible");
    site.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    document.querySelector(".hero .reveal").classList.add("in-view");
  }, 1650);
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
    document.querySelector(`#${id}`).textContent = String(value).padStart(id === "days" ? 3 : 2, "0");
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
  document.querySelector("#formMessage").textContent =
    data.get("attending") === "yes"
      ? `Thank you, ${name}. We cannot wait to celebrate with you.`
      : `Thank you for letting us know, ${name}. You will be missed.`;
  event.currentTarget.querySelector(".button").textContent = "Response received";
});
