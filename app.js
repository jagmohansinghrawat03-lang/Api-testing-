"use strict";

/*
=========================================================
ELICEN API VAULT
Final frontend version

IMPORTANT:
The browser cannot bypass CORS restrictions.
The tester therefore reports CORS failures clearly
instead of pretending every API is testable.
=========================================================
*/


/* =====================================================
   API DATA SOURCE
===================================================== */

/*
  This is the public APIs JSON endpoint.

  If GitHub is temporarily unavailable, the site shows
  a useful error instead of becoming completely blank.
*/

const API_SOURCE =
  "https://raw.githubusercontent.com/public-apis/public-apis/master/db/apis.json";


const PER_PAGE = 24;


/* =====================================================
   STATE
===================================================== */

let APIs = [];
let filteredAPIs = [];

let currentPage = 1;
let currentView = "all";
let currentCategory = "all";
let currentFilter = "all";
let currentAPI = null;


/* =====================================================
   ELEMENTS
===================================================== */

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
const modalIcon = $("modalIcon");

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


/* =====================================================
   LOCAL STORAGE
===================================================== */

function getJSON(key, fallback = []) {

  try {

    const value = localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;

  }

}


function setJSON(key, value) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch {}

}


function getFavorites() {

  return getJSON(
    "elicenFavorites",
    []
  );

}


function saveFavorites(list) {

  setJSON(
    "elicenFavorites",
    list
  );

}


function getRecent() {

  return getJSON(
    "elicenRecent",
    []
  );

}


function saveRecent(list) {

  setJSON(
    "elicenRecent",
    list
  );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2200);

}


/* =====================================================
   SAFE HTML
===================================================== */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =====================================================
   NORMALIZE API DATA
===================================================== */

function normalizeAPI(item, index) {

  if (!item) return null;

  const name =
    item.API ||
    item.name ||
    item.Name ||
    "Unknown API";

  const description =
    item.Description ||
    item.description ||
    "No description available.";

  const url =
    item.Link ||
    item.link ||
    item.URL ||
    item.url ||
    "#";

  const category =
    item.Category ||
    item.category ||
    "Other";

  const authValue =
    item.Auth ??
    item.auth ??
    "";

  const httpsValue =
    item.HTTPS ??
    item.https ??
    "";

  const corsValue =
    item.Cors ??
    item.CORS ??
    item.cors ??
    "";


  let auth =
    String(authValue).trim();

  if (!auth || auth.toLowerCase() === "null") {
    auth = "No";
  }


  let https =
    String(httpsValue).toLowerCase();

  https =
    https === "true" ||
    https === "yes"
      ? "Yes"
      : "No";


  let cors =
    String(corsValue).toLowerCase();

  cors =
    cors === "yes" ||
    cors === "true" ||
    cors === "unknown"
      ? "Yes"
      : "No";


  return {

    id:
      `${index}-${name}-${url}`,

    name:
      String(name),

    description:
      String(description),

    category:
      String(category),

    auth,

    https,

    cors,

    url:
      String(url)

  };

}


/* =====================================================
   LOAD APIS
===================================================== */

async function loadAPIs() {

  try {

    if (loading) {
      loading.style.display = "block";
    }


    const response =
      await fetch(
        API_SOURCE,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `API database returned HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    /*
      Database normally contains an array.
    */

    let rawList = [];


    if (Array.isArray(data)) {

      rawList = data;

    }

    else if (
      data &&
      Array.isArray(data.apis)
    ) {

      rawList = data.apis;

    }

    else if (
      data &&
      Array.isArray(data.data)
    ) {

      rawList = data.data;

    }


    APIs =
      rawList
        .map(normalizeAPI)
        .filter(api =>
          api &&
          api.name &&
          api.url !== "#"
        );


    /*
      Remove duplicates.
    */

    const unique =
      new Map();


    APIs.forEach(api => {

      const key =
        `${api.name.toLowerCase()}|${api.url}`;

      if (!unique.has(key)) {
        unique.set(key, api);
      }

    });


    APIs =
      Array.from(
        unique.values()
      );


    if (!APIs.length) {

      throw new Error(
        "No API records found."
      );

    }


    updateStats();

    buildCategories();

    if (loading) {
      loading.style.display = "none";
    }

    applyFilters();

    showToast(
      `${APIs.length} APIs loaded`
    );

  }

  catch (error) {

    console.error(
      "API loading error:",
      error
    );


    if (!loading) return;


    loading.style.display = "block";


    loading.innerHTML = `

      <div style="max-width:600px;margin:auto">

        <h3>API directory couldn't load</h3>

        <p>
          The external API database is temporarily
          unavailable. Your website itself is working.
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


    $("retryBtn")
      ?.addEventListener(
        "click",
        loadAPIs
      );

  }

}


/* =====================================================
   STATS
===================================================== */

function updateStats() {

  const categorySet =
    new Set(
      APIs.map(
        api => api.category
      )
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
      categorySet.size;


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


/* =====================================================
   CATEGORIES
===================================================== */

function buildCategories() {

  if (!categoriesBox) return;


  const counts = {};


  APIs.forEach(api => {

    counts[api.category] =
      (counts[api.category] || 0) + 1;

  });


  categoriesBox.innerHTML = "";


  Object.keys(counts)
    .sort()
    .forEach(category => {

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

        <b>
          ${counts[category]}
        </b>

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


          sectionTitle.textContent =
            category;


          applyFilters();

          scrollToDirectory();

          if (window.innerWidth <= 760) {
            sidebar.classList.remove(
              "mobileOpen"
            );
          }

        }
      );


      categoriesBox.appendChild(
        button
      );

    });

}


/* =====================================================
   SIDE COUNTS
===================================================== */

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


/* =====================================================
   FILTER
===================================================== */

function applyFilters() {

  const query =
    searchInput
      ?.value
      .trim()
      .toLowerCase() || "";


  filteredAPIs =
    APIs.filter(api => {


      const searchable =
        [
          api.name,
          api.description,
          api.category,
          api.auth,
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
        currentView ===
        "favorites"
      ) {

        if (
          !getFavorites()
            .includes(api.id)
        ) {
          return false;
        }

      }


      if (
        currentView ===
        "recent"
      ) {

        if (
          !getRecent()
            .includes(api.id)
        ) {
          return false;
        }

      }


      if (
        currentCategory !==
        "all" &&
        api.category !==
        currentCategory
      ) {

        return false;

      }


      if (
        currentFilter ===
        "noauth" &&
        api.auth !== "No"
      ) {

        return false;

      }


      if (
        currentFilter ===
        "https" &&
        api.https !== "Yes"
      ) {

        return false;

      }


      if (
        currentFilter ===
        "cors" &&
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


/* =====================================================
   RENDER
===================================================== */

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

        <p>
          Try another search, category or filter.
        </p>

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
        `${index * 30}ms`;


      const favorite =
        favorites.includes(
          api.id
        );


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
            class="heartBtn ${
              favorite ? "liked" : ""
            }"
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
            <b>
              ${escapeHTML(api.auth)}
            </b>
          </span>

          <span>
            HTTPS
            <b>
              ${escapeHTML(api.https)}
            </b>
          </span>

          <span>
            CORS
            <b>
              ${escapeHTML(api.cors)}
            </b>
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


      apiGrid.appendChild(
        card
      );

    }
  );


  document
    .querySelectorAll(
      ".heartBtn"
    )
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
    .querySelectorAll(
      ".detailsButton"
    )
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


/* =====================================================
   PAGINATION
===================================================== */

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
    document.createElement(
      "div"
    );


  wrapper.className =
    "paginationInner";


  function addButton(
    text,
    page,
    disabled = false,
    active = false
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.textContent =
      text;


    button.disabled =
      disabled;


    if (active) {
      button.classList.add(
        "active"
      );
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


    wrapper.appendChild(
      button
    );

  }


  addButton(
    "←",
    currentPage - 1,
    currentPage === 1
  );


  let start =
    Math.max(
      1,
      currentPage - 2
    );


  let end =
    Math.min(
      pages,
      start + 4
    );


  if (end - start < 4) {

    start =
      Math.max(
        1,
        end - 4
      );

  }


  for (
    let i = start;
    i <= end;
    i++
  ) {

    addButton(
      String(i),
      i,
      false,
      i === currentPage
    );

  }


  addButton(
    "→",
    currentPage + 1,
    currentPage === pages
  );


  pagination.appendChild(
    wrapper
  );

}


/* =====================================================
   FAVORITES
===================================================== */

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


  saveFavorites(
    favorites
  );


  updateSideCounts();

  applyFilters();


  if (
    currentAPI &&
    currentAPI.id === id
  ) {

    updateModalFavorite();

  }

}


/* =====================================================
   RECENT
===================================================== */

function addRecent(id) {

  let recent =
    getRecent();


  recent =
    recent.filter(
      item => item !== id
    );


  recent.unshift(id);


  recent =
    recent.slice(
      0,
      30
    );


  saveRecent(
    recent
  );


  updateSideCounts();

}


/* =====================================================
   MODAL
===================================================== */

function openModal(api) {

  currentAPI =
    api;


  addRecent(
    api.id
  );


  modalCategory.textContent =
    api.category;


  modalName.textContent =
    api.name;


  modalDescription.textContent =
    api.description;


  modalUrl.textContent =
    api.url;


  modalIcon.textContent =
    api.name
      .charAt(0)
      .toUpperCase();


  testUrl.value =
    api.url;


  visitBtn.href =
    api.url;


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


  updateModalFavorite();


  tester.style.display =
    "none";


  responseBox.textContent =
    "Ready.";


  modal.classList.add(
    "active"
  );


  document.body.style.overflow =
    "hidden";

}


function updateModalFavorite() {

  if (!currentAPI) return;


  const favorite =
    getFavorites()
      .includes(
        currentAPI.id
      );


  favBtn.textContent =
    favorite
      ? "★ Favorited"
      : "☆ Favorite";

}


function closeAPI() {

  modal.classList.remove(
    "active"
  );


  document.body.style.overflow =
    "";


  currentAPI =
    null;

}


/* =====================================================
   MODAL EVENTS
===================================================== */

closeModal?.addEventListener(
  "click",
  closeAPI
);


modal?.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      modal
    ) {

      closeAPI();

    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeAPI();

    }

  }
);


/* =====================================================
   COPY
===================================================== */

copyBtn?.addEventListener(
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

    }

    catch {

      showToast(
        "Copy failed"
      );

    }

  }
);


/* =====================================================
   FAVORITE FROM MODAL
===================================================== */

favBtn?.addEventListener(
  "click",
  () => {

    if (currentAPI) {

      toggleFavorite(
        currentAPI.id
      );

    }

  }
);


/* =====================================================
   TESTER TOGGLE
===================================================== */

testerBtn?.addEventListener(
  "click",
  () => {

    if (!tester) return;


    tester.style.display =
      tester.style.display ===
      "block"
        ? "none"
        : "block";

  }
);


/* =====================================================
   API TESTER
===================================================== */

sendBtn?.addEventListener(
  "click",
  testAPI
);


testUrl?.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      testAPI();

    }

  }
);


async function testAPI() {

  const url =
    testUrl.value.trim();


  if (!url) {

    responseBox.textContent =
      "Please enter an API URL.";

    return;

  }


  if (
    !/^https?:\/\//i.test(url)
  ) {

    responseBox.textContent =
      "Invalid URL.\n\nUse a complete URL beginning with https:// or http://";

    return;

  }


  /*
    Don't allow local/private targets from the tester.
  */

  try {

    const parsed =
      new URL(url);


    if (
      [
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
      ].includes(
        parsed.hostname
      )
    ) {

      responseBox.textContent =
        "Localhost/private addresses cannot be tested from this public website.";

      return;

    }

  }

  catch {

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


  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => controller.abort(),
      10000
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


    clearTimeout(
      timeout
    );


    const contentType =
      response.headers.get(
        "content-type"
      ) || "";


    let body;


    if (
      contentType.includes(
        "application/json"
      )
    ) {

      const json =
        await response.json();


      body =
        JSON.stringify(
          json,
          null,
          2
        );

    } else {

      body =
        await response.text();

    }


    /*
      Prevent extremely large responses
      from freezing the page.
    */

    if (
      body.length > 50000
    ) {

      body =
        body.slice(
          0,
          50000
        ) +
        "\n\n[Response truncated]";

    }


    responseBox.textContent =
      `HTTP ${response.status} ${response.statusText}

Content-Type: ${contentType || "unknown"}

${body}`;


    if (
      response.ok
    ) {

      showToast(
        "API request successful"
      );

    } else {

      showToast(
        `HTTP ${response.status}`
      );

    }

  }

  catch (error) {

    clearTimeout(
      timeout
    );


    if (
      error.name ===
      "AbortError"
    ) {

      responseBox.textContent =

`REQUEST TIMEOUT

The API did not respond within 10 seconds.

Possible reasons:
• Server is slow/offline
• Network restriction
• API rate limit`;

    }

    else {

      responseBox.textContent =

`BROWSER REQUEST FAILED

${error.message}

This usually means the API does not allow
cross-origin browser requests (CORS).

Other possible reasons:
• Authentication is required
• Special headers are required
• API is offline
• Rate limit
• Network/security policy

Try the "Open API ↗" button to check the endpoint directly.`;

    }

  }

  finally {

    sendBtn.disabled =
      false;

    sendBtn.textContent =
      "Send";

  }

}


/* =====================================================
   SEARCH
===================================================== */

searchInput?.addEventListener(
  "input",
  () => {

    currentPage = 1;

    applyFilters();

  }
);


/* =====================================================
   SIDEBAR VIEWS
===================================================== */

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

        else if (
          currentView ===
          "favorites"
        ) {

          sectionTitle.textContent =
            "Favorites";

        }

        else if (
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


        if (
          window.innerWidth <=
          760
        ) {

          sidebar.classList.remove(
            "mobileOpen"
          );

        }

      }
    );

  });


/* =====================================================
   FILTER BUTTONS
===================================================== */

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


        currentPage =
          1;


        applyFilters();

      }
    );

  });


/* =====================================================
   EXPLORE
===================================================== */

exploreBtn?.addEventListener(
  "click",
  () => {

    scrollToDirectory();

  }
);


/* =====================================================
   MOBILE MENU
===================================================== */

menuBtn?.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "mobileOpen"
    );

  }
);


/* =====================================================
   DEVELOPER PROFILE
===================================================== */

$("developerProfile")
  ?.addEventListener(
    "click",
    () => {

      window.location.href =
        "developer.html";

    }
  );


/* =====================================================
   THEME
===================================================== */

const savedTheme =
  localStorage.getItem(
    "elicenTheme"
  );


if (
  savedTheme ===
  "light"
) {

  document.body.classList.add(
    "lightMode"
  );

}


themeBtn?.addEventListener(
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


/* =====================================================
   MUSIC
===================================================== */

if (music) {

  music.volume =
    0.45;

}


async function playMusic() {

  if (!music) return;


  try {

    await music.play();

    musicBtn?.classList.add(
      "playing"
    );

  }

  catch {

    /*
      Modern browsers block autoplay
      when sound is not muted.

      The first user interaction below
      starts the music.
    */

  }

}


musicBtn?.addEventListener(
  "click",
  async () => {

    if (
      music.paused
    ) {

      await playMusic();

    }

    else {

      music.pause();

      musicBtn.classList.remove(
        "playing"
      );

    }

  }
);


/*
  Attempt autoplay.
*/

window.addEventListener(
  "load",
  () => {

    setTimeout(
      playMusic,
      500
    );

  }
);


/*
  Browser-autoplay fallback.
*/

[
  "click",
  "touchstart",
  "keydown"
].forEach(
  eventName => {

    document.addEventListener(
      eventName,
      () => {

        if (
          music &&
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


/* =====================================================
   SCROLL
===================================================== */

function scrollToDirectory() {

  $("directory")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}


/* =====================================================
   START
===================================================== */

updateSideCounts();

loadAPIs();