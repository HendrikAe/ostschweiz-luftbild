/* Ostschweiz Luftbild — nav + baudoku carousel */
(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav-links a, .nav-cta").forEach((el) => {
      el.addEventListener("click", () => {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const track = document.querySelector("[data-carousel-track]");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  if (!track) return;

  const scrollByAmount = () => {
    const slide = track.querySelector(".carousel__slide");
    return slide ? slide.getBoundingClientRect().width + 16 : 240;
  };

  const updateButtons = () => {
    if (!prev || !next) return;
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  prev && prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
  });
  next && next.addEventListener("click", () => {
    track.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
  });
  track.addEventListener("scroll", () => window.requestAnimationFrame(updateButtons), { passive: true });
  updateButtons();
})();


/* Center Kontakt form in the viewport when arriving via #anfrage */
(function centerAnfrageForm() {
  const form = document.getElementById("anfrage");
  if (!form) return;

  const center = () => {
    const rect = form.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const target = absoluteTop - (window.innerHeight - rect.height) / 2;
    window.scrollTo({ top: Math.max(0, target), behavior: "auto" });
    const first = form.querySelector("input, textarea");
    if (first && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try { first.focus({ preventScroll: true }); } catch (_) { first.focus(); }
    }
  };

  const go = () => {
    if (location.hash === "#anfrage" || document.body.classList.contains("kontakt-page")) {
      // Always center on kontakt page so CTA landings see fields without scrolling
      requestAnimationFrame(() => requestAnimationFrame(center));
    }
  };

  if (document.readyState === "complete") go();
  else window.addEventListener("load", go);
  window.addEventListener("hashchange", () => {
    if (location.hash === "#anfrage") requestAnimationFrame(() => requestAnimationFrame(center));
  });
})();


/* Submit Kontakt form → Google Sheet (Apps Script web app) */
(function sheetFormSubmit() {
  const form = document.getElementById("anfrage");
  if (!form) return;
  const status = document.getElementById("form-status");
  const endpoint = form.getAttribute("data-sheet-endpoint");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!endpoint || endpoint === "SHEET_WEBAPP_URL") {
      if (status) status.textContent = "Formular noch nicht verbunden — bitte per E-Mail an hendrik@ostschweizluftbild.ch schreiben.";
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      page: location.href
    };
    if (!data.name || !data.email || !data.message) {
      if (status) status.textContent = "Bitte Name, E-Mail und Nachricht ausfüllen.";
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = "Senden…"; }
    if (status) status.textContent = "Wird gesendet…";
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      });
      form.reset();
      if (status) status.textContent = "Danke — Ihre Anfrage ist angekommen. Wir melden uns zeitnah.";
      if (btn) { btn.disabled = false; btn.textContent = "Anfrage senden →"; }
    } catch (err) {
      if (status) status.textContent = "Senden fehlgeschlagen. Bitte schreiben Sie an hendrik@ostschweizluftbild.ch oder rufen Sie 078 337 77 77 an.";
      if (btn) { btn.disabled = false; btn.textContent = "Anfrage senden →"; }
    }
  });
})();
