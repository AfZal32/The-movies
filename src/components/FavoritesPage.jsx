import { auth } from "./firebase";
import { MovieCard } from "./MovieCard";
import { useMovieContext } from "../context/MovieContext";

export const FavoritesPage = ({ moviesList, onFavoriteClick }) => {
  const { favorites } = useMovieContext();

  //   Filter favorites from moviesList
  const favoriteMovies = moviesList.filter((movie) =>
    favorites.some((fav) => fav.id === movie.id)
  );

  return (
    <div className="wrapper">
      <section className="all-movies  ">
        <div className="w-full h-screen bg-[#030014] mt-8 ">
          <div className="flex  items-center  p-5">
            <img
              src="images/avatar-profile.jpg"
              alt="avatar"
              className="w-20 h-20 rounded-full"
            />
            <h2 className="text-white text-2xl font-semibold ml-4 ">
              {auth.currentUser && auth.currentUser.email}
            </h2>
          </div>
          <h2 className="my-4 ml-2">Favorite Movies</h2>
          {favoriteMovies.length > 0 ? (
            <ul>
              {favoriteMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onFavoriteClick={onFavoriteClick}
                />
              ))}
            </ul>
          ) : (
            <h2 className="text-white">No favorites found</h2>
          )}
        </div>
      </section>
    </div>
  );
};
