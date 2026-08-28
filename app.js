"use strict";

/* =========================================
   API DIRECTORY DATA
========================================= */

const APIs = [

    {
        name: "JSONPlaceholder",
        category: "Development",
        description: "Free fake REST API for testing and prototyping.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://jsonplaceholder.typicode.com/posts/1"
    },

    {
        name: "Dog Facts",
        category: "Animals",
        description: "Random facts and information about dogs.",
        auth: "No",
        https: "Yes",
        cors: "Unknown",
        url: "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1"
    },

    {
        name: "Cat Facts",
        category: "Animals",
        description: "Random facts about cats.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://catfact.ninja/fact"
    },

    {
        name: "Open Meteo",
        category: "Weather",
        description: "Free weather API with no API key required.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m"
    },

    {
        name: "CoinGecko",
        category: "Cryptocurrency",
        description: "Cryptocurrency market and price data.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://api.coingecko.com/api/v3/ping"
    },

    {
        name: "Random User",
        category: "Users",
        description: "Generate random user profiles for development.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://randomuser.me/api/"
    },

    {
        name: "Public APIs",
        category: "Directory",
        description: "A collection of public APIs for developers.",
        auth: "No",
        https: "Yes",
        cors: "Unknown",
        url: "https://api.publicapis.org/entries"
    },

    {
        name: "Exchange Rate",
        category: "Finance",
        description: "Exchange rate information for currencies.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://open.er-api.com/v6/latest/USD"
    },

    {
        name: "Joke API",
        category: "Entertainment",
        description: "Programming and general jokes through a REST API.",
        auth: "No",
        https: "Yes",
        cors: "Yes",
        url: "https://official-joke-api.appspot.com/random_joke"
    }

];


/* =========================================
   ELEMENTS
========================================= */

const apiGrid = document.getElementById("apiGrid");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("apiModal");
const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalUrl = document.getElementById("modalUrl");

const testUrl = document.getElementById("testUrl");
const sendRequest = document.getElementById("sendRequest");
const responseBox = document.getElementById("responseBox");


/* =========================================
   RENDER APIs
========================================= */

function renderAPIs(list) {

    apiGrid.innerHTML = "";

    if (!list.length) {

        apiGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                padding:50px;
                text-align:center;
                color:#777;
                border:1px solid rgba(255,255,255,.08);
                border-radius:18px;
            ">
                No APIs found.
            </div>
        `;

        return;
    }

    list.forEach((api, index) => {

        const card = document.createElement("article");

        card.className = "api-card";

        card.style.animationDelay = `${index * 70}ms`;

        card.innerHTML = `

            <h3>${escapeHTML(api.name)}</h3>

            <p>
                ${escapeHTML(api.description)}
            </p>

            <div class="tags">

                <span class="tag">
                    AUTH: ${escapeHTML(api.auth)}
                </span>

                <span class="tag">
                    HTTPS: ${escapeHTML(api.https)}
                </span>

                <span class="tag">
                    CORS: ${escapeHTML(api.cors)}
                </span>

                <span class="tag">
                    ${escapeHTML(api.category)}
                </span>

            </div>

            <div class="card-actions">

                <button
                    class="small-btn details-btn"
                    data-index="${index}"
                >
                    View Details
                </button>

                <button
                    class="small-btn test-btn"
                    data-index="${index}"
                >
                    API Tester
                </button>

            </div>
        `;

        apiGrid.appendChild(card);
    });


    document.querySelectorAll(".details-btn").forEach(button => {

        button.addEventListener("click", () => {

            const api = list[Number(button.dataset.index)];

            openModal(api);

        });

    });


    document.querySelectorAll(".test-btn").forEach(button => {

        button.addEventListener("click", () => {

            const api = list[Number(button.dataset.index)];

            openModal(api);

        });

    });

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener("input", () => {

    const query = searchInput.value
        .trim()
        .toLowerCase();

    const filtered = APIs.filter(api =>

        api.name.toLowerCase().includes(query) ||

        api.category.toLowerCase().includes(query) ||

        api.description.toLowerCase().includes(query)

    );

    renderAPIs(filtered);

});


/* =========================================
   MODAL
========================================= */

function openModal(api) {

    modalTitle.textContent = api.name;

    modalDescription.textContent = api.description;

    modalUrl.textContent = api.url;

    testUrl.value = api.url;

    responseBox.textContent = "Waiting for request...";

    modal.classList.add("active");

}


function closeAPI() {

    modal.classList.remove("active");

}


closeModal.addEventListener("click", closeAPI);


modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeAPI();
    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeAPI();
    }

});


/* =========================================
   API TESTER
========================================= */

sendRequest.addEventListener("click", async () => {

    const url = testUrl.value.trim();

    if (!url) {

        responseBox.textContent =
            "Please enter a valid URL.";

        return;
    }

    if (!/^https?:\/\//i.test(url)) {

        responseBox.textContent =
            "URL must start with http:// or https://";

        return;
    }

    sendRequest.disabled = true;

    sendRequest.textContent = "TESTING...";

    responseBox.textContent =
        "Sending GET request...\n\nPlease wait.";

    try {

        const controller =
            new AbortController();

        const timeout =
            setTimeout(() => controller.abort(), 10000);


        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json,text/plain,*/*"
            },
            signal: controller.signal
        });


        clearTimeout(timeout);


        const contentType =
            response.headers.get("content-type") || "";


        let result;


        if (contentType.includes("application/json")) {

            result = await response.json();

            result = JSON.stringify(
                result,
                null,
                2
            );

        } else {

            result = await response.text();

        }


        responseBox.textContent =
            `HTTP ${response.status} ${response.statusText}\n\n${result}`;

    }

    catch (error) {

        if (error.name === "AbortError") {

            responseBox.textContent =
                "REQUEST TIMEOUT\n\nThe API took too long to respond.";

        } else {

            responseBox.textContent =
                `REQUEST FAILED\n\n${error.message}\n\n` +
                "Possible reasons:\n" +
                "• CORS blocked the request\n" +
                "• API is offline\n" +
                "• Invalid endpoint\n" +
                "• Authentication required\n" +
                "• Network problem";

        }

    }

    finally {

        sendRequest.disabled = false;

        sendRequest.textContent = "TEST";

    }

});


/* =========================================
   HTML SECURITY
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   MUSIC SYSTEM
========================================= */

const music =
    document.getElementById("bgMusic");

const musicButton =
    document.getElementById("musicButton");

const volumeControl =
    document.getElementById("volumeControl");

const musicDisc =
    document.getElementById("musicDisc");

const musicStatus =
    document.getElementById("musicStatus");

const musicWarning =
    document.getElementById("musicWarning");


music.volume = 0.45;


function updateMusicUI(isPlaying) {

    if (isPlaying) {

        musicButton.textContent = "Ⅱ";

        musicStatus.textContent =
            "Now playing";

        musicDisc.classList.add("playing");

        musicWarning.style.display = "none";

    } else {

        musicButton.textContent = "▶";

        musicStatus.textContent =
            "Paused";

        musicDisc.classList.remove("playing");

    }

}


async function startMusic() {

    try {

        await music.play();

        updateMusicUI(true);

    }

    catch (error) {

        updateMusicUI(false);

        musicWarning.style.display =
            "block";

        musicStatus.textContent =
            "Tap play to start";

    }

}


musicButton.addEventListener("click", async () => {

    if (music.paused) {

        await startMusic();

    } else {

        music.pause();

        updateMusicUI(false);

    }

});


volumeControl.addEventListener("input", () => {

    music.volume =
        Number(volumeControl.value);

});


/*
   Browser autoplay policy:
   First try automatically.
   If blocked, first user interaction
   will start music.
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


document.addEventListener(
    "click",
    () => {

        if (music.paused) {

            startMusic();

        }

    },
    { once: true }
);


/* =========================================
   INITIALIZE
========================================= */

renderAPIs(APIs);