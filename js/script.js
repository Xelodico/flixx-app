const global = {
  currentPage: window.location.pathname,
  search: { term: "", type: "", page: 1, totalPages: 1, totalResults: 0 },
  api: {
    // Key registered at https://www.themoviedb.org/settings/api
    // Note from Brad:
    // Only use this for development or very small projects. You should store your key and make requests from a server.
    apiKey: "bc757194559843f0ed4c5af750c0e8ed",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

console.log(global.currentPage);

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
${
  movie.poster_path
    ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
    : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
}
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// Display 20 most popular TV shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
${
  show.poster_path
    ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
    : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
}
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Display Movie Details
async function displayMovieDetails() {
  const movieID = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieID}`);

  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `<div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />`
      : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
  />`
  }
          </div>
          <div>
            <h2>${movie.title}</h2>
            ${
              movie.vote_average
                ? `<p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>`
                : ""
            }

            <p class="text-muted">Release Date: ${
              movie.release_date ? movie.release_date : "N/A"
            }</p>
            <p>
            ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group"> ${
              movie.genres.length
                ? `${movie.genres
                    .map((genre) => `<li>${genre.name}</li>`)
                    .join("")}`
                : "N/A"
            }
              
            </ul>
            ${
              movie.homepage
                ? `<a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>`
                : ""
            }

          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${
              movie.budget ? `$${addCommasToNumber(movie.budget)}` : "N/A"
            }</li>
            <li><span class="text-secondary">Revenue:</span> ${
              movie.revenue ? `$${addCommasToNumber(movie.revenue)}` : "N/A"
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime ? `${movie.runtime} minutes` : "N/A"
            }</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${
            movie.production_companies.length
              ? `${movie.production_companies
                  .map((company) => `<span>${company.name}</span>`)
                  .join(", ")}</div>`
              : "N/A"
          }
          </div>`;

  document.querySelector("#movie-details").appendChild(div);
  displayCastSlider();
}

// Display Show Details
async function displayShowDetails() {
  const showID = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showID}`);

  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `<div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}"
    />`
      : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`
  }

  </div>
  <div>
    <h2>${show.name}</h2>
    ${
      show.vote_average
        ? `<p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>`
        : ""
    }
    ${
      show.last_air_date
        ? `<p class="text-muted">Last Air Date: ${show.last_air_date}</p>`
        : ""
    }
    
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group"> ${
      show.genres.length
        ? `${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}`
        : "N/A"
    }
    </ul>
    ${
      show.homepage
        ? `<a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>`
        : ""
    }

  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${
        show.last_episode_to_air ? show.last_episode_to_air.name : "N/A"
      }
    </li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${
    show.production_companies.length
      ? `${show.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(", ")}</div>`
      : "N/A"
  }
</div>`;

  document.querySelector("#show-details").appendChild(div);
}

// Display Backdrop on Details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// Search Movies/Shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_results, total_pages, page } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }

    document.querySelector("#search-term").value = "";

    displaySearchResults(results);
  } else {
    showAlert("Please enter a search term");
  }
}

function displaySearchResults(results) {
  const searchResults = document.querySelector("#search-results");
  const searchResultsHeading = document.querySelector(
    "#search-results-heading"
  );

  // Clear previous results
  searchResults.innerHTML = "";
  searchResultsHeading.innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
${
  result.poster_path
    ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === "movie" ? result.title : result.name
              }"
            />`
    : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === "movie" ? result.title : result.name}"
          />`
}
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === "movie" ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">${
                global.search.type === "movie"
                  ? `Released: ${
                      result.release_date ? result.release_date : "N/A"
                    }`
                  : `First Aired: ${
                      result.first_air_date ? result.first_air_date : "N/A"
                    }`
              }</small>
            </p>
          </div>`;

    searchResultsHeading.innerHTML = `<h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>`;
    searchResults.appendChild(div);
  });

  displayPagination();
}

// Create and display pagination for search
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;
  document.querySelector("#pagination").appendChild(div);

  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");

  // Disable prev button if on first page
  if (global.search.page === 1) {
    prevBtn.disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    nextBtn.disabled = true;
  }

  // Next page
  nextBtn.addEventListener("click", async () => {
    global.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // Previous page
  prevBtn.addEventListener("click", async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Display Slider Movies/Shows
async function displaySlider() {
  const isMovie = global.currentPage !== "/shows.html";
  let { results } = [];

  if (isMovie) {
    ({ results } = await fetchAPIData("movie/now_playing"));
  } else {
    ({ results } = await fetchAPIData("tv/airing_today"));
  }

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
            <a href="${isMovie ? "movie" : "tv"}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500${
                    result.poster_path
                  }" alt="${isMovie ? result.title : result.name}" />`
                : `<img src="./images/no-image.jpg" alt="${
                    isMovie ? result.title : result.name
                  }" />`
            } 
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${
                result.vote_average
                  ? `${result.vote_average.toFixed(1)} / 10`
                  : "TBA"
              }
            </h4>
          </div>`;

    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

async function displayCastSlider() {
  const ID = window.location.search.split("=")[1];
  const { cast } = await fetchAPIData(`movie/${ID}/credits`);
  const actors = cast.filter(
    (actor) => actor.known_for_department === "Acting"
  );
  console.log(actors);

  actors.forEach((actor) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
            ${
              actor.profile_path
                ? `<img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}" />`
                : `<img src="./images/no-image.jpg" alt="${actor.name}" />`
            } 
            <h4 class="actor-info">
              ${actor.name} - <span class="actor-character">${actor.character}</span>
            </h4>
          </div>`;
    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: true },
    breakpoints: {
      500: { slidesPerView: 2 },
      700: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
    grabCursor: true,
  });
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-GB`
  );

  const data = await response.json();

  hideSpinner();
  return data;
}

// Make request to search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-GB&include_adult=false&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// Show Alert
function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 4000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Init App, page router
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displaySlider();
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
    default:
      console.log("Nothing");
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
