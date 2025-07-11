import React from "react";

export const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/images/no-movie.png"
        }
        alt=""
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/images/star.svg" alt="star" />
            <span> </span>
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">{release_date.split("-")[0]}</p>
        </div>
      </div>
    </div>
  );
};
