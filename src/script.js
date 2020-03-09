class API {
  constructor() {
    this.token = "da50ad1d11b0ba194991d37120384288";
    this.apiUrl = `https://api.themoviedb.org`;
  }

  get(path, params) {
    return fetch(
      `${this.apiUrl}${path}?api_key=${this.token}${params ? "&" + params : ""}`
    ).then(r => r.json());
  }

  async getMovies(search) {
    let result = await this.get("/3/search/movie", `query=${search}`);
    return result;
  }

  async getMovie(id) {
    let result = await this.get(`/3/movie/${id}`);
    return result;
  }

  async getMovieRecommendations(id) {
    let result = await this.get(`/3/movie/${id}/recommendations`);
    return result;
  }
}

let api = new API();

const updateMovies = async (search = "A") => {
  const movies = await api.getMovies(search);
  const main = document.querySelector("main");
  main.innerHTML = "";
  movies.results.forEach(movie => {
    const { id, original_title } = movie;
    main.appendChild(createMovieItem(id, original_title));
  });
  setVisible("main");
};

const openMovie = async id => {
  const movie = await api.getMovie(id);

  const icon = document.getElementById("icon");
  icon.src = `http://image.tmdb.org/t/p/w200/${
    movie.backdrop_path
  }?api_key=da50ad1d11b0ba194991d37120384288`;

  const title = document.getElementById("title");
  title.innerText = movie.title;

  const overview = document.getElementById("overview");
  overview.innerText = movie.overview;

  const recommendations = document.getElementById("recommendations");
  recommendations.innerHTML = "Loading...";
  api.getMovieRecommendations(id).then(({ results }) => {
    if (results.length === 0) {
      recommendations.innerHTML = "Have not recommendation";
      return;
    }
    setTimeout(() => {
      recommendations.innerHTML = "";
      results.forEach(({ id, original_title }) => {
        recommendations.appendChild(createMovieItem(id, original_title));
      });
    }, 1000);
  });
  setVisible("movie");
};

const createMovieItem = (id, title) => {
  const ch = document.createElement("li");
  ch.innerText = title;
  ch.onclick = () => {
    openMovie(id);
  };
  return ch;
};

const setVisible = type => {
  const main = document.querySelector("main");
  const movie = document.querySelector("movie");

  if (type === "main") {
    main.style.display = "block";
    movie.style.display = "none";
  } else if (type === "movie") {
    main.style.display = "none";
    movie.style.display = "block";
  }
};

document.getElementById("search-btn").onclick = () => {
  let val = document.getElementById("search-input").value;
  updateMovies(val ? val : "A");
};

updateMovies();
