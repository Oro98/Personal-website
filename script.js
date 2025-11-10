const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const sectionTargets = navLinks
  .map((link) => {
    const id = link.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    return section ? { section, link } : null;
  })
  .filter(Boolean);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const activateNavLink = () => {
  const scrollPosition = window.scrollY + 140;
  let currentEntry = null;

  sectionTargets.forEach(({ section, link }) => {
    if (section.offsetTop <= scrollPosition) {
      if (!currentEntry || section.offsetTop > currentEntry.section.offsetTop) {
        currentEntry = { section, link };
      }
    }
  });

  navLinks.forEach((link) => link.classList.remove("active"));
  if (currentEntry) {
    currentEntry.link.classList.add("active");
  }
};

activateNavLink();
window.addEventListener("scroll", () => requestAnimationFrame(activateNavLink));
window.addEventListener("resize", () => requestAnimationFrame(activateNavLink));

const counters = Array.from(document.querySelectorAll(".stat-number[data-target]"));
if (counters.length) {
  const seen = new WeakSet();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        const element = entry.target;
        const target = Number(element.getAttribute("data-target")) || 0;
        const suffix = element.getAttribute("data-suffix") || "";
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.round(progress * target);
          element.textContent = `${value}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            element.textContent = `${target}${suffix}`;
          }
        };

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const messageEl = contactForm.querySelector(".form-message");
  let messageTimer = null;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const showMessage = (text, type) => {
      if (!messageEl) return;
      messageEl.textContent = text;
      messageEl.classList.remove("is-success", "is-error", "is-visible");
      if (type === "success") {
        messageEl.classList.add("is-success");
      } else if (type === "error") {
        messageEl.classList.add("is-error");
      }
      messageEl.classList.add("is-visible");

      if (messageTimer) {
        clearTimeout(messageTimer);
      }
      messageTimer = setTimeout(() => {
        messageEl.classList.remove("is-success", "is-error", "is-visible");
        messageEl.textContent = "";
      }, 4000);
    };

    if (!name || !email || !message) {
      showMessage("Please fill in all required fields before sending.", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    contactForm.reset();
    showMessage("Thanks for reaching out! I'll respond shortly.", "success");
  });
}
