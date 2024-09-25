// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsz-82MDaibWnIBUpoykrZHyJW7UMedX8",
    authDomain: "movies-bee24.firebaseapp.com",
    databaseURL: "https://movies-bee24-default-rtdb.firebaseio.com",
    projectId: "movies-bee24",
    storageBucket: "movies-bee24.appspot.com",
    messagingSenderId: "1080659811750",
    appId: "1:1080659811750:web:c1ef7d4dacc3ab17edc367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const movieListContainer = document.getElementById('movie-list');
const loadingElement = document.getElementById('loading');
const modal = document.getElementById('movie-modal');
const closeModal = document.querySelector('.close-btn');
const searchInput = document.getElementById('search');
const prevPageBtn = document.getElementById('prev');
const nextPageBtn = document.getElementById('next');

let allMovies = [];
let currentPage = 1;
const itemsPerPage = 6;

// Load Movies from Firebase
function loadMovies() {
    loadingElement.style.display = 'block';

    const moviesRef = ref(db, 'movies');
    onValue(moviesRef, (snapshot) => {
        loadingElement.style.display = 'none';
        allMovies = [];
        movieListContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const movie = childSnapshot.val();
            allMovies.push(movie);
        });
        paginateMovies(allMovies);
    });
}

// Paginate Movies
function paginateMovies(movies) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedMovies = movies.slice(start, end);

    movieListContainer.innerHTML = '';
    paginatedMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        const movieImage = document.createElement('img');
        movieImage.src = movie.fileURL;
        movieImage.alt = movie.name;
        movieImage.addEventListener('click', () => {
            showModal(movie);
        });

        const movieInfo = document.createElement('div');
        movieInfo.className = 'movie-info';
        movieInfo.innerHTML = `
            <h5>${movie.name} (${movie.year})</h5>
            <p><a href="${movie.downloadLink}" target="_blank">Download</a></p>
        `;

        movieCard.appendChild(movieImage);
        movieCard.appendChild(movieInfo);
        movieListContainer.appendChild(movieCard);
    });
}

// Pagination Controls
nextPageBtn.addEventListener('click', () => {
    if ((currentPage * itemsPerPage) < allMovies.length) {
        currentPage++;
        paginateMovies(allMovies);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    }
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        paginateMovies(allMovies);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    }
});

// Search Functionality
searchInput.addEventListener('input', function (event) {
    const query = event.target.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie =>
        movie.name.toLowerCase().includes(query)
    );
    currentPage = 1; // Reset to first page on search
    paginateMovies(filteredMovies);
});

// Modal Functionality
function showModal(movie) {
    document.getElementById('modal-title').textContent = movie.name;
    document.getElementById('modal-description').textContent = movie.description || 'No description available.';
    modal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Initialize
loadMovies();
