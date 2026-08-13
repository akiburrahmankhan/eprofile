/* Akibur Rahman Khan — Academic Portfolio
   Vanilla JS: sticky-nav state, mobile menu, scroll reveal. No dependencies. */

(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  // Sticky nav shadow after scrolling past the hero
  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "Close" : "Menu";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
      });
    });
  }

  // Scroll-triggered reveal animation
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: no IntersectionObserver support — show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Gallery slider
  var galleryEl = document.querySelector("[data-gallery]");
  if (galleryEl) {
    var track = galleryEl.querySelector("[data-track]");
    var slides = Array.prototype.slice.call(galleryEl.querySelectorAll(".gallery-slide"));
    var dots = Array.prototype.slice.call(galleryEl.querySelectorAll(".gallery-dot"));
    var prevBtn = galleryEl.querySelector("[data-prev]");
    var nextBtn = galleryEl.querySelector("[data-next]");
    var index = 0;
    var total = slides.length;
    var autoplayDelay = 6000;
    var autoplayTimer = null;

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      slides.forEach(function (s, si) {
        s.classList.toggle("is-active", si === index);
      });
      dots.forEach(function (d, di) {
        d.classList.toggle("is-active", di === index);
      });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = window.setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); startAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        startAutoplay();
      });
    });

    // Keyboard navigation when the slider has focus
    galleryEl.setAttribute("tabindex", "0");
    galleryEl.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); startAutoplay(); }
      if (e.key === "ArrowLeft") { prev(); startAutoplay(); }
    });

    // Touch swipe support
    var touchStartX = null;
    track.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) { next(); } else { prev(); }
      }
      touchStartX = null;
      startAutoplay();
    }, { passive: true });

    galleryEl.addEventListener("mouseenter", stopAutoplay);
    galleryEl.addEventListener("mouseleave", startAutoplay);

    goTo(0);
    startAutoplay();
  }
})();
