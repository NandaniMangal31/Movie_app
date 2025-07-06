const moviesearchbox = document.getElementById('movie-search-box');
const searchlist = document.getElementById('search-list');
const resultgrid = document.getElementById('result-grid');
let debounceTimer;

function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}



async function loadmovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if (data.Response === "True") displaymovielist(data.Search);
}
function findmovies() {
    let searchTerm = (moviesearchbox.value).trim();
    if (searchTerm.length > 0) {

        searchlist.classList.remove('hide-search-list');
        loadmovies(searchTerm);
    }
    else {
        searchlist.classList.add('hide-search-list');
    }
}
function displaymovielist(movies) {
    movies.sort((a, b) => a.Title.localeCompare(b.Title)); 
    searchlist.innerHTML = "";
    for (let i = 0; i < movies.length; i++) {

        let movielistitem = document.createElement('div');
        movielistitem.dataset.id = movies[i].imdbID;
        movielistitem.classList.add('search-list-item');
        if (movies[i].Poster !== "N/A")
            moviePoster = movies[i].Poster;
        else
            moviePoster = "https://via.placeholder.com/100x150?text=No+Image";
        movielistitem.innerHTML = ` 
        <div class="search-item-thumbnail">
                            <img src="${moviePoster}">
                        </div>
                        <div class="search-item-info">
                            <h3>${movies[i].Title}</h3>
                            <p>${movies[i].Year}</p>
                        </div>
        `;
        searchlist.appendChild(movielistitem);
    }
    loadmoviedetails();

}
function loadmoviedetails() {
    const searchlistmovies = searchlist.querySelectorAll('.search-list-item');
    searchlistmovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchlist.classList.add('hide-search-list');
            moviesearchbox.value = "";
            const result = await fetch(`https://omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const moviedetails = await result.json();
            displaymoviedetails(moviedetails);
        });

    })
}
function displaymoviedetails(details) {
    resultgrid.innerHTML = `
         <div class="movie-poster">
            <img src="${(details.Poster !== "N/A") ? details.Poster:'https://via.placeholder.com/100x150?text=No+Image'}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">${details.Year}</li>
                <li class="rating">${details.Rated}</li>
                <li class="released">${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre: </b>${details.Genre}</p>
            <p class="writer"><b>Writer: </b>${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot: </b>${details.Plot}</p>
            <p class="language"><b>Language: </b>${details.Language}</p>
            <p class="award"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
            <button id="add-to-watchlist-btn" class="watchlist-btn">➕ Add to Watchlist</button>
        </div>
    `;

    const watchlistBtn = document.getElementById("add-to-watchlist-btn");
    watchlistBtn.addEventListener("click", () => {
        addToWatchlist(details);
    });
}

function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!watchlist.some(m => m.imdbID === movie.imdbID)) {
        watchlist.push(movie);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert("Movie added to watchlist!");
    } else {
        alert("Already in watchlist!");
    }
}

window.addEventListener('click', (event) => {
    if (event.target.className != "Form-control")
        searchlist.classList.add('hide-search-list');
})