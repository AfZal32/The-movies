import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";

export const DetailsPage = ({ moviesList, onFavoriteClick }) => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const { isFavorite } = useMovieContext();

  // Find movies on state or id change
  useEffect(() => {
    if (movieId) {
      const findMovie = moviesList.find(
        (movie) => movie.id === Number(movieId)
      );
      setMovieDetails(findMovie);
      isFavorite(movieId);
    }
  }, [movieId]);

  return (
    <>
      <main className="w-full h-auto  sm:pt-5 bg-[#030014]  flex flex-col sm:flex-row sm:h-screen  md:h-screen">
        <div className="flex mt-[30px] justify-center  md:w-[450px] items-center h-full p-10 sm:p-5 sm:w-[60%] ">
          <img
            className=" h-100  md:h-[80%] rounded-xl "
            src={
              movieDetails
                ? `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`
                : "/images/no-movie.png"
            }
            alt="no-movies"
          />
        </div>
        <div className="details relative text-white  flex flex-col justify-center items-start w-full p-4 md:p-10">
          <button
            onClick={() => onFavoriteClick(Number(movieId))}
            className="absolute w-12 h-12 text-2xl top-4 right-4 md:w-16 md:h-16  sm:top-20 sm:right-10 border-2 rounded-full hover:bg-red-400 hover:cursor-pointer "
          >
            {isFavorite(movieId) ? "❤️" : "🤍"}
          </button>
          <h2 className="text-xl md:text-2xl font-semibold mt-16 md:mt-0">
            {movieDetails ? movieDetails.title : "No movie"}
          </h2>
          <p className=" capitalize text-sm md:text-base mt-2">
            {movieDetails
              ? `${movieDetails.original_language} • 
                ${movieDetails.release_date}`
              : "No movie"}
          </p>
          <p className="text-sm md:text-base mt-1 flex flex-row">
            {movieDetails ? (
              <>
                <img
                  src="/images/star.svg"
                  className="w-4 h-4 pt-1.5"
                  alt="star"
                />
                <span> </span>

                {movieDetails.vote_average.toFixed(1)}
              </>
            ) : (
              "No rating"
            )}
          </p>
          <h3 className="  md:text-lg mt-6 md:mt-10">Overview</h3>
          <p className="font-normal text-xs md:text-sm mt-6 md:mt-1">
            {movieDetails ? movieDetails.overview : "No review"}
          </p>
        </div>
      </main>
    </>
  );
};
