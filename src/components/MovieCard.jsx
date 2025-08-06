import { Link } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";

export const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    id,
  },
  onFavoriteClick,
}) => {
  const { isFavorite } = useMovieContext();

  return (
    <Link to={`/movie/${id}`}>
      <div className="movie-card group">
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavoriteClick(Number(id));
          }}
          className="absolute text-white  top-6 right-6 bg-black/50  rounded-full flex items-center justify-center w-8 h-8 cursor-pointer hover:bg-red-500   lg:opacity-0 lg:group-hover:opacity-100 lg:transition-all  lg:duration-200 z-10 "
        >
          {isFavorite(id) ? "❤️" : "🤍"}
        </button>
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/images/no-movie.png"
          }
          alt="no movie"
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
    </Link>
  );
};
