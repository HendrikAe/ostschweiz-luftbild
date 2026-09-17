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
