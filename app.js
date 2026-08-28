"use strict";

/* =========================================================
   ELICEN API VAULT
   FINAL API DIRECTORY + SMART TESTER
========================================================= */

const API_SOURCE =
  "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md";

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
const testStatus = $("testStatus");
const methodSelect = $("methodSelect");
const clearResponse = $("clearResponse");

const toast = $("toast");

const themeBtn = $("themeBtn");
const musicBtn = $("musicBtn");
const music = $("music");

const menuBtn = $("menuBtn");
const sidebar = $("sidebar");
const exploreBtn = $("exploreBtn");


/* =========================================================
   STORAGE
========================================================= */

function getJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function getFavorites() {
  return getJSON("elicenFavorites");
}

function saveFavorites(list) {
  localStorage.setItem(
    "elicenFavorites",
    JSON.stringify(list)
  );
}

function getRecent() {
  return getJSON("elicenRecent");
}

function saveRecent(list) {
  localStorage.setItem(
    "elicenRecent",
    JSON.stringify(list)
  );
}


/* =========================================================
   TOAST
========================================================= */

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
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   MARKDOWN
========================================================= */

function cleanMarkdown(text) {

  return String(text || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}


function extractURL(cell) {

  const markdown =
    cell.match(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);

  if (markdown) {
    return markdown[1];
  }

  const direct =
    cell.match(/https?:\/\/[^\s|)]+/i);

  return direct
    ? direct[0].replace(/[.,]+$/, "")
    : "#";
}


function extractName(cell) {

  const markdown =
    cell.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/i);

  if (markdown) {
    return cleanMarkdown(markdown[1]);
  }

  return cleanMarkdown(cell);
}


function normalizeAuth(value) {

  value = cleanMarkdown(value);

  if (!value || value.toLowerCase() === "no") {
    return "No";
  }

  if (value.toLowerCase() === "null") {
    return "No";
  }

  return value;
}


function normalizeYesNo(value) {

  const lower =
    cleanMarkdown(value).toLowerCase();

  if (lower === "yes") return "Yes";
  if (lower === "no") return "No";

  return "Unknown";
}


/* =========================================================
   README PARSER
========================================================= */

function parseREADME(markdown) {

  const lines =
    markdown.split(/\r?\n/);

  const results = [];

  let category = "Other";

  for (let i = 0; i < lines.length; i++) {

    const line =
      lines[i].trim();

    /*
      Public-apis categories are generally
      level 3 markdown headings.
    */

    const heading =
      line.match(/^###\s+(.+)$/);

    if (heading) {

      category =
        cleanMarkdown(heading[1]);

      continue;
    }

    if (!line.startsWith("|")) {
      continue;
    }

    if (
      line.includes("---") ||
      /api\s*\|\s*description/i.test(line)
    ) {
      continue;
    }

    const cells =
      line
        .split("|")
        .map(x => x.trim());

    /*
      Because split("|") creates empty
      first/last cells.
    */

    if (cells.length < 6) {
      continue;
    }

    const nameCell = cells[1];
    const descriptionCell = cells[2];
    const authCell = cells[3];
    const httpsCell = cells[4];
    const corsCell = cells[5];

    if (
      !nameCell ||
      !descriptionCell
    ) {
      continue;
    }

    const name =
      extractName(nameCell);

    const url =
      extractURL(nameCell);

    const description =
      cleanMarkdown(descriptionCell);

    if (
      !name ||
      name.length < 2 ||
      url === "#"
    ) {
      continue;
    }

    if (
      name.toLowerCase() === "api" ||
      name.toLowerCase() === "name"
    ) {
      continue;
    }

    results.push({

      id:
        `${category}|${name}|${url}`,

      name,

      category:
        category || "Other",

      description,

      auth:
        normalizeAuth(authCell),

      https:
        normalizeYesNo(httpsCell),

      cors:
        normalizeYesNo(corsCell),

      url

    });

  }

  const unique =
    new Map();

  results.forEach(api => {

    const key =
      `${api.name.toLowerCase()}|${api.url}`;

    if (!unique.has(key)) {
      unique.set(key, api);
    }

  });

  return Array.from(unique.values());
}


/* =========================================================
   LOAD APIs
========================================================= */

async function loadAPIs() {

  try {

    loading.style.display = "grid";

    loading.innerHTML = `
      <div class="spinner"></div>
      <h3>LOADING PUBLIC APIs</h3>
      <p>Fetching the latest directory data...</p>
    `;

    const response =
      await fetch(API_SOURCE, {
        cache: "no-store"
      });

    if (!response.ok) {
      throw new Error(
        `GitHub returned HTTP ${response.status}`
      );
    }

    const markdown =
      await response.text();

    APIs =
      parseREADME(markdown);

    if (!APIs.length) {
      throw new Error(
        "No API entries were detected."
      );
    }

    updateStats();
    buildCategories();

    loading.style.display = "none";

    applyFilters();

    showToast(
      `${APIs.length.toLocaleString()} APIs loaded`
    );

  } catch (error) {

    console.error(error);

    loading.style.display = "grid";

    loading.innerHTML = `
      <div>
        <h3>API DIRECTORY COULD NOT LOAD</h3>

        <p>
          ${escapeHTML(error.message)}
        </p>

        <button id="retryBtn"
                class="primaryBtn"
                style="margin-top:18px">
          RETRY
        </button>
      </div>
    `;

    const retryBtn =
      $("retryBtn");

    retryBtn?.addEventListener(
      "click",
      loadAPIs
    );
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

  const https =
    APIs.filter(
      api => api.https === "Yes"
    ).length;

  const noAuth =
    APIs.filter(
      api => api.auth === "No"
    ).length;

  totalApis.textContent =
    APIs.length.toLocaleString();

  totalCategories.textContent =
    categories.size;

  httpsApis.textContent =
    https.toLocaleString();

  noAuthApis.textContent =
    noAuth.toLocaleString();

  allCount.textContent =
    APIs.length;

  updateSideCounts();
}


/* =========================================================
   CATEGORIES
========================================================= */

function buildCategories() {

  const counts = {};

  APIs.forEach(api => {

    counts[api.category] =
      (counts[api.category] || 0) + 1;

  });

  categoriesBox.innerHTML = "";

  Object.keys(counts)
    .sort((a,b) => a.localeCompare(b))
    .forEach(category => {

      const button =
        document.createElement("button");

      button.className =
        "sideBtn categoryBtn";

      button.innerHTML = `
        <span>${escapeHTML(category)}</span>
        <b>${counts[category]}</b>
      `;

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(".sideBtn")
            .forEach(x =>
              x.classList.remove("active")
            );

          button.classList.add("active");

          currentCategory =
            category;

          currentView =
            "category";

          currentPage = 1;

          sectionTitle.textContent =
            category.toUpperCase();

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

  favCount.textContent =
    getFavorites().length;

  recentCount.textContent =
    getRecent().length;
}


/* =========================================================
   FILTERING
========================================================= */

function applyFilters() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  filteredAPIs =
    APIs.filter(api => {

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
        query &&
        !searchable.includes(query)
      ) {
        return false;
      }

      if (
        currentView === "favorites" &&
        !getFavorites().includes(api.id)
      ) {
        return false;
      }

      if (
        currentView === "recent" &&
        !getRecent().includes(api.id)
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

  const pages =
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
      pages
    );

  renderPage();
}


/* =========================================================
   RENDER
========================================================= */

function renderPage() {

  apiGrid.innerHTML = "";

  const start =
    (currentPage - 1) *
    PER_PAGE;

  const items =
    filteredAPIs.slice(
      start,
      start + PER_PAGE
    );

  resultText.textContent =
    `${filteredAPIs.length.toLocaleString()} APIs found`;

  if (!items.length) {

    apiGrid.innerHTML = `
      <div class="emptyState">
        <h3>NO APIs FOUND</h3>
        <p>Try another search, category or filter.</p>
      </div>
    `;

    renderPagination();

    return;
  }

  const favorites =
    getFavorites();

  items.forEach((api,index) => {

    const card =
      document.createElement("article");

    card.className =
      "apiCard";

    card.style.animationDelay =
      `${index * 25}ms`;

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
          data-id="${escapeHTML(api.id)}">
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
          data-id="${escapeHTML(api.id)}">
          VIEW DETAILS
        </button>

        <a
          class="visitButton"
          href="${escapeHTML(api.url)}"
          target="_blank"
          rel="noopener noreferrer">
          OPEN
        </a>

      </div>

    `;

    apiGrid.appendChild(card);

  });

  document
    .querySelectorAll(".heartBtn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          toggleFavorite(
            btn.dataset.id
          );

        }
      );

    });

  document
    .querySelectorAll(".detailsButton")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const api =
            APIs.find(
              x => x.id === btn.dataset.id
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

  pagination.innerHTML = "";

  const pages =
    Math.ceil(
      filteredAPIs.length /
      PER_PAGE
    );

  if (pages <= 1) return;

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "paginationInner";

  function addButton(text,page,active=false) {

    const button =
      document.createElement("button");

    button.textContent =
      text;

    if (active) {
      button.classList.add("active");
    }

    button.addEventListener(
      "click",
      () => {

        currentPage =
          page;

        renderPage();

        scrollToDirectory();

      }
    );

    wrapper.appendChild(button);
  }

  const prev =
    document.createElement("button");

  prev.textContent =
    "← PREV";

  prev.disabled =
    currentPage === 1;

  prev.addEventListener(
    "click",
    () => {

      currentPage--;

      renderPage();

      scrollToDirectory();

    }
  );

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
    addButton(
      i,
      i,
      i === currentPage
    );
  }

  const next =
    document.createElement("button");

  next.textContent =
    "NEXT →";

  next.disabled =
    currentPage === pages;

  next.addEventListener(
    "click",
    () => {

      currentPage++;

      renderPage();

      scrollToDirectory();

    }
  );

  wrapper.appendChild(next);

  pagination.appendChild(wrapper);
}


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(id) {

  let list =
    getFavorites();

  if (list.includes(id)) {

    list =
      list.filter(
        x => x !== id
      );

    showToast(
      "Removed from favorites"
    );

  } else {

    list.push(id);

    showToast(
      "Added to favorites"
    );

  }

  saveFavorites(list);

  updateSideCounts();

  applyFilters();

  updateModalFavorite();
}


/* =========================================================
   RECENT
========================================================= */

function addRecent(id) {

  let list =
    getRecent();

  list =
    list.filter(
      x => x !== id
    );

  list.unshift(id);

  saveRecent(
    list.slice(0,30)
  );

  updateSideCounts();
}


/* =========================================================
   MODAL
========================================================= */

function openModal(api) {

  currentAPI =
    api;

  addRecent(api.id);

  modalCategory.textContent =
    api.category;

  modalName.textContent =
    api.name;

  modalDescription.textContent =
    api.description;

  modalUrl.textContent =
    api.url;

  visitBtn.href =
    api.url;

  testUrl.value =
    api.url;

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

  tester.style.display =
    "none";

  responseBox.textContent =
    "Ready.";

  testStatus.textContent =
    "READY";

  updateModalFavorite();

  modal.classList.add("active");

  document.body.style.overflow =
    "hidden";
}


function closeAPI() {

  modal.classList.remove("active");

  document.body.style.overflow =
    "";

  currentAPI = null;
}


function updateModalFavorite() {

  if (!currentAPI) return;

  const favorite =
    getFavorites().includes(
      currentAPI.id
    );

  favBtn.textContent =
    favorite
      ? "★ FAVORITED"
      : "☆ FAVORITE";
}


closeModal.addEventListener(
  "click",
  closeAPI
);


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

copyBtn.addEventListener(
  "click",
  async () => {

    if (!currentAPI) return;

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


/* =========================================================
   FAVORITE FROM MODAL
========================================================= */

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


/* =========================================================
   TESTER TOGGLE
========================================================= */

testerBtn.addEventListener(
  "click",
  () => {

    const visible =
      tester.style.display === "block";

    tester.style.display =
      visible
        ? "none"
        : "block";

  }
);


/* =========================================================
   SMART API TESTER
========================================================= */

function formatResponse(text, contentType) {

  if (
    contentType &&
    contentType.includes("application/json")
  ) {

    try {

      return JSON.stringify(
        JSON.parse(text),
        null,
        2
      );

    } catch {

      return text;
    }

  }

  /*
    Some APIs return JSON without the
    correct content-type.
  */

  try {

    const parsed =
      JSON.parse(text);

    return JSON.stringify(
      parsed,
      null,
      2
    );

  } catch {

    return text;
  }
}


sendBtn.addEventListener(
  "click",
  async () => {

    const url =
      testUrl.value.trim();

    if (!url) {

      responseBox.textContent =
        "Enter an API endpoint URL.";

      return;
    }

    if (
      !/^https?:\/\//i.test(url)
    ) {

      responseBox.textContent =
        "Invalid URL. Use http:// or https://";

      return;
    }

    sendBtn.disabled =
      true;

    sendBtn.textContent =
      "TESTING...";

    testStatus.textContent =
      "REQUESTING";

    responseBox.textContent =
      "Sending GET request...\n\nPlease wait.";

    try {

      const controller =
        new AbortController();

      const timeout =
        setTimeout(
          () => controller.abort(),
          15000
        );

      const started =
        performance.now();

      const response =
        await fetch(
          url,
          {
            method: "GET",
            headers: {
              "Accept":
                "application/json, text/plain, */*"
            },
            signal:
              controller.signal
          }
        );

      clearTimeout(timeout);

      const elapsed =
        Math.round(
          performance.now() -
          started
        );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      const text =
        await response.text();

      const formatted =
        formatResponse(
          text,
          contentType
        );

      testStatus.textContent =
        `HTTP ${response.status}`;

      responseBox.textContent =
`HTTP ${response.status} ${response.statusText}
TIME ${elapsed} ms
CONTENT-TYPE ${contentType || "unknown"}

${formatted}`;

      /*
        Helpful explanation when the
        directory URL returns HTML.
      */

      if (
        contentType.includes("text/html") ||
        /^\s*<!doctype html/i.test(text) ||
        /^\s*<html/i.test(text)
      ) {

        responseBox.textContent +=
`

────────────────────────
INFO
────────────────────────
This URL returned HTML, not an API JSON response.

The URL is probably a website/documentation page.
Open the API documentation and enter the actual
endpoint URL into the tester.`;

      }

    } catch (error) {

      testStatus.textContent =
        "FAILED";

      let message =
        error.message;

      if (
        error.name === "AbortError"
      ) {

        message =
          "Request timed out after 15 seconds.";

      }

      /*
        Browser CORS errors usually appear
        as a generic TypeError.
      */

      if (
        error.name === "TypeError"
      ) {

        message += `

Possible reason:
• API blocks browser CORS
• API requires authentication
• endpoint is offline
• special headers are required
• rate limit is active

This does NOT automatically mean the API itself is broken.`;

      }

      responseBox.textContent =
`REQUEST FAILED

${message}`;

    } finally {

      sendBtn.disabled =
        false;

      sendBtn.textContent =
        "SEND";

    }

  }
);


/* =========================================================
   CLEAR RESPONSE
========================================================= */

clearResponse.addEventListener(
  "click",
  () => {

    responseBox.textContent =
      "Ready.";

    testStatus.textContent =
      "READY";

  }
);


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
  "input",
  () => {

    currentPage = 1;

    applyFilters();

  }
);


/* =========================================================
   SIDEBAR VIEWS
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
            btn.classList.remove("active")
          );

        button.classList.add("active");

        currentView =
          button.dataset.view;

        currentCategory =
          "all";

        currentPage =
          1;

        if (
          currentView === "all"
        ) {
          sectionTitle.textContent =
            "ALL APIs";
        }

        if (
          currentView === "favorites"
        ) {
          sectionTitle.textContent =
            "FAVORITES";
        }

        if (
          currentView === "recent"
        ) {
          sectionTitle.textContent =
            "RECENTLY VIEWED";
        }

        document
          .querySelectorAll(
            ".categoryBtn"
          )
          .forEach(btn =>
            btn.classList.remove("active")
          );

        applyFilters();

        scrollToDirectory();

      }
    );

  });


/* =========================================================
   FILTERS
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
            btn.classList.remove("active")
          );

        button.classList.add("active");

        currentFilter =
          button.dataset.filter;

        currentPage =
          1;

        applyFilters();

      }
    );

  });


/* =========================================================
   EXPLORE
========================================================= */

exploreBtn.addEventListener(
  "click",
  scrollToDirectory
);


function scrollToDirectory() {

  $("directory").scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   MOBILE MENU
========================================================= */

menuBtn.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "mobileOpen"
    );

  }
);


/* =========================================================
   THEME
========================================================= */

const savedTheme =
  localStorage.getItem(
    "elicenTheme"
  );

if (
  savedTheme === "light"
) {
  document.body.classList.add(
    "lightMode"
  );
}

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


/* =========================================================
   MUSIC
========================================================= */

music.volume =
  0.45;


async function playMusic() {

  try {

    await music.play();

    musicBtn.classList.add(
      "playing"
    );

  } catch {

    /*
      Chrome/Android can block
      autoplay with sound.
      The first user interaction
      will start it.
    */

  }

}


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


/*
  Try autoplay.
*/

window.addEventListener(
  "load",
  () => {

    setTimeout(
      playMusic,
      700
    );

  }
);


/*
  Browser autoplay fallback.
*/

["click","touchstart","keydown"].forEach(
  eventName => {

    document.addEventListener(
      eventName,
      () => {

        if (
          music.paused
        ) {
          playMusic();
        }

      },
      {
        once: true,
        passive: true
      }
    );

  }
);


/* =========================================================
   START
========================================================= */

updateSideCounts();
loadAPIs();