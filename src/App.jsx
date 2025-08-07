import { useDebounce } from "react-use";
import { Navbar } from "./components/Navbar";
import { auth } from "./components/firebase";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { DetailsPage } from "./components/DetailsPage";
import { toast, ToastContainer } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
import { FavoritesPage } from "./components/FavoritesPage";
import { updateSearchCount, getTrendingMovies } from "./appwrite";
import { MovieProvider, useMovieContext } from "./context/MovieContext";

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
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerms, setDebouncedSearchTerms] = useState();

  // Custom hook for accessing movie context
  const { toggleFavorite } = useMovieContext();

  // Handle scroll to search
  const searchRef = useRef(null);
  const moviesRef = useRef(null);

  // custom react hook for fixed time delay for api request
  useDebounce(() => setDebouncedSearchTerms(searchTerm), 500, [searchTerm]);

  // Fetch movies from API
  const fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");
    try {
      const endPoint = query //checks any query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS); //Fetch movies

      // Custom error if got any error on response
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      //Error handler for data from api
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      //Function for update trending movies count
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function for fetch trending movies form appwrite DB
  const loadTrendingMovies = async () => {
    setLoading(true);
    try {
      const movie = await getTrendingMovies();
      setTrendingMovies(movie);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle favorites
  const onFavoriteClick = (movieId) => {
    auth.currentUser
      ? toggleFavorite(movieId)
      : toast.warning(" You must be logged in to access this functionality");
  };

  //Render fetch movies on search state change
  useEffect(() => {
    fetchMovies(debouncedSearchTerms);
  }, [debouncedSearchTerms]);

  //Initial render for trending movies
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <>
      <Navbar refs={{ movies: moviesRef, search: searchRef }} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              trendingMovies={trendingMovies}
              isLoading={isLoading}
              searchRef={searchRef}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              moviesRef={moviesRef}
              errorMessage={errorMessage}
              moviesList={moviesList}
              onFavoriteClick={onFavoriteClick}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              moviesList={moviesList}
              onFavoriteClick={onFavoriteClick}
            />
          }
        />
        <Route
          path="movie/:movieId"
          element={
            <DetailsPage
              onFavoriteClick={onFavoriteClick}
              moviesList={moviesList}
            />
          }
        />
      </Routes>
      <ToastContainer style={{ paddingTop: "10px" }} />
    </>
  );
};

export default App;
