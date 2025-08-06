import React, { useEffect, useState, useContext } from "react";
import { createContext } from "react";
import { auth, db } from "../components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const MovieContext = createContext();

// Custom hook for movie context
// eslint-disable-next-line react-refresh/only-export-components
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Function for get favorite movies from firebase
  const getMoviesFromFirebase = () => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const favoritesRef = collection(db, "user", user.uid, "favorites");
          const snapshot = await getDocs(favoritesRef);
          const movies = snapshot.docs.map((doc) => doc.data());
          setFavorites(movies);
        } else {
          console.log("No user is logged in.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    });
  };

  //Function for checks movie is favorite?
  const isFavorite = (movieId) => {
    return favorites.some((movie) => Number(movie.id) === Number(movieId));
  };

  //Function for toggle favorites
  const toggleFavorite = async (movieId) => {
    const moviesRefDb = doc(
      db,
      "user",
      auth.currentUser.uid,
      "favorites",
      String(movieId)
    );
    try {
      if (isFavorite(movieId)) {
        await deleteDoc(moviesRefDb);
        setFavorites((prev) => prev.filter((m) => m.id !== movieId));
      } else {
        await setDoc(moviesRefDb, {
          id: movieId,
          email: auth.currentUser.email,
          createdAt: new Date(),
        });
        setFavorites((prev) => [
          ...prev,
          { id: movieId, email: auth.currentUser.email, createdAt: new Date() },
        ]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Creates the context value object provider
  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };
  // Handle favorites effect
  useEffect(() => {
    getMoviesFromFirebase();
  }, [favorites]);

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
