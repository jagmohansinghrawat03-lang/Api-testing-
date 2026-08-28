"use strict";

/* =========================================================
   ELICEN API VAULT — FINAL
   Local API directory + browser tester
========================================================= */

const PER_PAGE = 18;

let APIs = [];
let filteredAPIs = [];

let currentPage = 1;
let currentView = "all";
let currentCategory = "all";
let currentFilter = "all";
let currentAPI = null;


/* =========================================================
   API DATABASE
   Local data = no external README dependency
========================================================= */

const API_DATA = [

  {
    name:"JokeAPI",
    category:"Entertainment",
    description:"Free REST API for programming jokes and general jokes.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://v2.jokeapi.dev/joke/Any"
  },

  {
    name:"JSONPlaceholder",
    category:"Development",
    description:"Free fake REST API for testing and prototyping.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://jsonplaceholder.typicode.com/posts/1"
  },

  {
    name:"DummyJSON",
    category:"Development",
    description:"Free fake REST API with products, users, posts and more.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://dummyjson.com/products/1"
  },

  {
    name:"REST Countries",
    category:"Geocoding",
    description:"Get country information including names, flags and population.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://restcountries.com/v3.1/name/India"
  },

  {
    name:"Open-Meteo",
    category:"Weather",
    description:"Free weather API providing forecasts without an API key.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.21&current=temperature_2m"
  },

  {
    name:"Open Notify",
    category:"Space",
    description:"Simple APIs for International Space Station data.",
    auth:"No",
    https:"Yes",
    cors:"No",
    url:"https://api.open-notify.org/astros.json"
  },

  {
    name:"Dog CEO",
    category:"Animals",
    description:"Random dog images and breed information.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://dog.ceo/api/breeds/image/random"
  },

  {
    name:"Cat Facts",
    category:"Animals",
    description:"Provides random facts about cats.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://catfact.ninja/fact"
  },

  {
    name:"The Cat API",
    category:"Animals",
    description:"Cat images, breeds and related information.",
    auth:"apiKey",
    https:"Yes",
    cors:"Yes",
    url:"https://api.thecatapi.com/v1/images/search"
  },

  {
    name:"PokéAPI",
    category:"Games",
    description:"Comprehensive Pokémon data API.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://pokeapi.co/api/v2/pokemon/pikachu"
  },

  {
    name:"Rick and Morty API",
    category:"Games",
    description:"Characters, locations and episodes from Rick and Morty.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://rickandmortyapi.com/api/character/1"
  },

  {
    name:"Star Wars API",
    category:"Games",
    description:"Star Wars characters, films, planets and more.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://swapi.dev/api/people/1/"
  },

  {
    name:"CoinGecko",
    category:"Finance",
    description:"Cryptocurrency market and price data.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.coingecko.com/api/v3/ping"
  },

  {
    name:"ExchangeRate API",
    category:"Finance",
    description:"Currency exchange rate information.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://open.er-api.com/v6/latest/USD"
  },

  {
    name:"Frankfurter",
    category:"Finance",
    description:"Free foreign exchange rates from the European Central Bank.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.frankfurter.app/latest?from=USD&to=EUR"
  },

  {
    name:"Random User",
    category:"Development",
    description:"Generate random user profile data.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://randomuser.me/api/"
  },

  {
    name:"ReqRes",
    category:"Development",
    description:"Hosted REST API for testing frontend applications.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://reqres.in/api/users/2"
  },

  {
    name:"GitHub API",
    category:"Development",
    description:"Access public GitHub repositories, users and activity.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.github.com/users/octocat"
  },

  {
    name:"GitLab API",
    category:"Development",
    description:"Programmatic access to GitLab projects and users.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://gitlab.com/api/v4/projects"
  },

  {
    name:"NASA",
    category:"Science",
    description:"NASA open data including astronomy pictures and space information.",
    auth:"apiKey",
    https:"Yes",
    cors:"Yes",
    url:"https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
  },

  {
    name:"Open Library",
    category:"Books",
    description:"Open library data for books, authors and editions.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://openlibrary.org/search.json?q=harry+potter"
  },

  {
    name:"Google Books",
    category:"Books",
    description:"Search books and retrieve public book metadata.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://www.googleapis.com/books/v1/volumes?q=javascript"
  },

  {
    name:"Open Trivia DB",
    category:"Games",
    description:"Free trivia questions in multiple categories.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://opentdb.com/api.php?amount=1"
  },

  {
    name:"Advice Slip",
    category:"Entertainment",
    description:"Random advice and advice search API.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.adviceslip.com/advice"
  },

  {
    name:"Affirmations",
    category:"Entertainment",
    description:"Simple API serving positive affirmations.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://www.affirmations.dev/"
  },

  {
    name:"Bored API",
    category:"Entertainment",
    description:"Find activities to do when bored.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://www.boredapi.com/api/activity"
  },

  {
    name:"Agify",
    category:"Data",
    description:"Predict age based on a given name.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.agify.io?name=akhil"
  },

  {
    name:"Genderize",
    category:"Data",
    description:"Predict gender from a first name.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.genderize.io?name=akhil"
  },

  {
    name:"Nationalize",
    category:"Data",
    description:"Predict nationality probabilities from a name.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.nationalize.io?name=akhil"
  },

  {
    name:"IPify",
    category:"Networking",
    description:"Simple service for retrieving the public IP address.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api64.ipify.org?format=json"
  },

  {
    name:"HTTPBin",
    category:"Development",
    description:"HTTP request and response testing service.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://httpbin.org/get"
  },

  {
    name:"QR Code API",
    category:"Tools",
    description:"Generate QR code images from text or URLs.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Elicen"
  },

  {
    name:"Lorem Picsum",
    category:"Images",
    description:"Simple image placeholder service.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://picsum.photos/200"
  },

  {
    name:"Random Image",
    category:"Images",
    description:"Random image generation service.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://source.unsplash.com/featured/400x300/?nature"
  },

  {
    name:"MediaWiki",
    category:"Knowledge",
    description:"API for accessing Wikipedia and other MediaWiki projects.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=India"
  },

  {
    name:"Dictionary API",
    category:"Words",
    description:"Free English dictionary definitions and phonetics.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.dictionaryapi.dev/api/v2/entries/en/hello"
  },

  {
    name:"Datamuse",
    category:"Words",
    description:"Word-finding engine for synonyms, rhymes and related words.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.datamuse.com/words?rel_jja=yellow"
  },

  {
    name:"Numbers API",
    category:"Data",
    description:"Interesting facts about numbers and dates.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"http://numbersapi.com/42?json"
  },

  {
    name:"TimeAPI",
    category:"Date & Time",
    description:"Retrieve time information for locations.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata"
  },

  {
    name:"World Time API",
    category:"Date & Time",
    description:"Current time information for time zones.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://worldtimeapi.org/api/timezone/Asia/Kolkata"
  },

  {
    name:"Public APIs",
    category:"Development",
    description:"Directory of public APIs for developers.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.publicapis.org/entries"
  },

  {
    name:"Open Brewery DB",
    category:"Food",
    description:"Public brewery information database.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.openbrewerydb.org/v1/breweries"
  },

  {
    name:"TheMealDB",
    category:"Food",
    description:"Meal recipes, categories and ingredients.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://www.themealdb.com/api/json/v1/1/search.php?s=pizza"
  },

  {
    name:"TheCocktailDB",
    category:"Food",
    description:"Cocktail recipes, ingredients and categories.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita"
  },

  {
    name:"Open Food Facts",
    category:"Food",
    description:"Open database of food products and nutrition information.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://world.openfoodfacts.org/api/v2/product/737628064502.json"
  },

  {
    name:"FreeToGame",
    category:"Games",
    description:"Free-to-play game database and information.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://www.freetogame.com/api/games"
  },

  {
    name:"RAWG",
    category:"Games",
    description:"Video game discovery and metadata API.",
    auth:"apiKey",
    https:"Yes",
    cors:"Yes",
    url:"https://api.rawg.io/api/games"
  },

  {
    name:"Open Brewery",
    category:"Data",
    description:"Search breweries and brewery locations.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.openbrewerydb.org/v1/breweries?per_page=5"
  },

  {
    name:"Coindesk",
    category:"Finance",
    description:"Bitcoin price index data.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://api.coindesk.com/v1/bpi/currentprice.json"
  },

  {
    name:"Placehold",
    category:"Images",
    description:"Simple placeholder images for development.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://placehold.co/600x400"
  },

  {
    name:"Manifest API",
    category:"Development",
    description:"Useful public endpoint for testing JSON requests.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://jsonplaceholder.typicode.com/users"
  },

  {
    name:"Universities",
    category:"Education",
    description:"Search universities around the world.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"http://universities.hipolabs.com/search?country=India"
  },

  {
    name:"REST Countries Search",
    category:"Education",
    description:"Country facts and geographic information.",
    auth:"No",
    https:"Yes",
    cors:"Yes",
    url:"https://restcountries.com/v3.1/all?fields=name,capital,population"
  }

];


/* =========================================================
   HELPERS
========================================================= */

function makeId(api){
  return (
    api.name +
    "|" +
    api.url
  ).toLowerCase();
}

function escapeHTML(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function getFavorites(){
  try{
    return JSON.parse(
      localStorage.getItem("elicenFavorites")
    ) || [];
  }catch{
    return [];
  }
}

function saveFavorites(list){
  localStorage.setItem(
    "elicenFavorites",
    JSON.stringify(list)
  );
}

function getRecent(){
  try{
    return JSON.parse(
      localStorage.getItem("elicenRecent")
    ) || [];
  }catch{
    return [];
  }
}

function saveRecent(list){
  localStorage.setItem(
    "elicenRecent",
    JSON.stringify(list)
  );
}

function showToast(message){

  const toast =
    document.getElementById("toast");

  if(!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer =
    setTimeout(()=>{
      toast.classList.remove("show");
    },2200);
}


/* =========================================================
   ELEMENTS
========================================================= */

const searchInput =
  document.getElementById("searchInput");

const apiGrid =
  document.getElementById("apiGrid");

const categoriesBox =
  document.getElementById("categories");

const pagination =
  document.getElementById("pagination");

const loading =
  document.getElementById("loading");

const totalApis =
  document.getElementById("totalApis");

const totalCategories =
  document.getElementById("totalCategories");

const httpsApis =
  document.getElementById("httpsApis");

const noAuthApis =
  document.getElementById("noAuthApis");

const allCount =
  document.getElementById("allCount");

const favCount =
  document.getElementById("favCount");

const recentCount =
  document.getElementById("recentCount");

const sectionTitle =
  document.getElementById("sectionTitle");

const resultText =
  document.getElementById("resultText");

const modal =
  document.getElementById("modal");

const closeModal =
  document.getElementById("closeModal");

const modalIcon =
  document.getElementById("modalIcon");

const modalCategory =
  document.getElementById("modalCategory");

const modalName =
  document.getElementById("modalName");

const modalDescription =
  document.getElementById("modalDescription");

const modalDetails =
  document.getElementById("modalDetails");

const modalUrl =
  document.getElementById("modalUrl");

const copyBtn =
  document.getElementById("copyBtn");

const visitBtn =
  document.getElementById("visitBtn");

const favBtn =
  document.getElementById("favBtn");

const testerBtn =
  document.getElementById("testerBtn");

const tester =
  document.getElementById("tester");

const testUrl =
  document.getElementById("testUrl");

const methodSelect =
  document.getElementById("methodSelect");

const sendBtn =
  document.getElementById("sendBtn");

const responseBox =
  document.getElementById("responseBox");

const clearResponse =
  document.getElementById("clearResponse");

const testerHint =
  document.getElementById("testerHint");

const themeBtn =
  document.getElementById("themeBtn");

const musicBtn =
  document.getElementById("musicBtn");

const music =
  document.getElementById("music");

const menuBtn =
  document.getElementById("menuBtn");

const sidebar =
  document.getElementById("sidebar");

const exploreBtn =
  document.getElementById("exploreBtn");


/* =========================================================
   PREPARE DATABASE
========================================================= */

APIs =
  API_DATA.map(api => ({
    ...api,
    id:makeId(api)
  }));


/* =========================================================
   STATS
========================================================= */

function updateStats(){

  const categories =
    new Set(
      APIs.map(api=>api.category)
    );

  if(totalApis)
    totalApis.textContent =
      APIs.length;

  if(totalCategories)
    totalCategories.textContent =
      categories.size;

  if(httpsApis)
    httpsApis.textContent =
      APIs.filter(api=>api.https==="Yes").length;

  if(noAuthApis)
    noAuthApis.textContent =
      APIs.filter(api=>api.auth==="No").length;

  updateCounts();
}


function updateCounts(){

  if(allCount)
    allCount.textContent =
      APIs.length;

  if(favCount)
    favCount.textContent =
      getFavorites().length;

  if(recentCount)
    recentCount.textContent =
      getRecent().length;
}


/* =========================================================
   CATEGORIES
========================================================= */

function buildCategories(){

  if(!categoriesBox) return;

  const counts = {};

  APIs.forEach(api=>{
    counts[api.category] =
      (counts[api.category] || 0) + 1;
  });

  categoriesBox.innerHTML = "";

  Object.keys(counts)
    .sort((a,b)=>a.localeCompare(b))
    .forEach(category=>{

      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "sideBtn categoryBtn";

      button.dataset.category =
        category;

      button.innerHTML = `
        <span>
          <i>◈</i>
          ${escapeHTML(category)}
        </span>
        <b>${counts[category]}</b>
      `;

      button.addEventListener(
        "click",
        ()=>{

          currentCategory =
            category;

          currentView =
            "category";

          currentPage = 1;

          document
            .querySelectorAll(".sideBtn")
            .forEach(btn=>
              btn.classList.remove("active")
            );

          button.classList.add("active");

          if(sectionTitle)
            sectionTitle.textContent =
              category;

          applyFilters();
          closeMobileMenu();
          scrollToDirectory();
        }
      );

      categoriesBox.appendChild(button);

    });
}


/* =========================================================
   FILTERING
========================================================= */

function applyFilters(){

  const query =
    (searchInput?.value || "")
      .trim()
      .toLowerCase();

  const favorites =
    getFavorites();

  const recent =
    getRecent();

  filteredAPIs =
    APIs.filter(api=>{

      if(query){

        const searchable =
          [
            api.name,
            api.category,
            api.description,
            api.auth,
            api.https,
            api.cors,
            api.url
          ]
          .join(" ")
          .toLowerCase();

        if(!searchable.includes(query))
          return false;
      }


      if(currentView==="favorites"){

        if(!favorites.includes(api.id))
          return false;
      }


      if(currentView==="recent"){

        if(!recent.includes(api.id))
          return false;
      }


      if(
        currentCategory!=="all" &&
        api.category!==currentCategory
      ){
        return false;
      }


      if(
        currentFilter==="noauth" &&
        api.auth!=="No"
      ){
        return false;
      }


      if(
        currentFilter==="https" &&
        api.https!=="Yes"
      ){
        return false;
      }


      if(
        currentFilter==="cors" &&
        api.cors!=="Yes"
      ){
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

function renderPage(){

  if(!apiGrid) return;

  apiGrid.innerHTML = "";

  const start =
    (currentPage - 1) *
    PER_PAGE;

  const items =
    filteredAPIs.slice(
      start,
      start + PER_PAGE
    );

  if(resultText){

    resultText.textContent =
      `${filteredAPIs.length.toLocaleString()} APIs found`;

  }


  if(!items.length){

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


  items.forEach((api,index)=>{

    const card =
      document.createElement("article");

    card.className =
      "apiCard";

    card.style.animationDelay =
      `${index * 30}ms`;

    const liked =
      favorites.includes(api.id);

    card.innerHTML = `

      <div class="cardTop">

        <div class="apiIcon">
          ${escapeHTML(
            api.name.charAt(0).toUpperCase()
          )}
        </div>

        <button
          class="heartBtn ${liked ? "liked" : ""}"
          data-id="${escapeHTML(api.id)}"
          type="button"
          title="Favorite"
        >
          ${liked ? "★" : "☆"}
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
          type="button"
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
  });


  document
    .querySelectorAll(".heartBtn")
    .forEach(btn=>{

      btn.addEventListener(
        "click",
        event=>{

          event.stopPropagation();

          toggleFavorite(
            btn.dataset.id
          );
        }
      );

    });


  document
    .querySelectorAll(".detailsButton")
    .forEach(btn=>{

      btn.addEventListener(
        "click",
        ()=>{

          const api =
            APIs.find(
              item =>
                item.id ===
                btn.dataset.id
            );

          if(api)
            openModal(api);

        }
      );

    });


  renderPagination();
}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination(){

  if(!pagination) return;

  pagination.innerHTML = "";

  const pages =
    Math.ceil(
      filteredAPIs.length /
      PER_PAGE
    );

  if(pages<=1)
    return;

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "paginationInner";


  const prev =
    document.createElement("button");

  prev.textContent =
    "← Prev";

  prev.disabled =
    currentPage===1;

  prev.addEventListener(
    "click",
    ()=>{
      if(currentPage>1){

        currentPage--;

        renderPage();
        scrollToDirectory();
      }
    }
  );

  wrapper.appendChild(prev);


  let start =
    Math.max(
      1,
      currentPage-3
    );

  let end =
    Math.min(
      pages,
      start+6
    );

  if(end-start<6)
    start =
      Math.max(
        1,
        end-6
      );


  for(
    let page=start;
    page<=end;
    page++
  ){

    const button =
      document.createElement("button");

    button.textContent =
      page;

    if(page===currentPage)
      button.classList.add("active");

    button.addEventListener(
      "click",
      ()=>{
        currentPage=page;
        renderPage();
        scrollToDirectory();
      }
    );

    wrapper.appendChild(button);
  }


  const next =
    document.createElement("button");

  next.textContent =
    "Next →";

  next.disabled =
    currentPage===pages;

  next.addEventListener(
    "click",
    ()=>{
      if(currentPage<pages){

        currentPage++;

        renderPage();
        scrollToDirectory();
      }
    }
  );

  wrapper.appendChild(next);

  pagination.appendChild(wrapper);
}


/* =========================================================
   FAVORITES
========================================================= */

function toggleFavorite(id){

  let favorites =
    getFavorites();

  if(favorites.includes(id)){

    favorites =
      favorites.filter(
        item=>item!==id
      );

    showToast(
      "Removed from favorites"
    );

  }else{

    favorites.push(id);

    showToast(
      "Added to favorites"
    );
  }

  saveFavorites(favorites);

  updateCounts();

  applyFilters();

  if(
    currentAPI &&
    currentAPI.id===id
  ){
    updateModalFavorite();
  }
}


/* =========================================================
   RECENT
========================================================= */

function addRecent(id){

  let recent =
    getRecent();

  recent =
    recent.filter(
      item=>item!==id
    );

  recent.unshift(id);

  saveRecent(
    recent.slice(0,30)
  );

  updateCounts();
}


/* =========================================================
   MODAL
========================================================= */

function openModal(api){

  currentAPI = api;

  addRecent(api.id);

  if(modalIcon)
    modalIcon.textContent =
      api.name.charAt(0).toUpperCase();

  if(modalCategory)
    modalCategory.textContent =
      api.category;

  if(modalName)
    modalName.textContent =
      api.name;

  if(modalDescription)
    modalDescription.textContent =
      api.description;

  if(modalUrl)
    modalUrl.textContent =
      api.url;

  if(testUrl)
    testUrl.value =
      api.url;

  if(visitBtn)
    visitBtn.href =
      api.url;


  if(modalDetails){

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


  if(tester)
    tester.style.display =
      "none";

  if(responseBox)
    responseBox.textContent =
      "Ready.";

  if(testerHint)
    testerHint.textContent =
      "⚡ Browser testing depends on the API's CORS policy.";


  if(modal){

    modal.classList.add("active");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";
  }
}


function updateModalFavorite(){

  if(!favBtn || !currentAPI)
    return;

  const favorites =
    getFavorites();

  favBtn.textContent =
    favorites.includes(currentAPI.id)
      ? "★ Favorited"
      : "☆ Favorite";
}


function closeAPI(){

  if(!modal) return;

  modal.classList.remove("active");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

  currentAPI = null;
}


closeModal?.addEventListener(
  "click",
  closeAPI
);

modal?.addEventListener(
  "click",
  event=>{
    if(event.target===modal)
      closeAPI();
  }
);

document.addEventListener(
  "keydown",
  event=>{
    if(event.key==="Escape")
      closeAPI();
  }
);


/* =========================================================
   COPY
========================================================= */

copyBtn?.addEventListener(
  "click",
  async ()=>{

    if(!currentAPI)
      return;

    try{

      await navigator.clipboard.writeText(
        currentAPI.url
      );

      showToast(
        "API URL copied"
      );

    }catch{

      showToast(
        "Copy failed"
      );
    }
  }
);


/* =========================================================
   FAVORITE FROM MODAL
========================================================= */

favBtn?.addEventListener(
  "click",
  ()=>{
    if(currentAPI)
      toggleFavorite(
        currentAPI.id
      );
  }
);


/* =========================================================
   TESTER OPEN/CLOSE
========================================================= */

testerBtn?.addEventListener(
  "click",
  ()=>{

    if(!tester)
      return;

    const visible =
      getComputedStyle(tester).display !== "none";

    tester.style.display =
      visible ? "none" : "block";

    if(!visible){

      setTimeout(()=>{
        testUrl?.focus();
      },100);

    }
  }
);


/* =========================================================
   IMPROVED API TESTER
========================================================= */

function isProbablyDocumentationURL(url){

  const lower =
    url.toLowerCase();

  const documentationWords = [
    "/docs",
    "/documentation",
    "/swagger",
    "/redoc",
    "swagger-ui",
    "developer.",
    "developers.",
    "/about",
    "/"
  ];

  return documentationWords.some(
    word =>
      lower.endsWith(word) ||
      lower.includes(word + "#")
  );
}


function formatResponse(text){

  try{

    const parsed =
      JSON.parse(text);

    return JSON.stringify(
      parsed,
      null,
      2
    );

  }catch{

    return text;
  }
}


async function testAPI(){

  if(!testUrl || !responseBox)
    return;

  const url =
    testUrl.value.trim();

  const method =
    methodSelect?.value || "GET";


  if(!url){

    responseBox.textContent =
      "Enter an API endpoint.";

    return;
  }


  let parsedURL;

  try{

    parsedURL =
      new URL(url);

  }catch{

    responseBox.textContent =
      "Invalid URL.\n\nExample:\nhttps://api.example.com/data";

    return;
  }


  if(
    parsedURL.protocol!=="https:" &&
    parsedURL.protocol!=="http:"
  ){

    responseBox.textContent =
      "Only HTTP and HTTPS URLs are supported.";

    return;
  }


  if(
    isProbablyDocumentationURL(
      parsedURL.pathname
    )
  ){

    responseBox.textContent =
      "⚠ This looks like a website/documentation URL, not a specific API endpoint.\n\nTry the endpoint shown in the API documentation.\n\nExample for JokeAPI:\nhttps://v2.jokeapi.dev/joke/Any";

    return;
  }


  sendBtn.disabled = true;
  sendBtn.textContent = "Testing...";

  responseBox.textContent =
    `Sending ${method} request...\n\nPlease wait.`;

  if(testerHint)
    testerHint.textContent =
      "Connecting to endpoint...";


  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      ()=>controller.abort(),
      12000
    );


  try{

    const response =
      await fetch(
        parsedURL.href,
        {
          method,
          headers:{
            "Accept":
              "application/json, text/plain, */*"
          },
          signal:
            controller.signal
        }
      );


    clearTimeout(timeout);


    const contentType =
      response.headers.get(
        "content-type"
      ) || "";


    let body;


    if(
      contentType.includes(
        "application/json"
      )
    ){

      const json =
        await response.json();

      body =
        JSON.stringify(
          json,
          null,
          2
        );

    }else{

      const text =
        await response.text();

      body =
        formatResponse(text);

    }


    if(body.length>30000)
      body =
        body.slice(0,30000) +
        "\n\n...[response truncated]";


    responseBox.textContent =
      `HTTP ${response.status} ${response.statusText}\n\n${body}`;


    if(testerHint){

      testerHint.textContent =
        response.ok
          ? "✓ Request completed successfully."
          : "⚠ Server returned an HTTP error status.";

    }


  }catch(error){

    clearTimeout(timeout);


    if(error.name==="AbortError"){

      responseBox.textContent =
        "Request timed out after 12 seconds.";

      if(testerHint)
        testerHint.textContent =
          "⚠ The endpoint did not respond in time.";

    }else{

      responseBox.textContent =
        `Failed to fetch.\n\n${error.message}\n\n` +
        `Possible reasons:\n` +
        `• The API blocks browser CORS requests\n` +
        `• The endpoint requires authentication\n` +
        `• The API is offline\n` +
        `• The endpoint requires special headers\n` +
        `• The API has rate limits\n\n` +
        `The API itself may still work when opened directly.`;

      if(testerHint)
        testerHint.textContent =
          "⚠ Browser CORS/security policy prevented the request.";
    }

  }finally{

    sendBtn.disabled = false;
    sendBtn.textContent = "Send";

  }
}


sendBtn?.addEventListener(
  "click",
  testAPI
);


testUrl?.addEventListener(
  "keydown",
  event=>{
    if(event.key==="Enter")
      testAPI();
  }
);


clearResponse?.addEventListener(
  "click",
  ()=>{
    if(responseBox)
      responseBox.textContent =
        "Ready.";

    if(testerHint)
      testerHint.textContent =
        "⚡ Browser testing depends on the API's CORS policy.";
  }
);


/* =========================================================
   SEARCH
========================================================= */

searchInput?.addEventListener(
  "input",
  ()=>{
    currentPage=1;
    applyFilters();
  }
);


/* CTRL + K */

document.addEventListener(
  "keydown",
  event=>{

    if(
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase()==="k"
    ){

      event.preventDefault();

      searchInput?.focus();
    }
  }
);


/* =========================================================
   SIDEBAR
========================================================= */

document
  .querySelectorAll(
    ".sideBtn[data-view]"
  )
  .forEach(button=>{

    button.addEventListener(
      "click",
      ()=>{

        document
          .querySelectorAll(".sideBtn")
          .forEach(btn=>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        currentView =
          button.dataset.view;

        currentCategory =
          "all";

        currentPage=1;


        if(sectionTitle){

          if(currentView==="all")
            sectionTitle.textContent =
              "All APIs";

          if(currentView==="favorites")
            sectionTitle.textContent =
              "Favorites";

          if(currentView==="recent")
            sectionTitle.textContent =
              "Recently Viewed";
        }


        document
          .querySelectorAll(".categoryBtn")
          .forEach(btn=>
            btn.classList.remove("active")
          );

        applyFilters();

        closeMobileMenu();

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
  .forEach(button=>{

    button.addEventListener(
      "click",
      ()=>{

        document
          .querySelectorAll(".filter")
          .forEach(btn=>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        currentFilter =
          button.dataset.filter;

        currentPage=1;

        applyFilters();
      }
    );

  });


/* =========================================================
   EXPLORE
========================================================= */

exploreBtn?.addEventListener(
  "click",
  ()=>{
    scrollToDirectory();
  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function closeMobileMenu(){

  sidebar?.classList.remove(
    "mobileOpen"
  );
}

menuBtn?.addEventListener(
  "click",
  ()=>{
    sidebar?.classList.toggle(
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

if(savedTheme==="light")
  document.body.classList.add(
    "lightMode"
  );

themeBtn?.addEventListener(
  "click",
  ()=>{

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

if(music){

  music.volume=.45;

}


async function playMusic(){

  if(!music)
    return;

  try{

    await music.play();

    musicBtn?.classList.add(
      "playing"
    );

  }catch{

    /*
      Browser autoplay restrictions can
      block audio until the user interacts.
    */

  }
}


musicBtn?.addEventListener(
  "click",
  async ()=>{

    if(music.paused){

      await playMusic();

    }else{

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
  ()=>{
    setTimeout(
      playMusic,
      700
    );
  }
);


/*
  Browser fallback:
  first interaction starts music.
*/

document.addEventListener(
  "pointerdown",
  ()=>{
    if(
      music &&
      music.paused
    ){
      playMusic();
    }
  },
  {
    once:true
  }
);


/* =========================================================
   SCROLL
========================================================= */

function scrollToDirectory(){

  document
    .getElementById("directory")
    ?.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });
}


/* =========================================================
   START
========================================================= */

updateStats();
buildCategories();

if(loading)
  loading.style.display =
    "none";

applyFilters();

showToast(
  `${APIs.length} APIs ready`
);l