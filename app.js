"use strict";

/* =========================================================
   ELICEN API VAULT — STABLE DATA ENGINE
   Uses the public-apis data API instead of scraping README.
========================================================= */

const API_ENDPOINT =
  "https://api.publicapis.org/entries";

const PER_PAGE = 24;

let APIs = [];
let filteredAPIs = [];
let currentPage = 1;
let currentView = "all";
let currentCategory = "all";
let currentFilter = "all";
let currentAPI = null;


/* =========================================================
   ELEMENTS
========================================================= */

const $ = id => document.getElementById(id);

const searchInput = $("searchInput");
const apiGrid = $("apiGrid");
const categoriesBox = $("categories");
const pagination = $("pagination");
const loading = $("loading");

const totalApis = $("totalApis");
const totalCategories = $("totalCategories");
const httpsApis = $("httpsApis");
const noAuthApis = $("noAuthApis");

const allCount = $("allCount");
const favCount = $("favCount");
const recentCount = $("recentCount");

const sectionTitle = $("sectionTitle");
const resultText = $("resultText");

const modal = $("modal");
const closeModal = $("closeModal");

const modalCategory = $("modalCategory");
const modalName = $("modalName");
const modalDescription = $("modalDescription");
const modalDetails = $("modalDetails");
const modalUrl = $("modalUrl");

const copyBtn = $("copyBtn");
const visitBtn = $("visitBtn");
const favBtn = $("favBtn");
const testerBtn = $("testerBtn");

const tester = $("tester");
const testUrl = $("testUrl");
const sendBtn = $("sendBtn");
const responseBox = $("responseBox");

const toast = $("toast");

const themeBtn = $("themeBtn");
const musicBtn = $("musicBtn");
const music = $("music");

const menuBtn = $("menuBtn");
const sidebar = $("sidebar");

const exploreBtn = $("exploreBtn");


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getFavorites() {
  try {
    return JSON.parse(
      localStorage.getItem("elicenFavorites") || "[]"
    );
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(
    "elicenFavorites",
    JSON.stringify(list)
  );
}

function getRecent() {
  try {
    return JSON.parse(
      localStorage.getItem("elicenRecent") || "[]"
    );
  } catch {
    return [];
  }
}

function saveRecent(list) {
  localStorage.setItem(
    "elicenRecent",
    JSON.stringify(list)
  );
}


/* =========================================================
   NORMALIZE API DATA
========================================================= */

function normalizeAPI(item) {

  const name =
    item.API ||
    item.api ||
    item.name ||
    "Unnamed API";

  const description =
    item.Description ||
    item.description ||
    "No description available.";

  const authValue =
    item.Auth ??
    item.auth ??
    "";

  const auth =
    authValue === null ||
    authValue === "" ||
    String(authValue).toLowerCase() === "null"
      ? "No"
      : String(authValue);

  const https =
    item.HTTPS === true ||
    String(item.HTTPS).toLowerCase() === "true" ||
    String(item.https).toLowerCase() === "yes"
      ? "Yes"
      : "No";

  const corsValue =
    item.Cors ??
    item.cors ??
    "unknown";

  let cors = "Unknown";

  if (
    String(corsValue).toLowerCase() === "yes" ||
    String(corsValue).toLowerCase() === "true"
  ) {
    cors = "Yes";
  }

  if (
    String(corsValue).toLowerCase() === "no" ||
    String(corsValue).toLowerCase() === "false"
  ) {
    cors = "No";
  }

  const category =
    item.Category ||
    item.category ||
    "Other";

  const url =
    item.Link ||
    item.link ||
    item.URL ||
    item.url ||
    "#";

  return {
    id:
      `${name}|${url}|${category}`
        .toLowerCase(),

    name: String(name),
    description: String(description),
    auth,
    https,
    cors,
    category: String(category),
    url: String(url)
  };
}


/* =========================================================
   LOAD API DATA
========================================================= */

async function loadAPIs() {

  if (loading) {
    loading.style.display = "block";

    loading.innerHTML = `
      <div class="spinner"></div>
      <h3>Loading public APIs...</h3>
      <p>Connecting to the API directory.</p>
    `;
  }

  try {

    const response = await fetch(
      API_ENDPOINT,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `API server returned HTTP ${response.status}`
      );
    }

    const data =
      await response.json();

    const entries =
      Array.isArray(data)
        ? data
        : Array.isArray(data.entries)
          ? data.entries
          : [];

    APIs =
      entries
        .map(normalizeAPI)
        .filter(api =>
          api.name &&
          api.url &&
          api.url !== "#"
        );

    /*
      Remove duplicates.
    */

    const unique =
      new Map();

    APIs.forEach(api => {
      if (!unique.has(api.id)) {
        unique.set(api.id, api);
      }
    });

    APIs =
      Array.from(unique.values());

    if (!APIs.length) {
      throw new Error(
        "No API records were returned."
      );
    }

    updateStats();
    buildCategories();

    if (loading) {
      loading.style.display = "none";
    }

    applyFilters();

    showToast(
      `${APIs.length.toLocaleString()} APIs loaded`
    );

  }

  catch (error) {

    console.error(
      "ELICEN API LOAD ERROR:",
      error
    );

    if (loading) {

      loading.innerHTML = `
        <div class="errorBox">

          <h3>API directory could not load</h3>

          <p>
            The public API service is temporarily
            unavailable or blocked by the network.
          </p>

          <button
            id="retryBtn"
            class="primaryBtn"
          >
            Retry
          </button>

        </div>
      `;

      const retry =
        $("retryBtn");

      if (retry) {
        retry.addEventListener(
          "click",
          loadAPIs
        );
      }
    }

  }
}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

  const categories =
    new Set(
      APIs.map(api => api.category)
    );

  const httpsCount =
    APIs.filter(
      api => api.https === "Yes"
    ).length;

  const noAuthCount =
    APIs.filter(
      api => api.auth === "No"
    ).length;

  if (totalApis)
    totalApis.textContent =
      APIs.length.toLocaleString();

  if (totalCategories)
    totalCategories.textContent =
      categories.size;

  if (httpsApis)
    httpsApis.textContent =
      httpsCount.toLocaleString();

  if (noAuthApis)
    noAuthApis.textContent =
      noAuthCount.toLocaleString();

  if (allCount)
    allCount.textContent =
      APIs.length.toLocaleString();

  updateSideCounts();
}


/* =========================================================
   CATEGORIES
========================================================= */

function buildCategories() {

  if (!categoriesBox) return;

  const counts = {};

  APIs.forEach(api => {
    counts[api.category] =
      (counts[api.category] || 0) + 1;
  });

  const categories =
    Object.keys(counts)
      .sort(
        (a, b) =>
          a.localeCompare(b)
      );

  categoriesBox.innerHTML = "";

  categories.forEach(category => {

    const button =
      document.createElement("button");

    button.className =
      "sideBtn categoryBtn";

    button.dataset.category =
      category;

    button.innerHTML = `
      <span>${escapeHTML(category)}</span>
      <span>${counts[category]}</span>
    `;

    button.addEventListener(
      "click",
      () => {

        currentCategory =
          category;

        currentView =
          "category";

        currentPage = 1;

        document
          .querySelectorAll(".sideBtn")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        if (sectionTitle) {
          sectionTitle.textContent =
            category;
        }

        applyFilters();
        scrollToDirectory();

      }
    );

    categoriesBox.appendChild(button);

  });
}


/* =========================================================
   COUNTS
========================================================= */

function updateSideCounts() {

  const favorites =
    getFavorites();

  const recent =
    getRecent();

  if (favCount)
    favCount.textContent =
      favorites.length;

  if (recentCount)
    recentCount.textContent =
      recent.length;
}


/* =========================================================
   FILTERING
========================================================= */

function applyFilters() {

  const query =
    (searchInput?.value || "")
      .trim()
      .toLowerCase();

  const favorites =
    getFavorites();

  const recent =
    getRecent();

  filteredAPIs =
    APIs.filter(api => {

      if (query) {

        const searchable =
          [
            api.name,
            api.description,
            api.category,
            api.auth,
            api.https,
            api.cors,
            api.url
          ]
          .join(" ")
          .toLowerCase();

        if (
          !searchable.includes(query)
        ) {
          return false;
        }
      }

      if (
        currentView === "favorites" &&
        !favorites.includes(api.id)
      ) {
        return false;
      }

      if (
        currentView === "recent" &&
        !recent.includes(api.id)
      ) {
        return false;
      }

      if (
        currentCategory !== "all" &&
        api.category !== currentCategory
      ) {
        return false;
      }

      if (
        currentFilter === "noauth" &&
        api.auth !== "No"
      ) {
        return false;
      }

      if (
        currentFilter === "https" &&
        api.https !== "Yes"
      ) {
        return false;
      }

      if (
        currentFilter === "cors" &&
        api.cors !== "Yes"
      ) {
        return false;
      }

      return true;

    });

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAPIs.length /
        PER_PAGE
      )
    );

  currentPage =
    Math.min(
      currentPage,
      totalPages
    );

  renderPage();
}


/* =========================================================
   RENDER CARDS
========================================================= */

function renderPage() {

  if (!apiGrid) return;

  apiGrid.innerHTML = "";

  const start =
    (currentPage - 1) *
    PER_PAGE;

  const items =
    filteredAPIs.slice(
      start,
      start + PER_PAGE
    );

  if (resultText) {
    resultText.textContent =
      `${filteredAPIs.length.toLocaleString()} APIs found`;
  }

  if (!items.length) {

    apiGrid.innerHTML = `
      <div class="emptyState">
        <h3>No APIs found</h3>
        <p>Try another search, category or filter.</p>
      </div>
    `;

    renderPagination();
    return;
  }

  const favorites =
    getFavorites();

  items.forEach(
    (api, index) => {

      const card =
        document.createElement("article");

      card.className =
        "apiCard";

      card.style.animationDelay =
        `${index * 35}ms`;

      const favorite =
        favorites.includes(api.id);

      card.innerHTML = `

        <div class="cardTop">

          <div class="apiIcon">
            ${escapeHTML(
              api.name
                .charAt(0)
                .toUpperCase()
            )}
          </div>

          <button
            class="heartBtn ${favorite ? "liked" : ""}"
            data-id="${escapeHTML(api.id)}"
          >
            ${favorite ? "★" : "☆"}
          </button>

        </div>

        <div class="apiCategory">
          ${escapeHTML(api.category)}
        </div>

        <h3>
          ${escapeHTML(api.name)}
        </h3>

        <p>
          ${escapeHTML(api.description)}
        </p>

        <div class="apiMeta">

          <span>
            AUTH
            <b>${escapeHTML(api.auth)}</b>
          </span>

          <span>
            HTTPS
            <b>${escapeHTML(api.https)}</b>
          </span>

          <span>
            CORS
            <b>${escapeHTML(api.cors)}</b>
          </span>

        </div>

        <div class="cardButtons">

          <button
            class="detailsButton"
            data-id="${escapeHTML(api.id)}"
          >
            View Details
          </button>

          <a
            class="visitButton"
            href="${escapeHTML(api.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit ↗
          </a>

        </div>
      `;

      apiGrid.appendChild(card);
    }
  );


  document
    .querySelectorAll(".heartBtn")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          toggleFavorite(
            button.dataset.id
          );

        }
      );

    });


  document
    .querySelectorAll(".detailsButton")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const api =
            APIs.find(
              item =>
                item.id ===
                button.dataset.id
            );

          if (api) {
            openModal(api);
          }

        }
      );

    });

  renderPagination();
}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

  if (!pagination) return;

  const pages =
    Math.ceil(
      filteredAPIs.length /
      PER_PAGE
    );

  pagination.innerHTML = "";

  if (pages <= 1) return;

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "paginationInner";

  const prev =
    document.createElement("button");

  prev.textContent =
    "← Prev";

  prev.disabled =
    currentPage === 1;

  prev.onclick = () => {

    if (currentPage > 1) {

      currentPage--;

      renderPage();

      scrollToDirectory();
    }

  };

  wrapper.appendChild(prev);


  let start =
    Math.max(
      1,
      currentPage - 3
    );

  let end =
    Math.min(
      pages,
      start + 6
    );

  if (
    end - start < 6
  ) {
    start =
      Math.max(
        1,
        end - 6
      );
  }

  for (
    let i = start;
    i <= end;
    i++
  ) {

    const button =
      document.createElement("button");

    button.textContent =
      i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.onclick = () => {

      currentPage = i;

      renderPage();

      scrollToDirectory();

    };

    wrapper.appendChild(button);
  }


  const next =
    document.createElement("button");

  next.textContent =
    "Next →";

  next.disabled =
    currentPage === pages;

  next.onclick = () => {

    if (currentPage < pages) {

      currentPage++;

      renderPage();

      scrollToDirectory();
    }

  };

  wrapper.appendChild(next);

  pagination.appendChild(wrapper);
}


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(id) {

  let favorites =
    getFavorites();

  if (
    favorites.includes(id)
  ) {

    favorites =
      favorites.filter(
        item => item !== id
      );

    showToast(
      "Removed from favorites"
    );

  } else {

    favorites.push(id);

    showToast(
      "Added to favorites"
    );
  }

  saveFavorites(favorites);

  updateSideCounts();

  applyFilters();

  if (
    currentAPI &&
    currentAPI.id === id
  ) {
    updateModalFavorite();
  }
}


/* =========================================================
   RECENT
========================================================= */

function addRecent(id) {

  let recent =
    getRecent();

  recent =
    recent.filter(
      item => item !== id
    );

  recent.unshift(id);

  saveRecent(
    recent.slice(0, 30)
  );

  updateSideCounts();
}


/* =========================================================
   MODAL
========================================================= */

function openModal(api) {

  currentAPI = api;

  addRecent(api.id);

  if (modalCategory)
    modalCategory.textContent =
      api.category;

  if (modalName)
    modalName.textContent =
      api.name;

  if (modalDescription)
    modalDescription.textContent =
      api.description;

  if (modalUrl)
    modalUrl.textContent =
      api.url;

  if (testUrl)
    testUrl.value =
      api.url;

  if (visitBtn)
    visitBtn.href =
      api.url;

  if (modalDetails) {

    modalDetails.innerHTML = `

      <div class="detailItem">
        <small>AUTHENTICATION</small>
        <strong>${escapeHTML(api.auth)}</strong>
      </div>

      <div class="detailItem">
        <small>HTTPS</small>
        <strong>${escapeHTML(api.https)}</strong>
      </div>

      <div class="detailItem">
        <small>CORS</small>
        <strong>${escapeHTML(api.cors)}</strong>
      </div>

      <div class="detailItem">
        <small>CATEGORY</small>
        <strong>${escapeHTML(api.category)}</strong>
      </div>

    `;
  }

  updateModalFavorite();

  if (tester)
    tester.style.display = "none";

  if (responseBox)
    responseBox.textContent =
      "Ready.";

  if (modal) {

    modal.classList.add("active");

    document.body.style.overflow =
      "hidden";
  }
}


function updateModalFavorite() {

  if (!favBtn || !currentAPI)
    return;

  const favorites =
    getFavorites();

  favBtn.textContent =
    favorites.includes(
      currentAPI.id
    )
      ? "★ Favorited"
      : "☆ Favorite";
}


function closeAPI() {

  if (!modal) return;

  modal.classList.remove("active");

  document.body.style.overflow = "";

  currentAPI = null;
}


if (closeModal) {
  closeModal.addEventListener(
    "click",
    closeAPI
  );
}

if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {
        closeAPI();
      }

    }
  );
}

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {
      closeAPI();
    }

  }
);


/* =========================================================
   COPY
========================================================= */

if (copyBtn) {

  copyBtn.addEventListener(
    "click",
    async () => {

      if (!currentAPI)
        return;

      try {

        await navigator.clipboard.writeText(
          currentAPI.url
        );

        showToast(
          "API URL copied"
        );

      } catch {

        showToast(
          "Copy failed"
        );

      }

    }
  );
}


/* =========================================================
   MODAL FAVORITE
========================================================= */

if (favBtn) {

  favBtn.addEventListener(
    "click",
    () => {

      if (currentAPI) {
        toggleFavorite(
          currentAPI.id
        );
      }

    }
  );
}


/* =========================================================
   API TESTER
========================================================= */

if (testerBtn) {

  testerBtn.addEventListener(
    "click",
    () => {

      if (!tester) return;

      tester.style.display =
        tester.style.display === "none"
          ? "block"
          : "none";

    }
  );
}


if (sendBtn) {

  sendBtn.addEventListener(
    "click",
    async () => {

      const url =
        testUrl?.value.trim();

      if (!url) {

        responseBox.textContent =
          "Enter an API URL.";

        return;
      }

      if (
        !/^https?:\/\//i.test(url)
      ) {

        responseBox.textContent =
          "Invalid URL.";

        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent =
        "Testing...";

      responseBox.textContent =
        "Sending GET request...\n\nPlease wait.";

      const controller =
        new AbortController();

      const timeout =
        setTimeout(
          () => controller.abort(),
          12000
        );

      try {

        const response =
          await fetch(
            url,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json,text/plain,*/*"
              },
              signal:
                controller.signal
            }
          );

        const contentType =
          response.headers
            .get("content-type") || "";

        let result;

        if (
          contentType.includes(
            "application/json"
          )
        ) {

          result =
            JSON.stringify(
              await response.json(),
              null,
              2
            );

        } else {

          result =
            await response.text();

        }

        responseBox.textContent =
          `HTTP ${response.status} ${response.statusText}

${result}`;

      }

      catch (error) {

        responseBox.textContent =
          error.name === "AbortError"
            ? "Request timed out."
            : `Request failed.

${error.message}

Possible reasons:
• Browser CORS restriction
• API requires authentication
• API is offline
• Rate limit
• Special headers required`;

      }

      finally {

        clearTimeout(timeout);

        sendBtn.disabled =
          false;

        sendBtn.textContent =
          "Send Request";
      }

    }
  );
}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      currentPage = 1;

      applyFilters();

    }
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

document
  .querySelectorAll(
    ".sideBtn[data-view]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".sideBtn"
          )
          .forEach(btn =>
            btn.classList.remove(
              "active"
            )
          );

        button.classList.add("active");

        currentView =
          button.dataset.view;

        currentCategory =
          "all";

        currentPage = 1;

        if (sectionTitle) {

          if (
            currentView === "all"
          )
            sectionTitle.textContent =
              "All APIs";

          if (
            currentView === "favorites"
          )
            sectionTitle.textContent =
              "Favorites";

          if (
            currentView === "recent"
          )
            sectionTitle.textContent =
              "Recently Viewed";

        }

        document
          .querySelectorAll(
            ".categoryBtn"
          )
          .forEach(btn =>
            btn.classList.remove(
              "active"
            )
          );

        applyFilters();

        scrollToDirectory();

      }
    );

  });


/* =========================================================
   FILTER BUTTONS
========================================================= */

document
  .querySelectorAll(
    ".filter[data-filter]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter")
          .forEach(btn =>
            btn.classList.remove(
              "active"
            )
          );

        button.classList.add("active");

        currentFilter =
          button.dataset.filter;

        currentPage = 1;

        applyFilters();

      }
    );

  });


/* =========================================================
   EXPLORE
========================================================= */

if (exploreBtn) {

  exploreBtn.addEventListener(
    "click",
    scrollToDirectory
  );

}


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && sidebar) {

  menuBtn.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "mobileOpen"
      );

    }
  );
}


/* =========================================================
   DEVELOPER
========================================================= */

const developerMini =
  document.querySelector(
    ".developerMini"
  );

if (developerMini) {

  developerMini.style.cursor =
    "pointer";

  developerMini.addEventListener(
    "click",
    () => {

      window.location.href =
        "developer.html";

    }
  );
}


/* =========================================================
   THEME
========================================================= */

if (
  localStorage.getItem(
    "elicenTheme"
  ) === "light"
) {

  document.body.classList.add(
    "lightMode"
  );
}

if (themeBtn) {

  themeBtn.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "lightMode"
      );

      localStorage.setItem(
        "elicenTheme",

        document.body.classList.contains(
          "lightMode"
        )
          ? "light"
          : "dark"
      );

    }
  );
}


/* =========================================================
   MUSIC
========================================================= */

if (music) {
  music.volume = 0.45;
}

async function playMusic() {

  if (!music) return;

  try {

    await music.play();

    musicBtn?.classList.add(
      "playing"
    );

  } catch {

    /*
      Modern browsers may block
      autoplay with sound.
    */

  }
}

if (musicBtn) {

  musicBtn.addEventListener(
    "click",
    async () => {

      if (music.paused) {
        await playMusic();
      } else {

        music.pause();

        musicBtn.classList.remove(
          "playing"
        );

      }

    }
  );
}

window.addEventListener(
  "load",
  () => {

    setTimeout(
      playMusic,
      500
    );

  }
);

document.addEventListener(
  "click",
  () => {

    if (
      music &&
      music.paused
    ) {
      playMusic();
    }

  },
  { once: true }
);


/* =========================================================
   SCROLL
========================================================= */

function scrollToDirectory() {

  document
    .getElementById("directory")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}


/* =========================================================
   START
========================================================= */

updateSideCounts();
loadAPIs();