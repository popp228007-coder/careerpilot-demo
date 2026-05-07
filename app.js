const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalIcon = document.getElementById("modalIcon");
const closeModalBtn = document.getElementById("closeModal");
const okModalBtn = document.getElementById("okModal");

const quotes = [
  "Сегодня ты можешь сделать маленький шаг, который приблизит тебя к большой цели.",
  "Не обязательно видеть весь путь — достаточно увидеть следующий шаг.",
  "Твоё развитие не обязано быть быстрым. Главное — чтобы оно продолжалось.",
  "Каждый качественный отклик — это вклад в будущий оффер.",
  "Даже если сейчас не получается идеально, ты уже двигаешься вперёд.",
  "Не сравнивай свой старт с чужой серединой пути.",
  "Сильное резюме строится так же, как сильная карьера: постепенно.",
  "Иногда один хороший проект важнее, чем десять пустых слов о себе.",
  "Ты не обязан знать всё сразу. Достаточно быть готовым учиться.",
  "Работа мечты начинается с одного честного шага к себе.",
  "Твоя цель — не отправить сто откликов, а сделать десять сильных.",
  "Нормально начинать неидеально. Главное — начать."
];

function setDailyQuote() {
  const quoteEl = document.getElementById("dailyQuote");
  if (!quoteEl) return;

  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayIndex = Math.floor(diff / oneDay);

  quoteEl.textContent = quotes[dayIndex % quotes.length];
}

function showScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(`screen-${screenName}`);

  if (target) {
    target.classList.add("active");
  }

  navButtons.forEach((btn) => {
    btn.classList.remove("active");

    if (btn.dataset.screenTarget === screenName) {
      btn.classList.add("active");
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openModal(title, text, icon = "🌿") {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalIcon.textContent = icon;

  modal.classList.add("show");

  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred("light");
  }
}

function closeModal() {
  modal.classList.remove("show");
}

document.querySelectorAll("[data-screen-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const screen = button.dataset.screenTarget;
    showScreen(screen);
  });
});

document.querySelectorAll("[data-placeholder-title]").forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.dataset.placeholderTitle;
    const text = button.dataset.placeholderText;
    openModal(title, text, "✨");
  });
});

closeModalBtn?.addEventListener("click", closeModal);
okModalBtn?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

const tipsBtn = document.getElementById("tipsBtn");
const howItWorksBtn = document.getElementById("howItWorksBtn");

tipsBtn?.addEventListener("click", () => {
  openModal(
    "Подсказки",
    "1. Начни с профиля — заполни основные данные о себе.\n\n2. Не распыляйся — лучше выбрать одно понятное направление.\n\n3. Следи за аналитикой — позже здесь будут просмотры, отклики, отказы и интервью.\n\n4. Сохраняй профиль — сейчас данные хранятся локально в браузере.\n\n5. Для сильного отклика важны не только навыки, но и понятное портфолио.",
    "💡"
  );
});

howItWorksBtn?.addEventListener("click", () => {
  openModal(
    "Как это работает",
    "Сейчас это демо-версия интерфейса. Уже можно заполнить профиль, посмотреть будущую структуру сервиса и открыть аналитику.\n\nПозже мы подключим поиск вакансий, резюме, аналитику, уведомления, ИИ и полноценную Telegram Mini App-логику внутри бота.",
    "🌿"
  );
});

const supportButtons = [
  document.getElementById("supportBtn"),
  document.getElementById("supportBtn2")
].filter(Boolean);

supportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(
      "Поддержать сервис",
      "Позже здесь можно будет оставить небольшое пожертвование на развитие CareerPilot AI.\n\nПока это демо-версия, но сама точка поддержки уже заложена в интерфейс.",
      "☕"
    );
  });
});

document.getElementById("demoSearchBtn")?.addEventListener("click", () => {
  openModal(
    "Поиск вакансий",
    "Настоящий поиск вакансий мы подключим позже.\n\nСейчас это демонстрационный экран с фильтрами по должности, зарплате, валюте и формату работы.",
    "🔎"
  );
});

/* PROFILE LOCAL STORAGE */
const profileForm = document.getElementById("profileForm");
const profileStatus = document.getElementById("profileStatus");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const clearProfileBtn = document.getElementById("clearProfileBtn");

const PROFILE_KEY = "careerpilot_profile";

function loadProfile() {
  const saved = localStorage.getItem(PROFILE_KEY);

  if (!saved || !profileForm) return;

  try {
    const data = JSON.parse(saved);

    Object.keys(data).forEach((key) => {
      const field = profileForm.elements[key];

      if (field) {
        field.value = data[key];
      }
    });

    profileStatus.textContent = "Профиль загружен из локального хранилища.";
  } catch (error) {
    profileStatus.textContent = "Не удалось загрузить сохранённый профиль.";
  }
}

function saveProfile() {
  if (!profileForm) return;

  const formData = new FormData(profileForm);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

  profileStatus.textContent = "Профиль сохранён локально в браузере.";

  openModal(
    "Профиль сохранён",
    "Данные сохранены локально в браузере.\n\nПозже мы подключим базу данных, чтобы профиль сохранялся в аккаунте Telegram.",
    "✅"
  );
}

function clearProfile() {
  if (!profileForm) return;

  profileForm.reset();
  localStorage.removeItem(PROFILE_KEY);

  profileStatus.textContent = "Профиль очищен.";

  openModal(
    "Профиль очищен",
    "Все локально сохранённые данные профиля удалены.",
    "🧹"
  );
}

saveProfileBtn?.addEventListener("click", saveProfile);
clearProfileBtn?.addEventListener("click", clearProfile);

setDailyQuote();
loadProfile();
showScreen("home");