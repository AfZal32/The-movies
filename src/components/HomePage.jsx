import React from "react";
import { Search } from "./Search";
import { Spinner } from "./Spinner";
import { MovieCard } from "./MovieCard";

export const HomePage = ({
  trendingMovies,
  isLoading,
  searchRef,
  searchTerm,
  setSearchTerm,
  moviesRef,
  errorMessage,
  moviesList,
  onFavoriteClick,
}) => {
  return (
    <>
      <div className="pattern" />
      <div className="wrapper">
        {/* Hero */}
        <header>
          <img src="/images/hero.png" alt="hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          {/* Trending Movies */}
          {trendingMovies.length > 0 &&
            (isLoading ? (
              <Spinner size={10} />
            ) : (
              <section className="trending">
                <h2>Trending movies</h2>
                <ul ref={searchRef}>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          <div>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </header>

        {/* Content */}
        <section ref={moviesRef} className="all-movies">
          <h2 className="text-white mt-5">All Movies</h2>
          {isLoading ? (
            <Spinner size={10} />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : moviesList.length == 0 ? (
            <h2 className="text-white ">No movies found</h2>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard
                  onFavoriteClick={onFavoriteClick}
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};
