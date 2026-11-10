/* ============================================================
   BrewLab — script.js (v3, JSON через text/plain)
   ============================================================ */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/library/d/1p5OOvuVXVtXkqAFOHsFlgGU9LB3wRvh64jek0FWv6y73SWXdSmTNZ32p/4";

/* ---------- 1. Бургер ---------- */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("open");
  });
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      nav.classList.remove("open");
    });
  });
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains("open")) {
      burger.classList.remove("active");
      nav.classList.remove("open");
    }
  });
}

/* ---------- 2. Плавный скролл ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 82;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

/* ---------- 3. Форма ---------- */
const form = document.getElementById("order-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("form-status");

const phoneInput = document.getElementById("phone");
if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/[^\d+()\-\s]/g, "");
    if (v.length > 18) v = v.slice(0, 18);
    e.target.value = v;
    e.target.classList.remove("error");
  });
}

form?.querySelectorAll("input, textarea, select").forEach((f) => {
  f.addEventListener("input", () => f.classList.remove("error"));
  f.addEventListener("change", () => f.classList.remove("error"));
});

function showStatus(msg, type) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = "form__status " + (type || "");
}

function validate(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Введите имя (минимум 2 символа)");
    document.getElementById("name")?.classList.add("error");
  }
  const digits = (data.phone || "").replace(/\D/g, "");
  if (digits.length < 10) {
    errors.push("Введите корректный телефон");
    document.getElementById("phone")?.classList.add("error");
  }
  return errors;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: (form.name?.value || "").trim(),
      phone: (form.phone?.value || "").trim(),
      plan: (form.plan?.value || "").trim(),
      comment: (form.comment?.value || "").trim(),
      page: window.location.href,
      timestamp: new Date().toLocaleString("ru-RU"),
    };

    const errors = validate(data);
    if (errors.length) {
      showStatus(errors[0], "error");
      return;
    }

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = "Отправляем...";
    showStatus("", "");

    try {
      // ⚠️ JSON.stringify + Content-Type: text/plain —
      // это safelisted, preflight нет, тело доходит полностью
      // даже с mode: "no-cors"
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data),
      });

      showStatus("✅ Заявка отправлена! Перезвоним в течение 15 минут ☕", "success");
      form.reset();
      console.log("✅ POST sent (JSON):", data);
    } catch (err) {
      console.error("❌ Submit error:", err);
      showStatus("❌ Не удалось отправить. Позвоните: +7 (999) 555-22-11", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}

/* ---------- 4. Анимация ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
);

document.querySelectorAll(".card, .why-item, .review, .menu-item, .geo-block, .form").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

/* ---------- 5. Подсветка меню ---------- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");
if (sections.length && navLinks.length) {
  window.addEventListener("scroll", () => {
    const y = window.pageYOffset;
    sections.forEach((s) => {
      const top = s.offsetTop - 120;
      if (y >= top && y < top + s.offsetHeight) {
        navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + s.id));
      }
    });
  }, { passive: true });
}

/* ---------- 6. Выбор тарифа ---------- */
const planSelect = document.getElementById("plan");
document.querySelectorAll(".card--plan .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.closest(".card--plan")?.querySelector("h3")?.textContent?.trim();
    if (!name || !planSelect) return;
    const opt = Array.from(planSelect.options).find((o) => o.value.toLowerCase().includes(name.toLowerCase()));
    if (opt) planSelect.value = opt.value;
  });
});
