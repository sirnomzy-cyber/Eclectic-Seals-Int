/* =========================================================
   ECLECTIC SEALS INT'L — GLOBAL SCRIPT
   Vanilla JS. No frameworks, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    pageLoader();
    stickyNav();
    mobileMenu();
    scrollProgress();
    backToTop();
    darkModeToggle();
    scrollReveal();
    animatedCounters();
    testimonialCarousel();
    accordions();
    projectFilters();
    projectLightbox();
    faqSearch();
    blogSearch();
    quoteFormWizard();
    formValidation("#quote-review-form");
    formValidation("#contact-form");
    newsletterForms();
    rippleButtons();
    setActiveNavLink();
    yearStamp();
  }

  /* ---------------- Page loader ---------------- */
  function pageLoader() {
    var loader = document.getElementById("page-loader");
    if (!loader) return;
    window.addEventListener("load", function () {
      setTimeout(function () {
        loader.classList.add("loaded");
      }, 250);
    });
  }

  /* ---------------- Sticky nav ---------------- */
  function stickyNav() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    window.addEventListener("scroll", debounce(onScroll, 10));
    onScroll();
  }

  /* ---------------- Mobile menu ---------------- */
  function mobileMenu() {
    var toggle = document.querySelector(".mobile-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      menu.classList.toggle("open");
      document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        menu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function scrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + "%";
    }
    window.addEventListener("scroll", debounce(update, 5));
    update();
  }

  /* ---------------- Back to top ---------------- */
  function backToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", debounce(function () {
      if (window.scrollY > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    }, 10));
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Dark mode ---------------- */
  function darkModeToggle() {
    var toggle = document.querySelector(".dark-toggle");
    if (!toggle) return;
    if (localStorage.getItem("es-theme") === "dark") document.body.classList.add("dark");
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      localStorage.setItem("es-theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  /* ---------------- Scroll reveal (Intersection Observer) ---------------- */
  function scrollReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------------- Animated counters ---------------- */
  function animatedCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      }
      requestAnimationFrame(step);
    }
  }

  /* ---------------- Testimonial carousel ---------------- */
  function testimonialCarousel() {
    var track = document.querySelector(".testi-slides");
    if (!track) return;
    var slides = track.children;
    var dotsWrap = document.querySelector(".testi-dots");
    var index = 0;
    var timer;

    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      (function (idx) {
        dot.addEventListener("click", function () { goTo(idx); });
      })(i);
      if (dotsWrap) dotsWrap.appendChild(dot);
    }

    function goTo(i) {
      index = i;
      track.style.transform = "translateX(-" + (index * 100) + "%)";
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach(function (d, di) {
          d.classList.toggle("active", di === index);
        });
      }
    }
    function next() { goTo((index + 1) % slides.length); }
    function start() { timer = setInterval(next, 6000); }
    function stop() { clearInterval(timer); }
    start();
    var wrap = document.querySelector(".testi-track");
    if (wrap) {
      wrap.addEventListener("mouseenter", stop);
      wrap.addEventListener("mouseleave", start);
    }
  }

  /* ---------------- Accordions (FAQ / Services) ---------------- */
  function accordions() {
    document.querySelectorAll(".accordion-item").forEach(function (item) {
      var head = item.querySelector(".accordion-head");
      var body = item.querySelector(".accordion-body");
      if (!head || !body) return;
      head.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        item.closest(".accordion").querySelectorAll(".accordion-item").forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".accordion-body").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------------- Project filters ---------------- */
  function projectFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll("[data-category]");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Project gallery lightbox ---------------- */
  function projectLightbox() {
    var lightbox = document.getElementById("project-lightbox");
    if (!lightbox) return;
    var imgEl = document.getElementById("lightbox-img");
    var titleEl = document.getElementById("lightbox-title");
    var counterEl = document.getElementById("lightbox-counter");
    var thumbsEl = document.getElementById("lightbox-thumbs");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var images = [];
    var current = 0;
    var title = "";

    function buildThumbs() {
      thumbsEl.innerHTML = "";
      images.forEach(function (src, i) {
        var t = document.createElement("img");
        t.src = src;
        t.alt = "Thumbnail " + (i + 1);
        t.addEventListener("click", function () { show(i); });
        thumbsEl.appendChild(t);
      });
    }

    function show(i) {
      current = (i + images.length) % images.length;
      imgEl.src = images[current];
      titleEl.textContent = title;
      counterEl.textContent = (current + 1) + " / " + images.length;
      Array.from(thumbsEl.children).forEach(function (t, ti) {
        t.classList.toggle("active", ti === current);
      });
      var activeThumb = thumbsEl.children[current];
      if (activeThumb && activeThumb.scrollIntoView) {
        activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }

    function openGallery(imgs, startIndex, projTitle) {
      images = imgs;
      title = projTitle;
      var multi = images.length > 1;
      prevBtn.style.display = multi ? "" : "none";
      nextBtn.style.display = multi ? "" : "none";
      thumbsEl.style.display = multi ? "" : "none";
      buildThumbs();
      show(startIndex);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeGallery() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-gallery]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var imgs;
        try { imgs = JSON.parse(trigger.getAttribute("data-gallery")); } catch (err) { return; }
        var t = trigger.getAttribute("data-title") || "";
        openGallery(imgs, 0, t);
      });
    });

    closeBtn.addEventListener("click", closeGallery);
    prevBtn.addEventListener("click", function () { show(current - 1); });
    nextBtn.addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeGallery(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });

    var touchStartX = null;
    lightbox.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 50) show(current - 1);
      else if (dx < -50) show(current + 1);
      touchStartX = null;
    });
  }

  /* ---------------- FAQ search + category filter ---------------- */
  function faqSearch() {
    var input = document.getElementById("faq-search");
    var items = document.querySelectorAll(".faq-list .accordion-item");
    var cats = document.querySelectorAll(".faq-cat-btn");
    if (input) {
      input.addEventListener("input", function () {
        var q = input.value.toLowerCase();
        items.forEach(function (item) {
          var text = item.textContent.toLowerCase();
          item.style.display = text.indexOf(q) > -1 ? "" : "none";
        });
      });
    }
    cats.forEach(function (btn) {
      btn.addEventListener("click", function () {
        cats.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-cat");
        items.forEach(function (item) {
          var match = cat === "all" || item.getAttribute("data-cat") === cat;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Blog search ---------------- */
  function blogSearch() {
    var input = document.getElementById("blog-search");
    var cards = document.querySelectorAll("[data-blog-card]");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.toLowerCase();
      cards.forEach(function (card) {
        card.style.display = card.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none";
      });
    });
  }

  /* ---------------- Quote form wizard (multi-step) ---------------- */
  function quoteFormWizard() {
    var form = document.getElementById("quote-form");
    if (!form) return;
    var steps = form.querySelectorAll(".form-step");
    var dots = document.querySelectorAll(".step-dot");
    var current = 0;

    function show(i) {
      steps.forEach(function (s, si) { s.classList.toggle("active", si === i); });
      dots.forEach(function (d, di) {
        d.classList.toggle("active", di === i);
        d.classList.toggle("done", di < i);
      });
      if (i === steps.length - 1) buildSummary();
      window.scrollTo({ top: form.offsetTop - 140, behavior: "smooth" });
    }

    form.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!validateStep(steps[current])) return;
        current = Math.min(current + 1, steps.length - 1);
        show(current);
      });
    });
    form.querySelectorAll("[data-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        current = Math.max(current - 1, 0);
        show(current);
      });
    });

    function validateStep(step) {
      var required = step.querySelectorAll("[required]");
      var valid = true;
      required.forEach(function (field) {
        var wrap = field.closest(".field");
        if (!field.value.trim()) {
          valid = false;
          if (wrap) wrap.classList.add("error");
        } else if (wrap) wrap.classList.remove("error");
      });
      return valid;
    }

    function buildSummary() {
      var summary = document.getElementById("quote-summary");
      if (!summary) return;
      var data = new FormData(form);
      var rows = [];
      ["fullname", "email", "phone", "company", "city", "state", "project_type", "budget", "timeline", "address", "details"].forEach(function (key) {
        var val = data.get(key);
        if (val) rows.push("<div><strong>" + labelFor(key) + ":</strong> " + escapeHtml(val) + "</div>");
      });
      summary.innerHTML = rows.join("");
    }
    function labelFor(key) {
      var map = { fullname: "Full Name", email: "Email", phone: "Phone", company: "Company", city: "City", state: "State", project_type: "Project Type", budget: "Budget Range", timeline: "Timeline", address: "Project Address", details: "Project Details" };
      return map[key] || key;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep(steps[current])) return;
      var success = document.getElementById("quote-success");
      form.style.display = "none";
      if (success) success.style.display = "block";
    });
  }

  /* ---------------- Generic contact/other form validation ---------------- */
  function formValidation(selector) {
    var form = document.querySelector(selector);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.type === "email" ? /^\S+@\S+\.\S+$/.test(field.value) : field.value.trim().length > 0;
        if (!ok) { valid = false; if (wrap) wrap.classList.add("error"); }
        else if (wrap) wrap.classList.remove("error");
      });
      if (!valid) return;
      var success = form.querySelector(".form-success");
      if (success) {
        form.reset();
        success.style.display = "flex";
        setTimeout(function () { success.style.display = "none"; }, 5000);
      }
    });
  }

  /* ---------------- Newsletter forms ---------------- */
  function newsletterForms() {
    document.querySelectorAll(".newsletter-form, .newsletter-mini").forEach(function (form) {
      if (form.tagName !== "FORM") return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = form.querySelector(".nl-msg");
        if (msg) { msg.textContent = "You're subscribed. Thank you!"; msg.style.display = "block"; }
        form.reset();
      });
    });
  }

  /* ---------------- Button ripple ---------------- */
  function rippleButtons() {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement("span");
        ripple.className = "ripple";
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });
  }

  /* ---------------- Active nav link ---------------- */
  function setActiveNavLink() {
    var path = location.pathname.replace(/\/index\.html$/, "/").replace(/(.)\/$/, "$1");
    if (path === "") path = "/";
    document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var hrefPath = href.replace(/(.)\/$/, "$1");
      if (hrefPath === path) a.classList.add("active");
    });
  }

  /* ---------------- Footer year ---------------- */
  function yearStamp() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------- Utilities ---------------- */
  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      var args = arguments, ctx = this;
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
})();
