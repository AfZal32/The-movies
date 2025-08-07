import { auth } from "./firebase";
import UserProfileDropdown from "./DropDown";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import React, { useEffect, useState, useRef } from "react";

export const Navbar = ({ onSearchClick, refs }) => {
  const { favorites, setFavorites } = useMovieContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState();
  const navbarRef = useRef(null);

  const navigateLoginPage = useNavigate();

  // Function for scroll ref
  const handleScrollToSearch = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Listen for auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  // Out side click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); //clean up event listener
  }, []);

  return (
    <div>
      <nav
        className="bg-[#150627] border-gray-200 fixed px-5 top-0 left-0 right-0 z-50"
        ref={navbarRef}
      >
        <div className=" max-w-screen-xl flex flex-wrap items-center  justify-between mx-auto py-2 ">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/images/logo-movie.png"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Movies
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {menuOpen ? (
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            )}
          </button>
          <div
            className={`${menuOpen ? "" : "hidden"} w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-small flex flex-col items-center p-4 md:p-0 mt-4 bg-[#150627] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  ">
              <li>
                <Link
                  to={"/"}
                  className="block py-2 px-3 text-white rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={"/"}
                  onClick={(e) => {
                    // e.preventDefault();
                    handleScrollToSearch(refs.search);
                    setMenuOpen(false);
                  }}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to={"#"}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={() => {
                    handleScrollToSearch(refs.movies);
                    setMenuOpen(false);
                  }}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to={"#"}
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={() => {
                    onSearchClick();
                    setMenuOpen(false);
                  }}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                {user ? (
                  <UserProfileDropdown
                    favorites={favorites}
                    setFavorites={setFavorites}
                  />
                ) : (
                  <button
                    className="text-white bg-blue-700 py-1 px-3 rounded-md font-medium font-dm-sans hover:bg-blue-500 hover:cursor-pointer"
                    onClick={() => {
                      navigateLoginPage("/login");
                      setMenuOpen(false);
                    }}
                  >
                    Sign-in ➜
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
