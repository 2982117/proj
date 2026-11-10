/* ============================================================
   BrewLab — script.js (минимальная версия)
   Отправка заявки в Google Sheets
   ============================================================ */

const URL = "https://script.google.com/macros/s/AKfycbwfDtxy5s52DwipaFgeeWarxsNNuWDcFEDhos_KSo8F6iZnlwg4d_6IWCMX2w35E5tb/exec";

const form = document.getElementById("order-form");
const btn = document.getElementById("submit-btn");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    plan: form.plan ? form.plan.value : "",
    comment: form.comment ? form.comment.value.trim() : "",
  };

  if (data.name.length < 2) {
    statusEl.textContent = "Введите имя";
    statusEl.className = "form__status error";
    return;
  }
  if (data.phone.replace(/\D/g, "").length < 10) {
    statusEl.textContent = "Введите телефон";
    statusEl.className = "form__status error";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Отправляем...";
  statusEl.textContent = "";
  statusEl.className = "form__status";

  try {
    await fetch(URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });

    statusEl.textContent = "✅ Заявка отправлена!";
    statusEl.className = "form__status success";
    form.reset();
  } catch (err) {
    statusEl.textContent = "❌ Ошибка отправки";
    statusEl.className = "form__status error";
  } finally {
    btn.disabled = false;
    btn.textContent = "Отправить";
  }
});
