// Movie class
class Movie {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

// UI class: Handle UI Tasks
class UI {
    static displayMovie() {
        const movies = Store.getMovies();
        movies.forEach(movie => UI.addMovieToList(movie));
    }

    static addMovieToList(movie) {
        const list = document.querySelector('#movie-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.author}</td>
        <td>${movie.isbn}</td>
        <td><a href ="#" class="btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);
    }

    static deleteMovie(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#movie-form');
        container.insertBefore(div, form);

        setTimeout(() =>
            document.querySelector('.alert').remove(), 3000);

    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store CLass: Handles Storage
class Store {
    static getMovies() {
        let movies;
        if (localStorage.getItem('movies') === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem('movies'));
        }
        return movies;
    }

    static addMovie(movie) {
        const movies = Store.getMovies();
        movies.push(movie);
        localStorage.setItem('movies', JSON.stringify(movies));
    }

    static removeMovie(isbn) {
        const movies = Store.getMovies();
        movies.forEach((movie, index) => {
            if (movie.isbn === isbn) {
                movies.splice(index, 1);
            }
        });
        localStorage.setItem('movies', JSON.stringify(movies));
    }
}


//Event: Display Movies
document.addEventListener('DOMContentLoaded', UI.displayMovie);

//Event: Add a Movie
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill all fields', 'danger');
    } else {

        // Instatiate movie
        const movie = new Movie(title, author, isbn);

        // Add movie to UI
        UI.addMovieToList(movie);

        //Add movie to store
        Store.addMovie(movie);

        // Show success message
        UI.showAlert('Movie added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Movie
document.querySelector('#movie-list').addEventListener('click', (e) => {
    UI.deleteMovie(e.target);

    //Remove movie from a store
    Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Movie deleted', 'success');
});