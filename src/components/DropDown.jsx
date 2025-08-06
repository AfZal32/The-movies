import React, { useState, useRef, useEffect } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Spinner } from "./Spinner";
import { Link } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";

const UserProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { setFavorites } = useMovieContext();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setOpen(false);
        }
      }, 0);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); //clean up event listener
    };
  }, []);

  // Sign out function
  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      toast.success("Logged out!");
      setOpen(false);
      setFavorites([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left " ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src="images/avatar-profile.jpg"
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 p-2 mt-2 w-48 bg-[#150627] border border-blue-700 rounded-md shadow-lg z-20">
          <div className="flex items-center px-4 py-3">
            <img
              src="images/avatar-profile.jpg"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3 mb-1">
              <p className="text-xs text-white">{auth.currentUser.email}</p>
            </div>
          </div>
          <Link
            to={"/favorites"}
            className=" text-sm ml-2 text-blue-700 hover:text-blue-500 hover:cursor-pointer"
          >
            Favorites
          </Link>
          <div className="border-1 w-full rounded-b-full  border-blue-500" />

          <div className=" w-full mt-2 flex justify-end">
            <button
              onClick={handleLogout}
              className=" rounded-lg text-left px-3 py-1 text-sm text-white bg-blue-700 hover:cursor-pointer hover:bg-blue-500"
            >
              {isLoading ? <Spinner size={4} /> : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
