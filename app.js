"use strict";

/* =========================================================
   ELICEN API VAULT
   Loads the public-apis GitHub README dynamically
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

const searchInput = document.getElementById("searchInput");
const apiGrid = document.getElementById("apiGrid");
const categoriesBox = document.getElementById("categories");
const pagination = document.getElementById("pagination");

const loading = document.getElementById("loading");

const totalApis = document.getElementById("totalApis");
const totalCategories = document.getElementById("totalCategories");
const httpsApis = document.getElementById("httpsApis");
const noAuthApis = document.getElementById("noAuthApis");

const allCount = document.getElementById("allCount");
const favCount = document.getElementById("favCount");
const recentCount = document.getElementById("recentCount");

const sectionTitle = document.getElementById("sectionTitle");
const resultText = document.getElementById("resultText");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");
const modalUrl = document.getElementById("modalUrl");

const copyBtn = document.getElementById("copyBtn");
const visitBtn = document.getElementById("visitBtn");
const favBtn = document.getElementById("favBtn");
const testerBtn = document.getElementById("testerBtn");

const tester = document.getElementById("tester");
const testUrl = document.getElementById("testUrl");
const sendBtn = document.getElementById("sendBtn");
const responseBox = document.getElementById("responseBox");

const toast = document.getElementById("toast");

const themeBtn = document.getElementById("themeBtn");
const musicBtn = document.getElementById("musicBtn");
const music = document.getElementById("music");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const exploreBtn = document.getElementById("exploreBtn");


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("elicenFavorites")) || [];
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
    return JSON.parse(localStorage.getItem("elicenRecent")) || [];
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
   TOAST
========================================================= */

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* =========================================================
   ESCAPE HTML
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
   CLEAN MARKDOWN
========================================================= */

function cleanMarkdown(text) {

  return String(text || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .trim();

}


/* =========================================================
   EXTRACT URL FROM MARKDOWN
========================================================= */

function extractURL(cell) {

  const markdown =
    cell.match(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);

  if (markdown) {
    return markdown[1];
  }

  const direct =
    cell.match(/https?:\/\/[^\s|)]+/i);

  return direct ? direct[0] : "#";

}


/* =========================================================
   EXTRACT API NAME
========================================================= */

function extractName(cell) {

  const markdown =
    cell.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/i);

  if (markdown) {
    return cleanMarkdown(markdown[1]);
  }

  return cleanMarkdown(cell);
}


/* =========================================================
   NORMALIZE VALUES
========================================================= */

function normalizeAuth(value) {

  value = cleanMarkdown(value);

  if (!value || value === "No") {
    return "No";
  }

  if (value.toLowerCase() === "null") {
    return "No";
  }

  return value;
}


function normalizeYesNo(value) {

  value = cleanMarkdown(value);

  const lower = value.toLowerCase();

  if (lower === "yes") return "Yes";
  if (lower === "no") return "No";

  return "Unknown";
}


/* =========================================================
   PARSE PUBLIC-APIS README
========================================================= */

function parseREADME(markdown) {

  const lines = markdown.split(/\r?\n/);

  const results = [];

  let category = null;

  for (let i = 0; i < lines.length; i++) {

    const line = lines[i].trim();

    /*
      Categories in public-apis README use ### headings.
    */

    const heading =
      line.match(/^###\s+(.+)$/);

    if (heading) {

      category =
        cleanMarkdown(heading[1]);

      continue;
    }


    /*
      Only process markdown table rows.
    */

    if (!line.startsWith("|")) {
      continue;
    }

    if (
      line.includes("---") ||
      line.toLowerCase().includes("api | description")
    ) {
      continue;
    }


    const cells =
      line
        .split("|")
        .map(x => x.trim());

    if (cells.length < 6) {
      continue;
    }


    /*
      Because rows look like:

      | API | Description | Auth | HTTPS | CORS |
    */

    const nameCell = cells[1];
    const descriptionCell = cells[2];
    const authCell = cells[3];
    const httpsCell = cells[4];
    const corsCell = cells[5];


    if (!nameCell || !descriptionCell) {
      continue;
    }


    const name =
      extractName(nameCell);

    const url =
      extractURL(nameCell);

    const description =
      cleanMarkdown(descriptionCell);

    if (!name || name.length < 2) {
      continue;
    }


    /*
      Avoid accidentally importing table headings.
    */

    if (
      name.toLowerCase() === "api" ||
      name.toLowerCase() === "name"
    ) {
      continue;
    }


    results.push({
      id: `${category}-${name}-${url}`,

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


  /*
    Remove duplicate entries.
  */

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

    loading.style.display = "block";

    const response =
      await fetch(API_SOURCE, {
        cache: "no-store"
      });

    if (!response.ok) {
      throw new Error(
        `GitHub returned ${response.status}`
      );
    }

    const markdown =
      await response.text();

    APIs =
      parseREADME(markdown);


    if (!APIs.length) {
      throw new Error(
        "No API entries were found."
      );
    }


    updateStats();

    buildCategories();

    loading.style.display = "none";

    applyFilters();

    showToast(
      `${APIs.length} APIs loaded`
    );

  }

  catch (error) {

    console.error(error);

    loading.innerHTML = `
      <div style="padding:25px">
        <h3>Unable to load APIs</h3>

        <p style="margin-top:8px">
          GitHub data could not be loaded.
        </p>

        <button
          id="retryBtn"
          class="primaryBtn"
          style="margin-top:18px"
        >
          Retry
        </button>
      </div>
    `;

    const retry =
      document.getElementById("retryBtn");

    if (retry) {
      retry.addEventListener(
        "click",
        loadAPIs
      );
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

  const https =
    APIs.filter(
      api => api.https === "Yes"
    ).length;

  const noAuth =
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
      https.toLocaleString();

  if (noAuthApis)
    noAuthApis.textContent =
      noAuth.toLocaleString();

  if (allCount)
    allCount.textContent =
      APIs.length;

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
      .sort((a, b) =>
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
      <span>
        ${escapeHTML(category)}
      </span>
      <span>
        ${counts[category]}
      </span>
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
   SIDEBAR COUNTS
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
   FILTERS
========================================================= */

function applyFilters() {

  const query =
    (searchInput?.value || "")
      .trim()
      .toLowerCase();


  filteredAPIs =
    APIs.filter(api => {

      /*
        Search
      */

      const searchable =
        [
          api.name,
          api.description,
          api.category,
          api.auth,
          api.https,
          api.cors
        ]
        .join(" ")
        .toLowerCase();


      if (
        query &&
        !searchable.includes(query)
      ) {
        return false;
      }


      /*
        Sidebar view
      */

      if (currentView === "favorites") {

        const favorites =
          getFavorites();

        if (
          !favorites.includes(api.id)
        ) {
          return false;
        }

      }


      if (currentView === "recent") {

        const recent =
          getRecent();

        if (
          !recent.includes(api.id)
        ) {
          return false;
        }

      }


      /*
        Category
      */

      if (
        currentCategory !== "all" &&
        api.category !== currentCategory
      ) {
        return false;
      }


      /*
        Filters
      */

      if (currentFilter === "noauth") {

        if (api.auth !== "No") {
          return false;
        }

      }


      if (currentFilter === "https") {

        if (api.https !== "Yes") {
          return false;
        }

      }


      if (currentFilter === "cors") {

        if (api.cors !== "Yes") {
          return false;
        }

      }


      return true;

    });


  currentPage = Math.min(
    currentPage,
    Math.max(
      1,
      Math.ceil(
        filteredAPIs.length /
        PER_PAGE
      )
    )
  );


  renderPage();

}


/* =========================================================
   RENDER PAGE
========================================================= */

function renderPage() {

  if (!apiGrid) return;


  apiGrid.innerHTML = "";


  const start =
    (currentPage - 1) *
    PER_PAGE;

  const end =
    start + PER_PAGE;


  const pageItems =
    filteredAPIs.slice(
      start,
      end
    );


  if (resultText) {

    resultText.textContent =
      `${filteredAPIs.length.toLocaleString()} APIs found`;

  }


  if (!pageItems.length) {

    apiGrid.innerHTML = `
      <div class="emptyState">
        <h3>No APIs found</h3>
        <p>
          Try another search or filter.
        </p>
      </div>
    `;

    renderPagination();

    return;
  }


  pageItems.forEach(
    (api, index) => {

      const card =
        document.createElement("article");

      card.className =
        "apiCard";

      card.style.animationDelay =
        `${index * 35}ms`;


      const isFavorite =
        getFavorites()
          .includes(api.id);


      card.innerHTML = `

        <div class="cardTop">

          <div class="apiIcon">
            ${escapeHTML(
              api.name
                .slice(0, 1)
                .toUpperCase()
            )}
          </div>

          <button
            class="heartBtn ${
              isFavorite
                ? "liked"
                : ""
            }"
            data-id="${escapeHTML(api.id)}"
            title="Favorite"
          >
            ${isFavorite ? "★" : "☆"}
          </button>

        </div>


        <div class="apiCategory">
          ${escapeHTML(api.category)}
        </div>


        <h3>
          ${escapeHTML(api.name)}
        </h3>


        <p>
          ${escapeHTML(
            api.description
          )}
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
            href="${escapeHTML(api.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="visitButton"
          >
            Visit ↗
          </a>

        </div>

      `;


      apiGrid.appendChild(card);

    }
  );


  /*
    Favorite buttons
  */

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


  /*
    Detail buttons
  */

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


  if (pages <= 1) {
    return;
  }


  const wrapper =
    document.createElement("div");

  wrapper.className =
    "paginationInner";


  const previous =
    document.createElement("button");

  previous.textContent =
    "← Prev";

  previous.disabled =
    currentPage === 1;


  previous.addEventListener(
    "click",
    () => {

      if (currentPage > 1) {

        currentPage--;

        renderPage();

        scrollToDirectory();

      }

    }
  );


  wrapper.appendChild(
    previous
  );


  /*
    Show maximum 7 page buttons.
  */

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


    button.addEventListener(
      "click",
      () => {

        currentPage = i;

        renderPage();

        scrollToDirectory();

      }
    );


    wrapper.appendChild(
      button
    );

  }


  const next =
    document.createElement("button");

  next.textContent =
    "Next →";

  next.disabled =
    currentPage === pages;


  next.addEventListener(
    "click",
    () => {

      if (
        currentPage < pages
      ) {

        currentPage++;

        renderPage();

        scrollToDirectory();

      }

    }
  );


  wrapper.appendChild(next);

  pagination.appendChild(
    wrapper
  );

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


  /*
    Keep latest 30.
  */

  recent =
    recent.slice(0, 30);


  saveRecent(recent);

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


  if (visitBtn) {

    visitBtn.href =
      api.url;

  }


  if (modalDetails) {

    modalDetails.innerHTML = `

      <div class="detailItem">
        <small>AUTHENTICATION</small>
        <strong>
          ${escapeHTML(api.auth)}
        </strong>
      </div>

      <div class="detailItem">
        <small>HTTPS</small>
        <strong>
          ${escapeHTML(api.https)}
        </strong>
      </div>

      <div class="detailItem">
        <small>CORS</small>
        <strong>
          ${escapeHTML(api.cors)}
        </strong>
      </div>

      <div class="detailItem">
        <small>CATEGORY</small>
        <strong>
          ${escapeHTML(api.category)}
        </strong>
      </div>

    `;

  }


  updateModalFavorite();


  if (tester) {
    tester.style.display =
      "none";
  }


  if (responseBox) {
    responseBox.textContent =
      "Ready.";
  }


  if (modal) {

    modal.classList.add(
      "active"
    );

    document.body.style.overflow =
      "hidden";

  }

}


function updateModalFavorite() {

  if (!favBtn || !currentAPI)
    return;


  const favorites =
    getFavorites();


  if (
    favorites.includes(
      currentAPI.id
    )
  ) {

    favBtn.textContent =
      "★ Favorited";

  } else {

    favBtn.textContent =
      "☆ Favorite";

  }

}


function closeAPI() {

  if (!modal) return;

  modal.classList.remove(
    "active"
  );

  document.body.style.overflow =
    "";

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
   COPY API URL
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

      }

      catch {

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

      if (!tester)
        return;

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


      sendBtn.disabled =
        true;

      sendBtn.textContent =
        "Testing...";


      responseBox.textContent =
        "Sending GET request...\n\nPlease wait.";


      try {

        const controller =
          new AbortController();

        const timeout =
          setTimeout(
            () =>
              controller.abort(),
            10000
          );


        const response =
          await fetch(url, {
            method: "GET",
            headers: {
              "Accept":
                "application/json,text/plain,*/*"
            },
            signal:
              controller.signal
          });


        clearTimeout(timeout);


        const type =
          response.headers
            .get("content-type") ||
          "";


        let result;


        if (
          type.includes(
            "application/json"
          )
        ) {

          const json =
            await response.json();

          result =
            JSON.stringify(
              json,
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

        if (
          error.name ===
          "AbortError"
        ) {

          responseBox.textContent =
            "Request timed out.";

        } else {

          responseBox.textContent =
            `Request failed.

${error.message}

This API may:
• block browser CORS
• require authentication
• be offline
• require special headers
• have rate limits`;

        }

      }

      finally {

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
            btn.classList.remove(
              "active"
            )
          );


        button.classList.add(
          "active"
        );


        currentView =
          button.dataset.view;


        currentCategory =
          "all";

        currentPage =
          1;


        if (
          currentView ===
          "all"
        ) {

          sectionTitle.textContent =
            "All APIs";

        }

        if (
          currentView ===
          "favorites"
        ) {

          sectionTitle.textContent =
            "Favorites";

        }

        if (
          currentView ===
          "recent"
        ) {

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
   TOP FILTER BUTTONS
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
          .querySelectorAll(
            ".filter"
          )
          .forEach(btn =>
            btn.classList.remove(
              "active"
            )
          );


        button.classList.add(
          "active"
        );


        currentFilter =
          button.dataset.filter;


        currentPage = 1;

        applyFilters();

      }
    );

  });


/* =========================================================
   EXPLORE BUTTON
========================================================= */

if (exploreBtn) {

  exploreBtn.addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "directory"
        )
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }
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
   PROFILE IMAGE CLICK
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

  music.volume =
    0.45;

}


async function playMusic() {

  if (!music)
    return;

  try {

    await music.play();

    if (musicBtn)
      musicBtn.classList.add(
        "playing"
      );

  }

  catch {

    /*
      Browser autoplay policies can
      block audio until user interacts.
    */

  }

}


if (musicBtn) {

  musicBtn.addEventListener(
    "click",
    async () => {

      if (
        music.paused
      ) {

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


/*
  Try autoplay.
*/

window.addEventListener(
  "load",
  () => {

    setTimeout(
      playMusic,
      800
    );

  }
);


/*
  First user interaction fallback.
*/

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
    .getElementById(
      "directory"
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}


/* =========================================================
   START
========================================================= */

loadAPIs();
updateSideCounts();