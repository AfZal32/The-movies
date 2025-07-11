import { useDebounce } from "react-use";
import { Search } from "./components/Search";
import { Spinner } from "./components/Spinner";
import { MovieCard } from "./components/MovieCard";
import React, { useEffect, useState } from "react";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

// API key and url
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";

// Configuration object for fetch API request
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setSetLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerms, setDebouncedSearchTerms] = useState();

  // custom react hook for fixed time delay for api request
  useDebounce(() => setDebouncedSearchTerms(searchTerm), 500, [searchTerm]);

  // Fetch movies from API
  const fetchMovies = async (query = "") => {
    setSetLoading(true);
    setErrorMessage("");
    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setSetLoading(false);
    }
  };

  // Function for fetch trending movies form DB
  const loadTrendingMovies = async () => {
    try {
      const movie = await getTrendingMovies();
      setTrendingMovies(movie);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerms);
  }, [debouncedSearchTerms]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        {/* Header */}
        <header>
          <img src="/images/hero.png" alt="hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Hero component */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Content */}
        <section className="all-movies">
          <h2 className="text-white mt-5">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
