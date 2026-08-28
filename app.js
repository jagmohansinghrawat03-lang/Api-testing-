"use strict";

/* =========================================================
   ELICEN API VAULT
   Stable API Directory
========================================================= */

const PER_PAGE = 24;

/*
  Primary source.
  If GitHub source fails, fallback APIs are used.
*/
const API_SOURCE =
  "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md";

const FALLBACK_APIS = [

  {
    name: "JSONPlaceholder",
    description: "Free fake REST API for testing and prototyping.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://jsonplaceholder.typicode.com/posts"
  },

  {
    name: "REST Countries",
    description: "Get information about countries around the world.",
    category: "Geocoding",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://restcountries.com/v3.1/all"
  },

  {
    name: "Open-Meteo",
    description: "Free weather API with no API key required.",
    category: "Weather",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m"
  },

  {
    name: "Open Library",
    description: "Open library catalogue and book information API.",
    category: "Books",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://openlibrary.org/search.json?q=javascript"
  },

  {
    name: "CoinGecko",
    description: "Cryptocurrency market data and information API.",
    category: "Cryptocurrency",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.coingecko.com/api/v3/ping"
  },

  {
    name: "Dog API",
    description: "Random dog images and breed information.",
    category: "Animals",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://dog.ceo/api/breeds/image/random"
  },

  {
    name: "Cat Facts",
    description: "Random facts about cats.",
    category: "Animals",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://catfact.ninja/fact"
  },

  {
    name: "PokeAPI",
    description: "Comprehensive Pokémon data API.",
    category: "Games",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://pokeapi.co/api/v2/pokemon/pikachu"
  },

  {
    name: "Advice Slip",
    description: "Random advice generator API.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.adviceslip.com/advice"
  },

  {
    name: "Bored API",
    description: "Random activities to do when bored.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://www.boredapi.com/api/activity"
  },

  {
    name: "Numbers API",
    description: "Interesting facts about numbers and dates.",
    category: "Science",
    auth: "No",
    https: "Yes",
    cors: "No",
    url: "http://numbersapi.com/42"
  },

  {
    name: "Agify",
    description: "Predict age based on a person's first name.",
    category: "Data",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.agify.io?name=michael"
  },

  {
    name: "Genderize",
    description: "Predict gender based on first name.",
    category: "Data",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.genderize.io?name=lucy"
  },

  {
    name: "Nationalize",
    description: "Predict nationality based on first name.",
    category: "Data",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.nationalize.io?name=nathan"
  },

  {
    name: "Universities",
    description: "Search universities around the world.",
    category: "Education",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://universities.hipolabs.com/search?country=India"
  },

  {
    name: "IPify",
    description: "Simple public IP address API.",
    category: "Tools",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.ipify.org?format=json"
  },

  {
    name: "Random User",
    description: "Generate random user profiles for testing.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://randomuser.me/api/"
  },

  {
    name: "ReqRes",
    description: "Hosted REST API for frontend development and testing.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://reqres.in/api/users"
  },

  {
    name: "DummyJSON",
    description: "Fake REST API with products, users, carts and more.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://dummyjson.com/products"
  },

  {
    name: "Frankfurter",
    description: "Free foreign exchange rates API.",
    category: "Finance",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.frankfurter.app/latest"
  },

  {
    name: "ExchangeRate Host",
    description: "Currency exchange rate API.",
    category: "Finance",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.exchangerate.host/latest"
  },

  {
    name: "WorldTimeAPI",
    description: "Get current time information for time zones.",
    category: "Time",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://worldtimeapi.org/api/timezone/Asia/Kolkata"
  },

  {
    name: "HTTPBin",
    description: "HTTP request and response testing service.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://httpbin.org/get"
  },

  {
    name: "GitHub API",
    description: "Access public GitHub repositories and developer data.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.github.com/repos/public-apis/public-apis"
  },

  {
    name: "Wikipedia",
    description: "Access Wikipedia content and search information.",
    category: "Knowledge",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=API&origin=*"
  },

  {
    name: "Quotable",
    description: "Random quotes and quote search API.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.quotable.io/random"
  },

  {
    name: "JokeAPI",
    description: "Programming and general jokes API.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://v2.jokeapi.dev/joke/Any"
  },

  {
    name: "Trivia API",
    description: "Random trivia questions.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://opentdb.com/api.php?amount=1"
  },

  {
    name: "MealDB",
    description: "Free meal and recipe database API.",
    category: "Food",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://www.themealdb.com/api/json/v1/1/random.php"
  },

  {
    name: "Open Brewery DB",
    description: "Search breweries and brewery information.",
    category: "Food",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.openbrewerydb.org/v1/breweries"
  },

  {
    name: "NASA APOD",
    description: "NASA Astronomy Picture of the Day API.",
    category: "Science",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
  },

  {
    name: "USGS Earthquake",
    description: "Recent earthquake information from USGS.",
    category: "Science",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  },

  {
    name: "Restful Booker",
    description: "Hotel booking REST API for testing.",
    category: "Travel",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://restful-booker.herokuapp.com/booking"
  },

  {
    name: "Transport API",
    description: "Public transport data and journey information.",
    category: "Transportation",
    auth: "No",
    https: "Yes",
    cors: "Unknown",
    url: "https://api.transport.rest/"
  },

  {
    name: "Postman Echo",
    description: "Service for testing HTTP requests.",
    category: "Development",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://postman-echo.com/get"
  },

  {
    name: "API Ninjas",
    description: "Collection of APIs for facts, animals and utilities.",
    category: "Utilities",
    auth: "apiKey",
    https: "Yes",
    cors: "Yes",
    url: "https://api.api-ninjas.com/v1/facts"
  },

  {
    name: "Open Trivia DB",
    description: "Free trivia question database.",
    category: "Games",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://opentdb.com/api.php?amount=5"
  },

  {
    name: "Rick and Morty API",
    description: "Rick and Morty characters, locations and episodes.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://rickandmortyapi.com/api/character"
  },

  {
    name: "Star Wars API",
    description: "Star Wars people, planets, films and more.",
    category: "Entertainment",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://swapi.py4e.com/api/people/1/"
  },

  {
    name: "PokéAPI",
    description: "Pokémon species, abilities, moves and game data.",
    category: "Games",
    auth: "No",
    https: "Yes",
    cors: "Yes",
    url: "https://pokeapi.co/api/v2/pokemon/ditto"
  }

];


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

const $ = id =>
  document.getElementById(id);


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
const methodSelect = $("methodSelect");

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

function getArray(key) {

  try {

    const value =
      JSON.parse(
        localStorage.getItem(key)
      );

    return Array.isArray(value)
      ? value
      : [];

  } catch {

    return [];

  }

}


function setArray(key, value) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


function getFavorites() {

  return getArray(
    "elicenFavorites"
  );

}


function getRecent() {

  return getArray(
    "elicenRecent"
  );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(
      () => toast.classList.remove("show"),
      2200
    );

}


/* =========================================================
   ESCAPE
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
   MARKDOWN HELPERS
========================================================= */

function cleanMarkdown(text) {

  return String(text || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .trim();

}


function extractURL(cell) {

  const markdown =
    cell.match(
      /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/i
    );

  if (markdown) {
    return markdown[1];
  }

  const direct =
    cell.match(
      /https?:\/\/[^\s|)]+/i
    );

  return direct
    ? direct[0]
    : "#";

}


function extractName(cell) {

  const markdown =
    cell.match(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/i
    );

  if (markdown) {
    return cleanMarkdown(
      markdown[1]
    );
  }

  return cleanMarkdown(cell);

}


function normalizeAuth(value) {

  const clean =
    cleanMarkdown(value);

  if (
    !clean ||
    clean.toLowerCase() === "no" ||
    clean.toLowerCase() === "none" ||
    clean.toLowerCase() === "null"
  ) {
    return "No";
  }

  return clean;

}


function normalizeYesNo(value) {

  const clean =
    cleanMarkdown(value)
      .toLowerCase();

  if (clean === "yes") {
    return "Yes";
  }

  if (clean === "no") {
    return "No";
  }

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

  for (const rawLine of lines) {

    const line =
      rawLine.trim();


    /*
      New and old public-apis headings.
    */

    const heading =
      line.match(
        /^#{2,4}\s+(.+?)\s*$/
      );

    if (heading) {

      const headingText =
        cleanMarkdown(
          heading[1]
        );

      if (
        !/public api|api list|table of contents|contents|api/i.test(
          headingText
        ) ||
        headingText.length < 40
      ) {

        category =
          headingText
            .replace(/^#+\s*/, "")
            .trim();

      }

      continue;

    }


    if (!line.startsWith("|")) {
      continue;
    }


    if (
      line.includes("---") ||
      line.toLowerCase().includes(
        "| api |"
      ) ||
      line.toLowerCase().includes(
        "| api|"
      )
    ) {
      continue;
    }


    const cells =
      line
        .split("|")
        .map(
          item => item.trim()
        );


    if (cells.length < 5) {
      continue;
    }


    const nameCell =
      cells[1];

    const descriptionCell =
      cells[2];

    const authCell =
      cells[3];

    const httpsCell =
      cells[4];

    const corsCell =
      cells[5] || "";


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
      cleanMarkdown(
        descriptionCell
      );


    if (
      !name ||
      !description ||
      url === "#"
    ) {
      continue;
    }


    if (
      name.toLowerCase() === "api"
    ) {
      continue;
    }


    results.push({

      name,

      description,

      category:
        category || "Other",

      auth:
        normalizeAuth(
          authCell
        ),

      https:
        normalizeYesNo(
          httpsCell
        ),

      cors:
        normalizeYesNo(
          corsCell
        ),

      url

    });

  }


  return results;

}


/* =========================================================
   PREPARE API
========================================================= */

function prepareAPIs(list) {

  const map = new Map();


  list.forEach(api => {

    if (
      !api ||
      !api.name ||
      !api.url
    ) {
      return;
    }


    const key =
      (
        api.name +
        "|" +
        api.url
      )
      .toLowerCase();


    if (!map.has(key)) {

      map.set(
        key,
        {
          ...api,

          id:
            makeId(
              api.name,
              api.url
            )
        }
      );

    }

  });


  return Array.from(
    map.values()
  );

}


function makeId(name, url) {

  return (
    name +
    "|" +
    url
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .slice(0, 180);

}


/* =========================================================
   LOAD API DATA
========================================================= */

async function loadAPIs() {

  if (loading) {

    loading.style.display =
      "flex";

  }


  let loadedFromRemote =
    false;


  try {

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        9000
      );


    const response =
      await fetch(
        API_SOURCE,
        {
          method: "GET",
          cache: "no-store",
          signal: controller.signal
        }
      );


    clearTimeout(timeout);


    if (!response.ok) {
      throw new Error(
        "Remote source returned " +
        response.status
      );
    }


    const markdown =
      await response.text();


    const parsed =
      parseREADME(markdown);


    if (parsed.length > 20) {

      APIs =
        prepareAPIs(
          parsed
        );

      loadedFromRemote =
        true;

    }

  }

  catch (error) {

    console.warn(
      "Remote API source unavailable:",
      error
    );

  }


  /*
    Always guarantee working content.
    Remote data + fallback data.
  */

  APIs =
    prepareAPIs([
      ...APIs,
      ...FALLBACK_APIS
    ]);


  updateStats();

  buildCategories();

  if (loading) {

    loading.style.display =
      "none";

  }


  applyFilters();


  if (loadedFromRemote) {

    showToast(
      `${APIs.length} APIs loaded`
    );

  } else {

    showToast(
      `${APIs.length} APIs available`
    );

  }

}


/* =========================================================
   STATS
========================================================= */

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


  if (totalApis) {

    totalApis.textContent =
      APIs.length.toLocaleString();

  }


  if (totalCategories) {

    totalCategories.textContent =
      categorySet.size;

  }


  if (httpsApis) {

    httpsApis.textContent =
      https.toLocaleString();

  }


  if (noAuthApis) {

    noAuthApis.textContent =
      noAuth.toLocaleString();

  }


  if (allCount) {

    allCount.textContent =
      APIs.length;

  }


  updateSideCounts();

}


/* =========================================================
   CATEGORIES
========================================================= */

function buildCategories() {

  if (!categoriesBox) {
    return;
  }


  const counts = {};


  APIs.forEach(api => {

    const category =
      api.category ||
      "Other";


    counts[category] =
      (counts[category] || 0) + 1;

  });


  const categories =
    Object.keys(counts)
      .sort(
        (a,b) =>
          a.localeCompare(b)
      );


  categoriesBox.innerHTML =
    "";


  categories.forEach(
    category => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "side-btn category-btn";


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

          document
            .querySelectorAll(
              ".side-btn"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          currentView =
            "category";

          currentCategory =
            category;

          currentPage =
            1;


          if (sectionTitle) {

            sectionTitle.textContent =
              category;

          }


          applyFilters();

          closeSidebarMobile();

          scrollToDirectory();

        }
      );


      categoriesBox.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   SIDE COUNTS
========================================================= */

function updateSideCounts() {

  if (favCount) {

    favCount.textContent =
      getFavorites().length;

  }


  if (recentCount) {

    recentCount.textContent =
      getRecent().length;

  }

}


/* =========================================================
   FILTERING
========================================================= */

function applyFilters() {

  const query =
    (
      searchInput?.value ||
      ""
    )
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
          api.cors
        ]
          .join(" ")
          .toLowerCase();


      if (
        query &&
        !searchable.includes(
          query
        )
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
   RENDER
========================================================= */

function renderPage() {

  if (!apiGrid) {
    return;
  }


  apiGrid.innerHTML =
    "";


  const start =
    (currentPage - 1) *
    PER_PAGE;


  const pageItems =
    filteredAPIs.slice(
      start,
      start + PER_PAGE
    );


  if (resultText) {

    resultText.textContent =
      `${filteredAPIs.length.toLocaleString()} APIs found`;

  }


  if (!pageItems.length) {

    apiGrid.innerHTML = `
      <div class="empty-state">
        <h3>No APIs found</h3>
        <p>
          Try a different search, category or filter.
        </p>
      </div>
    `;


    renderPagination();

    return;

  }


  const favorites =
    getFavorites();


  pageItems.forEach(
    (api,index) => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "api-card";


      card.style.animationDelay =
        `${index * 30}ms`;


      const liked =
        favorites.includes(
          api.id
        );


      const initial =
        api.name
          .trim()
          .charAt(0)
          .toUpperCase();


      card.innerHTML = `

        <div class="card-top">

          <div class="api-icon">
            ${escapeHTML(initial)}
          </div>

          <button
            class="heart-btn ${liked ? "liked" : ""}"
            data-id="${escapeHTML(api.id)}"
            type="button"
            title="Favorite"
          >
            ${liked ? "★" : "☆"}
          </button>

        </div>


        <div class="api-category">
          ${escapeHTML(api.category)}
        </div>


        <h3>
          ${escapeHTML(api.name)}
        </h3>


        <p>
          ${escapeHTML(api.description)}
        </p>


        <div class="api-meta">

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


        <div class="card-buttons">

          <button
            class="details-button"
            data-id="${escapeHTML(api.id)}"
            type="button"
          >
            View Details
          </button>

          <a
            class="visit-button"
            href="${escapeHTML(api.url)}"
            target="_blank"
            rel="noopener noreferrer"
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


  bindCardEvents();

  renderPagination();

}


/* =========================================================
   CARD EVENTS
========================================================= */

function bindCardEvents() {

  document
    .querySelectorAll(
      ".heart-btn"
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
      ".details-button"
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

}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

  if (!pagination) {
    return;
  }


  const pages =
    Math.ceil(
      filteredAPIs.length /
      PER_PAGE
    );


  pagination.innerHTML =
    "";


  if (pages <= 1) {
    return;
  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "pagination-inner";


  const prev =
    document.createElement(
      "button"
    );


  prev.textContent =
    "← Prev";


  prev.disabled =
    currentPage === 1;


  prev.addEventListener(
    "click",
    () => {

      if (
        currentPage > 1
      ) {

        currentPage--;

        renderPage();

        scrollToDirectory();

      }

    }
  );


  wrapper.appendChild(
    prev
  );


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
      document.createElement(
        "button"
      );


    button.textContent =
      i;


    if (
      i === currentPage
    ) {

      button.classList.add(
        "active"
      );

    }


    button.addEventListener(
      "click",
      () => {

        currentPage =
          i;

        renderPage();

        scrollToDirectory();

      }
    );


    wrapper.appendChild(
      button
    );

  }


  const next =
    document.createElement(
      "button"
    );


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


  wrapper.appendChild(
    next
  );


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
        item =>
          item !== id
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


  setArray(
    "elicenFavorites",
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


/* =========================================================
   RECENT
========================================================= */

function addRecent(id) {

  let recent =
    getRecent();


  recent =
    recent.filter(
      item =>
        item !== id
    );


  recent.unshift(id);


  recent =
    recent.slice(
      0,
      30
    );


  setArray(
    "elicenRecent",
    recent
  );


  updateSideCounts();

}


/* =========================================================
   MODAL
========================================================= */

function openModal(api) {

  currentAPI =
    api;


  addRecent(
    api.id
  );


  if (modalCategory) {

    modalCategory.textContent =
      api.category;

  }


  if (modalName) {

    modalName.textContent =
      api.name;

  }


  if (modalDescription) {

    modalDescription.textContent =
      api.description;

  }


  if (modalUrl) {

    modalUrl.textContent =
      api.url;

  }


  if (testUrl) {

    testUrl.value =
      api.url;

  }


  if (visitBtn) {

    visitBtn.href =
      api.url;

  }


  if (modalDetails) {

    modalDetails.innerHTML = `

      <div class="detail-item">
        <small>AUTHENTICATION</small>
        <strong>
          ${escapeHTML(api.auth)}
        </strong>
      </div>

      <div class="detail-item">
        <small>HTTPS</small>
        <strong>
          ${escapeHTML(api.https)}
        </strong>
      </div>

      <div class="detail-item">
        <small>CORS</small>
        <strong>
          ${escapeHTML(api.cors)}
        </strong>
      </div>

      <div class="detail-item">
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

  if (
    !favBtn ||
    !currentAPI
  ) {
    return;
  }


  const liked =
    getFavorites()
      .includes(
        currentAPI.id
      );


  favBtn.textContent =
    liked
      ? "★ Favorited"
      : "☆ Favorite";

}


function closeAPI() {

  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );


  document.body.style.overflow =
    "";


  currentAPI =
    null;

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

      if (!currentAPI) {
        return;
      }


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
   TESTER TOGGLE
========================================================= */

if (testerBtn) {

  testerBtn.addEventListener(
    "click",
    () => {

      if (!tester) {
        return;
      }


      const visible =
        getComputedStyle(
          tester
        ).display !== "none";


      tester.style.display =
        visible
          ? "none"
          : "block";

    }
  );

}


/* =========================================================
   API TESTER
========================================================= */

if (sendBtn) {

  sendBtn.addEventListener(
    "click",
    async () => {

      const url =
        testUrl?.value.trim();


      if (!url) {

        responseBox.textContent =
          "Please enter an API URL.";

        return;

      }


      if (
        !/^https?:\/\//i.test(url)
      ) {

        responseBox.textContent =
          "Invalid URL. URL must start with http:// or https://";

        return;

      }


      sendBtn.disabled =
        true;


      sendBtn.textContent =
        "Testing...";


      responseBox.textContent =
        "Sending request...\n\nPlease wait.";


      const controller =
        new AbortController();


      const timeout =
        setTimeout(
          () =>
            controller.abort(),
          12000
        );


      try {

        const method =
          methodSelect?.value ||
          "GET";


        const response =
          await fetch(
            url,
            {
              method,

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


        if (
          body.length > 12000
        ) {

          body =
            body.slice(
              0,
              12000
            ) +
            "\n\n[Response truncated]";

        }


        responseBox.textContent =
          `HTTP ${response.status} ${response.statusText}

${body}`;

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
            "Request timed out after 12 seconds.";

        } else {

          responseBox.textContent =
`REQUEST FAILED

${error.message}

Possible reasons:
• API blocks browser CORS
• API requires authentication
• API is offline
• API requires special headers
• API has rate limits

Try the "Visit API" button to open the endpoint directly.`;

        }

      }

      finally {

        sendBtn.disabled =
          false;

        sendBtn.textContent =
          "Send";

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

      currentPage =
        1;

      applyFilters();

    }
  );

}


/* =========================================================
   CTRL + K
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      (event.ctrlKey ||
       event.metaKey) &&
      event.key.toLowerCase() ===
        "k"
    ) {

      event.preventDefault();

      searchInput?.focus();

    }

  }
);


/* =========================================================
   SIDEBAR VIEWS
========================================================= */

document
  .querySelectorAll(
    ".side-btn[data-view]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".side-btn"
          )
          .forEach(
            item =>
              item.classList.remove(
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
          currentView === "all"
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
            ".category-btn"
          )
          .forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


        applyFilters();

        closeSidebarMobile();

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
          .querySelectorAll(
            ".filter"
          )
          .forEach(
            item =>
              item.classList.remove(
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


/* =========================================================
   EXPLORE
========================================================= */

if (exploreBtn) {

  exploreBtn.addEventListener(
    "click",
    () => {

      scrollToDirectory();

    }
  );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function closeSidebarMobile() {

  sidebar?.classList.remove(
    "mobileOpen"
  );

}


if (menuBtn) {

  menuBtn.addEventListener(
    "click",
    () => {

      sidebar?.classList.toggle(
        "mobileOpen"
      );

    }
  );

}


/* =========================================================
   PROFILE
========================================================= */

const developerProfile =
  document.querySelector(
    ".profile-card"
  );


if (developerProfile) {

  developerProfile.style.cursor =
    "pointer";


  developerProfile.addEventListener(
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


      const mode =
        document.body.classList.contains(
          "lightMode"
        )
          ? "light"
          : "dark";


      localStorage.setItem(
        "elicenTheme",
        mode
      );

    }
  );

}


/* =========================================================
   MUSIC
========================================================= */

if (music) {

  music.volume =
    0.42;

}


let musicStarted =
  false;


async function startMusic() {

  if (
    !music ||
    musicStarted
  ) {
    return;
  }


  try {

    await music.play();

    musicStarted =
      true;


    musicBtn?.classList.add(
      "playing"
    );

  }

  catch {

    /*
      Modern browsers block
      audible autoplay until the
      user interacts with the page.
    */

  }

}


if (musicBtn) {

  musicBtn.addEventListener(
    "click",
    async event => {

      event.stopPropagation();


      if (
        music?.paused
      ) {

        musicStarted =
          false;

        await startMusic();

      } else {

        music?.pause();

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
      startMusic,
      700
    );

  }
);


/*
  First interaction fallback.
*/

document.addEventListener(
  "pointerdown",
  () => {

    if (
      music &&
      music.paused
    ) {

      startMusic();

    }

  },
  {
    once: true
  }
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

updateSideCounts();

loadAPIs();